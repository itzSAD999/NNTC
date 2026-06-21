import { Resend } from "resend";

import {
  buildEmailLayout,
  emailButton,
  emailLink,
  emailParagraph,
  escapeHtml,
  reasonBox,
  referenceBox,
  renderTemplate,
} from "@/lib/email/template";
import {
  getEmailBranding,
  type EmailBranding,
} from "@/lib/email/branding";
import { sendEmail } from "@/lib/email/send";

export async function sendRequestConfirmationEmail(data: {
  to: string;
  studentName: string;
  referenceNo: string;
  documentTypeName: string;
  amountExpected: number;
  deliveryMethod: string;
}) {
  const branding = await getEmailBranding();
  const trackUrl = `${branding.siteUrl}/request/track?ref=${encodeURIComponent(data.referenceNo)}`;
  const delivery =
    data.deliveryMethod === "email"
      ? "email delivery"
      : "collection at the college";

  const bodyHtml = [
    emailParagraph(`Dear ${escapeHtml(data.studentName)},`),
    emailParagraph(
      `Your request for an <strong>${escapeHtml(data.documentTypeName)}</strong> has been received and is now being processed.`
    ),
    referenceBox(data.referenceNo),
    emailParagraph(
      `<strong>Amount paid:</strong> GHS ${data.amountExpected.toFixed(2)}<br />
      <strong>Delivery:</strong> ${escapeHtml(delivery)}`
    ),
    emailParagraph("Save your reference number. You can track progress anytime:"),
    emailButton(trackUrl, "Track your request", branding.primaryColor),
    emailParagraph(
      `Or copy this link: ${emailLink(trackUrl, trackUrl, branding.primaryColor)}`
    ),
  ].join("");

  return sendEmail({
    to: data.to,
    subject: `NMTC request confirmed — ${data.referenceNo}`,
    html: buildEmailLayout({
      branding,
      title: "Document request received",
      preheader: `Reference ${data.referenceNo} — track your request online.`,
      bodyHtml,
    }),
  });
}

export async function sendRequestReturnedEmail(data: {
  to: string;
  studentName: string;
  referenceNo: string;
  reason: string;
  context?: "sent_back" | "receipt_rejected";
}) {
  const branding = await getEmailBranding();
  const trackUrl = `${branding.siteUrl}/request/track?ref=${encodeURIComponent(data.referenceNo)}`;
  const title =
    data.context === "receipt_rejected"
      ? "Receipt needs attention"
      : "Your request needs attention";
  const intro =
    data.context === "receipt_rejected"
      ? `The payment receipt for request <strong style="font-family:'IBM Plex Mono',monospace;">${escapeHtml(data.referenceNo)}</strong> could not be verified.`
      : `Your document request <strong style="font-family:'IBM Plex Mono',monospace;">${escapeHtml(data.referenceNo)}</strong> has been returned for corrections.`;

  const bodyHtml = [
    emailParagraph(`Dear ${escapeHtml(data.studentName)},`),
    emailParagraph(intro),
    reasonBox(data.reason, branding.accentColor),
    emailParagraph(
      "Please review the message above and contact the college or resubmit as instructed."
    ),
    emailButton(trackUrl, "Track your request", branding.primaryColor),
  ].join("");

  return sendEmail({
    to: data.to,
    subject: `Action required — ${data.referenceNo}`,
    html: buildEmailLayout({
      branding,
      title,
      titleColor: branding.accentColor,
      preheader: `Action required on request ${data.referenceNo}.`,
      bodyHtml,
    }),
  });
}

function buildApprovedBody(
  branding: EmailBranding,
  data: {
    studentName: string;
    referenceNo: string;
    documentTypeName: string;
    deliveryMethod: string;
  }
): string {
  const deliveryLabel =
    data.deliveryMethod === "email"
      ? "email delivery"
      : "collection at the college";

  if (branding.notificationTemplate?.trim()) {
    const rendered = renderTemplate(branding.notificationTemplate, {
      student_name: data.studentName,
      reference_no: data.referenceNo,
      document_type: data.documentTypeName,
      delivery_method: deliveryLabel,
      status: "approved",
      college_name: branding.collegeName,
    });

    return emailParagraph(rendered.replace(/\n/g, "<br />"));
  }

  const delivery =
    data.deliveryMethod === "email"
      ? "emailed to you shortly"
      : "collection at the college";

  return [
    emailParagraph(`Dear ${escapeHtml(data.studentName)},`),
    emailParagraph(
      `Your <strong>${escapeHtml(data.documentTypeName)}</strong> (reference <span style="font-family:'IBM Plex Mono',monospace;">${escapeHtml(data.referenceNo)}</span>) has been approved.`
    ),
    emailParagraph(
      `It is ready for <strong>${escapeHtml(delivery)}</strong>. Please bring your reference number if collecting in person.`
    ),
  ].join("");
}

export async function sendRequestApprovedEmail(data: {
  to: string;
  studentName: string;
  referenceNo: string;
  documentTypeName: string;
  deliveryMethod: string;
}) {
  const branding = await getEmailBranding();
  const trackUrl = `${branding.siteUrl}/request/track?ref=${encodeURIComponent(data.referenceNo)}`;

  const bodyHtml = [
    buildApprovedBody(branding, data),
    emailButton(trackUrl, "View request status", branding.primaryColor),
  ].join("");

  return sendEmail({
    to: data.to,
    subject: `Your document is ready — ${data.referenceNo}`,
    html: buildEmailLayout({
      branding,
      title: "Document approved",
      preheader: `Your ${data.documentTypeName} is ready.`,
      bodyHtml,
    }),
  });
}
