import crypto from "node:crypto";

export interface InitializePaymentParams {
  email: string;
  amountGhs: number;
  reference: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface InitializePaymentResult {
  ok: boolean;
  authorizationUrl?: string;
  reference: string;
  error?: string;
}

export function isPaystackConfigured(): boolean {
  return Boolean(process.env.PAYSTACK_SECRET_KEY?.trim());
}

/**
 * Initialize a Paystack Mobile Money or Card payment transaction in Ghana Cedis (GHS).
 */
export async function initializePaystackPayment({
  email,
  amountGhs,
  reference,
  callbackUrl,
  metadata = {},
}: InitializePaymentParams): Promise<InitializePaymentResult> {
  const secretKey = process.env.PAYSTACK_SECRET_KEY?.trim();

  if (!secretKey) {
    // In local dev without live Paystack key, provide mock simulation
    return {
      ok: true,
      authorizationUrl: `/request/track?ref=${encodeURIComponent(reference)}&simulated_pay=true`,
      reference,
    };
  }

  try {
    const amountInPesewas = Math.round(amountGhs * 100);

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amountInPesewas,
        currency: "GHS",
        reference,
        callback_url: callbackUrl,
        channels: ["mobile_money", "card"],
        metadata: {
          ...metadata,
          custom_fields: [
            {
              display_name: "Document Reference",
              variable_name: "reference_no",
              value: reference,
            },
          ],
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      return {
        ok: false,
        reference,
        error: data.message || "Failed to initialize Paystack payment.",
      };
    }

    return {
      ok: true,
      authorizationUrl: data.data.authorization_url,
      reference: data.data.reference,
    };
  } catch (err) {
    return {
      ok: false,
      reference,
      error: err instanceof Error ? err.message : "Payment initialization error.",
    };
  }
}

/**
 * Verify a completed Paystack transaction by reference.
 */
export async function verifyPaystackPayment(reference: string): Promise<{
  ok: boolean;
  paid: boolean;
  amountGhs?: number;
  channel?: string;
  error?: string;
}> {
  const secretKey = process.env.PAYSTACK_SECRET_KEY?.trim();

  if (!secretKey) {
    return { ok: true, paid: true, amountGhs: 50, channel: "simulated_momo" };
  }

  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.status) {
      return { ok: false, paid: false, error: data.message };
    }

    const tx = data.data;
    const paid = tx.status === "success";
    const amountGhs = tx.amount / 100;

    return {
      ok: true,
      paid,
      amountGhs,
      channel: tx.channel,
    };
  } catch (err) {
    return {
      ok: false,
      paid: false,
      error: err instanceof Error ? err.message : "Verification error.",
    };
  }
}

/**
 * Validates the HMAC SHA512 signature sent with incoming Paystack webhooks.
 */
export function verifyPaystackSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  const secretKey = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!secretKey || !signatureHeader) return false;

  const hash = crypto
    .createHmac("sha512", secretKey)
    .update(rawBody)
    .digest("hex");

  return hash === signatureHeader;
}

