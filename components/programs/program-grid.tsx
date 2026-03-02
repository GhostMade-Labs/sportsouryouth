"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { programs } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const filters = ["All", "Basketball", "Soccer", "Baseball", "Football", "Track"];

export function ProgramGrid() {
  const [active, setActive] = useState("All");

  const visible = useMemo(() => {
    return active === "All" ? programs : programs.filter((program) => program.sport === active);
  }, [active]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActive(filter)}
            className={`rounded-full border px-4 py-2 text-sm font-medium ${
              active === filter ? "border-accent bg-accent/20" : "border-border bg-card"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((program) => (
          <Card key={program.slug}>
            <CardHeader>
              <Image src={program.image} alt={program.title} width={640} height={360} className="h-44 w-full rounded-xl object-cover" />
              <CardTitle className="mt-3">{program.title}</CardTitle>
              <CardDescription>{program.summary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Support covers coaching, equipment, nutrition, travel, and tournament fees.</p>
              <Link href={`/programs/${program.slug}`}>
                <Button variant="outline" className="w-full">Learn More</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
