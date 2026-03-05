import Link from "next/link";
import Image from "next/image";
import { programProfiles } from "@/lib/data";
import { SectionShell } from "@/components/sections/section-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const programPreviewImageBySport: Record<string, string> = {
  Basketball: "/images/program-preview/basketball-clinic-drill.png",
  Football: "/images/program-preview/football-youth-scrimmage.png",
  "Baseball and Girls Softball": "/images/program-preview/baseball-kid-batter.png",
  Soccer: "/images/program-preview/soccer-girls-drill.png",
  Hockey: "/images/program-preview/hockey-team-rink.png",
};

function snippetFromParagraph(paragraph: string) {
  const firstSentence = paragraph.split(". ")[0];
  return firstSentence.endsWith(".") ? firstSentence : `${firstSentence}.`;
}

export function ProgramsPreviewSection() {
  return (
    <SectionShell
      title="Programs We Support"
      description="Explore regional pathways across basketball, football, baseball and girls softball, soccer, and hockey."
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {programProfiles.map((program) => (
          <Card key={program.sport}>
            <CardHeader className="space-y-3">
              <Image
                src={programPreviewImageBySport[program.sport] ?? "/images/placeholder.svg"}
                alt={`${program.sport} program`}
                width={640}
                height={360}
                className="h-40 w-full rounded-xl object-cover"
              />
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{program.sport}</p>
              <CardTitle>{program.focus}</CardTitle>
              <CardDescription>{snippetFromParagraph(program.paragraph)}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/programs#${program.id}`}>
                <Button variant="outline" className="w-full">Learn More</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}
