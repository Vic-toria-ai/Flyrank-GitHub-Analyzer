// a simple in-memory rate limiter that tracks request timestamps per IP, and rejects requests once a client exceeds the allowed count within the time window. resets on server restart, good enough to stop casual abuse, not meant to be bulletproof against a determined attacker.

const requests = new Map();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // max requests per IP per window

export function checkRateLimit(identifier) {
  const now = Date.now();
  const timestamps = requests.get(identifier) || [];

  // keep only timestamps from within the current window
  const recent = timestamps.filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    return { allowed: false, retryAfter: Math.ceil((recent[0] + WINDOW_MS - now) / 1000) };
  }

  recent.push(now);
  requests.set(identifier, recent);
  return { allowed: true };
}