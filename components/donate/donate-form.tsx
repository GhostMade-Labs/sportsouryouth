"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

const tiers = [25, 50, 100, 250];
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;
const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";

type PaymentMethod = "stripe" | "paypal";

async function postJSON<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = typeof data?.error === "string" ? data.error : "Request failed";
    throw new Error(message);
  }
  return data as T;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function StripePayArea({
  donationId,
  onPaid,
  disabled,
}: {
  donationId: string;
  onPaid: () => void;
  disabled?: boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function syncStripeStatus(paymentIntentId?: string) {
    try {
      await postJSON("/api/donations/stripe/sync-payment-intent", { donationId, paymentIntentId });
    } catch {
      // Webhook can still settle state.
    }
  }

  async function handleStripePay() {
    setError(null);
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/donate?donationId=${donationId}`,
        },
        redirect: "if_required",
      });

      if (result.error) {
        const maybePiId =
          (result.error as { payment_intent?: { id?: string } })?.payment_intent?.id;

        await syncStripeStatus(maybePiId);
        throw new Error(result.error.message || "Payment failed");
      }

      const pi = result.paymentIntent;
      await syncStripeStatus(pi?.id);
      const status = pi?.status ?? "";

      if (status === "succeeded") {
        onPaid();
        return;
      }

      if (status === "processing") {
        setError("Payment is processing. Donation status will update automatically.");
        return;
      }

      if (status === "requires_action") {
        setError("Additional authentication is required. Please follow Stripe prompts.");
        return;
      }

      setError(status ? `Payment not completed (status: ${status}).` : "Payment not completed.");
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Payment failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className={`rounded-xl border border-border bg-card p-4 ${disabled ? "pointer-events-none opacity-60" : ""}`}>
        <PaymentElement />
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      {disabled ? <p className="text-xs text-muted-foreground">Enter your name and email to enable Stripe payment.</p> : null}
      <Button onClick={handleStripePay} disabled={!stripe || loading || Boolean(disabled)} className="w-full">
        {loading ? "Processing..." : "Donate with Stripe"}
      </Button>
    </div>
  );
}

function PayPalPayArea({
  donationReady,
  creatingDonation,
  ensureDonation,
  onPaid,
}: {
  donationReady: boolean;
  creatingDonation: boolean;
  ensureDonation: () => Promise<string>;
  onPaid: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [activeDonationId, setActiveDonationId] = useState<string | null>(null);

  if (!paypalClientId) {
    return <p className="text-sm text-red-500">Missing NEXT_PUBLIC_PAYPAL_CLIENT_ID.</p>;
  }

  return (
    <div className="space-y-3">
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <PayPalScriptProvider
        options={{
          clientId: paypalClientId,
          currency: "USD",
          intent: "capture",
        }}
      >
        <PayPalButtons
          style={{ layout: "vertical" }}
          disabled={!donationReady || creatingDonation}
          createOrder={async () => {
            setError(null);
            if (!donationReady) {
              throw new Error("Enter name, email, and amount before paying with PayPal.");
            }

            const resolvedDonationId = await ensureDonation();
            setActiveDonationId(resolvedDonationId);
            const { paypalOrderId } = await postJSON<{ paypalOrderId: string }>(
              "/api/donations/paypal/create-order",
              { donationId: resolvedDonationId },
            );
            return paypalOrderId;
          }}
          onApprove={async (data) => {
            try {
              if (!data.orderID) {
                throw new Error("PayPal order ID missing");
              }
              if (!activeDonationId) {
                throw new Error("Donation is not ready");
              }
              await postJSON("/api/donations/paypal/capture-order", {
                donationId: activeDonationId,
                paypalOrderId: data.orderID,
              });
              onPaid();
            } catch (requestError) {
              const message = requestError instanceof Error ? requestError.message : "PayPal capture failed";
              setError(message);
            }
          }}
          onError={() => setError("PayPal payment failed")}
        />
      </PayPalScriptProvider>
      {!donationReady ? <p className="text-xs text-muted-foreground">Enter name, email, and amount to enable PayPal.</p> : null}
    </div>
  );
}

export function DonateForm() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [donationId, setDonationId] = useState<string | null>(null);
  const [creatingDonation, setCreatingDonation] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [stripeLoading, setStripeLoading] = useState(false);

  const hasCustomAmount = customAmount.trim().length > 0;
  const parsedCustomAmount = Number(customAmount);
  const resolvedAmount = hasCustomAmount ? parsedCustomAmount : selectedAmount;

  const donationAmount = useMemo(() => {
    if (!Number.isFinite(resolvedAmount) || resolvedAmount < 1) {
      return null;
    }
    return Number(resolvedAmount.toFixed(2));
  }, [resolvedAmount]);

  const donorInfoComplete = fullName.trim().length >= 2 && isValidEmail(email.trim());
  const donationReady = donorInfoComplete && donationAmount !== null;
  const detailsLocked = Boolean(donationId);

  function resetPreparedDonation() {
    setDonationId(null);
    setStripeClientSecret(null);
    setFormError(null);
  }

  const ensureDonation = useCallback(async () => {
    if (donationId) {
      return donationId;
    }

    if (!donationAmount) {
      setFormError("Enter a valid donation amount of at least $1.");
      throw new Error("Invalid donation amount");
    }

    if (!donorInfoComplete) {
      setFormError("Enter your full name and a valid email.");
      throw new Error("Invalid donor info");
    }

    setFormError(null);
    setCreatingDonation(true);
    try {
      const data = await postJSON<{ donationId: string }>("/api/donations/create", {
        fullName: fullName.trim(),
        email: email.trim(),
        amount: donationAmount,
      });

      setDonationId(data.donationId);
      return data.donationId;
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Could not start donation";
      setFormError(message);
      throw requestError;
    } finally {
      setCreatingDonation(false);
    }
  }, [donationAmount, donationId, donorInfoComplete, email, fullName]);

  const ensureStripeIntent = useCallback(async (targetDonationId: string) => {
    if (stripeClientSecret) {
      return stripeClientSecret;
    }

    setStripeLoading(true);
    try {
      const { clientSecret } = await postJSON<{ clientSecret: string }>(
        "/api/donations/stripe/create-payment-intent",
        { donationId: targetDonationId },
      );
      setStripeClientSecret(clientSecret);
      return clientSecret;
    } finally {
      setStripeLoading(false);
    }
  }, [stripeClientSecret]);

  useEffect(() => {
    if (!donationReady || !stripePromise || paymentMethod !== "stripe" || stripeClientSecret || creatingDonation || stripeLoading) {
      return;
    }

    let active = true;
    const prepareStripe = async () => {
      try {
        const resolvedDonationId = await ensureDonation();
        if (!active) {
          return;
        }
        await ensureStripeIntent(resolvedDonationId);
      } catch {
        // Error is already reflected in UI.
      }
    };

    void prepareStripe();

    return () => {
      active = false;
    };
  }, [creatingDonation, donationReady, ensureDonation, ensureStripeIntent, paymentMethod, stripeClientSecret, stripeLoading]);

  function handlePaid() {
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Card>
        <CardHeader className="items-center text-center">
          <CheckCircle2 className="h-12 w-12 text-accent" />
          <CardTitle>Donation Complete</CardTitle>
          <CardDescription>Thank you for investing in young athletes and their future.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Make a Donation</CardTitle>
        <CardDescription>Choose an amount and complete payment securely with Stripe or PayPal.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-2 sm:grid-cols-4">
          {tiers.map((tier) => (
            <button
              type="button"
              key={tier}
              disabled={detailsLocked}
              onClick={() => {
                setSelectedAmount(tier);
                setCustomAmount("");
              }}
              className={`rounded-xl border p-3 text-sm font-semibold transition ${
                selectedAmount === tier && !customAmount ? "border-accent bg-accent/15" : "border-border bg-card"
              }`}
            >
              ${tier}
            </button>
          ))}
          <Input
            type="number"
            step="0.01"
            min={1}
            placeholder="Custom"
            value={customAmount}
            disabled={detailsLocked}
            onChange={(event) => setCustomAmount(event.target.value)}
            aria-label="Custom amount"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1 text-sm text-muted-foreground">
            Full Name
            <Input
              placeholder="Jordan Lee"
              value={fullName}
              disabled={detailsLocked}
              onChange={(event) => setFullName(event.target.value)}
            />
          </label>
          <label className="space-y-1 text-sm text-muted-foreground">
            Email
            <Input
              type="email"
              placeholder="jordan@example.com"
              value={email}
              disabled={detailsLocked}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
        </div>

        <div className="rounded-xl border border-border bg-muted p-3 text-sm text-muted-foreground">
          Transparency note: Donations support coaching, equipment, nutrition, travel, and tournament fees.
          <div className="mt-1 font-medium text-foreground">
            Donation amount: {donationAmount !== null ? formatCurrency(donationAmount) : "--"}
          </div>
        </div>

        {detailsLocked ? (
          <Button type="button" variant="outline" className="w-full" onClick={resetPreparedDonation}>
            Edit Donation Details
          </Button>
        ) : null}

        <div className="space-y-4 rounded-xl border border-border p-4">
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={paymentMethod === "stripe" ? "default" : "outline"}
              onClick={() => setPaymentMethod("stripe")}
            >
              Stripe
            </Button>
            <Button
              type="button"
              variant={paymentMethod === "paypal" ? "default" : "outline"}
              onClick={() => setPaymentMethod("paypal")}
            >
              PayPal
            </Button>
          </div>

          {formError ? <p className="text-sm text-red-500">{formError}</p> : null}

          {paymentMethod === "stripe" ? (
            <>
              {!stripePromise ? (
                <p className="text-sm text-red-500">Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.</p>
              ) : stripeClientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret: stripeClientSecret, appearance: { theme: "stripe" } }}>
                  <StripePayArea donationId={donationId!} onPaid={handlePaid} disabled={!donationReady} />
                </Elements>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
                    {donationReady ? "Preparing secure Stripe form..." : "Enter name, email, and amount to unlock Stripe payment details."}
                  </div>
                  <Button disabled className="w-full">
                    Donate with Stripe
                  </Button>
                </div>
              )}
            </>
          ) : (
            <PayPalPayArea
              donationReady={donationReady}
              creatingDonation={creatingDonation}
              ensureDonation={ensureDonation}
              onPaid={handlePaid}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
