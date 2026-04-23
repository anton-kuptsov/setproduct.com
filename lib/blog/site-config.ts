const CANONICAL_SITE_URL = "https://www.setproduct.com";

// Vercel auto-injects VERCEL_URL per deployment; using it on preview keeps OG/schema
// URLs on the same host that actually serves /blog/covers/<slug>.jpg.
const VERCEL_HOST = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : undefined;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? VERCEL_HOST ?? CANONICAL_SITE_URL;
