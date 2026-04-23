# Site Health Report — setproduct-com.vercel.app

**Date:** 2026-04-23
**Target:** https://setproduct-com.vercel.app
**Script:** `scripts/check-site.mjs`
**Full data:** `scripts/report.json`

## TL;DR

| Check | Result |
|---|---|
| Sitemap URLs reachable (200) | **242 / 242 ✅** |
| Broken internal non-image refs | **3** (1 × 404 page + 1 × 404 asset + 1 × setproduct.com rewrite) |
| Broken internal `/_next/image` requests | **1081** — all reduce to **2 root causes** (SVG-as-JPG + Vercel quota) |
| Broken external links | **474** (mostly Figma 403/bot-block + dead domains) |

No page in the sitemap returns a non-200. All "broken" internal findings reduce to **3 real issues**.

---

## Real issues to fix

### 1. Broken internal link: `/legal/terms-and-conditions` (404) — ⚠️ FIX

- **Where:** `components/sections/CtaSubscribe.tsx:49`
  ```tsx
  <a className="link-text-primary" href="/legal/terms-and-conditions">Terms and Conditions.</a>
  ```
- **Problem:** The page doesn't exist. Only these legal pages are present:
  - `pages/legal/license.tsx`
  - `pages/legal/refunds-policy.tsx`
  - `pages/legal/terms-of-paid-posts.tsx`
- **Impact:** Every page that renders `<CtaSubscribe />` has a dead "Terms and Conditions" link.
- **Fix options:**
  - Point to `/legal/terms-of-paid-posts` (most likely intent), or
  - Create `pages/legal/terms-and-conditions.tsx`, or
  - Remove/rewrite the link.

### 2. Broken internal link: `/external/github.com/vercel/next.js` (404) — ⚠️ FIX

- **Where:** `content/blog/material-nextjs-ui-kit.mdx`
- **Problem:** MDX contains what looks like a mis-rewritten external URL. Should be:
  `https://github.com/vercel/next.js`
- **Fix:** Replace the path in that MDX file.

### 3. 134 blog images are `*.jpg` but actually **SVG** — ⚠️ FIX

- **Examples:**
  - `public/blog/assets/button-ui-design/img-{2,3,5,6,9,13}.jpg` — SVG
  - `public/blog/assets/notifications-ui-design/img-{18..21}.jpg` — SVG
  - `public/blog/assets/chip-ui-design/img-*.jpg` — SVG
  - …total **134 files** (affecting 1072 `/_next/image` request variants).
- **Detection:**
  ```bash
  find public -name '*.jpg' -print0 | xargs -0 file | grep 'SVG' | wc -l
  # → 134
  ```
- **Why it breaks:** Next.js Image Optimizer refuses to optimize SVG by default → `/_next/image?url=.../img-N.jpg` returns HTTP 400. The raw URL (`/blog/assets/.../img-N.jpg`) still serves with 200, so `<img>` tags display fine, but anything using `next/image` doesn't.
- **Fix options:**
  1. **Rename `.jpg` → `.svg`** and update references (correct long-term fix).
  2. Set `images.dangerouslyAllowSVG = true` in `next.config.js` with a strict CSP (fastest).
  3. Re-encode as real JPEG.

### 4. Vercel Image Optimizer quota exceeded on preview — ℹ️ INFO (not a code bug)

- **Symptom:** 9 `/_next/image` requests for `blog/pay-for-claude-pro-with-usdt/img-1.jpg` (the newest post) return **HTTP 402** with body:
  ```
  Payment required
  OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED
  ```
- **Cause:** Hobby-plan monthly image-optimization limit hit on this preview.
- **Impact on production:** None (different project). On vercel.app preview it will self-resolve next billing cycle.
- **If preview must stay green:** upgrade the plan or set `images: { unoptimized: true }` for preview builds only.

### 5. 145 absolute refs to `https://setproduct.com/blog/covers/*.jpg` → 404 — ⚠️ CHECK

- **Finding:** Blog post covers are referenced as **absolute URLs to the old production host** (`https://setproduct.com/...`), which now redirects to `www.setproduct.com/...` where the files return **404**.
- **New site has the files:** all 145 covers are present in `public/blog/covers/` and serve fine via `https://setproduct-com.vercel.app/blog/covers/<slug>.jpg` (200).
- **Impact:** Any external consumer (OG image in socials, RSS reader, search-engine cache) hitting the old absolute URL gets a 404.
- **Fix:** Render cover URLs as relative paths (`/blog/covers/<slug>.jpg`) or build absolute URLs dynamically from the current origin instead of hard-coding `https://setproduct.com/...`.

---

## Broken external links (474)

Status distribution:

| Status | Count | Note |
|---|---|---|
| 404 (Not Found) | 328 | Target pages removed on 3rd-party sites |
| 403 (Forbidden) | 117 | Mostly `www.figma.com` blocking the bot UA |
| 0 (network / DNS error) | 18 | Domains gone or blocking our UA |
| 504 / 429 / 401 / 406 / 999 | 11 | Transient or auth-gated |

Top hosts:

| Host | Count | Reality check |
|---|---|---|
| `www.figma.com` | 282 | 403/404 for the bot; URLs likely work in a browser. **Mostly false-positive.** |
| `setproduct.com` | 146 | Issue #5 above — fix by making cover URLs relative. |
| `codepen.io`, `docs.thorswap.finance`, `makers.so`, `materialx.crionic.net`, `www.statista.com`, `www.uxcrush.com` | 2 each | Real 403/404. |
| 44+ small/personal domains | 1 each | Many are dead personal blogs from old posts. |

**Recommendations:**
- Before treating Figma links as broken, re-run with a browser-like User-Agent or Playwright (Figma returns 403 to simple `HEAD`/`GET`).
- Manually triage the 18 DNS-dead domains — rewrite or mark as archive.
- Full list: `scripts/report.json` → `broken[]` filtered by `internal === false`.

---

## How to reproduce

```bash
node scripts/check-site.mjs https://setproduct-com.vercel.app
# → writes scripts/report.json + scripts/report.md
# tune via env: PAGE_CONCURRENCY, ASSET_CONCURRENCY, TIMEOUT
```

Exit code is non-zero if any sitemap page fails or any internal link is broken.

## What was checked

- Sitemap: `/sitemap.xml` (242 URLs, `www.setproduct.com` hosts rewritten to the Vercel preview)
- Each page's HTML: `<a href>`, `<img src>`, `<img srcset>` / `<source srcset>`, `<link>` (icons, stylesheets, preload, manifest), `<script src>`, `<meta property="og:image"|"twitter:image">`
- HEAD probes (with GET fallback on 403/405/501) for every unique referenced URL — 13 497 total, 13 356 asset/link HEADs, 242 page GETs
