import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/hero-section";
import { StatsSection } from "@/components/sections/stats-section";
import { HowItWorksSection } from "@/components/sections/how-it-works-section";
import { ProgramsPreviewSection } from "@/components/sections/programs-preview-section";
import { MerchTeaserSection } from "@/components/sections/merch-teaser-section";
import { FinalCtaSection } from "@/components/sections/final-cta-section";

export const metadata: Metadata = {
  title: "Give Every Young Athlete a Fair Shot",
  description:
    "Support Sports Our Youth through trusted donations and purpose-driven merchandise that directly strengthens youth programs.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <HowItWorksSection />
      <ProgramsPreviewSection />
      <MerchTeaserSection />
      <FinalCtaSection />
    </>
  );
}
