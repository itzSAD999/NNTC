type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds?: number;
};

/**
 * Simple in-memory rate limiter for server actions.
 * Per-instance on serverless; pair with Cloudflare/Vercel edge rules in production.
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const bucket = store.get(key);

  if (!bucket || now >= bucket.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { allowed: true };
}

export const PUBLIC_FORM_LIMITS = {
  contact: { limit: 5, windowMs: 15 * 60 * 1000 },
  request: { limit: 3, windowMs: 60 * 60 * 1000 },
  track: { limit: 20, windowMs: 15 * 60 * 1000 },
} as const;
