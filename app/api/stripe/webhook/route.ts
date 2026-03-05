import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebase-admin";
import { ensureStripeReceipt } from "@/lib/stripe-receipts";
import { isMailerConfigured } from "@/lib/mailer";
import {
  sendStripeDonationFallbackReceiptEmail,
  sendStripeOrderFallbackReceiptEmail,
} from "@/lib/receipts";

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
  const donationId = pi.metadata?.donationId;
  if (!orderId && !donationId) {
    return NextResponse.json({ received: true });
  }

  const targetCollection = donationId ? "donations" : "orders";
  const targetId = donationId ?? orderId!;

  const status = mapStripePIStatusToOrderStatus(pi);

  const update: Record<string, unknown> = {
    status,
    paymentProvider: "stripe",
    stripePaymentIntentId: pi.id,
    updatedAt: nowIso(),
  };

  if (status === "paid") {
    const paidAt = nowIso();
    update.paidAt = paidAt;

    const targetSnap = await adminDb.collection(targetCollection).doc(targetId).get();
    const target = targetSnap.data() as
      | {
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
          donor?: { fullName?: string; email?: string };
          stripeFallbackReceiptSentAt?: string;
        }
      | undefined;

    try {
      const receiptEmail =
        targetCollection === "donations"
          ? target?.donor?.email?.trim()
          : target?.shipping?.email?.trim();
      const receipt = await ensureStripeReceipt(stripe, pi, receiptEmail);
      update.stripeReceiptStatus = receipt.status;
      update.stripeReceiptUrl = receipt.receiptUrl;
    } catch (error) {
      update.stripeReceiptStatus = "failed";
      update.stripeReceiptError = error instanceof Error ? error.message : "Failed to sync Stripe receipt";
    }

    if (target && !target.stripeFallbackReceiptSentAt) {
      if (!isMailerConfigured()) {
        update.stripeFallbackReceiptStatus = "skipped_missing_mailer_config";
      } else {
        try {
          if (targetCollection === "orders") {
            const canFallbackOrder =
              Boolean(target.shipping?.email) &&
              Array.isArray(target.items) &&
              target.items.length > 0 &&
              typeof target.total === "number";

            if (canFallbackOrder) {
              await sendStripeOrderFallbackReceiptEmail({
                orderId: targetId,
                paidAtIso: paidAt,
                total: target.total!,
                items: target.items!,
                shipping: target.shipping!,
              });
              update.stripeFallbackReceiptStatus = "sent";
              update.stripeFallbackReceiptSentAt = nowIso();
            }
          } else {
            const canFallbackDonation =
              Boolean(target.donor?.email) &&
              typeof target.total === "number";

            if (canFallbackDonation) {
              await sendStripeDonationFallbackReceiptEmail({
                donationId: targetId,
                paidAtIso: paidAt,
                total: target.total!,
                donorName: target.donor?.fullName || "Supporter",
                donorEmail: target.donor!.email!,
              });
              update.stripeFallbackReceiptStatus = "sent";
              update.stripeFallbackReceiptSentAt = nowIso();
            }
          }
        } catch (fallbackError) {
          update.stripeFallbackReceiptStatus = "failed";
          update.stripeFallbackReceiptError =
            fallbackError instanceof Error ? fallbackError.message : "Failed to send Stripe fallback receipt email";
        }
      }
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
    await adminDb.collection(targetCollection).doc(targetId).update(update);
  } catch {
    // Acknowledge webhook even if order update fails to avoid endless retries.
  }

  return NextResponse.json({ received: true });
}
