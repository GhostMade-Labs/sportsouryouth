"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useCart } from "@/components/store/cart-provider";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/35" onClick={closeCart} aria-label="Close cart overlay">
      <aside
        className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-border bg-card p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">Your Cart</h3>
          </div>
          <button onClick={closeCart} className="rounded-lg p-1 hover:bg-muted" aria-label="Close cart">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-5 text-center">
              <p className="text-sm text-muted-foreground">Your cart is empty.</p>
              <Link
                href="/store"
                onClick={closeCart}
                className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
              >
                Continue shopping
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="rounded-xl border border-border p-3">
                <div className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-muted/40">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.size} / {item.color}</p>
                    <div className="mt-2 flex items-center gap-1">
                      <button
                        className="rounded-md border border-border p-1"
                        onClick={() => {
                          if (item.quantity <= 1) {
                            removeItem(item.id);
                          } else {
                            updateQuantity(item.id, item.quantity - 1);
                          }
                        }}
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
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <p className="text-sm font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-5 space-y-3 border-t border-border pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})</span>
            <span className="text-lg font-bold">{formatCurrency(subtotal)}</span>
          </div>
          <Link href="/checkout" onClick={closeCart}>
            <Button variant="accent" className="w-full">Proceed to Checkout</Button>
          </Link>
          <p className="text-xs text-muted-foreground">Complete your purchase securely via Stripe or PayPal.</p>
        </div>
      </aside>
    </div>
  );
}
