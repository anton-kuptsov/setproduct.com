type RequestLog = {
  timestamps: number[];
};

const requests = new Map<string, RequestLog>();

const MINUTE_MS = 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export function rateLimit(
  ip: string,
  perMinute = 1,
  perDay = 3
): { allowed: boolean; reason?: string } {
  const now = Date.now();
  const log = requests.get(ip) || { timestamps: [] };

  const lastMinute = log.timestamps.filter(t => now - t < MINUTE_MS);
  if (lastMinute.length >= perMinute) {
    return { allowed: false, reason: "Please wait a minute before trying again" };
  }

  const lastDay = log.timestamps.filter(t => now - t < DAY_MS);
  if (lastDay.length >= perDay) {
    return { allowed: false, reason: "Daily limit reached. Please try again tomorrow" };
  }

  log.timestamps = [...lastDay, now];
  requests.set(ip, log);

  return { allowed: true };
}

export function getClientIp(req: { headers: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string } }): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  if (Array.isArray(forwarded)) return forwarded[0];
  return req.socket?.remoteAddress || 'unknown';
}
