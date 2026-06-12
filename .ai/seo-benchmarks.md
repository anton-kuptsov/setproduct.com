# SEO benchmarks — current best performers per category

**Last updated:** 28 May 2026  
**Source:** GSC data extracted on 28 May 2026  
**Update protocol:** When you have a new GSC export with at least 
14 days of data after a change, manually update the benchmarks 
in tables below. Skill `seo-content-optimization` reads this file 
on every run.

## How benchmarks are used

- Each blog post belongs to a category (`category` field in 
  frontmatter)
- For SEO optimization tasks, the skill compares the target 
  post against the best performer in its category
- New optimization must aim to beat the category benchmark, 
  not absolute numbers from other categories

## Category benchmarks

### UI design (component guides)

| Metric | Value | Post |
|---|---|---|
| Current best CTR | 1.06% | steps-ui-design |
| Median CTR in category | 0.42% | (across 28 posts) |
| Target after Wave 1 optimization | 1.5% | new bar |

**Winning formula notes:**
- Benefit-driven first sentence in description
- Specific numeric/visual hook ("build better flows", "reduce drop-offs")
- Action-oriented ending
- Has FAQ block in body
- Has pre-launch checklist
- Sentence case throughout

### Tutorials and educational

| Metric | Value | Post |
|---|---|---|
| Current best CTR | TBD | (no GSC data yet — fill after Wave 1 measurement) |
| Reference engagement | 40 sec | how-to-design-a-ui-kit-foundation |
| Target | aim 1.0%+ | |

**Winning formula notes:**
- "How to" prefix works for this category
- Long-tail keywords ("how to design X foundation")
- Engagement matters as much as CTR (depth-tutorial pattern)
- Direct product synergy in CTA

### Design trends and inspiration

| Metric | Value | Post |
|---|---|---|
| Current best CTR | TBD | liquid-glass-design-explained (high traffic but GSC TBD) |
| Reference views (GA4) | 8,259 | liquid-glass-design-explained |
| Target | match liquid-glass momentum | |

**Winning formula notes:**
- Reference a specific design language or trend by name
- "Explained" or "practical guide" suffix
- First-mover advantage on trending topics (write within 4-8 
  weeks of trend emergence)
- Heavy social/AI tool referral traffic — optimize for shareability

### Technology (crypto, AI tools, payment workarounds)

| Metric | Value | Post |
|---|---|---|
| Current best impressions | 6,081 | how-to-cancel-adobe-subscription-without-fees |
| Reference CTR | 1.3% | how-to-cancel-adobe-subscription-without-fees |
| Reference high-converter CTR | 2.2% | venice-ai-tool-private-uncensored (very narrow query) |
| Target | 1.5%+ | |

**Winning formula notes:**
- Action-oriented title ("How to pay X with Y", "Buy X without Z")
- Currency or tool name in title (USDT, USDC, Claude, ChatGPT)
- Time/cost specificity ("in 4 steps", "without KYC", "without fees")
- Friction-removing language ("when credit cards are not accepted")
- Niche audience converts hard — focus on completeness over breadth

### Startups and SaaS

| Metric | Value | Post |
|---|---|---|
| Current best CTR | TBD | (filter posts in this category after Wave 1) |
| Reference engagement | 51 sec | start-a-saas-business-with-no-money |
| Target | 1.0%+ | |

**Winning formula notes:**
- Counter-intuitive or contrarian angles ("with no money", 
  "without onboarding")
- Specific problem framing ("activation", "first 100 users")
- Founder-voice tone, not corporate

### Growth hacking and marketing

| Metric | Value | Post |
|---|---|---|
| Current best CTR | TBD | how-to-replace-onboarding-with-contextual-help |
| Reference engagement | 32 sec | how-to-replace-onboarding-with-contextual-help |
| Target | 1.0%+ | |

**Winning formula notes:**
- "Replace X with Y" pattern works
- Quantified outcome ("lift activation")
- Practical, anti-theoretical positioning

### Career and design profession

| Metric | Value | Post |
|---|---|---|
| Current best CTR | TBD | not enough data yet |
| Target | 1.0%+ | |

**Winning formula notes (predictive, refine after data):**
- Income/salary specificity ("$50k month", real numbers)
- Personal narrative ("I tried", "I learned", "after 13 years")
- Counter-intuitive ("the skill that pays more than X")

### Design and code (Figma + React)

| Metric | Value | Post |
|---|---|---|
| Current best CTR | TBD | |
| Reference engagement | varies | |
| Target | 1.0%+ | |

**Winning formula notes:**
- Tool-specific titles (Figma, React, Next.js, Tailwind, MDX)
- "From X to Y" pattern works (from Figma to React)
- Implementation-focused vocabulary

### SEO

| Metric | Value | Post |
|---|---|---|
| Current best CTR | TBD | |
| Target | 1.0%+ | |

### Research

| Metric | Value | Post |
|---|---|---|
| Current best CTR | TBD | |
| Reference views (GA4) | high engagement | the-ux-decisions-that-make-or-break-small-business-websites |
| Target | 1.0%+ | |

**Winning formula notes:**
- "Designer with X+ years" authority signal
- "Decisions that make or break" / "fundamentals" framing
- Research-backed claims, no fake statistics

### Resources

| Metric | Value | Post |
|---|---|---|
| Current best CTR | TBD | |
| Target | 1.0%+ | |

### Other / case studies / presentation / typography / inspiration

(Add benchmarks as data becomes available)

## Anti-patterns to flag across ALL categories

- Title Case (must be sentence case per AGENTS.md)
- Generic adjectives without value: "comprehensive", "complete", 
  "ultimate", "definitive"
- Empty engagement hooks: "Ready to get started?", "Let's go!", 
  "Dive in!"
- Fake statistics without source attribution (e.g. "23% faster", 
  "58% reduction") — this is the Tabs post failure mode and 
  hurts E-E-A-T
- Typos (notifications historically had "of of")
- Forbidden words at end of title: "Guide" alone, "Tutorial" alone 
  (these are weak hooks)
- Title and description that say the same thing

## Update history

- 28 May 2026: initial baseline created with GSC data for UI 
  design category
- (future entries: when category gets new benchmark, log here 
  with date and post slug)
