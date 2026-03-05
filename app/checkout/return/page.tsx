import Link from "next/link";

export const dynamic = "force-dynamic";

type CheckoutReturnProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CheckoutReturn({ searchParams }: CheckoutReturnProps) {
  const params = searchParams ? await searchParams : undefined;
  const orderIdRaw = params?.orderId;
  const orderId = Array.isArray(orderIdRaw) ? orderIdRaw[0] : orderIdRaw;

  return (
    <main className="min-h-[70vh] px-4 py-16">
      <div className="container max-w-xl rounded-2xl border border-border bg-card p-8 text-center">
        <h1 className="text-2xl font-bold">Finishing your payment...</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          If you are not redirected automatically, return to checkout.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/checkout" className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted">
            Back to Checkout
          </Link>
          {orderId ? (
            <Link
              href={`/checkout?orderId=${encodeURIComponent(orderId)}`}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Continue
            </Link>
          ) : null}
        </div>
      </div>
    </main>
  );
}
