import { trustBadges } from "@/lib/data";

export function TrustStrip() {
  return (
    <section className="py-4">
      <div className="container rounded-2xl border border-border bg-card p-5">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-accent">
          Trusted fundraising. Real impact. Transparent support.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {trustBadges.map((badge) => (
            <div key={badge.label} className="flex items-center gap-2 rounded-xl border border-border bg-muted p-3 text-sm font-medium">
              <badge.icon className="h-4 w-4 text-accent" />
              {badge.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
