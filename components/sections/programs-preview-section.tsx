import Link from "next/link";
import Image from "next/image";
import { programs } from "@/lib/data";
import { SectionShell } from "@/components/sections/section-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ProgramsPreviewSection() {
  return (
    <SectionShell title="Programs We Support" description="Funding pathways for basketball, soccer, baseball, football, track, and multi-sport clinics.">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {programs.map((program) => (
          <Card key={program.slug}>
            <CardHeader className="space-y-3">
              <Image src={program.image} alt={program.title} width={640} height={360} className="h-40 w-full rounded-xl object-cover" />
              <CardTitle>{program.title}</CardTitle>
              <CardDescription>{program.summary}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/programs/${program.slug}`}>
                <Button variant="outline" className="w-full">Learn More</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}
