import { impactStats } from "@/lib/data";
import { SectionShell } from "@/components/sections/section-shell";
import { Card, CardContent } from "@/components/ui/card";

export function StatsSection() {
  return (
    <SectionShell
      title="Impact At a Glance"
      description="A quick snapshot of the outcomes our fundraising model can produce for youth programs."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {impactStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="space-y-2 p-5">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Impact metrics are updated as program reporting is finalized.</p>
    </SectionShell>
  );
}
