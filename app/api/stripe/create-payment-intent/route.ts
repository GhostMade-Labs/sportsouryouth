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
  const { orderId } = (await req.json().catch(() => ({}))) as { orderId?: string };
  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  const orderRef = adminDb.collection("orders").doc(orderId);
  const snap = await orderRef.get();
  if (!snap.exists) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const order = snap.data() as { status?: string; total?: number; shipping?: { email?: string } };
  if (order.status === "paid") {
    return NextResponse.json({ error: "Order already paid" }, { status: 409 });
  }

  const receiptEmail = order.shipping?.email?.trim();

  const amountCents = Math.round(Number(order.total ?? 0) * 100);
  if (amountCents <= 0) {
    return NextResponse.json({ error: "Invalid order amount" }, { status: 400 });
  }

  const pi = await stripe.paymentIntents.create({
    amount: amountCents,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "always",
    },
    metadata: { orderId },
    receipt_email: receiptEmail || undefined,
  });

  await orderRef.update({
    status: "pending_payment",
    paymentProvider: "stripe",
    stripePaymentIntentId: pi.id,
    stripeReceiptEmail: receiptEmail || null,
    stripeReceiptStatus: receiptEmail ? "requested" : "skipped_missing_email",
    updatedAt: new Date().toISOString(),
  });

  return NextResponse.json({ clientSecret: pi.client_secret });
}
