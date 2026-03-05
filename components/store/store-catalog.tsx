"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { ArtworkCollection, Product } from "@/lib/data";
import { artworkCollections } from "@/lib/data";
import { CartDrawer } from "@/components/store/cart-drawer";
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

const tallHoodieImageBackgroundById: Record<string, string> = {
  "play-like-girl-hoodie": "#fefdfb",
  "orange-arc-hoodie": "#f4f4f4",
  "neon-ice-breaker-hoodie": "#ffffff",
  "eat-hockey-sleep-repeat-hoodie": "#fdfdfd",
  "bring-it-usa-hoodie": "#f8f4f1",
  "gridiron-splash-hoodie": "#000000",
};

function ArtworkCard({ collection }: ArtworkCardProps) {
  const { addItem } = useCart();
  const [variant, setVariant] = useState<Variant>("tee");
  const product: Product = variant === "tee" ? collection.tshirt : collection.hoodie;
  const [size, setSize] = useState(product.sizes[0]);
  const color = product.colors[0];
  const tallHoodieBackground = tallHoodieImageBackgroundById[product.id];
  const shouldFitToContent = Boolean(tallHoodieBackground);

  useEffect(() => {
    setSize(product.sizes[0]);
  }, [product.id, product.sizes]);

  return (
    <Card className="h-full overflow-hidden border-border/70 bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <CardContent className="space-y-4 p-4">
        <div
          className="relative h-[21rem] overflow-hidden rounded-2xl border border-border/60 sm:h-[23rem]"
          style={shouldFitToContent ? { backgroundColor: tallHoodieBackground } : undefined}
        >
          <Image
            src={product.image}
            alt={product.name}
            width={1024}
            height={1536}
            className={cn(
              "h-full w-full",
              shouldFitToContent ? "object-contain p-2 sm:p-3" : "object-cover",
            )}
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
    <>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visibleProducts.map((collection) => (
          <ArtworkCard key={collection.id} collection={collection} />
        ))}
      </div>

      <CartDrawer />
    </>
  );
}
