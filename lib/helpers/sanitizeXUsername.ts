/**
 * sanitizeXUsername
 *
 * Accepts any of these formats and returns a clean handle (no @ prefix):
 *   username
 *   @username
 *   https://x.com/username
 *   https://twitter.com/username
 *
 * Returns null if the input is empty, undefined, or not a valid username.
 */
export function sanitizeXUsername(
  raw: string | null | undefined
): string | null {
  if (!raw) return null;

  let cleaned = raw.trim();

  // Strip full URLs (http/https, optional www, x.com or twitter.com)
  cleaned = cleaned.replace(
    /^https?:\/\/(www\.)?(twitter\.com|x\.com)\//i,
    ""
  );

  // Strip leading @
  cleaned = cleaned.replace(/^@/, "");

  // Drop any trailing path segments, query strings, or fragments
  cleaned = cleaned.split("/")[0].split("?")[0].split("#")[0];

  // Twitter/X usernames: 1–15 characters, alphanumeric + underscore only
  return /^[A-Za-z0-9_]{1,15}$/.test(cleaned) ? cleaned : null;
}