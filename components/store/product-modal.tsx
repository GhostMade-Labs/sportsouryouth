"use client";

import Image from "next/image";
import { X } from "lucide-react";
import type { Product } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

type ProductModalProps = {
  product: Product | null;
  onClose: () => void;
};

export function ProductModal({ product, onClose }: ProductModalProps) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label="Product details">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl font-semibold">{product.name}</h3>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-muted" aria-label="Close product details">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Image src={product.image} alt={product.name} width={640} height={420} className="h-64 w-full rounded-xl object-cover" />
          <div className="space-y-4">
            <p className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {product.category}
            </p>
            <p className="text-sm text-muted-foreground">{product.description}</p>
            <p className="text-xl font-bold">{formatCurrency(product.price)}</p>
            <p className="text-sm text-muted-foreground">Available Sizes: {product.sizes.join(", ")}</p>
            <p className="text-sm text-muted-foreground">Available Colors: {product.colors.join(", ")}</p>
            <Button className="w-full" onClick={onClose}>Back to products</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
