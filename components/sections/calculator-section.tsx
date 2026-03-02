import { SectionShell } from "@/components/sections/section-shell";
import { FundraisingCalculator } from "@/components/donate/fundraising-calculator";

export function CalculatorSection() {
  return (
    <SectionShell
      title="Estimate Your Fundraising Potential"
      description="Use this simple calculator to model how local supporters can accelerate youth program resources."
    >
      <FundraisingCalculator />
    </SectionShell>
  );
}
