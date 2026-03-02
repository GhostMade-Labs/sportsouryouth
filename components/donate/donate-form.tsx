"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const tiers = [25, 50, 100];

export function DonateForm() {
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [monthly, setMonthly] = useState(false);
  const [sponsorAthlete, setSponsorAthlete] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Make a Donation</CardTitle>
        <CardDescription>Complete the form to submit your donation request.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 sm:grid-cols-4">
          {tiers.map((tier) => (
            <button
              key={tier}
              onClick={() => {
                setSelectedAmount(tier);
                setCustomAmount("");
              }}
              className={`rounded-xl border p-3 text-sm font-semibold transition ${
                selectedAmount === tier && !customAmount ? "border-accent bg-accent/15" : "border-border bg-card"
              }`}
            >
              ${tier}
            </button>
          ))}
          <Input
            type="number"
            min={1}
            placeholder="Custom"
            value={customAmount}
            onChange={(event) => setCustomAmount(event.target.value)}
            aria-label="Custom amount"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1 text-sm text-muted-foreground">
            Full Name
            <Input placeholder="Jordan Lee" />
          </label>
          <label className="space-y-1 text-sm text-muted-foreground">
            Email
            <Input type="email" placeholder="jordan@example.com" />
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex items-center gap-2 rounded-xl border border-border bg-muted p-3 text-sm font-medium">
            <input type="checkbox" checked={monthly} onChange={(event) => setMonthly(event.target.checked)} />
            Monthly giving
          </label>
          <label className="flex items-center gap-2 rounded-xl border border-border bg-muted p-3 text-sm font-medium">
            <input type="checkbox" checked={sponsorAthlete} onChange={(event) => setSponsorAthlete(event.target.checked)} />
            Sponsor an athlete
          </label>
        </div>

        <div className="rounded-xl border border-border bg-muted p-3 text-sm text-muted-foreground">
          Transparency note: Donations support coaching, equipment, nutrition, travel, and tournament fees.
        </div>

        <Button variant="accent" className="w-full">Submit Donation Intent ${customAmount || selectedAmount}{monthly ? " / month" : ""}</Button>
      </CardContent>
    </Card>
  );
}
