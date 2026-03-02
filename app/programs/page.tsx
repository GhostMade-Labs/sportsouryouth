import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { ProgramGrid } from "@/components/programs/program-grid";

export const metadata: Metadata = {
  title: "Programs",
  description: "Browse sports programs supported by Sports Our Youth.",
};

export default function ProgramsPage() {
  return (
    <>
      <PageHero title="Programs" subtitle="Explore the clinics, camps, and tournament pathways we help fund across youth sports." />
      <SectionShell
        title="Find a Program"
        description="Filter by sport and review how each program uses support for coaching, equipment, nutrition, travel, and tournament fees."
      >
        <ProgramGrid />
      </SectionShell>
    </>
  );
}
