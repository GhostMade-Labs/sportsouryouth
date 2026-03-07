import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { programProfiles } from "@/lib/data";

type ProgramCardVisual = {
  backgroundSrc: string;
  objectPosition: string;
};

const programCardVisualById: Record<string, ProgramCardVisual> = {
  basketball: {
    backgroundSrc: "/images/program-cards/basketball-card-bg.png",
    objectPosition: "56% 46%",
  },
  football: {
    backgroundSrc: "/images/program-cards/football-card-bg.png",
    objectPosition: "52% 48%",
  },
  "baseball-girls-softball": {
    backgroundSrc: "/images/program-cards/baseball-softball-card-bg.png",
    objectPosition: "50% 50%",
  },
  soccer: {
    backgroundSrc: "/images/program-cards/soccer-card-bg.jpeg",
    objectPosition: "52% 46%",
  },
  hockey: {
    backgroundSrc: "/images/program-cards/hockey-card-bg.png",
    objectPosition: "50% 46%",
  },
};

export function ProgramGrid() {
  return (
    <div className="space-y-5">
      {programProfiles.map((program) => (
        <Card id={program.id} key={program.sport} className="scroll-mt-28 overflow-hidden">
          <CardContent className="grid gap-6 p-0 lg:grid-cols-[280px_1fr]">
            <div className="relative min-h-[21rem] overflow-hidden border-b border-border lg:border-b-0 lg:border-r">
              <Image
                src={programCardVisualById[program.id]?.backgroundSrc ?? "/images/placeholder.svg"}
                alt={`${program.sport} program background`}
                fill
                sizes="(min-width: 1024px) 280px, 100vw"
                className="object-cover"
                style={{ objectPosition: programCardVisualById[program.id]?.objectPosition ?? "50% 50%" }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/75" />
              <div className="relative z-10 flex h-full flex-col p-6 text-white">
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold leading-tight">{program.sport}</h3>
                </div>
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
