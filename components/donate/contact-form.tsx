"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Us</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sent ? <p className="rounded-xl bg-accent/15 p-3 text-sm">Message sent successfully. We will follow up shortly.</p> : null}
        <label className="space-y-1 text-sm text-muted-foreground">
          Name
          <Input placeholder="Your name" />
        </label>
        <label className="space-y-1 text-sm text-muted-foreground">
          Email
          <Input type="email" placeholder="you@example.com" />
        </label>
        <label className="space-y-1 text-sm text-muted-foreground">
          Message
          <Textarea placeholder="How can we help your program?" />
        </label>
        <Button
          className="w-full"
          onClick={() => {
            setSent(true);
          }}
        >
          Send Message
        </Button>
      </CardContent>
    </Card>
  );
}
