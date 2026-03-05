import { NextResponse } from "next/server";
import checkoutNodeJssdk from "@paypal/checkout-server-sdk";
import { paypalClient } from "@/lib/paypal";
import { adminDb } from "@/lib/firebase-admin";
import { isMailerConfigured } from "@/lib/mailer";
import { sendPayPalDonationReceiptEmail } from "@/lib/receipts";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { donationId, paypalOrderId } = (await req.json().catch(() => ({}))) as {
    donationId?: string;
    paypalOrderId?: string;
  };

  if (!donationId || !paypalOrderId) {
    return NextResponse.json({ error: "Missing donationId or paypalOrderId" }, { status: 400 });
  }

  const donationRef = adminDb.collection("donations").doc(donationId);
  const donationSnap = await donationRef.get();
  if (!donationSnap.exists) {
    return NextResponse.json({ error: "Donation not found" }, { status: 404 });
  }

  const donation = donationSnap.data() as {
    status?: string;
    total?: number;
    donor?: {
      fullName?: string;
      email?: string;
    };
    paypalReceiptSentAt?: string;
  };
  if (donation.status === "paid") {
    return NextResponse.json({ ok: true, alreadyPaid: true });
  }

  const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(paypalOrderId);
  request.requestBody({} as unknown as checkoutNodeJssdk.orders.OrdersCapture.RequestData);

  const response = await paypalClient().execute(request);
  const status = response.result.status;

  if (status === "COMPLETED") {
    const paidAt = new Date().toISOString();
    await donationRef.update({
      status: "paid",
      paidAt,
      paypalOrderId,
      updatedAt: new Date().toISOString(),
    });

    const canSendReceipt =
      !donation.paypalReceiptSentAt &&
      Boolean(donation.donor?.email) &&
      typeof donation.total === "number";

    if (canSendReceipt) {
      if (!isMailerConfigured()) {
        await donationRef.update({
          paypalReceiptStatus: "skipped_missing_mailer_config",
          updatedAt: new Date().toISOString(),
        });
      } else {
        try {
          await sendPayPalDonationReceiptEmail({
            donationId,
            paidAtIso: paidAt,
            total: donation.total!,
            donorName: donation.donor?.fullName || "Supporter",
            donorEmail: donation.donor!.email!,
          });

          await donationRef.update({
            paypalReceiptStatus: "sent",
            paypalReceiptSentAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        } catch (error) {
          await donationRef.update({
            paypalReceiptStatus: "failed",
            paypalReceiptError: error instanceof Error ? error.message : "Failed to send PayPal donation receipt email",
            updatedAt: new Date().toISOString(),
          });
        }
      }
    }

    return NextResponse.json({ ok: true });
  }

  await donationRef.update({
    status: "payment_failed",
    paypalOrderId,
    updatedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: false, status }, { status: 400 });
}
