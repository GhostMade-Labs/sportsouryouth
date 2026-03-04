import Link from "next/link";
import Image from "next/image";
import { artworkCollections } from "@/lib/data";
import { SectionShell } from "@/components/sections/section-shell";

const featuredMerch = [
  {
    id: "featured-tee",
    label: "Free T-Shirt",
    product: artworkCollections[1].tshirt,
    donation: 32,
    popular: false,
  },
  {
    id: "featured-hoodie",
    label: "Free Hoodie",
    product: artworkCollections[2].hoodie,
    donation: 50,
    popular: true,
  },
];

const cardPerks = ["10 exclusive designs", "Choose your size", "Tax-deductible receipt"];

export function MerchTeaserSection() {
  return (
    <SectionShell
      title="Support by Shopping"
      description="Every purchase contributes to youth clinics, tournament travel, and better training environments."
    >
      <div className="rounded-3xl bg-muted/70 p-5 md:p-8">
        <div className="grid gap-6 md:grid-cols-2">
          {featuredMerch.map(({ id, label, product, donation, popular }) => (
            <article
              key={id}
              className={`overflow-hidden rounded-2xl bg-card shadow-sm ${
                popular ? "border border-primary/60" : "border border-border/70"
              }`}
            >
              <div className="relative border-b border-border/60 bg-muted/50 p-4 sm:p-6">
                {popular ? (
                  <span className="absolute right-4 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">Popular</span>
                ) : null}
                <Image
                  src={product.image}
                  alt={label}
                  width={1024}
                  height={1536}
                  className="mx-auto h-[16rem] w-full object-contain sm:h-[19rem]"
                />
              </div>

              <div className="space-y-3 p-5">
                <p className="flex items-baseline gap-2">
                  <span className="text-4xl font-black leading-none text-foreground">${donation}</span>
                  <span className="text-sm text-muted-foreground">Donation</span>
                </p>

                <h3 className="text-2xl font-bold text-primary">{label}</h3>
                <p className="text-sm text-muted-foreground">Choose from 10 exclusive designs in your preferred size</p>

                <ul className="space-y-2 text-sm text-foreground">
                  {cardPerks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2">
                      <span className="text-accent">&#10003;</span>
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/store"
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
                >
                  Donate ${donation}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Link href="/store" className="inline-block text-sm font-semibold text-accent underline-offset-4 hover:underline">
        Browse full store
      </Link>
    </SectionShell>
  );
}
