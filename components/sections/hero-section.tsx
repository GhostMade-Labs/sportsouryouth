import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="container grid items-center gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <Badge className="bg-accent/20 text-accent-foreground">Youth Sports Fundraising</Badge>
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">Give Every Young Athlete a Fair Shot.</h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Rise up youth programs, and build the next generation of community leaders through sports.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/donate"><Button variant="accent" size="lg">Donate Now</Button></Link>
            <Link href="/store"><Button variant="outline" size="lg">Free T-Shirt & Hoodie <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
          </div>
        </div>

        <div className="relative">
          <Image
            src="/images/hero-youth-sports-collage.png"
            alt="Young athletes playing soccer, baseball, and basketball"
            width={1536}
            height={1024}
            className="w-full rounded-3xl border border-border shadow-xl"
            priority
          />
          <div className="absolute -left-4 bottom-5 rounded-xl border border-border bg-card p-3 shadow-lg">
            <p className="text-xs text-muted-foreground">Programs Supported</p>
            <p className="text-xl font-bold">126</p>
          </div>
          <div className="absolute -right-4 top-6 rounded-xl border border-border bg-card p-3 shadow-lg">
            <p className="text-xs text-muted-foreground">Funds to Programs</p>
            <p className="text-xl font-bold">91%</p>
          </div>
        </div>
      </div>
    </section>
  );
}
