import { getClientIp } from "@/lib/security/client-ip";
import {
  checkRateLimit,
  PUBLIC_FORM_LIMITS,
  type RateLimitResult,
} from "@/lib/security/rate-limit";
import { verifyTurnstileToken } from "@/lib/security/turnstile";

export async function guardPublicForm(
  formKey: keyof typeof PUBLIC_FORM_LIMITS,
  turnstileToken: string | null | undefined
): Promise<RateLimitResult & { turnstileError?: string }> {
  const ip = await getClientIp();
  const { limit, windowMs } = PUBLIC_FORM_LIMITS[formKey];
  const rate = checkRateLimit(`${formKey}:${ip}`, limit, windowMs);

  if (!rate.allowed) {
    return rate;
  }

  const turnstile = await verifyTurnstileToken(turnstileToken);
  if (!turnstile.ok) {
    return { allowed: false, turnstileError: turnstile.error };
  }

  return { allowed: true };
}
