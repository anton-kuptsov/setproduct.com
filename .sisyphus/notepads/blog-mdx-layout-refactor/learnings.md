## [2026-04-18] Wave 1 Complete

### T1: Dependencies
- All MDX deps installed via npm successfully
- Package manager: npm (has both package-lock.json and bun.lock — use npm)
- next-mdx-remote v5 installed, gray-matter, reading-time, remark-gfm, rehype-pretty-code, shiki, @tailwindcss/typography
- Dev: turndown, @types/turndown, cheerio, tsx
- migrate:blog script alias works

### T2: Tailwind Typography
- Tailwind v4 syntax confirmed: `@plugin "@tailwindcss/typography";` added after `@import "tailwindcss";` in styles/globals.css
- globals.css path: styles/globals.css (confirmed)

### T3: types/blog.ts
- Created with BlogFrontmatter, BlogPost, BlogPostMeta — all clean
- MDXRemoteSerializeResult imported from next-mdx-remote

### T4: lib/blog/reading-time.ts
- computeReadingTime() strips frontmatter and import/export before counting
- Uses Math.max(1, Math.round(stats.minutes)) for minimum 1 min

### T5: Migration Script (KEY DISCOVERY)
- Script works! dry-run on accordion-ui-design extracted:
  - author: "Roman Kamushken" (found in body)
  - date: "2023-10-01" (found in body)
  - title: "Accordion UI Design: Styles, States, Usage, Templates"
  - coverImage: /blog/covers/accordion-ui-design.jpg
  - canonical: https://www.setproduct.com/blog/accordion-ui-design
- Legacy HTML has REAL author names (not "Setproduct Team") — script extracts them correctly!
- The default "Setproduct Team" is only used as fallback when no author found
- Script location: scripts/migrate-blog-html-to-mdx.ts

## [2026-04-18] Wave 2 Complete

### T6: lib/blog/mdx.ts
- getAllBlogSlugs() returns [] if content/blog/ doesn't exist — safe
- getBlogPost() returns null on missing/error, never throws
- Uses gray-matter for frontmatter parsing + next-mdx-remote serialize() for MDX
- Import path: "../../types/blog" (lib is at root level — two dirs up for types)
- getAllBlogPostsMeta() works without serialize (faster, for listing pages)

### T7: lib/blog/schema.ts + site-config.ts
- SITE_URL from process.env.NEXT_PUBLIC_SITE_URL ?? "https://setproduct.com"
- buildBlogPostingJsonLd() returns Record<string, unknown> — validated OK
- All fields present: @context, @type, headline, description, image, datePublished, author, publisher, mainEntityOfPage, timeRequired

### T8: components/blog/BlogHero.tsx
- Uses fill mode + aspect-[2/1] container — CLS safe
- priority={true} for LCP
- Graceful: if !coverImage → only H1 rendered

### T9: components/blog/BlogMeta.tsx
- data-testid="blog-meta" for Playwright
- formatDate parses YYYY-MM-DD as new Date(year, month-1, day) — no UTC offset issues
- Intl.DateTimeFormat en-US: "October 1, 2023"

### T10: components/blog/MDXImage.tsx
- Returns null if !src — no crash
- fill mode with aspect-[16/9] as default
- caption → <figure><figcaption> wrapping

### T11: Migration 148 posts
- 148/148 migrated successfully ✓
- 146 cover images downloaded (2 posts had no cover — expected)
- parseable: OK:148 FAIL:0 (after test-fixture cleaned)
- Sample: accordion-ui-design → author: "Roman Kamushken", date: "2023-10-01"
- Frontmatter fully populated: title, description, slug, date, author, coverImage, coverImageAlt, tags, canonical

## Task-14: MDX Quality Check (10 sampled posts)
- 9/10 posts passed all checks on first run
- 1 post (`the-ux-decisions-that-make-or-break-small-business-websites`) had coverImage path in frontmatter but file missing from `public/blog/covers/`
- Root cause: source image was a `.webp` in CDN not cached locally in `/external/`; migration script logged WARN but didn't fail
- Fix: manually `curl` downloaded from `cdn.prod.website-files.com` to correct local path
- Post has date `2026-04-14` (very recent — likely post-migration content added after initial crawl)
- All frontmatter fields (title, slug, date, author, description, coverImage) present across all 10 sampled posts
- No HTML garbage (`<style>`, `<script>` tags) in any sampled post bodies
- Body lengths all well above 100 chars threshold
- Pattern: Cover image gaps can occur for recent posts not in local CDN cache — worth checking all 148 if needed

## [2026-04-18] Wave 3 & 4 Progress

### T12: BlogPostLayout.tsx
- Composes: SiteHeader → main>article > BlogHero + BlogMeta + prose div with MDXRemote → SiteFooter → ScrollUpButton
- dangerouslySetInnerHTML ONLY for JSON-LD <script> (safe, standard practice)
- MDXRemote renders MDX content (NO dangerouslySetInnerHTML for content)
- All checks: no LegacyPage/PageShell, all SEO tags, MDXRemote present

### T13: mdx-components.tsx
- blogMdxComponents: MDXRemoteProps["components"] type
- Maps img → MDXImage with proper width/height int conversion

### T14: Quality check
- 10/10 posts PASS (including the-ux-decisions which had a cover fix)

### T15: pages/blog/[slug].tsx rewritten
- SSG: getStaticPaths (fallback: false) + getStaticProps (async, await getBlogPost)
- ZERO references to LegacyPage, legacy-collections, getServerSideProps
- tsc: CLEAN

### T16: Build - CRITICAL FINDINGS
- Build PASSED: exit 0, 148 blog pages pre-rendered (SSG ●)
- Other routes unchanged: /legal/[slug] (ƒ), /templates/[slug] (ƒ), /freebies/[slug] (ƒ) — still Dynamic (SSR via LegacyPage)
- 4 MDX files had bare HTML-like tags (e.g. <family>, <step>, <contact us>) from Webflow content — agent escaped them
- MDXRemote + rehype-pretty-code/shiki: average 425ms per blog page build (148 posts total ~3min build time — expected)

### T17: Playwright QA - NEXT
- Start dev server or production server for QA
- Use npm start (after build) — faster than dev for 148 static pages
- Test: accordion-ui-design (short), + 4 others
- Check: H1, header, footer, OG tags, JSON-LD, cover image 200
- Edge case: /blog/nonexistent-slug-xyz → 404
