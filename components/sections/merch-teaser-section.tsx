import Link from "next/link";
import { StoreCatalog } from "@/components/store/store-catalog";
import { SectionShell } from "@/components/sections/section-shell";

export function MerchTeaserSection() {
  return (
    <SectionShell
      title="Support by Shopping"
      description="Every purchase contributes to youth clinics, tournament travel, and better training environments."
    >
      <StoreCatalog limit={4} />
      <Link href="/store" className="inline-block text-sm font-semibold text-accent underline-offset-4 hover:underline">
        Browse full store
      </Link>
    </SectionShell>
  );
}
