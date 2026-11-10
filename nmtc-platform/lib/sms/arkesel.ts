export interface SendSmsParams {
  recipients: string[];
  message: string;
}

export function isSmsConfigured(): boolean {
  return Boolean(process.env.ARKESEL_API_KEY?.trim());
}

/**
 * Standardize Ghana phone numbers to international 233 format
 */
export function formatGhanaPhone(phone: string): string {
  const clean = phone.replace(/[^0-9]/g, "");
  if (clean.startsWith("233")) return clean;
  if (clean.startsWith("0")) return `233${clean.slice(1)}`;
  return `233${clean}`;
}

/**
 * Dispatch an SMS using the Arkesel Ghana SMS Gateway API v2.
 */
export async function sendSms({
  recipients,
  message,
}: SendSmsParams): Promise<{ ok: boolean; messageId?: string; error?: string }> {
  const apiKey = process.env.ARKESEL_API_KEY?.trim();
  const senderId = process.env.SMS_SENDER_ID?.trim() || "NMTC";

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[Arkesel SMS Simulated to ${recipients.join(", ")}]: ${message}`);
    }
    return { ok: true };
  }

  try {
    const formattedRecipients = recipients.map(formatGhanaPhone);

    const response = await fetch("https://sms.arkesel.com/api/v2/sms/send", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: senderId,
        recipients: formattedRecipients,
        message,
      }),
    });

    const data = await response.json();

    if (!response.ok || data.status !== "success") {
      return { ok: false, error: data.message || "Failed to dispatch SMS" };
    }

    return { ok: true, messageId: data.data?.[0]?.id };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Arkesel connection failed",
    };
  }
}

export async function sendRequestSubmittedSms(params: {
  phone: string;
  studentName: string;
  referenceNo: string;
  docType: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return sendSms({
    recipients: [params.phone],
    message: `Dear ${params.studentName}, your request for ${params.docType} has been received (Ref: ${params.referenceNo}). Track progress at: ${siteUrl}/request/track?ref=${params.referenceNo}`,
  });
}

export async function sendPaymentConfirmedSms(params: {
  phone: string;
  studentName: string;
  referenceNo: string;
  amountGhs: number;
}) {
  return sendSms({
    recipients: [params.phone],
    message: `Dear ${params.studentName}, payment of GHS ${params.amountGhs.toFixed(2)} for request ${params.referenceNo} is confirmed. It has advanced to Principal review.`,
  });
}

export async function sendRequestApprovedSms(params: {
  phone: string;
  studentName: string;
  referenceNo: string;
  docType: string;
}) {
  return sendSms({
    recipients: [params.phone],
    message: `Dear ${params.studentName}, your ${params.docType} (Ref: ${params.referenceNo}) has been approved by the Principal and is ready for collection/issuance.`,
  });
}

export async function sendRequestReturnedSms(params: {
  phone: string;
  studentName: string;
  referenceNo: string;
  reason: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return sendSms({
    recipients: [params.phone],
    message: `Dear ${params.studentName}, your request ${params.referenceNo} was returned for correction: "${params.reason}". Resubmit at: ${siteUrl}/request/resubmit?ref=${params.referenceNo}`,
  });
}

