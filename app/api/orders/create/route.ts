import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { CreateOrderSchema, computeServerTotal, normalizeServerItems, SIZES_IN_STOCK } from "@/lib/checkout";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = CreateOrderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { items, shipping } = parsed.data;

  let safeItems: ReturnType<typeof normalizeServerItems>;
  try {
    safeItems = normalizeServerItems(items);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid order items" },
      { status: 400 },
    );
  }

  const total = computeServerTotal(safeItems);

  const orderRef = adminDb.collection("orders").doc();
  const now = new Date().toISOString();

  await orderRef.set({
    id: orderRef.id,
    createdAt: now,
    updatedAt: now,
    status: "created", // created -> pending_payment -> paid -> fulfilled
    currency: "USD",
    total,
    items: safeItems,
    shipping,
    sizesInStockAtPurchase: Array.from(SIZES_IN_STOCK),
  });

  return NextResponse.json({ orderId: orderRef.id, total });
}
