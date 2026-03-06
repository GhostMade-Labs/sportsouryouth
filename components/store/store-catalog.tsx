"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { ArtworkCollection, Product } from "@/lib/data";
import { artworkCollections } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/components/store/cart-provider";
import { cn, formatCurrency } from "@/lib/utils";

type StoreCatalogProps = {
  limit?: number;
};

type Variant = "tee" | "hoodie";

type ArtworkCardProps = {
  collection: ArtworkCollection;
};

type HoodieImageFrame = {
  backgroundColor: string;
  imagePaddingClassName: string;
  objectPosition: string;
  scale: number;
};

const hoodieImageFrameById: Record<string, HoodieImageFrame> = {
  "play-like-girl-hoodie": {
    backgroundColor: "#fefdfb",
    imagePaddingClassName: "p-1 sm:p-2",
    objectPosition: "50% 47%",
    scale: 1.06,
  },
  "orange-arc-hoodie": {
    backgroundColor: "#f4f4f4",
    imagePaddingClassName: "p-0 sm:p-1",
    objectPosition: "50% 46%",
    scale: 1.05,
  },
  "neon-ice-breaker-hoodie": {
    backgroundColor: "#ffffff",
    imagePaddingClassName: "p-0 sm:p-0",
    objectPosition: "50% 43%",
    scale: 1.12,
  },
  "eat-hockey-sleep-repeat-hoodie": {
    backgroundColor: "#fdfdfd",
    imagePaddingClassName: "p-0 sm:p-0",
    objectPosition: "50% 44%",
    scale: 1.11,
  },
  "bring-it-usa-hoodie": {
    backgroundColor: "#f8f4f1",
    imagePaddingClassName: "p-0 sm:p-0",
    objectPosition: "50% 43%",
    scale: 1.12,
  },
  "gridiron-splash-hoodie": {
    backgroundColor: "#000000",
    imagePaddingClassName: "p-1 sm:p-1",
    objectPosition: "50% 47%",
    scale: 1.04,
  },
};

function ArtworkCard({ collection }: ArtworkCardProps) {
  const { addItem } = useCart();
  const [variant, setVariant] = useState<Variant>("tee");
  const product: Product = variant === "tee" ? collection.tshirt : collection.hoodie;
  const [size, setSize] = useState(product.sizes[0]);
  const color = product.colors[0];
  const hoodieImageFrame = variant === "hoodie" ? hoodieImageFrameById[product.id] : undefined;
  const shouldUseHoodieFrame = Boolean(hoodieImageFrame);

  useEffect(() => {
    setSize(product.sizes[0]);
  }, [product.id, product.sizes]);

  return (
    <Card className="h-full overflow-hidden border-border/70 bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <CardContent className="space-y-4 p-4">
        <div
          className="relative h-[21rem] overflow-hidden rounded-2xl border border-border/60 sm:h-[23rem]"
          style={shouldUseHoodieFrame ? { backgroundColor: hoodieImageFrame?.backgroundColor } : undefined}
        >
          <Image
            src={product.image}
            alt={product.name}
            width={1024}
            height={1536}
            className={cn(
              "h-full w-full",
              shouldUseHoodieFrame
                ? `object-contain ${hoodieImageFrame?.imagePaddingClassName ?? "p-1 sm:p-2"}`
                : "object-cover",
            )}
            style={
              shouldUseHoodieFrame
                ? {
                    objectPosition: hoodieImageFrame?.objectPosition ?? "50% 50%",
                    transform: `scale(${hoodieImageFrame?.scale ?? 1})`,
                  }
                : undefined
            }
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge className="border-accent/30 bg-accent/15 text-accent-foreground">{collection.sport}</Badge>
          <Badge>{variant === "tee" ? "T-Shirt" : "Hoodie"}</Badge>
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-semibold">{collection.artworkName}</h3>
          <p className="text-sm text-muted-foreground">{product.name}</p>
        </div>

        <p className="text-sm text-muted-foreground">{collection.description}</p>

        <div className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-muted/40 p-1">
          <button
            type="button"
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              variant === "tee" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-card"
            }`}
            onClick={() => setVariant("tee")}
            aria-label={`Show ${collection.artworkName} T-Shirt`}
          >
            T-Shirt
          </button>
          <button
            type="button"
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              variant === "hoodie" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-card"
            }`}
            onClick={() => setVariant("hoodie")}
            aria-label={`Show ${collection.artworkName} Hoodie`}
          >
            Hoodie
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Select Size</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((option) => (
              <button
                key={option}
                type="button"
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  size === option ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted"
                }`}
                onClick={() => setSize(option)}
                aria-label={`Select size ${option} for ${product.name}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-lg font-semibold">{formatCurrency(product.price)}</p>
          <Button variant="accent" onClick={() => addItem(product, size, color)}>
            Add to cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function StoreCatalog({ limit }: StoreCatalogProps) {
  const visibleProducts = useMemo(() => {
    return typeof limit === "number" ? artworkCollections.slice(0, limit) : artworkCollections;
  }, [limit]);

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {visibleProducts.map((collection) => (
        <ArtworkCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
}
