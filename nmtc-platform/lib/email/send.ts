import { Resend } from "resend";

import { getEmailBranding } from "@/lib/email/branding";
import {
  buildEmailLayout,
  emailParagraph,
  escapeHtml,
} from "@/lib/email/template";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export type SendEmailResult =
  | { ok: true }
  | { ok: false; error: string };

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping email send");
    return { ok: false, error: "Email not configured" };
  }

  const resend = new Resend(apiKey);
  const from = process.env.EMAIL_FROM ?? "NMTC <no-reply@nmtc.edu.gh>";

  const { error } = await resend.emails.send({ from, to, subject, html });

  if (error) {
    console.error("Resend error:", error.message);
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function buildContactEmailHtml(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const branding = await getEmailBranding();

  const bodyHtml = [
    emailParagraph(`<strong>From:</strong> ${escapeHtml(data.name)}`),
    emailParagraph(
      `<strong>Email:</strong> ${emailLinkValue(data.email, branding.primaryColor)}`
    ),
    data.phone
      ? emailParagraph(`<strong>Phone:</strong> ${escapeHtml(data.phone)}`)
      : "",
    emailParagraph(`<strong>Subject:</strong> ${escapeHtml(data.subject)}`),
    `<p style="margin:20px 0;padding:16px;background:#FBFBF9;border:1px solid #E2E6E3;border-radius:4px;white-space:pre-wrap;font-size:15px;line-height:1.6;color:#14241B;">${escapeHtml(data.message)}</p>`,
  ].join("");

  return buildEmailLayout({
    branding,
    title: "New contact form message",
    preheader: `${data.name}: ${data.subject}`,
    bodyHtml,
  });
}

function emailLinkValue(email: string, color: string): string {
  return `<a href="mailto:${escapeHtml(email)}" style="color:${color};text-decoration:underline;">${escapeHtml(email)}</a>`;
}
