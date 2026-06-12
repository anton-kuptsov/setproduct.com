# Notifications UI design — content rescue plan (v2, GSC-focused)

**Patient:** `content/blog/notifications-ui-design.mdx` (628 lines, published 2023-09-29)
**Benchmark:** `steps-ui-design.mdx` (CTR 1.06%) + rescued `tabs-ui-design.mdx`
**Baseline:** 131k impressions · 532 clicks · CTR 0.4% · avg position 8.6 · GA4 engagement 28 sec (worst in "large posts")
**Goal:** lift CTR toward benchmark, fix Webflow markdown bugs, make AI-citable, add 8 GSC-driven sections. Frontmatter / slug / images / Setproduct links frozen.

---

## 1.1. Markdown bugs inventory (fix in Stage 2.1 FIRST)

| Bug pattern | Where (line examples) | Count | Fix |
|---|---|---|---|
| `_‍_` — italic wrapping a zero-width joiner (U+200D), Webflow junk | 64, 80, 96, 112, 129, 145, 162, 178, 194, 405, 407, 415, 417, 425, 427, 435, 437, 447, 449, 457, 459, 481, 501, 521, 561, 619 | ~26 | delete the `_‍_` token entirely |
| `**‍**` / trailing `**‍** ` — bold wrapping a ZWJ | 46 (`...calls to action.**‍**`) | 1+ | delete the `**‍**` token |
| `‍**Examples:` — leading ZWJ then broken bold label spanning two lines (`‍**Examples:  \n**`) | 216, 240, 265, 289, 313, 337, 361, 385 | 8 | convert to clean bold `**Examples:**` on one line |
| `**Design considerations:  \n**` — bold label split across lines by trailing spaces + newline | 223, 247, 272, 296, 320, 344, 368, 392 | 8 | collapse to `**Design considerations:**` |
| `<span class="blog\_big-paragraph">` — escaped underscore in class name | 42 | 1 | keep the lead-paragraph span but verify class renders (`blog_big-paragraph`); the `\_` escape is the MDX-correct form, leave as-is |
| Escaped parens in Figma URL `\(preview\)` | 383 | 1 | leave — it is a valid URL escape, not a bug |
| Stray empty bold/typos: double period `transactions..` | 232 | 1 | fix to single period |
| Multiple blank lines after frontmatter (38–41) | 38–41 | 1 | collapse to single blank line |

---

## 1.2. Content problems (GPT-tells, fake stats, pseudo-precision, typos)

| Problem | Where | Action |
|---|---|---|
| **Fake stats section** "Average Statistics for In-App Notifications" — promises figures, delivers a disclaimer that figures vary; zero real data | 623–625 | **Remove** the heading + disclaimer paragraph. Keep the Cover Image Credit line (627). |
| **GPT-tell formula** `_Definition_:` / `_Purpose_:` italic labels on every Components item | 64–66, 80–82, 96–98, 112–114, 129–131, 145–147, 162–164, 178–180, 194–196 | Rewrite labels into natural prose lead sentence (keep meaning, drop the robotic `_Label_:` scaffold). Per constraint: light touch, no full rewrite. |
| **GPT-tell formula** `_Purpose_ / _Benefit_ / _Example_` triad on every Usability tip | 405–409, 415–419, 425–429, 435–439, 447–451, 457–461 | Same — convert to flowing sentences; keep the real brand example (YouTube, Twitter, etc.). |
| **GPT-tell formula** `_User Story_ / _User steps_ / _Suggested component_ / _Explanation_` on every Use Case | 471–483, 491–503, … 609–621 | Reworked into "Real-world examples" (see 1.5-C). Trim verbose 5-step user stories. |
| **Typos / grammar**: "acquire specific input" ok; "to allow to take" (227), "enable to take" (307), "set to silent mode" ok; "IIdiko Gaspar" (263), "Pigma Community" (238) | various | fix obvious typos in lines touched; leave 3rd-party author-name typos in credits as-is (they're attribution strings). |
| **Weak intro list** "Today you will learn:" — fine, but precedes no TL;DR | 48–54 | Keep, but add TL;DR above it (2.4). |

---

## 1.3. Structural gaps vs Steps benchmark

| Benchmark element (steps/tabs) | Present in patient? | Plan |
|---|---|---|
| Answer-first **TL;DR** (40–80 words) right after lead | ❌ | **Add** (2.4) |
| Real **H3** subsections (not bold pseudo-headings) | ⚠️ partial — H3 exist but wrapped in `**bold**` (`### **Badge**`) | **Convert** all `### **X**` → `### X` (2.2) |
| **Comparison table(s)** as AI-citable asset | ❌ none | **Add 2** tables (Toast vs Snackbar vs Banner vs Push in Components; platform comparison) |
| **"Before you ship" checklist** with ✅ | ❌ | **Add** 10-item checklist (2.8) |
| **FAQ** section (5–7 Q&A) | ❌ | **Add** 7-question FAQ (2.9 / 1.7) |
| **Opinionated closing** paragraph | ❌ (ends on fake stats) | **Add** "## A last word on notifications" (2.10) |
| Sentence-case headings | ❌ all Title Case | **Rename** all H2/H3 (see 1.5) |
| Settings UI coverage | ❌ | **Add** dedicated H2 (1.5-A) |
| Platform comparison (in-app/push/web/desktop) | ❌ | **Add** dedicated H2 (1.5-B) |
| Material Design patterns | ❌ | **Add** mini H2 (1.5-D) |

---

## 1.4. Cannibalization audit

This hub overlaps with dedicated posts. Per Принцип 6, the hub should **point to** dedicated posts, not duplicate them.

| Sub-topic in hub | Dedicated post exists? | Action |
|---|---|---|
| Badge (58–72) | ✅ `badge-ui-design` (already linked ×2) | **Shorten** to 50–80 words + keep link. Already has links — trim body. |
| Tooltip (123–137) | ✅ `tooltip-ui-design` | **Shorten** to 50–80 words + **add internal link** to `/blog/tooltip-ui-design` (currently only links to react.setproduct). |
| Dialog/Modal (90–104) | ✅ `how-to-design-dialogs` | **Shorten** + **add internal link** to `/blog/how-to-design-dialogs`. |
| Toast/Snackbar (74–88) | ❌ no dedicated post | Keep (it's core to notifications). External react link stays. |
| Popover (106–121) | ❌ | Keep. |
| Banner (139–154) | ❌ | Keep. |
| Progress (156–170) | ❌ | Keep. External react link stays. |
| Settings (new) | ✅ `settings-ui-design` | New section will **link** to `/blog/settings-ui-design`. |

**Net:** shorten 3 cannibalizing blocks (badge, tooltip, dialog), add 2 new internal links, keep the 4 notification-native components at full length.

---

## 1.5. NEW SECTIONS plan

**A) `## Notification settings UI design`** (INSIGHT 1 — 340+ impressions uncovered) — 300–400 words
Placement: after Use Cases / examples, before checklist. H3 subsections:
- `### Per-channel toggles` (email / push / in-app / SMS)
- `### Quiet hours and time windows`
- `### Snooze and frequency caps`
- `### Grouping and digests`
Answer-first opener. Examples: Slack notification preferences, iOS Settings → Notifications, Notion. Internal link → `/blog/settings-ui-design`. Internal link → `/blog/toggle-switch-ui-design` (toggles are the control). Stealth: mention Setproduct UI kit settings screens.

**B) `## In-app vs push vs web vs desktop notifications`** (INSIGHT 2 — 314+ impressions) — 150–200 word intro + 4-column comparison table
Table columns: In-app · Push · Web · Desktop. Rows: Trigger context · User permission required · Persistent / transient · Typical use case · Design constraints · Best for. Answer-first intro defines the 4 delivery channels.

**C) `## Real-world notification design examples`** (INSIGHT 8 — "notification design examples") — reworks existing Use Cases (463–621)
Convert the 8 verbose `_User Story_` blocks into 6–7 tight, **named** real-product examples: Slack DM badge · Stripe payment confirmation · Linear comment mention · Notion @mention · GitHub PR review · iOS lock-screen event · cloud-upload progress. Each: 1–2 sentences (what triggers it, which component, why it works) + keep the existing image. Drops the 5-step robotic walkthroughs.

**D) `## Material Design notification patterns`** (INSIGHT 5 — Material record CTR 14%) — 100–150 words + primary-source link
Placement: after platform comparison. Covers Material 3 notification anatomy (header, content, actions, expanded state), snackbar guidance. Link → official Material Design docs (m3.material.io). Internal link opportunity → existing Material X UI kit link reuse (`/templates/material-x`, already at line 94).

---

## 1.6. Internal linking opportunities (verified via search of content/blog/*.mdx)

**Dedicated posts that EXIST (safe to link):**
- `/blog/badge-ui-design` ✅ (already linked ×2 — keep)
- `/blog/tooltip-ui-design` ✅ → **add** in shortened Tooltip block
- `/blog/how-to-design-dialogs` ✅ → **add** in shortened Dialog block
- `/blog/settings-ui-design` ✅ → **add** in new Settings section
- `/blog/toggle-switch-ui-design` ✅ → **add** in Settings (per-channel toggles)
- `/blog/empty-state-ui-design` ✅ (in relatedSlugs) → optional contextual link
- `/blog/steps-ui-design` ✅ (in relatedSlugs) → optional link (onboarding example)
- `/blog/button-ui-design` ✅ → optional link where CTA buttons mentioned in banner/actionable

**Target: add 4–5 new internal links minimum.** Plan: tooltip, dialog, settings, toggle-switch + one of steps/empty-state.

**Do NOT link (no dedicated post — would 404):** toast, snackbar, popover, banner, alert, progress, push. Keep their existing external react.setproduct.com links untouched.

---

## 1.7. SEO term coverage matrix (all 8 insights)

| # | Insight / query intent | Impressions | Where addressed in new content |
|---|---|---|---|
| 1 | "notification settings ui/ux" | 340+ | NEW `## Notification settings UI design` (1.5-A) + FAQ Q on settings |
| 2 | platform-specific (in-app 130, desktop 75, web) | 314+ | NEW `## In-app vs push vs web vs desktop` + comparison table (1.5-B) |
| 3 | "what makes a good notification design?" | 115 (0 clicks) | **FIRST FAQ question** (2.9), answer-first 100–150 words, 4–5 principles |
| 4 | UX-intent audience | 690+ (0 clicks) | Rename "Usability Tips" → `## Notification UX best practices`; strengthen UX language throughout (2.11); TL;DR covers UX+UI |
| 5 | Material Design notifications (record 14% CTR) | — | NEW `## Material Design notification patterns` (1.5-D) + docs link |
| 6 | AI-prompt style queries | — | Every section opens with answer-first definition (2.4, 1.5 openers) |
| 7 | singular "notification" head term | 1,748 | Use singular "notification" 8–10× organically across new sections + TL;DR + closing (2.12) |
| 8 | "notification design examples" | 80 | NEW `## Real-world notification design examples` with named products (1.5-C) |

---

## 1.8. Asset preservation checklist

**Images — all 31 kept, in order, paths untouched:**

| Range | Section | Format note |
|---|---|---|
| img-1 … img-9 | Components (badge→push) | .webp |
| img-10 … img-17 | Types | .webp |
| img-18 … img-21 | Usability/UX tips | **.svg** (4 files) |
| img-22 … img-23 | Usability/UX tips | .webp |
| img-24 … img-31 | Use Cases → examples | .webp |

All `![alt](/blog/assets/notifications-ui-design/img-N.ext)` references preserved. When reworking Use Cases into "examples" (1.5-C), each image stays attached to its example. No image deleted, reordered, or re-pathed.

**External links — all preserved:** codepen (×4: ykosinets, prvnbist, gatoledo1, joeydesignsstuff), dribbble (×11), figma community (×3), react.setproduct.com (toast, dialog, tooltip, progress-bar), blueprintjs, adobe spectrum, m2.material.io, mixkit, apple developer, behance, ui-lovelace, blog credit line (627).

**Setproduct product/brand links — frozen, kept:**
- `/templates/material-x` (line 94)
- `/templates/orion` + Figma Orion file (line 383)
- `/blog/badge-ui-design` (lines 64, 72)
- react.setproduct.com component links (×4)

**Frontmatter — frozen, zero changes:** title, description, slug, date, author, coverImage, coverImageAlt, tags, canonical, category, subtitle, metaTitle, cardDescription, inlineCta (guest-post block), readingTimeText (will update to reflect new length), relatedSlugs, thumbImage.
> Note: `readingTimeText: 8 mins read` (line 30) — should I bump to match new ~5000-word length (≈ "11 mins read")? Flagging — will only change if you approve, since it's a frontmatter field.

---

## Stage 2 execution order (after your OK)

1. Fix all markdown bugs (1.1) — global.
2. Convert `### **X**` → `### X` in all 4 big sections (2.2).
3. Remove fake stats section (623–625), keep credit line.
4. Add TL;DR after lead (40–80 words, UI+UX, answer-first).
5. Shorten badge/tooltip/dialog blocks to 50–80 words + add internal links.
6. De-formula Components / UX-tips prose (drop `_Definition_:` scaffolds).
7. Add comparison table in Components (Toast vs Snackbar vs Banner vs Push).
8. Add NEW `## In-app vs push vs web vs desktop` + table (1.5-B).
9. Rework Use Cases → `## Real-world notification design examples` (1.5-C).
10. Add NEW `## Notification settings UI design` (1.5-A).
11. Add NEW `## Material Design notification patterns` (1.5-D).
12. Rename "Notifications Usability Tips" → `## Notification UX best practices`; strengthen UX (2.11).
13. Sentence-case ALL headings.
14. Add `## Before you ship: notification checklist` (10 ✅ items, 2.8).
15. Add `## Notifications design FAQ` (7 Q, INSIGHT-3 question first, 2.9).
16. Add `## A last word on notifications` closing (100–150 words, opinion).
17. Ensure singular "notification" used 8–10×; em-dash budget ≤2; no "Not X but Y"; tricolon ≤2.
18. Final read + show full diff. Wait for OK.

---

## Proposed FAQ questions (need approval — order matters per INSIGHT 3)

1. **What makes a good notification design?** ← FIRST (INSIGHT 3, 0-click query)
2. What is the difference between in-app and push notifications?
3. How do you design notification settings users won't disable?
4. When should you use a toast vs a banner vs a dialog?
5. How many notifications is too many?
6. How do you make notifications accessible?
7. What are the best notification UI patterns in Material Design?

---

## Guardrails summary

- ✅ Frontmatter / slug / images / Setproduct links: frozen (one flagged question: readingTimeText).
- ✅ No links to non-existent posts (verified list in 1.6).
- ✅ Components + Types: light touch only (de-formula + bug-fix + shorten cannibalizers), no full rewrite.
- ✅ House style: sentence case, em-dash ≤2, no "Not X but Y", tricolon ≤2, ☞/☛/• callouts, ❶❷❸ for sequences.
- ✅ Primary sources only (Material, Apple HIG, NN/g).
- 🎯 Target length: ~4500–5000 words.
