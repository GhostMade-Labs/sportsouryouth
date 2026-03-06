import { NextResponse } from "next/server";
import { z } from "zod";
import { isMailerConfigured, sendEmail } from "@/lib/mailer";

export const runtime = "nodejs";

const ContactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(10).max(3000),
});

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = ContactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please provide a valid name, email, and message." },
      { status: 400 },
    );
  }

  if (!isMailerConfigured()) {
    return NextResponse.json(
      { error: "Contact email is not configured yet. Please try again later." },
      { status: 503 },
    );
  }

  const to = process.env.CONTACT_TO_EMAIL || "info@sportsouryouth.org";
  const { name, email, message } = parsed.data;

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

  try {
    await sendEmail({
      to,
      subject: `New contact message from ${name}`,
      text: [
        "New message from Sports Our Youth contact form.",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        "",
        "Message:",
        message,
      ].join("\n"),
      html: [
        "<div style=\"font-family:Arial,sans-serif;line-height:1.5;color:#111827;\">",
        "<h2 style=\"margin:0 0 12px;\">New contact form submission</h2>",
        `<p style=\"margin:0 0 8px;\"><strong>Name:</strong> ${safeName}</p>`,
        `<p style=\"margin:0 0 8px;\"><strong>Email:</strong> ${safeEmail}</p>`,
        `<p style=\"margin:12px 0 6px;\"><strong>Message:</strong></p>`,
        `<p style=\"margin:0;white-space:normal;\">${safeMessage}</p>`,
        "</div>",
      ].join(""),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to send contact form email", error);
    return NextResponse.json(
      { error: "Unable to send your message right now. Please try again." },
      { status: 500 },
    );
  }
}
