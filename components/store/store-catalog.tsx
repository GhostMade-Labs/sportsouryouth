"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/data";
import { products } from "@/lib/data";
import { ProductCard } from "@/components/store/product-card";
import { ProductModal } from "@/components/store/product-modal";
import { CartDrawer } from "@/components/store/cart-drawer";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type StoreCatalogProps = {
  limit?: number;
};

export function StoreCatalog({ limit }: StoreCatalogProps) {
  const [category, setCategory] = useState("All");
  const [size, setSize] = useState("All");
  const [maxPrice, setMaxPrice] = useState(100);
  const [selected, setSelected] = useState<Product | null>(null);

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const categoryMatch = category === "All" || product.category === category;
      const sizeMatch = size === "All" || product.sizes.includes(size);
      return categoryMatch && sizeMatch && product.price <= maxPrice;
    });

    return typeof limit === "number" ? filtered.slice(0, limit) : filtered;
  }, [category, size, maxPrice, limit]);

  const categories = ["All", ...new Set(products.map((product) => product.category))];
  const sizes = ["All", ...new Set(products.flatMap((product) => product.sizes))];

  return (
    <>
      {!limit ? (
        <div className="mb-6 grid gap-3 rounded-2xl border border-border bg-card p-4 md:grid-cols-3">
          <Select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category">
            {categories.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </Select>
          <Select value={size} onChange={(event) => setSize(event.target.value)} aria-label="Filter by size">
            {sizes.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </Select>
          <label className="space-y-1 text-sm text-muted-foreground">
            Max Price: ${maxPrice}
            <Input
              type="range"
              min={20}
              max={100}
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
              className="h-10 px-0"
              aria-label="Max price"
            />
          </label>
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} onView={setSelected} />
        ))}
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
      <CartDrawer />
    </>
  );
}
