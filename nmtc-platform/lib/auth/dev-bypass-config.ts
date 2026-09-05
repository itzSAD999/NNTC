/** Edge-safe check — no next/headers imports. Used by middleware. */
export function isAuthBypassEnabled(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  return process.env.DEV_AUTH_BYPASS?.trim() === "true";
}
