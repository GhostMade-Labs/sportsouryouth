import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { ImpactGallerySlider } from "@/components/impact/impact-gallery-slider";
import { SectionShell } from "@/components/sections/section-shell";
import { Card, CardContent } from "@/components/ui/card";
import { impactStats } from "@/lib/data";

const impactGallerySlides = [
  {
    src: "/images/program-preview/basketball-clinic-drill.png",
    alt: "Basketball clinic drill",
    title: "Basketball",
    caption: "Team passing and footwork sessions during a youth development clinic.",
  },
  {
    src: "/images/program-preview/football-youth-scrimmage.png",
    alt: "Youth football scrimmage",
    title: "Football",
    caption: "Weekend scrimmage reps where athletes build confidence, discipline, and teamwork.",
  },
  {
    src: "/images/program-preview/baseball-kid-batter.png",
    alt: "Youth baseball batter at the plate",
    title: "Baseball and Girls Softball",
    caption: "Game-day batting practice that reinforces mechanics and composure at the plate.",
  },
  {
    src: "/images/program-preview/soccer-girls-drill.png",
    alt: "Girls soccer training drill",
    title: "Soccer",
    caption: "Small-group technical drills focused on quick decisions and ball control.",
  },
  {
    src: "/images/program-preview/hockey-team-rink.png",
    alt: "Youth hockey team on the rink",
    title: "Hockey",
    caption: "On-ice team sessions that improve skating fundamentals and communication.",
  },
];

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

      <SectionShell title="Photo Gallery" description="Moments from clinics, practices, and competition days.">
        <ImpactGallerySlider slides={impactGallerySlides} autoPlayMs={2000} />
      </SectionShell>
    </>
  );
}
