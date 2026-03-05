import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { CreateDonationSchema, normalizeDonationAmount } from "@/lib/donations";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = CreateDonationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const total = normalizeDonationAmount(parsed.data.amount);
  if (total <= 0) {
    return NextResponse.json({ error: "Invalid donation amount" }, { status: 400 });
  }

  const donationRef = adminDb.collection("donations").doc();
  const now = new Date().toISOString();

  await donationRef.set({
    id: donationRef.id,
    type: "donation",
    createdAt: now,
    updatedAt: now,
    status: "created",
    currency: "USD",
    total,
    donor: {
      fullName: parsed.data.fullName.trim(),
      email: parsed.data.email.trim().toLowerCase(),
    },
  });

  return NextResponse.json({ donationId: donationRef.id, total });
}
