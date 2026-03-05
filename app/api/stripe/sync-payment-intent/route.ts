import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebase-admin";
import { ensureStripeReceipt } from "@/lib/stripe-receipts";

export const runtime = "nodejs";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2026-02-25.clover",
});

function nowIso() {
  return new Date().toISOString();
}

function mapStripePIStatusToOrderStatus(pi: Stripe.PaymentIntent) {
  switch (pi.status) {
    case "succeeded":
      return "paid";
    case "canceled":
      return "payment_failed";
    case "requires_payment_method":
      return "payment_failed";
    case "processing":
      return "pending_payment";
    case "requires_action":
      return "pending_action";
    default:
      return "pending_payment";
  }
}

export async function POST(req: Request) {
  const { orderId, paymentIntentId } = (await req.json().catch(() => ({}))) as {
    orderId?: string;
    paymentIntentId?: string;
  };

  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  const orderRef = adminDb.collection("orders").doc(orderId);
  const snap = await orderRef.get();
  if (!snap.exists) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const order = snap.data() as { stripePaymentIntentId?: string; shipping?: { email?: string } };
  const piId = paymentIntentId || order.stripePaymentIntentId;
  if (!piId) {
    return NextResponse.json({ error: "Missing stripePaymentIntentId" }, { status: 400 });
  }

  const pi = await stripe.paymentIntents.retrieve(piId);
  const status = mapStripePIStatusToOrderStatus(pi);

  const update: Record<string, unknown> = {
    status,
    paymentProvider: "stripe",
    stripePaymentIntentId: pi.id,
    updatedAt: nowIso(),
  };

  if (status === "paid") {
    update.paidAt = nowIso();

    try {
      const receipt = await ensureStripeReceipt(stripe, pi, order.shipping?.email?.trim());
      update.stripeReceiptStatus = receipt.status;
      update.stripeReceiptUrl = receipt.receiptUrl;
    } catch (error) {
      update.stripeReceiptStatus = "failed";
      update.stripeReceiptError = error instanceof Error ? error.message : "Failed to sync Stripe receipt";
    }
  }

  if (status === "payment_failed") {
    update.stripeLastPaymentError = pi.last_payment_error
      ? {
          code: pi.last_payment_error.code,
          decline_code: pi.last_payment_error.decline_code,
          message: pi.last_payment_error.message,
          type: pi.last_payment_error.type,
        }
      : null;
  }

  await orderRef.update(update);

  return NextResponse.json({ ok: true, stripeStatus: pi.status, mappedStatus: status });
}
