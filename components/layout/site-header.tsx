"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Menu, ShoppingBag } from "lucide-react";
import { siteLinks } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/store/cart-provider";

export function SiteHeader() {
  const pathname = usePathname();
  const { items, openCart } = useCart();
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const menu = mobileMenuRef.current;
      const target = event.target as Node | null;

      if (!menu?.open || !target || menu.contains(target)) {
        return;
      }

      menu.open = false;
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        mobileMenuRef.current?.removeAttribute("open");
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const closeMobileMenu = () => {
    mobileMenuRef.current?.removeAttribute("open");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur">
      <div className="container flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center" aria-label="Sports Our Youth home">
          <Image src="/images/logo.png" alt="Sports Our Youth logo" width={168} height={48} className="h-12 w-auto" priority />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {siteLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
                pathname === link.href && "bg-muted text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="outline" size="sm" onClick={openCart} aria-label="Open cart">
            <ShoppingBag className="mr-1 h-4 w-4" /> Cart ({items.length})
          </Button>
          <Link href="/donate">
            <Button variant="accent" size="sm">Donate</Button>
          </Link>
        </div>

        <details ref={mobileMenuRef} className="relative lg:hidden">
          <summary className="list-none rounded-lg border border-border bg-card p-2 text-foreground marker:content-none">
            <Menu className="h-5 w-5" />
          </summary>
          <div className="absolute right-0 mt-2 w-64 space-y-2 rounded-2xl border border-border bg-card p-4 shadow-lg">
            {siteLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={closeMobileMenu} className="block rounded-lg px-3 py-2 text-sm hover:bg-muted">
                {link.label}
              </Link>
            ))}
            <Link href="/donate" onClick={closeMobileMenu} className="block">
              <Button variant="accent" className="w-full">Donate</Button>
            </Link>
            <Button variant="outline" className="w-full" onClick={() => { closeMobileMenu(); openCart(); }}>
              Cart ({items.length})
            </Button>
          </div>
        </details>
      </div>
    </header>
  );
}
