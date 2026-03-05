"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HelpWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground shadow-lg transition hover:brightness-95"
        aria-label="Need help"
      >
        <MessageCircle className="h-4 w-4" /> Need help?
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label="Contact support">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">How can we help?</h3>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1 hover:bg-muted" aria-label="Close help modal">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              Reach us at <a className="font-semibold text-foreground" href="mailto:info@sportsouryouth.org">info@sportsouryouth.org</a> or call
              <a className="ml-1 font-semibold text-foreground" href="tel:+13125550188">(312) 555-0188</a>.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">Hours: Monday-Friday, 9:00 AM to 6:00 PM CT.</p>
            <Button className="mt-5 w-full" onClick={() => setOpen(false)}>Close</Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
