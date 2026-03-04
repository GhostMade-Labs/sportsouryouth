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
        title="Program Coverage"
        description="A full look at our basketball, football, baseball and girls softball, soccer, and hockey program pathways."
      >
        <ProgramGrid />
      </SectionShell>
    </>
  );
}
