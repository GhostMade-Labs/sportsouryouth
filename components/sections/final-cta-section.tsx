import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCtaSection() {
  return (
    <section className="py-16">
      <div className="container rounded-3xl border border-border bg-gradient-to-br from-primary to-[#13375f] p-8 text-primary-foreground shadow-xl md:p-12">
        <h2 className="max-w-3xl text-3xl font-bold md:text-5xl">Back Youth Potential With Action That Matters.</h2>
        <p className="mt-4 max-w-2xl text-primary-foreground/90">
          Join families, coaches, and community leaders who believe every athlete deserves access to quality opportunities.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/donate"><Button variant="accent" size="lg">Donate</Button></Link>
          <Link href="/store"><Button variant="outline" size="lg">Shop</Button></Link>
        </div>
      </div>
    </section>
  );
}
