"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye } from "lucide-react";
import type { Product } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/components/store/cart-provider";

type ProductCardProps = {
  product: Product;
  onView: (product: Product) => void;
};

export function ProductCard({ product, onView }: ProductCardProps) {
  const { addItem } = useCart();
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);

  return (
    <Card className="h-full">
      <CardHeader className="space-y-3">
        <div className="relative overflow-hidden rounded-xl border border-border bg-muted">
          <Image src={product.image} alt={product.name} width={640} height={400} className="h-44 w-full object-cover" />
        </div>
        <div>
          <CardTitle className="text-lg">{product.name}</CardTitle>
          <CardDescription>{product.category}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{product.description}</p>
        <p className="text-lg font-semibold">{formatCurrency(product.price)}</p>
        <div className="grid gap-2 md:grid-cols-2">
          <Select value={size} onChange={(event) => setSize(event.target.value)} aria-label={`${product.name} size`}>
            {product.sizes.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </Select>
          <Select value={color} onChange={(event) => setColor(event.target.value)} aria-label={`${product.name} color`}>
            {product.colors.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => onView(product)}>
            <Eye className="mr-2 h-4 w-4" />Details
          </Button>
          <Button variant="accent" onClick={() => addItem(product, size, color)}>Add to cart</Button>
        </div>
      </CardContent>
    </Card>
  );
}
