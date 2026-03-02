import { homeSteps } from "@/lib/data";
import { SectionShell } from "@/components/sections/section-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HowItWorksSection() {
  return (
    <SectionShell title="How It Works" description="A clear path from support to measurable athlete opportunity.">
      <div className="grid gap-5 md:grid-cols-3">
        {homeSteps.map((step, index) => (
          <Card key={step.title}>
            <CardHeader>
              <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 text-accent-foreground">
                <step.icon className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Step {index + 1}</p>
              <CardTitle>{step.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}
