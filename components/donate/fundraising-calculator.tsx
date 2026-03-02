"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

export function FundraisingCalculator() {
  const [athletes, setAthletes] = useState(40);
  const [averageDonation, setAverageDonation] = useState(35);
  const [supportersPerAthlete, setSupportersPerAthlete] = useState(6);

  const estimate = useMemo(
    () => athletes * averageDonation * supportersPerAthlete,
    [athletes, averageDonation, supportersPerAthlete],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fundraising Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-1 text-sm text-muted-foreground">
            Number of Athletes
            <Input type="number" min={1} value={athletes} onChange={(event) => setAthletes(Number(event.target.value))} />
          </label>
          <label className="space-y-1 text-sm text-muted-foreground">
            Average Donation
            <Input type="number" min={1} value={averageDonation} onChange={(event) => setAverageDonation(Number(event.target.value))} />
          </label>
          <label className="space-y-1 text-sm text-muted-foreground">
            Supporters per Athlete
            <Input type="number" min={1} value={supportersPerAthlete} onChange={(event) => setSupportersPerAthlete(Number(event.target.value))} />
          </label>
        </div>
        <div className="rounded-xl border border-accent/30 bg-accent/10 p-4">
          <p className="text-sm text-muted-foreground">Estimated Total</p>
          <p className="text-3xl font-bold text-foreground">{formatCurrency(estimate)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
