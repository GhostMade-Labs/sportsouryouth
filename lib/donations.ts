import { z } from "zod";

export const CreateDonationSchema = z.object({
  fullName: z.string().trim().min(2),
  email: z.string().trim().email(),
  amount: z.coerce.number().finite().min(1).max(1_000_000),
});

export function normalizeDonationAmount(amount: number) {
  return Number(amount.toFixed(2));
}
