import { impactStats, trustBadges } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";

export function StatsSection() {
  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <div
          className="relative overflow-hidden rounded-3xl border border-border/70 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/impact-at-a-glance-bg.png'), url('/images/hero-youth-sports-collage.png')" }}
        >
          <div className="absolute inset-0 bg-background/85" />

          <div className="relative space-y-8 p-5 md:p-8 lg:p-10">
            <div className="max-w-2xl space-y-3">
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">Impact At a Glance</h2>
              <p className="text-base text-muted-foreground md:text-lg">
                A quick snapshot of the outcomes our fundraising model can produce for youth programs.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card/90 p-5">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-accent">
                Trusted fundraising. Real impact. Transparent support.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {trustBadges.map((badge) => (
                  <div
                    key={badge.label}
                    className="flex items-center gap-2 rounded-xl border border-border/70 bg-muted/70 p-3 text-sm font-medium text-foreground"
                  >
                    <badge.icon className="h-4 w-4 text-accent" />
                    {badge.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {impactStats.map((stat) => (
                <Card key={stat.label} className="bg-card/90">
                  <CardContent className="space-y-2 p-5">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Impact metrics are updated as program reporting is finalized.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
