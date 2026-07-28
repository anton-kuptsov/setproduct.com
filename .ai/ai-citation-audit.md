# AI citation audit — top 20 posts

Date: 2026-07-01

## Why this audit exists

GA4 shows a growing stream of AI-assistant referrals to setproduct.com: chatgpt.com (282 users, 3.6% key-event rate), claude.ai (39 users, 5.26%), perplexity.ai (12 users, 10%), plus gemini.google.com and notebooklm.google.com. AI answer engines (ChatGPT, Claude, Perplexity, Gemini) cite pages that contain a single, self-contained factual sentence they can lift verbatim. The strongest pattern is an **atomic definition** in the hero: subject + "is/are" + plain-language explanation, in one sentence, with no dependency on surrounding context.

Reference model the client gave:
> "Dropdowns are UI controls that let users select one option from a hidden list of choices."

This audit checks the hero paragraph of each of the top-20 posts (by Search Console clicks, 28 days) for such a sentence and gives a concrete recommendation.

## Scoring legend

- ✅ **Strong** — has a clean atomic claim in the first paragraph; nothing needed.
- 🟡 **Weak** — has a claim, but it is buried, brand-heavy, or not self-contained; tighten it.
- 🔴 **Missing** — opens with narrative, opinion, or a hook; add a citable sentence.

## Summary table

| # | Post | Status | Action |
|---|------|--------|--------|
| 1 | tabs-ui-design | ✅ Strong | none |
| 2 | pay-for-claude-pro-with-usdt | 🟡 Weak | add a one-line answer up front |
| 3 | venice-ai-tool-private-uncensored | 🟡 Weak | replace promo opener with a definition |
| 4 | steps-ui-design | ✅ Strong | none |
| 5 | dropdown-ui-design | ✅ Strong | none (reference example) |
| 6 | liquid-glass-design-explained | ✅ Strong | minor tighten optional |
| 7 | guest-posting-opportunities | ✅ Strong | keep the stat, cite source |
| 8 | ai-chat-interface-ui-design | ✅ Strong | none |
| 9 | filter-ui-design | ✅ Strong | none |
| 10 | submit-a-guest-post | 🟡 Weak | add a scope sentence |
| 11 | chip-ui-design | ✅ Strong | none |
| 12 | complete-guide-to-blueprint-grid-design | 🔴 Missing | add a definition before the hook |
| 13 | liquid-glass-vs-glassmorphism | 🟡 Weak | add a one-line distinction |
| 14 | guest-article-for-web-development | 🔴 Missing | add a definition sentence |
| 15 | how-to-cancel-adobe-subscription-without-fees | 🔴 Missing | add a factual answer under the rant |
| 16 | toggle-switch-ui-design | 🟡 Weak | tighten to a crisp definition |
| 17 | pagination-ui-design | ✅ Strong | none |
| 18 | button-group-guide | ✅ Strong | none |
| 19 | breadcrumbs-ui-design | 🔴 Missing | add a definition before the hook |
| 20 | settings-ui-design | ✅ Strong | none |

Totals: 11 strong, 5 weak, 4 missing.

## Per-post detail

### 1. tabs-ui-design ✅
Current hero has: "Tabs are navigation elements that organize content into separate views without reloading the page." Clean and atomic. No change needed.

### 2. pay-for-claude-pro-with-usdt 🟡
The lead is narrative ("Anthropic accepts credit and debit cards through Stripe..."). The factual answer is present but not framed as a liftable sentence.
Recommended sentence to add as the first line:
> You can pay for Claude Pro with crypto by loading USDT, USDC, or SOL onto a virtual card and using it at Anthropic's Stripe checkout — no KYC required.

### 3. venice-ai-tool-private-uncensored 🟡
Opens promotionally ("Venice.ai has quickly become a go-to platform..."). Answer engines rarely cite marketing tone.
Recommended first sentence:
> Venice.ai is a private, uncensored AI platform that runs text, image, and code models without storing user conversations or applying content filters.

### 4. steps-ui-design ✅
Has: "Steps UI serve as progress indicators, combining labels, states, and connectors to show how far the user has gone and what remains." Strong. No change.

### 5. dropdown-ui-design ✅
Has: "A dropdown is a user interface element that allows users to select one option from a list of available choices." This is the reference standard. No change.

### 6. liquid-glass-design-explained-a-practical-guide ✅
Has: "Liquid glass is not a visual UI trick. It is a material system." Citable. Optional tighten into one positive sentence:
> Liquid glass is a layered material system for interfaces that keeps the background perceptible while keeping foreground content stable and legible.

### 7. guest-posting-opportunities ✅
Has a citable statistic: "it ranks as the third most commonly used link-building method, with nearly half of surveyed SEOs relying on it." Keep it, and add the source name inline (e.g. the survey/study) so engines attribute confidently.

### 8. ai-chat-interface-ui-design ✅
Has: "An AI chat interface is a conversational UI where the second participant is a language model, not a person." Excellent atomic definition. No change.

### 9. filter-ui-design ✅
Has: "A filter is a tool that allows users to refine and limit a dataset or content based on specific criteria." Strong. No change.

### 10. submit-a-guest-post 🟡
This is a landing/guidelines page, not a definitional article, so a component definition doesn't fit. Add one scope sentence so engines can summarize what the page offers:
> Setproduct accepts guest posts on UI design, product design, SaaS, and frontend development from experienced practitioners, following the guidelines below.

### 11. chip-ui-design ✅
Has: "A chip is a small, interactive component that serves as a visual representation of a specific input, attribute, or an action." Strong. No change.

### 12. complete-guide-to-blueprint-grid-design 🔴
Opens with a hook ("You've seen it everywhere..."). No definition up front.
Recommended first sentence (before the hook):
> Blueprint grid design is a background style that renders a fine technical grid — like engineering or graph paper — behind interface content to signal precision and a systematic, developer-oriented aesthetic.

### 13. liquid-glass-vs-glassmorphism 🟡
Comparison post; opens without a crisp distinction. Add one liftable contrast sentence:
> Glassmorphism is a static frosted-glass look built from blur and transparency, while liquid glass is a dynamic material system that reacts to content and motion behind it.

### 14. guest-article-for-web-development 🔴
Opens with narrative ("Every web development company is always looking..."). Add a definition:
> Guest posting for web development companies is the practice of publishing articles on external industry sites to earn backlinks, referral traffic, and authority for a development brand.

### 15. how-to-cancel-adobe-subscription-without-fees 🔴
Opens with an opinion/rant ("Fuck Adobe. No fancy intro here."). This is on-brand and can stay as voice, but bury a citable factual answer immediately after it:
> You can cancel an Adobe Creative Cloud annual plan without the early-termination fee by cancelling within the 14-day refund window, switching to a monthly plan first, or citing a price change — each avoids the standard 50% remaining-term charge.

### 16. toggle-switch-ui-design 🟡
Has a soft opener ("Toggle switches are among the most widely used interactive components..."). Tighten to a definition:
> A toggle switch is a binary control that turns a single setting on or off and applies the change immediately, without a separate save action.

### 17. pagination-ui-design ✅
Has: "Pagination is the process of dividing large sets of content — like search results, product listings, or data tables — into discrete pages." Strong. No change.

### 18. button-group-guide ✅
Has: "A button group is a UI component consisting of multiple buttons which are grouped together to perform related actions." Strong. No change.

### 19. breadcrumbs-ui-design 🔴
Opens with narrative ("Breadcrumbs often sit quietly in the background..."). Add a definition first:
> Breadcrumbs are a secondary navigation element that shows the user's current location within a site's hierarchy and provides one-click links back to each parent level.

### 20. settings-ui-design ✅
Has: "The app settings section is a designated area where users can customize and adjust various preferences, options, or configurations." Strong. No change.

## Implementation guidance

1. Place the citable sentence as the **first sentence of the first paragraph**, or immediately after a one-line hook. Keep it under ~30 words.
2. Use the shape: `[Subject] is/are [category] that [what it does], [optional qualifier].`
3. Avoid pronouns and back-references ("this", "these", "it") in the citable sentence — it must stand alone when quoted out of context.
4. Keep the brand voice; the atomic sentence can sit right after a stylistic opener (see how-to-cancel-adobe example).
5. Do not duplicate the sentence verbatim in the meta description — engines flag near-duplicate boilerplate. Paraphrase between hero and meta.
6. Sentence case per project convention; expand acronyms on first use where the definition benefits (UI, ARIA, etc.).

## Priority order for edits

1. 🔴 Missing (highest impact, currently uncitable): breadcrumbs-ui-design, complete-guide-to-blueprint-grid-design, guest-article-for-web-development, how-to-cancel-adobe-subscription-without-fees.
2. 🟡 Weak (already ranking well, quick wins): pay-for-claude-pro-with-usdt, venice-ai-tool-private-uncensored, liquid-glass-vs-glassmorphism, toggle-switch-ui-design, submit-a-guest-post.
3. ✅ Strong: no action; use these as templates for the rest of the blog.
