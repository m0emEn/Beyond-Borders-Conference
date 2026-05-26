/**
 * Simple in-memory rate limiter for API routes.
 * Uses a sliding window approach keyed by IP address.
 *
 * Note: This works per-process. In a multi-instance deployment,
 * consider using Redis or Upstash for distributed rate limiting.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetTime) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

interface RateLimitConfig {
  /** Max requests allowed within the window */
  maxRequests: number;
  /** Window duration in seconds */
  windowSeconds: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetInSeconds: number;
}

/**
 * Check if a request from the given identifier should be allowed.
 *
 * @param identifier - Typically the client IP address
 * @param config - Rate limit configuration
 * @returns Result indicating whether the request is allowed
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  const key = identifier;

  const existing = store.get(key);

  // No existing entry or window expired — start fresh
  if (!existing || now > existing.resetTime) {
    store.set(key, { count: 1, resetTime: now + windowMs });
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetInSeconds: config.windowSeconds,
    };
  }

  // Within the window — increment
  existing.count += 1;

  if (existing.count > config.maxRequests) {
    const resetInSeconds = Math.ceil((existing.resetTime - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetInSeconds,
    };
  }

  return {
    success: true,
    remaining: config.maxRequests - existing.count,
    resetInSeconds: Math.ceil((existing.resetTime - now) / 1000),
  };
}
