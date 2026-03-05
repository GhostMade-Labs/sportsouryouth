import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebase-admin";
import { ensureStripeReceipt } from "@/lib/stripe-receipts";
import { isMailerConfigured } from "@/lib/mailer";
import { sendStripeDonationFallbackReceiptEmail } from "@/lib/receipts";

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

function mapStripePIStatusToDonationStatus(pi: Stripe.PaymentIntent) {
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
  const { donationId, paymentIntentId } = (await req.json().catch(() => ({}))) as {
    donationId?: string;
    paymentIntentId?: string;
  };

  if (!donationId) {
    return NextResponse.json({ error: "Missing donationId" }, { status: 400 });
  }

  const donationRef = adminDb.collection("donations").doc(donationId);
  const snap = await donationRef.get();
  if (!snap.exists) {
    return NextResponse.json({ error: "Donation not found" }, { status: 404 });
  }

  const donation = snap.data() as {
    stripePaymentIntentId?: string;
    total?: number;
    donor?: {
      fullName?: string;
      email?: string;
    };
    stripeFallbackReceiptSentAt?: string;
  };
  const piId = paymentIntentId || donation.stripePaymentIntentId;
  if (!piId) {
    return NextResponse.json({ error: "Missing stripePaymentIntentId" }, { status: 400 });
  }

  const pi = await stripe.paymentIntents.retrieve(piId);
  const status = mapStripePIStatusToDonationStatus(pi);

  const update: Record<string, unknown> = {
    status,
    paymentProvider: "stripe",
    stripePaymentIntentId: pi.id,
    updatedAt: nowIso(),
  };

  if (status === "paid") {
    const paidAt = nowIso();
    update.paidAt = paidAt;

    try {
      const receipt = await ensureStripeReceipt(stripe, pi, donation.donor?.email?.trim());
      update.stripeReceiptStatus = receipt.status;
      update.stripeReceiptUrl = receipt.receiptUrl;
    } catch (error) {
      update.stripeReceiptStatus = "failed";
      update.stripeReceiptError = error instanceof Error ? error.message : "Failed to sync Stripe receipt";
    }

    const canFallbackToMailer =
      !donation.stripeFallbackReceiptSentAt &&
      Boolean(donation.donor?.email) &&
      typeof donation.total === "number";

    if (canFallbackToMailer) {
      if (!isMailerConfigured()) {
        update.stripeFallbackReceiptStatus = "skipped_missing_mailer_config";
      } else {
        try {
          await sendStripeDonationFallbackReceiptEmail({
            donationId,
            paidAtIso: paidAt,
            total: donation.total!,
            donorName: donation.donor?.fullName || "Supporter",
            donorEmail: donation.donor!.email!,
          });

          update.stripeFallbackReceiptStatus = "sent";
          update.stripeFallbackReceiptSentAt = nowIso();
        } catch (fallbackError) {
          update.stripeFallbackReceiptStatus = "failed";
          update.stripeFallbackReceiptError =
            fallbackError instanceof Error ? fallbackError.message : "Failed to send Stripe fallback donation receipt email";
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

  await donationRef.update(update);

  return NextResponse.json({ ok: true, stripeStatus: pi.status, mappedStatus: status });
}
