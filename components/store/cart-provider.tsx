"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { Product } from "@/lib/data";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, size: string, color: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (product: Product, size: string, color: string) => {
    const lineId = `${product.id}-${size}-${color}`;

    setItems((prev) => {
      const existing = prev.find((item) => item.id === lineId);
      if (existing) {
        return prev.map((item) => (item.id === lineId ? { ...item, quantity: item.quantity + 1 } : item));
      }

      return [
        ...prev,
        {
          id: lineId,
          name: product.name,
          price: product.price,
          quantity: 1,
          size,
          color,
        },
      ];
    });

    setIsOpen(true);
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const value = useMemo(
    () => ({
      items,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      updateQuantity,
      subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    [items, isOpen],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
