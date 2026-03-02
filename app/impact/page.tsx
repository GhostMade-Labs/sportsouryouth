import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { impactStats, impactStories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Impact",
  description: "See outcomes, stories, and visual highlights from supported programs.",
};

export default function ImpactPage() {
  return (
    <>
      <PageHero title="Impact Dashboard" subtitle="Track outcomes, stories, and momentum across supported communities." />

      <SectionShell title="Key Metrics" description="Outcomes from campaigns and program support cycles.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {impactStats.map((stat) => (
            <Card key={stat.label}><CardContent className="p-5"><p className="text-sm text-muted-foreground">{stat.label}</p><p className="text-3xl font-bold">{stat.value}</p></CardContent></Card>
          ))}
        </div>
      </SectionShell>

      <SectionShell title="Community Reach" description="Where program investments are active across communities.">
        <Image src="/images/placeholder.svg" alt="Impact map" width={1280} height={520} className="h-auto w-full rounded-2xl border border-border" />
      </SectionShell>

      <SectionShell title="Case Studies" description="Program stories that show what support can unlock.">
        <div className="grid gap-5 md:grid-cols-2">
          {impactStories.map((story) => (
            <Card key={story.title}>
              <CardHeader>
                <Image src={story.image} alt={story.title} width={700} height={360} className="h-52 w-full rounded-xl object-cover" />
                <CardTitle className="mt-3">{story.title}</CardTitle>
              </CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">{story.summary}</p></CardContent>
            </Card>
          ))}
        </div>
      </SectionShell>

      <SectionShell title="Photo Gallery" description="Moments from clinics, practices, and competition days.">
        <div className="grid gap-4 sm:grid-cols-3">
          {["/images/placeholder.svg", "/images/placeholder.svg", "/images/placeholder.svg"].map((image, index) => (
            <Image key={`${image}-${index}`} src={image} alt="Youth sports gallery image" width={420} height={300} className="h-48 w-full rounded-xl border border-border object-cover" />
          ))}
        </div>
      </SectionShell>
    </>
  );
}
