import Image from "next/image";
import Link from "next/link";
import { mission, siteLinks } from "@/lib/data";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="container grid gap-10 py-14 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          <Link href="/" className="inline-flex items-center" aria-label="Sports Our Youth home">
            <Image src="/images/logo.png" alt="Sports Our Youth logo" width={168} height={48} className="h-12 w-auto" />
          </Link>
          <p className="max-w-xl text-sm text-muted-foreground">{mission}</p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {siteLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>
      <div className="border-t border-border/70 py-4 text-center text-xs text-muted-foreground">
        <p>{`Copyright ${year} Sports Our Youth. All rights reserved.`}</p>
        <p className="mt-1">
          Built by{" "}
          <a
            href="https://www.ghostmadelabs.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-foreground hover:underline"
          >
            GM Labs
          </a>
        </p>
      </div>
    </footer>
  );
}
