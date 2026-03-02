import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { StoreCatalog } from "@/components/store/store-catalog";

export const metadata: Metadata = {
  title: "Store",
  description: "Shop merchandise that supports youth sports fundraising initiatives.",
};

export default function StorePage() {
  return (
    <>
      <PageHero title="Support by Shopping" subtitle="Purchase official Sports Our Youth merchandise to help fund youth program opportunities." />
      <SectionShell title="Store" description="Filter by category, size, and price, then add items to your cart.">
        <StoreCatalog />
      </SectionShell>
    </>
  );
}
