import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { CheckoutPage } from "@/components/store/checkout-page";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your secure checkout with Stripe or PayPal.",
};

export default function CheckoutRoute() {
  return (
    <>
      <PageHero title="Checkout" subtitle="Review your order and complete payment securely." />
      <CheckoutPage />
    </>
  );
}
