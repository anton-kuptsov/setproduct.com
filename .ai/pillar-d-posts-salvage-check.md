# Salvage check for D-posts before deletion

> Phase 4 of the Dashboards pillar project. Checked 4 D-posts slated for
> deletion + 301 against the live pillar
> [`dashboard-ui-design.mdx`](../content/blog/dashboard-ui-design.mdx).
> Date: 2026-06-05. **No files deleted or edited yet** — this is the
> pre-deletion audit only.

Redirect map under review:

| D-slug | 301 target |
|---|---|
| dashboard-design-best-practices-top-dashboard-ui-design-tips | /blog/dashboard-ui-design |
| why-are-dashboards-important | /blog/dashboard-ui-design |
| benefits-of-dashboards | /blog/dashboard-ui-design |
| marketing-dashboard-examples-templates | /blog/marketing-dashboard-ui-design-guide |

---

## dashboard-design-best-practices-top-dashboard-ui-design-tips

- **Unique content found:** No. 4121-word generic guide ("what is a
  dashboard", "purpose", "benefits of templates", "10 best practices", "10
  steps in dashboard design", "aspects to consider"). Every concept is
  already covered — and written far better — in the pillar: definition →
  pillar §"What is a dashboard?"; benefits → pillar §"Why dashboard design
  matters"; best practices / steps → pillar §"Layout patterns" + §"Data
  visualization principles" + §"Common anti-patterns"; responsive → pillar
  §"Mobile and responsive dashboards"; accessibility/security → pillar
  §"Accessibility and performance". The text is low-quality AI-spun prose
  (this is the 40 449-impressions / CTR 0.022% post the whole project is
  built to replace). Nothing to lift.
- **Unique images:** None worth keeping. img-1…img-6 are plain product
  screenshots with "Source: [Template]" captions (Material X, Neolex,
  Orion, Material, Rome, S8). The pillar uses its own custom conceptual
  diagrams (anatomy, layout patterns, chart-matching). The template links
  these images promote already live inside the pillar §"Dashboard templates
  and UI kits". No image to port.
- **Frontmatter notable:** `inlineCta` is the generic "transform your data
  into actionable insights" agency CTA with empty `buttonText`/`buttonLink`
  — no value. `relatedSlugs` = `liquid-glass-design-explained-a-practical-guide`,
  `depth-in-ios-design` (both iOS / Design Trends, off-topic for dashboards;
  these are the reciprocal backlinks handled in the inbound-links section
  below). Nothing the pillar should inherit.
- **Recommendation:** **Delete as-is.** 301 → /blog/dashboard-ui-design.

---

## why-are-dashboards-important

- **Unique content found:** No. 3730 words titled "What is the purpose of
  dashboards?" — definition, "importance of design", "benefits" (10 items),
  "types of dashboards" (operational / strategic / analytical / tactical),
  "purposes of dashboards" (10 items), "aspects to consider". Direct
  duplicate of benefits-of-dashboards (#6) and fully subsumed by the pillar
  (§"What is a dashboard?", §"Why dashboard design matters", §"Types of
  dashboards"). Flagged low-quality + miscategorized (SEO) in
  seo-category-audit. Nothing unique.
- **Unique images:** None. img-1…img-5 are template screenshots (Xela, OE
  Enterprise, Eclipse, Material X, Panda) with "Source:" captions. No port.
- **Frontmatter notable:** Generic agency `inlineCta` (empty button fields).
  `relatedSlugs` = three SEO posts
  (`top-tips-for-new-businesses-looking-to-strengthen-their-online-presence`,
  `seo-tools-compared`, `why-landing-page-optimization-is-essential`) — not
  dashboard-related, nothing for the pillar to take.
- **Recommendation:** **Delete as-is.** 301 → /blog/dashboard-ui-design.

---

## benefits-of-dashboards

- **Unique content found:** No. 2327 words: definition, "when should you use
  a dashboard", "how to choose a dashboard", one long benefits list. Dupe of
  why-are-dashboards-important (#4); content maps to pillar §"Why dashboard
  design matters". Low quality per seo-category-audit. The only mildly
  distinct angles — "When should you use a dashboard?" and "How to choose a
  dashboard?" — are thin bullet lists of generic advice, not worth a new
  pillar section. Note: body contains a stray broken link (a
  `chatgpt.com/c/...` URL left in by mistake) — another quality signal. No
  salvage.
- **Unique images:** None. img-1…img-3 are generic/screenshot images, one
  with a leftover Google-redirect URL caption. No port.
- **Frontmatter notable:** Generic agency `inlineCta` (empty buttons).
  `relatedSlugs` = same three SEO posts as #4. Nothing for the pillar.
- **Recommendation:** **Delete as-is.** 301 → /blog/dashboard-ui-design.

---

## marketing-dashboard-examples-templates

- **Unique content found:** Partially distinct but **not salvageable into
  the pillar**. 3448 words: "what is a marketing dashboard", benefits, a
  granular "types of marketing dashboards" list (campaign, performance,
  digital, SEO, social, email, PPC, content, e-commerce, market research,
  lead generation), "top 5 templates" listicle (Material X, Material You, OE
  Enterprise, S8, Eclipse), best practices. The marketing angle is owned by
  the 301 target — the strong B-cluster post
  [`marketing-dashboard-ui-design-guide`](../content/blog/marketing-dashboard-ui-design-guide.mdx)
  — not by the pillar. The pillar already covers marketing dashboards in
  §"Dashboard examples by industry → Marketing dashboards". Per task
  constraints, salvage may only go into the pillar (Step 4.1), and B/C
  cluster posts must not be touched — so the marketing guide cannot receive
  salvage here. The granular "types of marketing dashboards" list is
  listicle filler, not pillar-grade. No salvage.
- **Unique images:** None. img-1…img-6 are the five template screenshots
  (Material Desktop, Material X, Material You, OE Enterprise, S8, Eclipse)
  with "Source:" captions — all already linked from the pillar's templates
  section. No port.
- **Frontmatter notable:** Generic agency `inlineCta` (empty buttons).
  `relatedSlugs` = `how-to-study-saas-dashboard-in-the-ai-era` (live cluster
  post), `how-to-get-better-at-ui-design-by-studying-ai-generated-examples`,
  `how-to-use-ai-ui-inspiration-to-design-faster-without-copying-blindly`
  (both live, non-dashboard AI-UI posts). None of these need migrating —
  the pillar and cluster already interlink independently.
- **Recommendation:** **Delete as-is.** 301 → /blog/marketing-dashboard-ui-design-guide.

---

## Inbound markdown links to D-posts found

Searched all of `content/blog/*.mdx`, plus `data/*.ts`, `pages/`,
`components/`. Results below. `data/pages-meta.ts`, `data/breadcrumbs.ts`,
`data/faq.ts`, `pages/sitemap.xml.ts` and all `components/` contain **zero**
references to any D-slug (sitemap is generated dynamically from
`getAllBlogSlugs()`, so deleted files drop out automatically). The pillar
itself links to **none** of the 4 D-slugs — it is already clean.

Four real inbound references exist, in two classes: **body links** (2) and
**`relatedSlugs` backlinks** (2).

| # | File | Type | Context (≈) | Target D-post | Recommendation |
|---|---|---|---|---|---|
| 1 | [`marketing-dashboard-ui-design-guide.mdx:51`](../content/blog/marketing-dashboard-ui-design-guide.mdx) | body link | "[Marketing dashboards](…/blog/marketing-dashboard-examples-templates) aren't just graphs on a screen. They're decision-making engines." | marketing-dashboard-examples-templates | **MUST fix — self-redirect loop.** This post *is* the 301 target of that D-slug, so the link would 301 back onto itself. Repoint anchor "Marketing dashboards" → `/blog/dashboard-ui-design` (pillar). |
| 2 | [`how-to-study-saas-dashboard-in-the-ai-era.mdx:261`](../content/blog/how-to-study-saas-dashboard-in-the-ai-era.mdx) | body link | "the goal today is larger than collecting more [dashboard design best practices](…/blog/dashboard-design-best-practices-top-dashboard-ui-design-tips)." | dashboard-design-best-practices-top-dashboard-ui-design-tips | Repoint anchor "dashboard design best practices" → `/blog/dashboard-ui-design` (pillar). Would otherwise 301-hop; cleaner as a direct pillar link. ⚠️ This is a Phase-3A cluster post — see note below. |
| 3 | [`depth-in-ios-design.mdx:26`](../content/blog/depth-in-ios-design.mdx) | `relatedSlugs` | frontmatter `relatedSlugs: [liquid-glass-…, dashboard-design-best-practices-…]` | dashboard-design-best-practices-top-dashboard-ui-design-tips | Remove the D-slug entry. Not build-breaking (resolver skips missing slugs) but leaves a dead related-card after deletion. Keeps `liquid-glass-design-explained-a-practical-guide` (its real thematic neighbor). |
| 4 | [`liquid-glass-design-explained-a-practical-guide.mdx:27`](../content/blog/liquid-glass-design-explained-a-practical-guide.mdx) | `relatedSlugs` | frontmatter `relatedSlugs: [dashboard-design-best-practices-…, depth-in-ios-design]` | dashboard-design-best-practices-top-dashboard-ui-design-tips | Remove the D-slug entry. Keeps `depth-in-ios-design` (its real thematic neighbor). |

### Non-link references (no action — these are the files being deleted)

The search also returned each D-post's own frontmatter (`slug`, `canonical`,
`coverImage`, `thumbImage`) and its own in-body `![](…/assets/<slug>/img-N.webp)`
image paths. Those vanish with the files. Per task scope, the
`public/blog/assets/<slug>/` image folders are **left in place** (OG-image
safety for already-sent newsletters; asset cleanup is a separate task).

### ⚠️ Note on links #2 and the B/C constraint

Task constraint says "don't touch B/C cluster posts (already handled in
Phase 3A)". Links #1 and #2 live inside cluster posts
(`marketing-dashboard-ui-design-guide` is B, `how-to-study-saas-…` is a
cluster post). The Phase-3A treatment was callout + relatedSlugs + category;
fixing a *body link that points at a soon-deleted page* is a different and
necessary edit (Step 4.2). #1 in particular **must** be fixed to avoid a
self-redirect loop. Flagging for explicit confirmation before I touch these
two cluster-post bodies.

---

## Summary

**Ready to delete all 4 posts without salvage** — no unique paragraphs,
insights, examples, or images worth porting into the pillar; all four are
fully subsumed by the live pillar (and, for #5, by its marketing-guide 301
target). No salvage commit (Step 4.1) is needed.

**4 inbound references must be repaired before/with deletion (Step 4.2):**

1. `marketing-dashboard-ui-design-guide.mdx:51` body link → repoint to
   `/blog/dashboard-ui-design` (**critical: prevents self-redirect loop**).
2. `how-to-study-saas-dashboard-in-the-ai-era.mdx:261` body link → repoint
   to `/blog/dashboard-ui-design`.
3. `depth-in-ios-design.mdx` `relatedSlugs` → drop the D-slug (keep
   liquid-glass neighbor).
4. `liquid-glass-design-explained-a-practical-guide.mdx` `relatedSlugs` →
   drop the D-slug (keep depth-in-ios neighbor).

No references in `data/`, `pages/`, `components/`, or the sitemap. Awaiting
your "salvage done, proceed with deletion" before any file is deleted or
`next.config.js` is edited.
