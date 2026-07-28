---
name: seo
description: Activate when user asks to improve, optimize, or rewrite SEO metadata (title tags, meta descriptions, card descriptions, subtitles, frontmatter fields) for any blog post. Also activate for requests involving Search Console data analysis, CTR improvements, click-through rate optimization, SERP performance, or work on .ai/seo-baseline-*.md or .ai/seo-benchmarks.md files. Covers all blog categories — UI design, tutorials, startups, crypto, growth, career, design trends, technology, research, SEO, resources.
---

# SEO content optimization

This skill encodes a data-driven approach to optimizing blog post 
metadata. It does not hardcode benchmarks or category-specific 
patterns — both live in `.ai/seo-benchmarks.md` and must be 
read fresh on every activation.

## When this applies

- Rewriting frontmatter fields: title, metaTitle, description, 
  cardDescription, subtitle, coverImageAlt
- Analyzing GSC click/impression/CTR data
- Working with baseline or benchmark files in .ai/
- CTR recovery work (typically a "wave" of bulk optimization)
- Cross-category content audit

## Mandatory pre-work on every activation

Before proposing anything:

1. Read AGENTS.md to refresh sentence case rule and project 
   conventions
2. Read `.ai/seo-benchmarks.md` to learn current category 
   benchmarks. **Never assume benchmarks from memory or prior 
   sessions.**
3. Read the target post's frontmatter to identify its category
4. Find the matching category section in seo-benchmarks.md
5. If category is not yet tracked in benchmarks, ask user: 
   "This post is in category X, which is not yet benchmarked. 
   Should I optimize using cross-category general principles, 
   or do you want to add a benchmark for this category first?"

## Core principles (category-agnostic)

These apply to every post, regardless of topic:

### Title rules

- 60-65 characters maximum (verify count before proposing)
- Must contain the exact keyword phrase the post is meant to rank 
  for (extract from GSC data if available, otherwise from slug 
  and H1)
- Sentence case per AGENTS.md rule
- No suffix " | Setproduct Blog" — Next.js adds it automatically
- Must include a psychological hook chosen from:
  - Benefit ("build better flows")
  - Curiosity gap ("why most X quietly hurt usability")
  - Specificity ("X in 4 steps", "12 anti-patterns", "$50k month")
  - Authority ("after 13 years", "I audited 50 X")
  - Novelty ("liquid glass", "AI era", "in 2026")
- Forbidden generic words: "Complete", "Comprehensive", "Ultimate", 
  "Definitive" — they signal undifferentiated template content
- Forbidden weak endings: bare "Guide" or "Tutorial" without 
  a hook
- Forbidden to use ":" in title — it splits the title in SERP and reduces CTR

### Description rules

- 130-160 characters (verify count before proposing)
- First sentence: concrete benefit or specific problem the post 
  solves
- Second sentence: what concrete artifacts reader will find 
  (anatomy, examples, code, templates, FAQ, checklist)
- Active voice
- No "Ready to get started?", "Let's go!", "Dive in!", 
  "Get started today!"
- If the post has FAQ, checklist, or other structured artifacts, 
  mention them explicitly to set expectation
- Avoid restating the title verbatim

### Semantic variations (category-driven)

For each category, look up the variation patterns in 
seo-benchmarks.md. Examples:

- UI design components: combine 2-3 of: "X ui design", "X ui", 
  "X design", "X design ui"
- How-to tutorials: "how to X", "X tutorial", "X step by step", 
  "X in N steps"
- Technology/crypto: "X with crypto", "X without card", 
  "X without KYC", "X workaround"
- Career: "how to become X", "X career", "X salary", "X portfolio"

If category has no documented pattern in seo-benchmarks.md, infer 
from GSC top queries for the post (if available in 
`.ai/seo-baseline-*.md`), or default to 2-3 natural variations 
of the head term.

## Workflow

When user asks to optimize a specific post:

1. Read AGENTS.md and `.ai/seo-benchmarks.md` (every time)
2. Open the .mdx file at path content/blog/[slug].mdx
3. Identify the post's category from frontmatter
4. Look up the category benchmark and winning formula notes
5. Look up the post's current performance in 
   `.ai/seo-baseline-*.md` if it exists (GSC top queries, 
   current CTR, current title and description)
6. Show user:
   a. Current title and description (in a code block)
   b. Current performance metrics if known
   c. Category benchmark to beat
7. Propose 3 title variants and 3 description variants
8. For each variant, document:
   - Which GSC queries (or anticipated queries) it targets
   - Which psychological trigger from the list above it uses
   - Why it likely outperforms current version
   - Character count
9. Wait for user selection (e.g. "Title 2 + Description 1")
10. Apply changes to frontmatter
11. Self-check: re-read both title and description, verify 
    sentence case per AGENTS.md, verify character counts
12. Show final diff
13. After user "OK" — commit with conventional message:
    `seo: improve title and description for [slug]`
14. Wait for user's "next" or new instruction before moving on

## When user provides updated GSC data

If user shares a new GSC export or asks to update benchmarks:

1. Read `.ai/seo-benchmarks.md`
2. For each category mentioned in the new data, check if any 
   post in that category now exceeds the recorded benchmark
3. If yes, propose update to seo-benchmarks.md with:
   - New benchmark value
   - Post slug
   - Date of measurement
   - Updated winning formula notes if pattern changed
4. Wait for confirmation before editing the benchmarks file
5. Add entry to the file's "Update history" section
6. Commit:
   `docs: update SEO benchmarks for category [name]`

## When working on a category with no benchmark yet

If user requests optimization for a category not present in 
seo-benchmarks.md:

1. Tell user explicitly: "Category X is not in benchmarks. 
   I will use cross-category principles only."
2. Proceed with title/description rewrite using core principles
3. After completing, ask: "Should I add a placeholder entry 
   for category X in seo-benchmarks.md, so future posts in this 
   category can be tracked?"

## Out of scope for this skill

- Body content rewrites — different concern, separate skill
- Image alt text and filenames — separate skill
- Schema markup — separate skill
- Slug or URL changes — never modify without explicit user 
  request and consideration of redirects
- New post creation from scratch — separate workflow
- Pillar page architecture — separate skill

## Files this skill reads on every activation

- `AGENTS.md` (sentence case rule, project conventions)
- `.ai/seo-benchmarks.md` (current category benchmarks)

## Files this skill may read when relevant

- `.ai/seo-baseline-YYYY-MM-DD.md` (snapshots, for historical context)
- `.ai/content-strategy.md` (strategic priorities)
- `data/blog-categories.ts` (canonical category names)

## Files this skill writes to (only with user permission)

- `content/blog/[slug].mdx` (target posts, only after approval)
- `.ai/seo-benchmarks.md` (when user provides new GSC data 
  showing benchmark changes)
