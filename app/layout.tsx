import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CartProvider } from "@/components/store/cart-provider";
import { CartDrawer } from "@/components/store/cart-drawer";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sportsouryouth.org"),
  title: {
    default: "Sports Our Youth | Trusted Youth Sports Fundraising",
    template: "%s | Sports Our Youth",
  },
  description:
    "Sports Our Youth helps young athletes access coaching, equipment, travel, and opportunity through transparent fundraising and purpose-driven community support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${sora.variable} bg-background text-foreground antialiased`}>
        <CartProvider>
          <SiteHeader />
          <main className="min-h-screen pt-20">{children}</main>
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
