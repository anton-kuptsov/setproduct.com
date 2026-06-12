# SEO baseline — Wave 1 starting point

**Snapshot date:** 28 May 2026  
**GSC data period:** last 6 months (Dec 2025 — May 2026)  
**Purpose:** capture pre-deploy state to measure Wave 1 impact

## Overall site metrics

- **Total clicks:** 13,800
- **Total impressions:** 3,280,000
- **Average CTR:** 0.4%
- **Average position:** 13.4

Industry benchmark for blog content on positions 5-15: 2-4% CTR.  
Current site CTR is approximately 5-10x below benchmark, which identifies title and meta description optimization as the highest ROI improvement available.

## Top 28 posts — baseline metrics (pre-deploy)

| Slug | Impressions | Clicks | CTR | Tier |
|---|---|---|---|---|
| tabs-ui-design | 97,268 | 609 | 0.63% | 1 |
| notifications-ui-design | 74,990 | 266 | 0.35% | 1 |
| filter-ui-design | 55,167 | 201 | 0.36% | 1 |
| empty-state-ui-design | 50,730 | 49 | 0.10% | 1 (critical) |
| pagination-ui-design | 48,498 | 226 | 0.47% | 1 |
| dropdown-ui-design | 46,279 | 251 | 0.54% | 1 |
| tooltip-ui-design | 42,380 | 92 | 0.22% | 1 |
| dashboard-design-best-practices-top-dashboard-ui-design-tips | 40,449 | 9 | 0.022% | 1 (critical) |
| steps-ui-design | 32,627 | 346 | 1.06% | benchmark |
| chip-ui-design | 30,738 | 136 | 0.44% | 2 |
| carousel-ui-design | 30,531 | 83 | 0.27% | 2 |
| toggle-switch-ui-design | 28,963 | 127 | 0.44% | 2 |
| breadcrumbs-ui-design | 27,790 | 78 | 0.28% | 2 |
| button-ui-design | 24,307 | 75 | 0.31% | 2 |
| calendar-ui-design | 19,243 | 47 | 0.24% | 3 |
| badge-ui-design | 17,879 | 47 | 0.26% | 3 |
| settings-ui-design | 15,342 | 58 | 0.38% | 3 |
| pricing-ui-design | 8,250 | 57 | 0.69% | 4 |
| input-ui-design | 14,748 | 34 | 0.23% | 3 |
| slider-ui-design | 14,844 | 57 | 0.38% | 3 |
| checkbox-ui-design | 14,803 | 55 | 0.37% | 3 |
| avatar-ui-design | 10,084 | 14 | 0.14% | 3 |
| marketing-dashboard-ui-design-guide | 9,379 | 14 | 0.15% | 4 |
| stepper-ui-design | 7,458 | 31 | 0.42% | 4 |
| accordion-ui-design | 4,496 | 13 | 0.29% | 4 |
| appbar-ui-design | 3,642 | 16 | 0.44% | 4 |
| how-to-get-better-at-ui-design-by-studying-ai-generated-examples | 2,845 | 2 | 0.07% | 4 (special) |
| the-ui-designer-who-built-a-50k-month-template-store | 1,574 | 3 | 0.19% | 4 (special) |

## Top search queries (pre-deploy)

Brand queries (high CTR, expected):
- setproduct — 437 clicks / 912 impressions (CTR 48%)
- setgpt — 97 / 811
- set product — 84 / 817
- orion ui kit — 81 / 203

Non-brand UI design queries:
- how to cancel adobe subscription without fee — 79 / 6,081 (1.3%)
- venice ai nsfw — 35 / 1,605 (2.2%)
- tabs ui design — 27 / 2,240 (1.2%)
- dashboard ui kit — 24 / 1,023
- steps ui — 23 / 1,679
- ios design system — 20 / 1,803
- tab ui design — 17 / 1,953
- tab ui — 16 / 2,339
- button group ui — 15 / 508 (content gap — no dedicated post)
- types of dropdowns — 9 / 176 (subheading not in TOC, opportunity)

## What was changed in Wave 1

- `ba3d5f5` seo: improve title and description for tabs-ui-design
- `1ca835d` style: fix sentence case in tabs-ui-design title
- `cf539bb` seo: improve title and description for notifications-ui-design
- `c30599d` fix: remove duplicate 'of' typo in notifications-ui-design subtitle
- `5a83bf3` seo: improve title and description for dropdown-ui-design
- `21e9375` seo: improve title and description for pagination-ui-design
- `a45c9b1` seo: improve title and description for filter-ui-design
- `1d78600` seo: improve title and description for chip-ui-design
- `22b24be` seo: improve title and description for toggle-switch-ui-design
- `2f26ab6` seo: improve title and description for tooltip-ui-design
- `9c54b5b` seo: improve title and description for carousel-ui-design
- `1f9ccad` seo: improve title and description for breadcrumbs-ui-design
- `53296d0` seo: improve title and description for button-ui-design
- `ded2fb4` seo: improve title and description for settings-ui-design
- `025d4c6` seo: improve title and description for slider-ui-design
- `48ff332` seo: improve title and description for checkbox-ui-design
- `9adaf8f` seo: improve title and description for tabs-ui-design
- `cb05dd4` seo: improve title and description for notifications-ui-design
- `970c26c` seo: improve title and description for filter-ui-design
- `54a36a6` seo: improve title and description for empty-state-ui-design
- `3dbd04a` seo: improve title and description for pagination-ui-design
- `75c25f3` seo: improve title and description for dropdown-ui-design
- `6223bfe` seo: improve title and description for tooltip-ui-design

Total posts with updated title and description: 15 (tabs, notifications, dropdown, pagination, filter, chip, toggle-switch, tooltip, carousel, breadcrumbs, button, settings, slider, checkbox, empty-state).

## Tracking plan

| Checkpoint | When | What to measure |
|---|---|---|
| Day 7 | 4 Jun 2026 | First reindexing check in GSC URL Inspection for top 5 posts |
| Day 14 | 11 Jun 2026 | Early CTR signals — should see at least 30% of pages reindexed |
| Day 30 | 28 Jun 2026 | First significant CTR comparison vs baseline |
| Day 60 | 27 Jul 2026 | Final Wave 1 impact assessment |
| Day 90 | 26 Aug 2026 | Go/no-go decision for Wave 2 (featured snippets) |

## Success criteria

Wave 1 considered successful if:
- Average CTR across top 28 posts increases from 0.4% to at least 1.0%
- At least 5 of the critical tier 1 posts double their CTR
- empty-state-ui-design CTR moves from 0.10% to at least 0.8%
- dashboard-design-best-practices CTR moves from 0.022% to at least 0.5%
- No measurable drop in average position (re-indexing should not reduce rankings; if it does, investigate)

Wave 1 considered insufficient and requires adjustment if:
- Average CTR stays below 0.6% after 30 days
- Multiple posts show CTR drop instead of growth (formula problem)
- Re-indexing has not happened for >50% of changed pages after 21 days

## Methodology notes

- GSC data exported manually from search.google.com/search-console on 28 May 2026
- "Top 28 posts" selected by clicks-impressions volume, not arbitrary
- CTR targets based on industry benchmarks for design and education content at SERP positions 5-15
- All title and description changes follow sentence case rule documented in AGENTS.md (commit `621d1a0`)
- This baseline file is the reference point for all future optimization decisions — do not modify the data tables in this file. To record new measurements, create new files like `seo-baseline-YYYY-MM-DD.md`.

## Out of scope for Wave 1

The following improvements were identified but deliberately postponed to later waves to keep changes isolated and measurable:

- Body content rewrites (Wave 4: fake statistics cleanup)
- Image alt text and filename SEO (Wave 5)
- Heading hierarchy fixes — converting bold subsections to H3 (Wave 5)
- Featured snippet optimization (Wave 2)
- Pillar page and topical cluster structure (Wave 3)
- New posts for content gaps like button-group-ui (future)
