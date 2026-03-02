import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { ContactForm } from "@/components/donate/contact-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contact",
  description: "Connect with Sports Our Youth for partnerships, donor support, and program requests.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero title="Contact" subtitle="Reach out for support, partnership opportunities, or program funding questions." />
      <SectionShell title="Get In Touch" description="Our team responds quickly to coaches, parents, and community partners.">
        <div className="grid gap-6 lg:grid-cols-2">
          <ContactForm />
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Contact Details</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Email: hello@sportsouryouth.org</p>
                <p>Phone: (312) 555-0188</p>
                <p>Location: Chicago Metro Area (serving national partners)</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Request Partnership</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Submit your organization overview, goals, athlete demographics, and timeline. We collaborate on sponsorships,
                campaign launches, and matching gift initiatives.
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionShell>
    </>
  );
}
