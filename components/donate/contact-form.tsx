"use client";

import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ContactFormState = {
  name: string;
  email: string;
  message: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function ContactForm() {
  const [form, setForm] = useState<ContactFormState>({
    name: "",
    email: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const canSubmit =
    form.name.trim().length >= 2 &&
    isValidEmail(form.email.trim()) &&
    form.message.trim().length >= 10;

  function setField(field: keyof ContactFormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (sent) {
      setSent(false);
    }
    if (formError) {
      setFormError("");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      setFormError("Enter your name, a valid email, and a message with at least 10 characters.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        }),
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        throw new Error(payload?.error || "Unable to send your message right now. Please try again.");
      }

      setSent(true);
      setForm({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      setSent(false);
      setFormError(error instanceof Error ? error.message : "Unable to send your message right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Us</CardTitle>
      </CardHeader>
      <CardContent>
        {sent ? <p className="rounded-xl bg-accent/15 p-3 text-sm">Message sent successfully. We will follow up shortly.</p> : null}
        {formError ? <p className="mt-4 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{formError}</p> : null}
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <label className="space-y-1 text-sm text-muted-foreground">
            Name
            <Input
              placeholder="Your name"
              value={form.name}
              onChange={(event) => setField("name", event.target.value)}
              required
              minLength={2}
              disabled={isSubmitting}
            />
          </label>
          <label className="space-y-1 text-sm text-muted-foreground">
            Email
            <Input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(event) => setField("email", event.target.value)}
              required
              disabled={isSubmitting}
            />
          </label>
          <label className="space-y-1 text-sm text-muted-foreground">
            Message
            <Textarea
              placeholder="How can we help your program?"
              value={form.message}
              onChange={(event) => setField("message", event.target.value)}
              required
              minLength={10}
              disabled={isSubmitting}
            />
          </label>
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
