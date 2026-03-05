import { NextResponse } from "next/server";
import checkoutNodeJssdk from "@paypal/checkout-server-sdk";
import { paypalClient } from "@/lib/paypal";
import { adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { donationId } = (await req.json().catch(() => ({}))) as { donationId?: string };
  if (!donationId) {
    return NextResponse.json({ error: "Missing donationId" }, { status: 400 });
  }

  const donationRef = adminDb.collection("donations").doc(donationId);
  const snap = await donationRef.get();
  if (!snap.exists) {
    return NextResponse.json({ error: "Donation not found" }, { status: 404 });
  }

  const donation = snap.data() as { status?: string; total?: number };

  if (donation.status === "paid") {
    return NextResponse.json({ error: "Donation already paid" }, { status: 409 });
  }

  const totalNumber = Number(donation.total ?? 0);
  if (!Number.isFinite(totalNumber) || totalNumber <= 0) {
    return NextResponse.json({ error: "Invalid donation amount" }, { status: 400 });
  }

  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: donationId,
        amount: {
          currency_code: "USD",
          value: totalNumber.toFixed(2),
        },
        description: "Sports Our Youth donation",
      },
    ],
    application_context: {
      brand_name: "Sports Our Youth",
      shipping_preference: "NO_SHIPPING",
      user_action: "PAY_NOW",
    },
  });

  const response = await paypalClient().execute(request);
  const paypalOrderId = response.result.id;

  await donationRef.update({
    status: "pending_payment",
    paymentProvider: "paypal",
    paypalOrderId,
    updatedAt: new Date().toISOString(),
  });

  return NextResponse.json({ paypalOrderId });
}
