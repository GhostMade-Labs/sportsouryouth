import { formatCurrency } from "@/lib/utils";
import { sendEmail } from "@/lib/mailer";

type ReceiptItem = {
  name: string;
  type: "tshirt" | "hoodie";
  size: string;
  color: string;
  qty: number;
  price: number;
};

type ShippingDetails = {
  firstName: string;
  lastName: string;
  email: string;
  address1: string;
  city: string;
  state: string;
  zip: string;
};

type SendPayPalReceiptArgs = {
  orderId: string;
  paidAtIso: string;
  total: number;
  items: ReceiptItem[];
  shipping: ShippingDetails;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendPayPalReceiptEmail({
  orderId,
  paidAtIso,
  total,
  items,
  shipping,
}: SendPayPalReceiptArgs) {
  const paidAt = new Date(paidAtIso);
  const paidDate = paidAt.toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
    timeZoneName: "short",
  });

  const itemRowsHtml = items
    .map((item) => {
      return `
        <tr>
          <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;">${escapeHtml(item.name)}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;">${item.type === "hoodie" ? "Hoodie" : "T-Shirt"}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;">${escapeHtml(item.size)} / ${escapeHtml(item.color)}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.qty}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;text-align:right;">${formatCurrency(item.price * item.qty)}</td>
        </tr>
      `;
    })
    .join("");

  const html = `
    <div style="margin:0;padding:24px;background:#f5f8f6;font-family:Segoe UI,Arial,sans-serif;color:#102742;">
      <div style="max-width:700px;margin:0 auto;background:#ffffff;border:1px solid #d7e2e6;border-radius:16px;overflow:hidden;">
        <div style="padding:20px 24px;background:#0b2545;color:#f8fbf9;">
          <h1 style="margin:0;font-size:22px;line-height:1.2;">Sports Our Youth Receipt</h1>
          <p style="margin:6px 0 0;font-size:13px;opacity:.9;">Thank you for your support.</p>
        </div>
        <div style="padding:20px 24px;">
          <p style="margin:0 0 12px;">Hi ${escapeHtml(shipping.firstName)}, your PayPal payment was successful.</p>
          <p style="margin:0 0 16px;font-size:14px;color:#4f6074;">
            Order <strong>${escapeHtml(orderId)}</strong> • Paid on ${escapeHtml(paidDate)}
          </p>

          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <thead>
              <tr style="background:#eef3f5;">
                <th style="padding:10px 8px;text-align:left;">Item</th>
                <th style="padding:10px 8px;text-align:left;">Type</th>
                <th style="padding:10px 8px;text-align:left;">Size / Color</th>
                <th style="padding:10px 8px;text-align:center;">Qty</th>
                <th style="padding:10px 8px;text-align:right;">Line Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemRowsHtml}
            </tbody>
          </table>

          <div style="margin-top:16px;padding-top:14px;border-top:1px solid #d7e2e6;display:flex;justify-content:space-between;font-size:16px;">
            <span>Total Paid</span>
            <strong>${formatCurrency(total)}</strong>
          </div>

          <div style="margin-top:18px;padding:14px;background:#f6faf7;border:1px solid #dce9df;border-radius:10px;font-size:13px;color:#2f4a3f;">
            Shipping to: ${escapeHtml(shipping.firstName)} ${escapeHtml(shipping.lastName)}, ${escapeHtml(shipping.address1)}, ${escapeHtml(shipping.city)}, ${escapeHtml(shipping.state)} ${escapeHtml(shipping.zip)}
          </div>
        </div>
      </div>
    </div>
  `;

  const lines = items.map((item) => {
    const lineTotal = formatCurrency(item.price * item.qty);
    return `- ${item.name} (${item.type === "hoodie" ? "Hoodie" : "T-Shirt"}, ${item.size}/${item.color}) x${item.qty}: ${lineTotal}`;
  });

  const text = [
    "Sports Our Youth Receipt",
    "",
    `Order ID: ${orderId}`,
    `Paid on: ${paidDate}`,
    "",
    "Items:",
    ...lines,
    "",
    `Total Paid: ${formatCurrency(total)}`,
    "",
    `Shipping: ${shipping.firstName} ${shipping.lastName}, ${shipping.address1}, ${shipping.city}, ${shipping.state} ${shipping.zip}`,
  ].join("\n");

  await sendEmail({
    to: shipping.email,
    subject: `Your Sports Our Youth receipt (${orderId})`,
    html,
    text,
  });
}
