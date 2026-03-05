import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2026-02-25.clover",
});

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

  const donation = snap.data() as {
    status?: string;
    total?: number;
    donor?: { email?: string; fullName?: string };
  };

  if (donation.status === "paid") {
    return NextResponse.json({ error: "Donation already paid" }, { status: 409 });
  }

  const amountCents = Math.round(Number(donation.total ?? 0) * 100);
  if (amountCents <= 0) {
    return NextResponse.json({ error: "Invalid donation amount" }, { status: 400 });
  }

  const donorEmail = donation.donor?.email?.trim();
  const donorName = donation.donor?.fullName?.trim();

  const pi = await stripe.paymentIntents.create({
    amount: amountCents,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never",
    },
    metadata: { donationId },
    description: donorName ? `Donation by ${donorName}` : "Sports Our Youth donation",
    receipt_email: donorEmail || undefined,
  });

  if (!pi.client_secret) {
    return NextResponse.json({ error: "Unable to create Stripe payment intent" }, { status: 500 });
  }

  await donationRef.update({
    status: "pending_payment",
    paymentProvider: "stripe",
    stripePaymentIntentId: pi.id,
    stripeReceiptEmail: donorEmail || null,
    stripeReceiptStatus: donorEmail ? "requested" : "skipped_missing_email",
    updatedAt: new Date().toISOString(),
  });

  return NextResponse.json({ clientSecret: pi.client_secret });
}
