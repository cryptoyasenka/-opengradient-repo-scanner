import 'server-only';
import type { NextRequest } from 'next/server';

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  const xri = req.headers.get('x-real-ip');
  if (xri) return xri.trim();
  return 'unknown';
}

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSeconds: number };

export function checkRateLimit(
  req: NextRequest,
  scope: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const ip = getClientIp(req);
  const key = `${scope}:${ip}`;
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    if (buckets.size > 5000) {
      for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
    }
    return { ok: true };
  }

  if (bucket.count >= limit) {
    return { ok: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { ok: true };
}

export function checkOrigin(req: NextRequest): { ok: true } | { ok: false; reason: string } {
  const allowedRaw = process.env.ALLOWED_ORIGINS ?? '';
  const allowed = allowedRaw
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  if (allowed.length === 0) {
    return { ok: true };
  }

  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');

  const candidate = origin ?? (referer ? safeOrigin(referer) : null);
  if (!candidate) {
    return { ok: false, reason: 'Missing Origin/Referer header' };
  }

  if (!allowed.includes(candidate)) {
    return { ok: false, reason: `Origin '${candidate}' not in allowlist` };
  }
  return { ok: true };
}

function safeOrigin(url: string): string | null {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.host}`;
  } catch {
    return null;
  }
}
