# Setproduct Static Copy Audit

## Current Snapshot

- HTML pages found: `241`
- Search assets already present: local `pagefind` directory exists and is wired in `search.html`
- Vercel config exists: `vercel.json` with `cleanUrls: true`

## External Dependency Inventory

- Unique external asset URLs (download candidates): `2969`
- Most referenced external domains:
  - `cdn.prod.website-files.com` (Webflow CSS/JS/images/icons)
  - `cdn.jsdelivr.net` (Finsweet attributes, Splide)
  - `cdnjs.cloudflare.com` (Remodal CSS/JS)
  - `d3e54v103j8qbb.cloudfront.net` (jQuery from Webflow infra)
  - `www.googletagmanager.com` (analytics scripts)

## Critical Runtime Dependencies To Localize First

- Webflow core:
  - `https://cdn.prod.website-files.com/64cc98fb252732dec5bda7e9/css/setproduct.webflow.shared.ad51abc27.css`
  - `https://cdn.prod.website-files.com/64cc98fb252732dec5bda7e9/js/webflow.schunk.36b8fb49256177c8.js`
  - `https://cdn.prod.website-files.com/64cc98fb252732dec5bda7e9/js/webflow.3512287f.6a59fb76e774e328.js`
- jQuery (currently duplicated in many pages):
  - `https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=64cc98fb252732dec5bda7e9`
  - `https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.4.1.min.220afd743d.js`
- UI libraries:
  - Splide CSS/JS from `cdn.jsdelivr.net`
  - Remodal CSS/JS from `cdnjs.cloudflare.com`
  - Finsweet attributes from `cdn.jsdelivr.net`

## Risks Found

- Current copy is not fully independent because runtime assets are mostly remote.
- Some pages include two jQuery versions, which can cause race conditions.
- Forms are Webflow-structured (`w-form`) and should be explicitly set as non-functional for this phase.
- Python static server showed `404` on clean URLs (e.g. `/blog/empty-state-ui-design`), so rewrite behavior must be addressed for Vercel.

## Priority Order For Migration

1. Localize all external CSS/JS used for runtime behavior.
2. Localize external images/icons/fonts used by content and metadata.
3. Rewrite HTML `src/href` to local paths for downloaded assets only.
4. Normalize script loading order and remove duplicate jQuery.
5. Freeze forms as non-functional with clear user message.
6. Finalize Vercel routing and SEO files (`robots.txt`, `sitemap.xml`).
