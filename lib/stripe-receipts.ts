import Stripe from "stripe";

type StripeReceiptResult = {
  status: "sent_or_queued" | "pending_charge" | "skipped";
  receiptUrl: string | null;
};

export async function ensureStripeReceipt(
  stripe: Stripe,
  pi: Stripe.PaymentIntent,
  receiptEmail?: string,
): Promise<StripeReceiptResult> {
  if (!receiptEmail) {
    return { status: "skipped", receiptUrl: null };
  }

  const latestChargeId =
    typeof pi.latest_charge === "string" ? pi.latest_charge : pi.latest_charge?.id;

  if (!latestChargeId) {
    return { status: "pending_charge", receiptUrl: null };
  }

  let charge = await stripe.charges.retrieve(latestChargeId);

  if (charge.receipt_email !== receiptEmail) {
    await stripe.charges.update(latestChargeId, { receipt_email: receiptEmail });
    charge = await stripe.charges.retrieve(latestChargeId);
  }

  return {
    status: "sent_or_queued",
    receiptUrl: charge.receipt_url ?? null,
  };
}
