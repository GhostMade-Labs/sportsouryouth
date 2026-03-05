import { NextResponse } from "next/server";
import checkoutNodeJssdk from "@paypal/checkout-server-sdk";
import { paypalClient } from "@/lib/paypal";
import { adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { orderId } = (await req.json().catch(() => ({}))) as { orderId?: string };
  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  const orderRef = adminDb.collection("orders").doc(orderId);
  const snap = await orderRef.get();
  if (!snap.exists) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const order = snap.data() as {
    total: number;
    shipping: {
      firstName: string;
      lastName: string;
      address1: string;
      city: string;
      state: string;
      zip: string;
    };
  };

  const total = Number(order.total).toFixed(2);
  const shipping = order.shipping;

  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: orderId,
        amount: {
          currency_code: "USD",
          value: total,
        },
        shipping: {
          name: {
            full_name: `${shipping.firstName} ${shipping.lastName}`,
          },
          address: {
            address_line_1: shipping.address1,
            admin_area_2: shipping.city,
            admin_area_1: shipping.state,
            postal_code: shipping.zip,
            country_code: "US",
          },
        },
      },
    ],
    application_context: {
      brand_name: "Sports Our Youth",
      shipping_preference: "SET_PROVIDED_ADDRESS",
      user_action: "PAY_NOW",
    },
  });

  const response = await paypalClient().execute(request);
  const paypalOrderId = response.result.id;

  await orderRef.update({
    status: "pending_payment",
    paymentProvider: "paypal",
    paypalOrderId,
    updatedAt: new Date().toISOString(),
  });

  return NextResponse.json({ paypalOrderId });
}
