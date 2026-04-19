## [2026-04-19] Wave 1 Complete

### T1: CSV Parser
- csv-parse/sync works correctly for multiline HTML fields
- 145 rows total (not 148 — 3 posts are new, not in CSV)
- 14 unique categories: career, case-studies, design-code, design-trends, growth-hacking, inspiration, optimisation, presentation, research, resources, startups-saas, technology, tutorials, typography
- 45 posts have Section CTA (inlineCta)
- Output: .sisyphus/evidence/csv-slug-to-fields.json (map slug → {category, subtitle, metaTitle, cardDescription, inlineCta})

### T2: Authors Map
- 9 unique authors in CSV (more than expected):
  roman-kamushken, jamshed-kasimov, jeff-flipper, kari-nelson, nick-rybak,
  connor-patterson, elen-mesropyan, jamichael-mitchell, william-james
- Also found: stan-suboticki (from legacy HTML?)
- All avatars downloaded to public/blog/authors/*.avif (or .jpg/.png)
- lib/blog/authors.ts: AUTHORS map + getAuthor(slug) helper
- Avatar paths use /blog/authors/<slug>.avif format

### T3: Types Extended
- BlogFrontmatter: + category, subtitle, metaTitle, cardDescription, inlineCta
- New types: InlineCta, BlogCategory, BlogHeading
- BlogPost: + headings: BlogHeading[] (for TOC)

### Critical Path: T4 → T5 → then Wave 3 parallel
- T4 needs csv-slug-to-fields.json (ready) → merge into MDX frontmatter
- 3 posts not in CSV (new ones added after export) → skip or set defaults

## [2026-04-19] Final Wave + Post-release fixes

### F1 Plan Compliance: APPROVE (Must Have 11/11, Must NOT Have 9/9)
### F2 Code Quality: APPROVE (tsc clean, no anti-patterns)
### F4 Scope Fidelity: APPROVE (all protected files untouched)
### F3 Visual QA: user reported issues → fixed inline

### User-reported issues (fixed):
1. **3 posts had wrong cover**: pay-for-claude-pro-with-usdt, the-ux-decisions-..., top-real-estate-...
   These posts are NOT in CSV (145 posts vs 148 files), migration picked random image
   Fix: sed replaced coverImage in frontmatter to legacy-proxied /external/cdn.prod.website-files.com/... URLs
   Commit: 88f77af

2. **Related posts layout wrong**: used main_blog-liist2-* classes (wrong component)
   Fix: rewrote with main_blog-liist1-* classes, plain <img>, category-tag, "Read more" button, "Read All" header
   Commit: 9eb7b9d

3. **Block order wrong**: Related was AFTER CtaSubscribe + TemplateShowcase
   Fix: reordered to: inlineCta → BlogRelatedPosts → CtaSubscribe → TemplateShowcase
   Commit: 9eb7b9d

### Remaining known concerns (not reported yet):
- Hero cover may still be stretched on some posts (user noted "растянул на всю")
- Avatar rendering — user wants specific avatars matching original
