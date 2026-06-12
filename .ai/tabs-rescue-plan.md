# Tabs UI design — content rescue plan

Patient: [`content/blog/tabs-ui-design.mdx`](content/blog/tabs-ui-design.mdx:1)
Benchmark: [`content/blog/steps-ui-design.mdx`](content/blog/steps-ui-design.mdx:1)
GSC baseline: 107k impressions · 647 clicks · CTR 0.6% · avg position 8.6
Goal: lift CTR toward the steps-post benchmark (1.06%), make the post AI-citable, strip Helpful-Content-Update risk (fake stats), without touching frontmatter, slug, images or Setproduct links.

---

## 1. Found problems (categorized, with exact quotes)

### 1.1. Fabricated statistics (no source) — top priority, Wave 4 target
These are invented numbers presented as research. All must go (remove or convert to qualitative claims).

| Line | Exact quote | Action |
|---|---|---|
| 353 | `_Result_: 23% faster task completion in usability tests` | Remove the fake metric; keep the three-tier structure as a qualitative outcome. |
| 363 | `_Innovation_: Auto-expand "More" tab after 3 seconds of inactivity` | Keep as a behavior note (no fake metric), but reframe — auto-expand on inactivity is a dubious pattern; soften to a recommendation. |
| 373 | `_Engagement boost_: 40% higher story completion rate` | Remove fake metric; keep the icon-progress description. |
| 387 | `_Efficiency gain_: 58% reduction in support tickets` | Remove fake metric (explicitly named in content-strategy 4.2 antipattern). |
| 397 | `_Error Reduction_: 91% decrease in mistaken profile clicks` | Remove fake metric; keep hover-expand description. |

### 1.2. Pseudo-technical / invented-precision claims
Specific px / ms / dp / Hz / opacity / damping numbers presented as universal law. Per content-strategy 4.2, `spring physics (damping: 0.7, stiffness: 150)` is the named antipattern. These get softened to qualitative design guidance.

| Line | Quote | Fix direction |
|---|---|---|
| 60 | `1px border with #F5F5F5 fill`, `full-bleach containers` | Keep idea, drop the exact hex as if mandatory; "bleach"→"bleed" typo fix. |
| 70 | `3x higher visual weight` | → "clearly higher visual weight". |
| 72 | `animate underline from 1px to 3px over 200ms` | → "let the underline grow on selection with a short transition, not an instant jump". |
| 78 | `40% opacity reduction`, `amplify contrast by 15-20%` | → "noticeably lower contrast than the active tab; hover lifts it part-way, never to full active styling". |
| 84 | `150ms linear path animation`, `stroke-dashoffset` | → qualitative morph note. |
| 102 | `spring physics (damping: 0.7, stiffness: 150)` | → "use natural spring-like motion, not linear easing — linear feels mechanical". |
| 118 | `skeleton screens with 150ms delay` | → keep skeleton idea, drop the exact delay-as-law. |
| 174 | `90ms duration` close animation | → "animate the close so tabs don't vanish abruptly". |
| 198 | `Reveal 6% container elevation` | → "lift the tab slightly with a soft shadow on hover". |
| 214 | `diagonal strikethrough (45° angle, #FF4444 color)` | → drop the strikethrough-at-45° invention; standard disabled treatment is reduced opacity + no pointer. |
| 224 | `3px blue outline (#007AFF) with 2:1 contrast ratio` | fix: focus ring must meet WCAG 3:1 non-text contrast, not 2:1 — correct the number while we're here. |
| 226 | `update within 50ms` | → "keep the ARIA selected state in sync with the visual state". |
| 234 | `Pulse tab label 3 times at 2Hz frequency`, `5° horizontal shake (duration: 400ms)` | → remove the pseudo-precise motion spec; keep "badge + clear error affordance", drop the shake. |
| 242 | `progress ring (40px diameter)`, `load time exceeds 800ms` | → qualitative. |
| 332 | `400% font weight increase` | impossible-sounding metric → "increase the label weight (variable fonts make this smooth)". |
| 405-466 | scattered exact ms in Tips (250ms, 500ms, 1+ second) | Mostly fine as concrete examples of named products; keep where attributed to a real product, soften where stated as universal law. |

☞ Note: not every number dies. Real, checkable specifics (48×48px touch target, WCAG contrast, named product behavior) stay — that is the "verifiable concreteness" the strategy wants. Only *invented* precision and *sourceless* stats go.

### 1.3. GPT-tell subheadings (formulaic italic labels)
The article is saturated with `_Label_:` openers that scream AI-generated. Reformulate into natural prose or real bolded mini-headers, removing the rigid template.

Inventory: `_Definition_`, `_Critical function_`, `_Design imperative_`, `_Behavioral nuance_`, `_Common pitfall_`, `_Interaction clarity_`, `_Spatial grouping_`, `_State-driven glyph behavior_`, `_Failure protocol_`, `_Typography rules_`, `_Localization impact_`, `_Dynamic feedback_`, `_Motion design_`, `_Technical note_`, `_Ideal scenario_`, `_Layout formula_`, `_Mobile adaptation_`, `_Data-intensive use_`, `_Navigation depth_`, `_Ergonomic placement_`, `_Visual signature_`, `_Best for_`, `_Why it works_`, `_Styling parameters_`, `_Problem_` / `_Solution_` / `_Result_` / `_Innovation_` / `_Example_` / `_Design tips_`.

Approach (respecting "don't fully rewrite Anatomy/Types"): in Anatomy and Types I keep the substance but dissolve the rigid `_Definition_/_Critical function_/_Design imperative_` triplets into 1-2 flowing sentences per item. `_Best for_` / `_Why it works_` in Theming can stay as light bold leads (they read like a spec sheet, which suits theming) but lose the fake metrics inside.

### 1.4. Broken markdown / typography artifacts
- Zero-width-joiner junk `_‍_` scattered across ~40 lines (e.g. 56, 58, 68, 82, 98, 114, 184, 254, 256, 290, 308, 346, 396, 468). Strip all of these.
- `full-bleach` (L60, L328) — typo for "full-bleed". Fix.
- Title Case H2 headings violate AGENTS.md sentence-case rule:
  - L52 `## Tabs Anatomy` → `## Tabs anatomy`
  - L120 `## Types of Tabs` → `## Types of tabs`
  - L182 `## Tabs States` → `## Tabs states`
  - L246 `## Tabs Theming` → `## Tabs theming`
  - L338 `## Tabs Use Cases` → `## Tabs use cases`
  - L399 `## UX & Usability Tips` → `## UX and usability tips`
- Use Cases section uses `####` (H4) for examples while the section is `##` (H2) — skips H3. Will normalize example headers to `###` so the TOC (H2/H3 only) picks them up.
- Inconsistent dash glyph in intro (`-` used as em-dash on L42 `applications - all`). Will not introduce new em-dashes (budget max 2 per article).
- `subtitle` in frontmatter ends with banned cliché "Ready to get started? Let's go!" — **out of scope** (frontmatter frozen by task + Wave 1). Flagged only, not touched.

---

## 2. Structural gaps vs Steps benchmark

The steps post wins because of opinionated voice + answer-first scannability. Tabs is missing every one of these load-bearing blocks:

| Block in Steps | Present in Tabs? | Plan |
|---|---|---|
| TL;DR / answer-first opener after hero | ❌ (opens with "This documentation provides an exhaustive guide…") | Add a 40-80 word answer-first TL;DR before the first H2. |
| Live opinionated author voice | ❌ (cold, encyclopedic) | Inject light Roman-voice asides in intro, theming, and a new closing. |
| Comparison vs alternatives | ❌ | Add "Tabs vs dropdown vs accordion vs segmented control" table. |
| "Before you ship" checklist | ❌ | Add 8-10 item checklist near the end. |
| FAQ block (5 Q&A, ❶-❺) | ❌ | Add "## Tabs UI design FAQ" with 5-7 Q&A. |
| Opinion-driven closing line | ❌ (article just ends on a tooltip tip) | Add 80-150 word opinionated close. |
| Examples-first product gallery | ⚠️ partial (Use Cases names products but buries them under fake stats) | Reframe Use Cases examples-first with real named products. |

---

## 3. SEO coverage gaps (GSC queries → where to fix)

| Query | Impressions | Currently covered? | Where to materialize |
|---|---|---|---|
| `tab design` (singular, **top query**) | 2,334 | Weak — body says "Tabs" almost everywhere | Add singular "tab" naturally ≥5×: TL;DR, anatomy intro, FAQ, closing. |
| `tabs ui design examples` | 370 | Partial — examples exist but stat-polluted | Reframe Use Cases as a clean examples gallery; add "examples" phrasing in TL;DR + an H3. |
| `tab view ui design` | 240 | ❌ iOS term absent | Add "tab view" as the iOS/SwiftUI equivalent in Types (segmented/standard) + FAQ. |
| `material design tabs` | 91 | ⚠️ implicit (Material-X images) but never stated as a pattern | Name "Material Design tabs" explicitly in Theming (Elevated/Material X) + 1 FAQ. |
| `tabbed interface ui` | 14 | ❌ academic term absent | Add "tabbed interface" once in TL;DR or anatomy intro. |
| `tab section design` | 105 | ⚠️ loose | Use "tab section" phrasing once in Use Cases / content-pane copy. |

Answer-first TL;DR is the single highest-leverage SEO+AI-citation move (content-strategy 4.1).

---

## 4. Section-by-section edit plan (keep / rewrite / add)

| # | Section | Action |
|---|---|---|
| — | Frontmatter (L1-36) | **KEEP — do not touch** (title, description, metaTitle, cardDescription, subtitle, slug, coverImage, thumbImage, author, date, category, relatedSlugs, inlineCta all frozen). |
| A | Intro (L42-50) | **REWRITE lightly.** Replace "This documentation provides an exhaustive guide…" cold open. Keep the dropdown contrast link. Insert **new TL;DR** block (answer-first, ~60 words) right after, before `## Tabs anatomy`. Seed singular "tab", "tabbed interface". |
| B | `## Tabs anatomy` (L52-118) | **KEEP substance, DE-GPT.** Dissolve `_Definition_/_Critical function_/_Design imperative_` triplets into flowing sentences. Soften pseudo-tech (1.2). Strip ZWJ junk. Keep all 4 images (img-1, img-2) + links. Fix `full-bleach`→`full-bleed`. |
| C | `## Types of tabs` (L120-180) | **KEEP substance, DE-GPT.** Same treatment. Add "tab view (iOS / SwiftUI)" mention in Segmented control + Standard. Keep img-3, img-4, img-5 + links. |
| D | `## Tabs states` (L182-244) | **REWRITE the worst offenders.** Remove 2Hz pulse / 5° shake (L234), fix focus contrast 2:1→3:1 (L224), soften 6% elevation (L198), drop 45° strikethrough (L214). Keep img-6, img-7 + links. |
| E | `## Tabs theming` (L246-336) | **KEEP format, clean numbers.** Keep `_Best for_`/`_Why it works_` as light leads (suits a theme spec) but remove ZWJ, fix `400% font weight`, `full-bleach`. Explicitly name "Material Design tabs" in Elevated/Material X. Keep img-8…img-12 + links. |
| F | `## Tabs use cases` (L338-397) | **REWRITE — examples-first, strip ALL fake stats (1.1).** Convert `####`→`###`. Keep the 5 named products (GA4, Amazon, Instagram, Slack, Netflix) and **add** a couple more real ones (Linear, Notion, Stripe Dashboard, Figma) into a clean examples paragraph/table so it serves "tabs ui design examples". Keep img-13, img-14 + Setproduct internal links (appbar, settings, button). |
| G | `## UX and usability tips` (L399-466) | **KEEP — lightly clean.** Convert `####`→`###`, trim ZWJ, keep real product examples (Figma, Gmail, Notion, Slack, Teams) and their links. Keep img-15, img-16, img-17 + Setproduct links (notifications). |
| H | **NEW: comparison table** | Add after Types (or before Use Cases): "Tabs vs dropdown vs accordion vs segmented control" — rows: Best for, Visible options, Screen space, When to use, Mobile friendliness. |
| I | **NEW: ship checklist** | Add "## Before you ship: tabs checklist" — 8-10 ✔ items (one active tab, keyboard arrows, ARIA selected, focus ring, overflow handling, no ghost tabs, mobile target ≥48px, content stable on switch). |
| J | **NEW: FAQ** | Add "## Tabs UI design FAQ" — 5-7 Q&A (80-120 words each). Question list proposed in section 6 below for your approval. |
| K | **NEW: opinionated closing** | Add ~100-word Roman-voice close after FAQ (taste-driven, no fake numbers). |

Em-dash discipline: whole article kept to ≤2 em-dashes total; use `→`, `•`, `:` and short sentences instead (house style).

---

## 5. Asset preservation checklist

### 5.1. Images — all 17 kept, in order, untouched paths
| # | Path | Section |
|---|---|---|
| 1 | `/blog/assets/tabs-ui-design/img-1.webp` | Anatomy · Active tab |
| 2 | `/blog/assets/tabs-ui-design/img-2.webp` | Anatomy · Labels |
| 3 | `/blog/assets/tabs-ui-design/img-3.webp` | Types · Standard |
| 4 | `/blog/assets/tabs-ui-design/img-4.webp` | Types · Segmented |
| 5 | `/blog/assets/tabs-ui-design/img-5.webp` | Types · Dynamic |
| 6 | `/blog/assets/tabs-ui-design/img-6.webp` | States · Hover |
| 7 | `/blog/assets/tabs-ui-design/img-7.webp` | States · Focus |
| 8 | `/blog/assets/tabs-ui-design/img-8.webp` | Theming · Rounded |
| 9 | `/blog/assets/tabs-ui-design/img-9.webp` | Theming · Underlined |
| 10 | `/blog/assets/tabs-ui-design/img-10.webp` | Theming · Segmented |
| 11 | `/blog/assets/tabs-ui-design/img-11.webp` | Theming · Elevated/Material X |
| 12 | `/blog/assets/tabs-ui-design/img-12.webp` | Theming · Borderless |
| 13 | `/blog/assets/tabs-ui-design/img-13.webp` | Use cases · Dashboard |
| 14 | `/blog/assets/tabs-ui-design/img-14.webp` | Use cases · Settings |
| 15 | `/blog/assets/tabs-ui-design/img-15.webp` | Tips · Micro-animations |
| 16 | `/blog/assets/tabs-ui-design/img-16.webp` | Tips · Smart badges |
| 17 | `/blog/assets/tabs-ui-design/img-17.webp` | Tips · Tooltips |

Alt texts: kept as-is (sentence-case-safe), only `img-7` and `img-17` have empty alt — left as-is (not in task scope to invent).

### 5.2. External + internal links — all preserved
External (authority/inspiration): Figma Material-X (×3 nodes), Figma Material Design System v3, Figma iOS 13 Design System, Figma React UI kit (×2 nodes), react.setproduct.com/components/tabs, Dribbble (Praveen Juge, Erdem, Sebastiano Guerriero, Pixsellz, Jon Moore, Monty Hayton).

Setproduct internal (monetization / cluster — **must keep**): `/blog/dropdown-ui-design` (×2), `/blog/appbar-ui-design`, `/blog/settings-ui-design` (×2), `/blog/notifications-ui-design`, plus relatedSlugs (empty-state, steps, tooltip) in frontmatter.

No link removed or re-pointed. New internal links may be *added* (e.g. button, steps) where natural, never removed.

---

## 6. Proposed FAQ questions (need your approval)

Targeting the GSC queries + common AI-assistant prompts:

❶ When should I use tabs instead of a dropdown or accordion?
❷ What is a tab view, and how is it different from web tabs?
❸ How many tabs are too many?
❹ How do I make tabs accessible (keyboard and screen reader)?
❺ What is the Material Design tabs pattern?
❻ Should tabs be scrollable or wrap on mobile?
❼ Where should the active tab indicator go?

(Will trim to 5-7 final; tell me if you want any dropped/added.)

---

## Summary of guardrails
- ❌ No frontmatter / slug / image / Setproduct-link changes.
- ❌ No full rewrite of Anatomy & Types — only de-GPT + de-stat.
- ✅ Remove 5 fake stats + ~15 invented-precision claims.
- ✅ Add TL;DR, comparison table, ship checklist, FAQ, opinion close.
- ✅ Sentence-case all headings; strip ZWJ artifacts; ≤2 em-dashes.
- ✅ Seed singular "tab", "tab view", "tabbed interface", "Material Design tabs", "examples".
