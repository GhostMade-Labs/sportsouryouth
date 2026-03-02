"use client";

import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/components/store/cart-provider";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, subtotal } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/35" onClick={closeCart} aria-label="Close cart overlay">
      <aside
        className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-border bg-card p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Your Cart</h3>
          <button onClick={closeCart} className="rounded-lg p-1 hover:bg-muted" aria-label="Close cart">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          {items.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="rounded-xl border border-border p-3">
                <p className="font-semibold">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.size} / {item.color}</p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      className="rounded-md border border-border p-1"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      className="rounded-md border border-border p-1"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="text-sm font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-5 space-y-3 border-t border-border pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-lg font-bold">{formatCurrency(subtotal)}</span>
          </div>
          <Link href="/donate" onClick={closeCart}>
            <Button variant="accent" className="w-full">Continue to Donate</Button>
          </Link>
          <p className="text-xs text-muted-foreground">Merch support can be completed through the Donate page.</p>
        </div>
      </aside>
    </div>
  );
}
