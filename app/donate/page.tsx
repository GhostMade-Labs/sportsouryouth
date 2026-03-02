import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { DonateForm } from "@/components/donate/donate-form";
import { faqItems } from "@/lib/data";

export const metadata: Metadata = {
  title: "Donate",
  description: "Support youth athletes through transparent donations and sponsorship options.",
};

export default function DonatePage() {
  return (
    <>
      <PageHero title="Donate" subtitle="Fuel coaching, equipment, travel, and tournament access for young athletes." />
      <SectionShell title="Choose Your Support" description="Select one-time or monthly support and submit your donation intent.">
        <DonateForm />
      </SectionShell>
      <SectionShell title="Quick FAQ" description="Helpful answers for donors.">
        <div className="space-y-3 rounded-2xl border border-border bg-card p-5">
          {faqItems.slice(0, 4).map((item) => (
            <div key={item.question} className="border-b border-border pb-3 last:border-none last:pb-0">
              <p className="font-semibold">{item.question}</p>
              <p className="text-sm text-muted-foreground">{item.answer}</p>
            </div>
          ))}
        </div>
      </SectionShell>
    </>
  );
}
