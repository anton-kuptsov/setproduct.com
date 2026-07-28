# Form controls reference 2026 — pillar inventory (Phase 1)

**Created:** 19 Jun 2026
**Status:** Phase 1 — inventory only. No writing, no edits to existing posts.
**Reference pattern:** `pillar-dashboards-plan.md` (structure) + `ai-chat-interface-ui-design.mdx` (voice).
**GSC source:** `seo-baseline-2026-05-28.md` (6-month window Dec 2025 — May 2026).

---

## Executive summary

The blog already owns a deep cluster of form-control component posts (input, checkbox, radio, toggle, slider, stepper, chip, dropdown, calendar, date picker) plus three form-level pattern posts (steps, dialogs, contextual help). What is missing is a single **answer-first pillar** that (a) defines the whole form-control taxonomy, (b) gives a "which control for which input" decision framework, (c) covers cross-cutting concerns (validation, accessibility, anti-patterns), and (d) adds the developer-library section (React Hook Form, TanStack Form, Radix, React Aria, Zod) that no existing post touches.

The pillar consolidates a topic where we currently rank on 10+ separate URLs at sub-0.6% CTR (cannibalization, Principle 6 of content-strategy.md) and gives AI tools one citable source of truth.

**Strong structural precedent:** `data-table-ui-design` ("Data table UI design reference guide for 2026", 2026-06-12) — same "reference 2026" naming, same `category: UI Design`, same TL;DR-with-arrows opening. The form-controls pillar is its sibling.

---

## Inventory — existing component posts (✔ covered)

| # | slug | title | published | primary topic | GSC (imp / clicks / CTR) | notes |
|---|---|---|---|---|---|---|
| 1 | `input-ui-design` | Input UI design: States, anatomy, and validation patterns | 2023-10-09 | Text input field | 14,748 / 34 / 0.23% | Foundational, big (688 lines). Already covers validation patterns — pillar must link, not duplicate. CTR weak (Tier 3 rescue). |
| 2 | `checkbox-ui-design` | Checkbox UI design: Anatomy, states, and the indeterminate one | 2023-11-01 | Checkbox + indeterminate | 14,803 / 55 / 0.37% | Solid anatomy coverage. |
| 3 | `checkbox-react-component` | Styling ideas for React checkbox component | 2022-10-04 | Code/styling | — | Short (141 lines), code-flavored. Useful link from dev section. |
| 4 | `radio-button-ui-design` | Radio button UI design, from anatomy to accessible groups | 2026-06-16 | Radio + radio groups | — (too new) | NEW. No-colon title style (matches pillar rule). A11y groups covered. |
| 5 | `toggle-switch-ui-design` | Toggle switch UI design: When to use it and when not to | 2025-11-04 | Toggle vs checkbox | 28,963 / 127 / 0.44% | Strong cluster. |
| 6 | `slider-ui-design` | Slider UI design: Single, range, anatomy, and accessibility | 2025-11-07 | Slider / range | 14,844 / 57 / 0.38% | Good a11y coverage. |
| 7 | `stepper-ui-design` | Stepper input UI design: The +/− quantity control done right | 2025-09-10 | Numeric stepper | 7,458 / 31 / 0.42% | Narrow but clean. |
| 8 | `chip-ui-design` | Chip UI design: How chips, tags, and badges actually differ | 2023-09-17 | Chip / tag / badge | 30,738 / 136 / 0.44% | High impressions. Covers tags-as-chips — pillar references for "tags input". |
| 9 | `dropdown-ui-design` | Dropdown UI design: Standard, multi-select, searchable, and more | 2023-08-16 | Select / dropdown / multi-select | 46,279 / 251 / 0.54% | Top performer of the cluster. Covers select + searchable (combobox-adjacent). |
| 10 | `calendar-ui-design` | Calendar vs date picker UI design: When to use each | 2022-11-07 | Calendar vs picker decision | 19,243 / 47 / 0.24% | Short (123 lines), decision-flavored. Pairs with #11. |
| 11 | `date-picker-ui-design` | Date picker UI design, from anatomy to accessibility | 2026-06-15 | Date picker anatomy + a11y | — (too new) | NEW. No-colon title style. Tier 1 gap from strategy now filled. |
| 12 | `filter-ui-design` | Filter UI design: Sidebar vs top bar vs inline patterns | 2023-07-13 | Filter UI (form-adjacent) | 55,167 / 201 / 0.36% | Largest of cluster (761 lines). Form-adjacent, not a control per se — link as "filtering is a form". |
| 13 | `settings-ui-design` | Settings UI design: Why users can't find what they need | 2023-08-24 | Settings forms / IA | 15,342 / 58 / 0.38% | Form-level IA. Relevant to "form-level patterns" section. |
| 14 | `case-study-design-image-upload-component` | Case study: Design iterations for Cleeve's image upload component | 2025-04-29 | File / image upload (case study) | — | Author: Connor Patterson. Only file-upload content we have — link from the file-upload gap callout. |
| 15 | `data-table-ui-design` | Data table UI design reference guide for 2026 | 2026-06-12 | Data table (sibling pillar) | — (too new) | STRUCTURAL SIBLING. Not a form control, but the template to mirror. Cross-link pillar↔pillar. |

## Inventory — existing form-level pattern posts (✔ covered, link targets)

| # | slug | title | published | primary topic | GSC (imp / clicks / CTR) | notes |
|---|---|---|---|---|---|---|
| 16 | `steps-ui-design` | (Steps / multi-step flows) | live | Multi-step forms, checkout, onboarding, KYC | 32,627 / 346 / **1.06%** | **Quality benchmark** of whole blog. Pillar's "form-level patterns" must link here as the canonical multi-step source. |
| 17 | `how-to-design-dialogs` | Dialog windows: a complete tutorial for designers and developers | 2025-10-21 | Forms in dialogs/modals | — | Link from "where forms live" subsection. |
| 18 | `how-to-replace-onboarding-with-contextual-help` | (Contextual help vs onboarding) | 2026-02-22 | Inline help, validation friction | — | Growth category. Link from validation/help-text section. |

## Adjacent posts (link opportunistically, not core)

`tooltip-ui-design` (field hints), `notifications-ui-design` (submission feedback / toasts), `breadcrumbs-ui-design`, `pagination-ui-design`, `badge-ui-design`, `button-ui-design`. Use 1-2 as internal links where contextually honest.

---

## Gaps — components with NO dedicated post (❌ flag in pillar)

These are the inputs the pillar must define and at least briefly cover, since there is nowhere to link out to. They become the pillar's exclusive value (and future cluster-post candidates).

| component | status | how pillar handles it |
|---|---|---|
| Search input | ❌ no post | Define in "data-entry controls". Note relation to dropdown searchable. |
| OTP / PIN input | ❌ no post | Cover anatomy (segmented boxes, auto-advance, paste handling, a11y). High future-post potential. |
| Password input | ❌ no post | Cover reveal toggle, strength meter, paste, manager compatibility, WCAG. |
| Number input | ❌ no post | Distinguish from stepper (#7). Cover keyboard, locale, spin buttons. |
| File / image upload | ❌ partial (case study #14) | Cover drag-drop, progress, validation. Link the Cleeve case study as the only depth we have. |
| Autocomplete / combobox | ❌ no post | Closest is dropdown #9 (searchable). Define combobox per ARIA APG, link dropdown. |
| Tags input | ❌ no post | Closest is chip #8. Define token-entry pattern, link chip. |
| Phone input | ❌ no post | Cover country code, format-as-you-type, libphonenumber note. |
| Color picker | ❌ no post | Brief — niche. Anatomy + a11y contrast note. |
| Rating input | ❌ no post | Brief — stars/scale, a11y (radio-group semantics, link radio #4). |
| Standalone validation guide | ❌ partial (inside input #1) | Pillar owns the cross-cutting validation-strategy section; input post stays component-scoped. |
| Conversational / one-question forms | ❌ no post | Cover Typeform/Tally pattern in "form-level patterns". |
| Sign in / sign up forms | ❌ no post | Cover as a form-level composition example (email-first, social, passkeys). |

**Net new coverage the pillar adds that exists nowhere on the blog:**
the full taxonomy + decision framework, OTP/password/number/phone/color/rating/search/combobox/tags definitions, the cross-cutting validation-strategy section, and the **developer open-source library section** (React Hook Form, TanStack Form, Formik, Zod/Valibot/Yup, Radix, React Aria, Headless UI, Ariakit, shadcn/ui, Formbricks/Heyform).

---

## Proposed slug — 3 variants + collision check

| variant | pros | cons |
|---|---|---|
| `form-controls-reference-2026` ✅ recommended | Matches sibling `data-table-...reference...2026`. Clear pillar signal. Keyword "form controls" + freshness year. | Slightly long. |
| `form-design-reference-2026` | Broader ("form design" has volume). | Less precise vs "controls"; risks overlap with input/steps. |
| `form-controls-ui-design` | Matches existing `*-ui-design` cluster convention. | No freshness signal; weaker pillar differentiation from cluster. |

**No filename collision:** none of the above exist in `content/blog/`. Recommended `form-controls-reference-2026`.

---

## Proposed frontmatter (for Phase 3, not yet written)

- **title** (sentence case, no colon, ≤65): _"Form controls reference 2026 for product designers"_ (53 ch) — alt to refine in Phase 2.
- **category:** `UI Design`
- **author:** Roman Kamushken
- **relatedSlugs (3 closest):** `input-ui-design`, `dropdown-ui-design`, `radio-button-ui-design` (or `checkbox-ui-design`) — decide in Phase 2.
- **coverImage:** `/blog/covers/form-controls-reference-2026.webp` (propose only, do NOT create)
- **thumbImage:** `/blog/covers/thumbs/form-controls-reference-2026.webp` (propose only)
- **inlineCta x2 candidates:** React UI Kit (`https://setproduct.gumroad.com/l/figma2react`, 3700+ components) for the dev section; Material X (`https://setproduct.gumroad.com/l/material-x-fig`, 1100+ components, $88) or Material You (`https://gumroad.com/a/135691379/upxbb`, 2600+ MD3) for the design section.

---

## Phase 2 readiness checklist

- [x] Full component-post inventory with GSC metrics
- [x] Form-level pattern posts identified (steps = benchmark, dialogs, contextual help)
- [x] Gaps flagged (13 missing/partial components)
- [x] Sibling pillar identified (`data-table-ui-design`)
- [x] Slug variants + collision check
- [x] UI-kit CTA hrefs confirmed from `templates-listing.ts`
- [ ] **Awaiting user OK to proceed to Phase 2 (outline).**

## What Phase 2 will NOT do without your explicit "OK"

- Will not write any MDX body.
- Will not edit any existing cluster post.
- Will not create images or folders.
- Will only produce the 14-section outline in chat for your approval.
