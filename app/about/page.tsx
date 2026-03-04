import type { Metadata } from "next";
import { mission, vision } from "@/lib/data";
import { PageHero } from "@/components/layout/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about the mission, vision, and values driving Sports Our Youth.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero title="Mission-Driven, Process-Strong." subtitle="A youth sports fundraising organization built around trust, clarity, and measurable outcomes." />

      <SectionShell title="Mission and Vision" description="Our foundation is rooted in equitable access and long-term athlete development.">
        <div className="grid gap-5 md:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Mission</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">{mission}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Vision</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">{vision}</p></CardContent>
          </Card>
        </div>
      </SectionShell>

      <SectionShell title="Where Your Money Goes" description="A clear allocation model built for transparency and accountability.">
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="mb-2 text-sm font-semibold">Program Delivery (Coaching, Equipment, Fees) - 65%</p>
            <div className="h-3 rounded-full bg-muted"><div className="h-full w-[65%] rounded-full bg-accent" /></div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="mb-2 text-sm font-semibold">Travel and Competition Support - 20%</p>
            <div className="h-3 rounded-full bg-muted"><div className="h-full w-[20%] rounded-full bg-primary" /></div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="mb-2 text-sm font-semibold">Operations and Compliance - 15%</p>
            <div className="h-3 rounded-full bg-muted"><div className="h-full w-[15%] rounded-full bg-[#3d5a80]" /></div>
          </div>
        </div>
      </SectionShell>
    </>
  );
}
