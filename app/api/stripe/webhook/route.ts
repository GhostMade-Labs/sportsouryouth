import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebase-admin";
import { ensureStripeReceipt } from "@/lib/stripe-receipts";

export const runtime = "nodejs";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
if (!stripeSecretKey || !stripeWebhookSecret) {
  throw new Error("Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET");
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
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const rawBody = Buffer.from(await req.arrayBuffer());

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, stripeWebhookSecret as string);
  } catch {
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  const relevant = new Set([
    "payment_intent.succeeded",
    "payment_intent.payment_failed",
    "payment_intent.canceled",
    "payment_intent.processing",
    "payment_intent.requires_action",
  ]);

  if (!relevant.has(event.type)) {
    return NextResponse.json({ received: true });
  }

  const pi = event.data.object as Stripe.PaymentIntent;
  const orderId = pi.metadata?.orderId;
  if (!orderId) {
    return NextResponse.json({ received: true });
  }

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
      const orderSnap = await adminDb.collection("orders").doc(orderId).get();
      const order = orderSnap.data() as { shipping?: { email?: string } } | undefined;
      const receipt = await ensureStripeReceipt(stripe, pi, order?.shipping?.email?.trim());
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

  try {
    await adminDb.collection("orders").doc(orderId).update(update);
  } catch {
    // Acknowledge webhook even if order update fails to avoid endless retries.
  }

  return NextResponse.json({ received: true });
}
