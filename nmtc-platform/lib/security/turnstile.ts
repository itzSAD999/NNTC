export type TurnstileResult = { ok: true } | { ok: false; error: string };

export function isTurnstileConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY?.trim());
}

export async function verifyTurnstileToken(
  token: string | null | undefined
): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      return {
        ok: false,
        error: "Security verification is not configured. Contact the college.",
      };
    }
    return { ok: true };
  }

  if (!token?.trim()) {
    return { ok: false, error: "Please complete the security check." };
  }

  try {
    const body = new URLSearchParams({
      secret,
      response: token.trim(),
    });

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      }
    );

    const data = (await res.json()) as { success?: boolean };
    if (!data.success) {
      return { ok: false, error: "Security check failed. Please try again." };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Could not verify security check. Try again." };
  }
}
