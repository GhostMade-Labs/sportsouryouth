import Link from "next/link";
import { testimonials } from "@/lib/data";
import { SectionShell } from "@/components/sections/section-shell";
import { Card, CardContent } from "@/components/ui/card";

export function TestimonialsSection() {
  return (
    <SectionShell title="Stories From the Field" description="How trusted fundraising is changing athlete opportunities.">
      <div className="grid gap-5 md:grid-cols-3">
        {testimonials.map((item) => (
          <Card key={item.name}>
            <CardContent className="space-y-3 p-5">
              <p className="text-sm text-muted-foreground">{item.quote}</p>
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-accent">{item.role}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Link href="/impact" className="inline-block text-sm font-semibold text-accent underline-offset-4 hover:underline">
        Read Stories
      </Link>
    </SectionShell>
  );
}
