import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { programs } from "@/lib/data";
import { PageHero } from "@/components/layout/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function generateStaticParams() {
  return programs.map((program) => ({ slug: program.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const program = programs.find((item) => item.slug === params.slug);

  return {
    title: program ? program.title : "Program",
    description: program ? program.summary : "Program details",
  };
}

export default function ProgramDetailPage({ params }: { params: { slug: string } }) {
  const program = programs.find((item) => item.slug === params.slug);
  if (!program) notFound();

  return (
    <>
      <PageHero title={program.title} subtitle={program.summary} />
      <SectionShell title="Program Details" description={program.details}>
        <div className="grid gap-6 md:grid-cols-2">
          <Image src={program.image} alt={program.title} width={900} height={580} className="h-full w-full rounded-2xl border border-border object-cover" />
          <Card>
            <CardContent className="space-y-4 p-6">
              <p className="text-sm uppercase tracking-[0.16em] text-accent">Support Coverage</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Coaching and skill development</li>
                <li>Equipment and uniforms</li>
                <li>Nutrition and recovery support</li>
                <li>Travel and lodging for events</li>
                <li>Tournament and registration fees</li>
              </ul>
              <div className="grid gap-2 sm:grid-cols-2">
                <Link href="/donate"><Button variant="accent" className="w-full">Donate</Button></Link>
                <Link href="/programs"><Button variant="outline" className="w-full">Back to Programs</Button></Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </SectionShell>
    </>
  );
}
