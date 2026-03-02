import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { faqItems } from "@/lib/data";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Find answers about donations, support requests, shipping, and policies.",
};

export default function FaqPage() {
  return (
    <>
      <PageHero title="Frequently Asked Questions" subtitle="Everything supporters, families, and program partners ask us most often." />
      <SectionShell title="FAQ" description="Helpful answers for donors, families, and partner programs.">
        <div className="space-y-3">
          {faqItems.map((item) => (
            <details key={item.question} className="rounded-xl border border-border bg-card p-4">
              <summary className="cursor-pointer text-base font-semibold">{item.question}</summary>
              <p className="mt-2 text-sm text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </div>
      </SectionShell>
    </>
  );
}
