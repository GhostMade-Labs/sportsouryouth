import { NextResponse } from "next/server";
import checkoutNodeJssdk from "@paypal/checkout-server-sdk";
import { paypalClient } from "@/lib/paypal";
import { adminDb } from "@/lib/firebase-admin";
import { isMailerConfigured } from "@/lib/mailer";
import { sendPayPalReceiptEmail } from "@/lib/receipts";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { orderId, paypalOrderId } = (await req.json().catch(() => ({}))) as {
    orderId?: string;
    paypalOrderId?: string;
  };

  if (!orderId || !paypalOrderId) {
    return NextResponse.json({ error: "Missing orderId or paypalOrderId" }, { status: 400 });
  }

  const orderRef = adminDb.collection("orders").doc(orderId);
  const orderSnap = await orderRef.get();
  if (!orderSnap.exists) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const order = orderSnap.data() as {
    status?: string;
    total?: number;
    items?: Array<{
      name: string;
      type: "tshirt" | "hoodie";
      size: string;
      color: string;
      qty: number;
      price: number;
    }>;
    shipping?: {
      firstName: string;
      lastName: string;
      email: string;
      address1: string;
      city: string;
      state: string;
      zip: string;
    };
    paypalReceiptSentAt?: string;
  };

  if (order.status === "paid") {
    return NextResponse.json({ ok: true, alreadyPaid: true });
  }

  const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(paypalOrderId);
  request.requestBody({} as any);

  const response = await paypalClient().execute(request);
  const status = response.result.status;

  if (status === "COMPLETED") {
    const paidAt = new Date().toISOString();
    await orderRef.update({
      status: "paid",
      paidAt,
      paypalOrderId,
      updatedAt: new Date().toISOString(),
    });

    const canSendReceipt =
      !order.paypalReceiptSentAt &&
      Boolean(order.shipping?.email) &&
      Array.isArray(order.items) &&
      order.items.length > 0 &&
      typeof order.total === "number";

    if (canSendReceipt) {
      if (!isMailerConfigured()) {
        await orderRef.update({
          paypalReceiptStatus: "skipped_missing_mailer_config",
          updatedAt: new Date().toISOString(),
        });
      } else {
        try {
          await sendPayPalReceiptEmail({
            orderId,
            paidAtIso: paidAt,
            total: order.total!,
            items: order.items!,
            shipping: order.shipping!,
          });

          await orderRef.update({
            paypalReceiptStatus: "sent",
            paypalReceiptSentAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        } catch (error) {
          await orderRef.update({
            paypalReceiptStatus: "failed",
            paypalReceiptError: error instanceof Error ? error.message : "Failed to send PayPal receipt email",
            updatedAt: new Date().toISOString(),
          });
        }
      }
    }

    return NextResponse.json({ ok: true });
  }

  await orderRef.update({
    status: "payment_failed",
    paypalOrderId,
    updatedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: false, status }, { status: 400 });
}
