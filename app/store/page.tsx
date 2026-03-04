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
      <PageHero title="Artwork Merch Drops" subtitle="Every design comes in two cuts: T-Shirt and Hoodie. Switch styles inside each card." />
      <SectionShell
        title="Choose Your Favorite Merch"
        description="Wear the mission. Every dollar of profit from merch sales goes directly to funding our youth programs."
      >
        <StoreCatalog />
      </SectionShell>
    </>
  );
}
