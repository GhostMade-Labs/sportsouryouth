import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { programProfiles } from "@/lib/data";

export function ProgramGrid() {
  return (
    <div className="space-y-5">
      {programProfiles.map((program) => (
        <Card id={program.id} key={program.sport} className="scroll-mt-28 overflow-hidden">
          <CardContent className="grid gap-6 p-0 lg:grid-cols-[280px_1fr]">
            <div className="space-y-4 border-b border-border bg-muted/40 p-6 lg:border-b-0 lg:border-r">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{program.sport}</p>
              <div className="flex flex-wrap gap-2">
                <Badge>{program.region}</Badge>
                <Badge>{program.ages}</Badge>
                <Badge>{program.focus}</Badge>
              </div>
            </div>
            <div className="p-6 lg:pr-8">
              <p className="text-sm leading-7 text-muted-foreground">{program.paragraph}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
