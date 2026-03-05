"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { CheckCircle2, CreditCard, Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { useCart } from "@/components/store/cart-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

type PaymentMethod = "stripe" | "paypal";

type Shipping = {
  firstName: string;
  lastName: string;
  email: string;
  address1: string;
  city: string;
  state: string;
  zip: string;
};

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;
const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";

function isShippingComplete(shipping: Shipping) {
  return Boolean(
    shipping.firstName.trim() &&
      shipping.lastName.trim() &&
      shipping.email.trim() &&
      shipping.address1.trim() &&
      shipping.city.trim() &&
      shipping.state.trim() &&
      shipping.zip.trim(),
  );
}

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

function StripePayArea({
  orderId,
  onPaid,
  disabled,
}: {
  orderId: string;
  onPaid: () => void;
  disabled?: boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function syncStripeStatus(paymentIntentId?: string) {
    try {
      await postJSON("/api/stripe/sync-payment-intent", { orderId, paymentIntentId });
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
          return_url: `${window.location.origin}/checkout/return?orderId=${orderId}`,
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
        setError("Payment is processing. Your order status will update automatically.");
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
      {disabled ? <p className="text-xs text-muted-foreground">Fill shipping information to enable Stripe payment.</p> : null}
      <Button onClick={handleStripePay} disabled={!stripe || loading || Boolean(disabled)} className="w-full">
        {loading ? "Processing..." : "Pay with Stripe"}
      </Button>
    </div>
  );
}

function PayPalPayArea({
  shippingReady,
  creatingOrder,
  ensureOrder,
  onPaid,
}: {
  shippingReady: boolean;
  creatingOrder: boolean;
  ensureOrder: () => Promise<string>;
  onPaid: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

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
          disabled={!shippingReady || creatingOrder}
          createOrder={async () => {
            setError(null);
            if (!shippingReady) {
              throw new Error("Fill shipping fields before paying with PayPal.");
            }

            const resolvedOrderId = await ensureOrder();
            setActiveOrderId(resolvedOrderId);
            const { paypalOrderId } = await postJSON<{ paypalOrderId: string }>("/api/paypal/create-order", {
              orderId: resolvedOrderId,
            });
            return paypalOrderId;
          }}
          onApprove={async (data) => {
            try {
              if (!data.orderID) {
                throw new Error("PayPal order ID missing");
              }
              if (!activeOrderId) {
                throw new Error("Order is not ready");
              }

              await postJSON("/api/paypal/capture-order", { orderId: activeOrderId, paypalOrderId: data.orderID });
              onPaid();
            } catch (requestError) {
              const message = requestError instanceof Error ? requestError.message : "PayPal capture failed";
              setError(message);
            }
          }}
          onError={() => setError("PayPal payment failed")}
        />
      </PayPalScriptProvider>
      {!shippingReady ? <p className="text-xs text-muted-foreground">Fill shipping information to enable PayPal.</p> : null}
    </div>
  );
}

export function CheckoutPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal, totalItems } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");
  const [shipping, setShipping] = useState<Shipping>({
    firstName: "",
    lastName: "",
    email: "",
    address1: "",
    city: "",
    state: "",
    zip: "",
  });

  const [creatingOrder, setCreatingOrder] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [stripeLoading, setStripeLoading] = useState(false);

  const shippingOk = useMemo(() => isShippingComplete(shipping), [shipping]);

  const ensureOrder = useCallback(async () => {
    if (orderId) {
      return orderId;
    }

    setOrderError(null);
    setCreatingOrder(true);
    try {
      const payload = {
        items: items.map((item) => ({
          id: item.id,
          productId: item.productId,
          name: item.name,
          image: item.image,
          type: item.type,
          size: item.size,
          color: item.color,
          qty: item.quantity,
          price: item.price,
        })),
        shipping,
      };

      const data = await postJSON<{ orderId: string; total: number }>("/api/orders/create", payload);
      setOrderId(data.orderId);
      return data.orderId;
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Could not create order";
      setOrderError(message);
      throw requestError;
    } finally {
      setCreatingOrder(false);
    }
  }, [items, orderId, shipping]);

  const ensureStripeIntent = useCallback(async (targetOrderId: string) => {
    if (stripeClientSecret) {
      return stripeClientSecret;
    }

    setStripeLoading(true);
    try {
      const { clientSecret } = await postJSON<{ clientSecret: string }>("/api/stripe/create-payment-intent", {
        orderId: targetOrderId,
      });
      setStripeClientSecret(clientSecret);
      return clientSecret;
    } finally {
      setStripeLoading(false);
    }
  }, [stripeClientSecret]);

  useEffect(() => {
    if (!shippingOk || !stripePromise || paymentMethod !== "stripe" || stripeClientSecret || creatingOrder || stripeLoading) {
      return;
    }

    let active = true;
    const prepareStripe = async () => {
      try {
        const resolvedOrderId = await ensureOrder();
        if (!active) {
          return;
        }
        await ensureStripeIntent(resolvedOrderId);
      } catch {
        // Error is already reflected in UI.
      }
    };

    void prepareStripe();

    return () => {
      active = false;
    };
  }, [creatingOrder, ensureOrder, ensureStripeIntent, paymentMethod, shippingOk, stripeClientSecret, stripeLoading]);

  function handlePaid() {
    setSubmitted(true);
    clearCart();
  }

  if (submitted) {
    return (
      <section className="py-16">
        <div className="container max-w-2xl">
          <Card>
            <CardHeader className="items-center text-center">
              <CheckCircle2 className="h-12 w-12 text-accent" />
              <CardTitle>Payment Complete</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">
                Thank you for supporting Sports Our Youth. Your order has been received.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link href="/store">
                  <Button variant="outline" className="w-full">Continue Shopping</Button>
                </Link>
                <Link href="/">
                  <Button className="w-full">Back to Home</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="py-16">
        <div className="container max-w-2xl">
          <Card>
            <CardHeader className="items-center text-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              <CardTitle>Your cart is empty</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/store">
                <Button>Browse Store</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="container space-y-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
          <Link href="/store" className="text-sm font-medium text-muted-foreground hover:text-foreground">Back to Store</Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Truck className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1 text-sm text-muted-foreground">
                  First Name
                  <Input
                    value={shipping.firstName}
                    onChange={(event) => setShipping((prev) => ({ ...prev, firstName: event.target.value }))}
                  />
                </label>
                <label className="space-y-1 text-sm text-muted-foreground">
                  Last Name
                  <Input
                    value={shipping.lastName}
                    onChange={(event) => setShipping((prev) => ({ ...prev, lastName: event.target.value }))}
                  />
                </label>
                <label className="space-y-1 text-sm text-muted-foreground sm:col-span-2">
                  Email
                  <Input
                    type="email"
                    value={shipping.email}
                    onChange={(event) => setShipping((prev) => ({ ...prev, email: event.target.value }))}
                  />
                </label>
                <label className="space-y-1 text-sm text-muted-foreground sm:col-span-2">
                  Address
                  <Input
                    value={shipping.address1}
                    onChange={(event) => setShipping((prev) => ({ ...prev, address1: event.target.value }))}
                  />
                </label>
                <label className="space-y-1 text-sm text-muted-foreground">
                  City
                  <Input
                    value={shipping.city}
                    onChange={(event) => setShipping((prev) => ({ ...prev, city: event.target.value }))}
                  />
                </label>
                <label className="space-y-1 text-sm text-muted-foreground">
                  State
                  <Input
                    value={shipping.state}
                    onChange={(event) => setShipping((prev) => ({ ...prev, state: event.target.value }))}
                  />
                </label>
                <label className="space-y-1 text-sm text-muted-foreground sm:col-span-2">
                  ZIP Code
                  <Input
                    value={shipping.zip}
                    onChange={(event) => setShipping((prev) => ({ ...prev, zip: event.target.value }))}
                  />
                </label>
                {!shippingOk ? <p className="text-xs text-muted-foreground sm:col-span-2">Fill all fields to continue.</p> : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

                {orderError ? <p className="text-sm text-red-500">{orderError}</p> : null}

                {paymentMethod === "stripe" ? (
                  <>
                    {!stripePromise ? (
                      <p className="text-sm text-red-500">Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.</p>
                    ) : stripeClientSecret ? (
                      <Elements stripe={stripePromise} options={{ clientSecret: stripeClientSecret, appearance: { theme: "stripe" } }}>
                        <StripePayArea orderId={orderId!} onPaid={handlePaid} disabled={!shippingOk} />
                      </Elements>
                    ) : (
                      <div className="space-y-3">
                        <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
                          {shippingOk ? "Preparing secure Stripe form..." : "Fill shipping information to unlock Stripe payment details."}
                        </div>
                        <Button disabled className="w-full">
                          Pay with Stripe
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <PayPalPayArea
                    shippingReady={shippingOk}
                    creatingOrder={creatingOrder}
                    ensureOrder={ensureOrder}
                    onPaid={handlePaid}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-[26rem] space-y-3 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="rounded-xl border border-border p-3">
                    <div className="flex gap-3">
                      <div className="relative h-14 w-14 overflow-hidden rounded-lg border border-border">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.type === "tshirt" ? "T-Shirt" : "Hoodie"} / {item.size} / {item.color}
                        </p>
                        <div className="mt-2 flex items-center gap-1">
                          <button
                            className="rounded-md border border-border p-1"
                            onClick={() => {
                              if (item.quantity <= 1) {
                                removeItem(item.id);
                              } else {
                                updateQuantity(item.id, item.quantity - 1);
                              }
                            }}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <button
                            className="rounded-md border border-border p-1"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            className="ml-auto rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                            onClick={() => removeItem(item.id)}
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-right text-sm font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-border pt-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span>{totalItems}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex items-center justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
