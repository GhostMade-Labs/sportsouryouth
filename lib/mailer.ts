import nodemailer from "nodemailer";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

function parseBoolean(value: string | undefined, fallback: boolean) {
  if (!value) {
    return fallback;
  }
  return value.toLowerCase() === "true";
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure = parseBoolean(process.env.SMTP_SECURE, port === 465);

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export function isMailerConfigured() {
  return Boolean(getTransporter());
}

export async function sendEmail({ to, subject, html, text }: SendEmailInput) {
  const transporter = getTransporter();
  if (!transporter) {
    throw new Error("Mailer is not configured. Missing SMTP_HOST/SMTP_USER/SMTP_PASS.");
  }

  const from = process.env.RECEIPT_FROM_EMAIL || "Sports Our Youth <info@sportsouryouth.org>";
  await transporter.sendMail({
    from,
    to,
    subject,
    html,
    text,
  });
}
