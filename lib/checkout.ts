import { z } from "zod";
import { products } from "@/lib/data";

export const SIZES_IN_STOCK = ["S", "M", "L", "XL", "2XL", "3XL", "4XL"] as const;
export const SizeInStockSchema = z.enum(SIZES_IN_STOCK);

export const CartItemSchema = z.object({
  id: z.string().min(1),
  productId: z.string().min(1),
  name: z.string().min(1),
  image: z.string().min(1),
  type: z.enum(["tshirt", "hoodie"]),
  size: SizeInStockSchema,
  color: z.string().min(1),
  qty: z.number().int().min(1),
  price: z.number().nonnegative(),
});

export const ShippingSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  address1: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(3),
});

export const CreateOrderSchema = z.object({
  items: z.array(CartItemSchema).min(1),
  shipping: ShippingSchema,
});

type ParsedCartItem = z.infer<typeof CartItemSchema>;

const productById = new Map(
  products.map((product) => [
    product.id,
    {
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      sizes: product.sizes,
      colors: product.colors,
      type: product.category === "Hoodie" ? "hoodie" as const : "tshirt" as const,
    },
  ]),
);

export function normalizeServerItems(items: ParsedCartItem[]) {
  return items.map((item) => {
    const product = productById.get(item.productId);
    if (!product) {
      throw new Error(`Unknown product: ${item.productId}`);
    }

    if (item.type !== product.type) {
      throw new Error(`Invalid product type for ${product.id}`);
    }

    if (!product.sizes.includes(item.size)) {
      throw new Error(`Invalid size selected for ${product.name}`);
    }

    if (!product.colors.includes(item.color)) {
      throw new Error(`Invalid color selected for ${product.name}`);
    }

    return {
      id: item.id,
      productId: product.id,
      name: product.name,
      image: product.image,
      type: product.type,
      size: item.size,
      color: item.color,
      qty: item.qty,
      price: product.price,
    };
  });
}

export function computeServerTotal(items: ReturnType<typeof normalizeServerItems>) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}
