# Fix /all Page — Figma Templates & UI Kits

## TL;DR

> **Quick Summary**: Fix the `/all` page to match original `all.html` — add Load More, working FAQ accordion, CTA Subscribe section, fix hero subtitle. Extract reusable pieces.
> 
> **Deliverables**:
> - Working `/all` page matching original layout
> - Interactive FAQ accordion section
> - Load More button on template grid
> - CTA Subscribe section between grid and FAQ
> - FaqSection without inline styles
> - FAQ data for "all" slug
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 2 waves
> **Critical Path**: Task 1 → Task 2 → Task 4 → Task 5 → Final

---

## Context

### Original Request
Fix /all page to match original all.html. Reference /freebies for component structure. FAQ must be interactive. Add Load More. No inline styles. Extract reusable components where possible. Do NOT touch /blog or /freebies.

### Research Findings
- Original all.html structure: breadcrumbs → hero → category tabs → template grid → **CTA subscribe** → **FAQ** (7 items) → footer
- Current CategoryPage is missing: Load More, FAQ data for "all", CTA Subscribe, correct hero subtitle
- `FaqSection` has inline style `style={{ transform: ... }}` — needs Tailwind class
- `HeroSection` uses `heading-style-h6` for subtitle but original uses `heading-style-h5`
- `TemplateGrid` dumps all products — no pagination
- `PAGE_FAQ` has no `"all"` key → FAQ section never renders on /all
- FreebiesListingPage and BlogListingPage both have Load More pattern with `useState(PAGE_SIZE)` + `visibleCount`

---

## Work Objectives

### Core Objective
Make `/all` page fully match original HTML layout with interactive FAQ, Load More pagination, and CTA Subscribe section.

### Concrete Deliverables
- `data/faq.ts` — add `all: COMMON_FAQ` entry
- `components/sections/FaqSection.tsx` — remove inline style, use Tailwind
- `components/sections/TemplateGrid.tsx` — add Load More support
- `components/pages/CategoryPage.tsx` — add CtaSubscribe, pass Load More props
- `components/sections/HeroSection.tsx` — fix subtitle class to match original

### Definition of Done
- [ ] `/all` page shows Load More button, shows 9 products initially, loads more on click
- [ ] FAQ section visible with 7 accordion items, all open/close correctly
- [ ] CTA Subscribe section appears between template grid and FAQ
- [ ] Hero subtitle uses correct CSS class (`heading-style-h5`)
- [ ] No inline styles in FaqSection
- [ ] `/blog` and `/freebies` pages unchanged
- [ ] Other category pages (dashboards, mobile, etc.) still work correctly

### Must Have
- Load More button matching FreebiesListingPage pattern
- All 7 FAQ items from COMMON_FAQ visible and interactive
- CTA Subscribe between grid and FAQ
- No inline styles

### Must NOT Have (Guardrails)
- Do NOT modify BlogListingPage.tsx
- Do NOT modify FreebiesListingPage.tsx or FreebiesListingPage.module.css
- Do NOT add TemplateShowcase to /all (it links TO /all — would be circular)
- Do NOT change product data or product card design
- Do NOT break other category pages (dashboards, mobile, code, dataviz, websites)

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed.

### Test Decision
- **Infrastructure exists**: NO (no test framework found)
- **Automated tests**: None
- **Agent-Executed QA**: YES — Playwright for browser verification

### QA Policy
Every task includes agent-executed QA scenarios. Evidence saved to `.sisyphus/evidence/`.

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — data + shared component fixes):
├── Task 1: Add FAQ data for "all" slug + fix FaqSection inline style [quick]
├── Task 2: Add Load More to TemplateGrid [quick]
└── Task 3: Fix HeroSection subtitle class [quick]

Wave 2 (After Wave 1 — integration):
└── Task 4: Wire everything in CategoryPage [quick]

Wave 3 (After Wave 2 — verification):
└── Task 5: Full QA verification [unspecified-high]

Wave FINAL:
├── F1: Plan compliance audit (oracle)
├── F2: Code quality review (unspecified-high)
├── F3: Real manual QA (unspecified-high)
└── F4: Scope fidelity check (deep)
-> Present results -> Get explicit user okay

Critical Path: Task 1 → Task 4 → Task 5 → F1-F4
Parallel Speedup: Tasks 1-3 all run simultaneously
```

### Dependency Matrix

| Task | Depends On | Blocks |
|------|-----------|--------|
| 1 | — | 4 |
| 2 | — | 4 |
| 3 | — | 4 |
| 4 | 1, 2, 3 | 5 |
| 5 | 4 | F1-F4 |

### Agent Dispatch Summary

- **Wave 1**: 3 tasks — T1 `quick`, T2 `quick`, T3 `quick`
- **Wave 2**: 1 task — T4 `quick`
- **Wave 3**: 1 task — T5 `unspecified-high` + `playwright` skill
- **FINAL**: 4 tasks — F1 `oracle`, F2 `unspecified-high`, F3 `unspecified-high` + `playwright`, F4 `deep`

---

## TODOs

- [ ] 1. Add FAQ data for "all" slug + fix FaqSection inline style

  **What to do**:
  - In `data/faq.ts`: add `all: COMMON_FAQ` to `PAGE_FAQ` record (same 7 items as other pages)
  - In `components/sections/FaqSection.tsx`: replace inline `style={{ transform: openIndex === i ? "rotate(90deg)" : undefined }}` with Tailwind class. Use conditional class: `openIndex === i ? "rotate-90" : ""` on the `.faq_icon-line.is-vertical` div. Remove the `"use client"` directive (this is Pages Router, not needed).

  **Must NOT do**:
  - Do NOT change FAQ question/answer text content
  - Do NOT change FaqSection layout structure or CSS classes

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: Task 4
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `data/faq.ts:61-68` — `PAGE_FAQ` record where "all" key must be added
  - `data/faq.ts:3-32` — `COMMON_FAQ` array (the 7 items to use)
  - `components/sections/FaqSection.tsx:26` — inline style to replace with Tailwind

  **Acceptance Criteria**:
  - [ ] `PAGE_FAQ.all` exists and returns 7 FAQ items
  - [ ] FaqSection has zero inline `style=` attributes
  - [ ] FAQ accordion still opens/closes correctly (rotation via Tailwind `rotate-90` class)

  **QA Scenarios**:

  ```
  Scenario: FAQ data exists for "all" slug
    Tool: Bash (node)
    Steps:
      1. Run: node -e "const {PAGE_FAQ} = require('./data/faq'); console.log(PAGE_FAQ.all?.length)"
      2. Assert output is "7"
    Expected Result: 7
    Evidence: .sisyphus/evidence/task-1-faq-data.txt

  Scenario: No inline styles in FaqSection
    Tool: Bash (grep)
    Steps:
      1. Run: grep -c "style=" components/sections/FaqSection.tsx
      2. Assert output is "0"
    Expected Result: 0 matches
    Evidence: .sisyphus/evidence/task-1-no-inline-styles.txt
  ```

  **Commit**: NO (groups with Task 4)

- [ ] 2. Add Load More support to TemplateGrid

  **What to do**:
  - Modify `components/sections/TemplateGrid.tsx` to accept optional `visibleCount` and `onLoadMore` props
  - When `visibleCount` is provided, slice `products` to show only that many
  - When `onLoadMore` callback is provided AND there are more products to show, render a Load More button after the grid
  - Load More button markup must match FreebiesListingPage pattern exactly: `div.mt-14 > div.main_blog-liist2-btn-wr > a.button-small.outlined.w-inline-block > div.text-size-medium.text-weight-bold "Load More"`
  - When props are NOT provided, render all products (backward compatible — other category pages unaffected)

  **Must NOT do**:
  - Do NOT break existing usage of TemplateGrid (CategoryPage passes products without new props — must still work)
  - Do NOT change TemplateCard component

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3)
  - **Blocks**: Task 4
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `components/sections/TemplateGrid.tsx` — current component (18 lines, no pagination)
  - `components/pages/FreebiesListingPage.tsx:175-190` — Load More button pattern to copy
  - `components/pages/BlogListingPage.tsx:19-26` — another Load More reference

  **API/Type References**:
  - `types/data.ts` — Product type used by TemplateGrid

  **Acceptance Criteria**:
  - [ ] TemplateGrid accepts optional `visibleCount?: number` and `onLoadMore?: () => void` props
  - [ ] When visibleCount=9 and 20+ products exist, only 9 are rendered + Load More button visible
  - [ ] When no visibleCount, all products render (backward compatible)
  - [ ] Load More button CSS classes match: `button-small outlined w-inline-block`

  **QA Scenarios**:

  ```
  Scenario: TemplateGrid backward compatibility
    Tool: Bash (grep)
    Steps:
      1. Run: npx tsc --noEmit
      2. Assert: no type errors
    Expected Result: Clean compilation, zero errors
    Evidence: .sisyphus/evidence/task-2-tsc.txt

  Scenario: Load More button has correct classes
    Tool: Bash (grep)
    Steps:
      1. Run: grep "button-small outlined w-inline-block" components/sections/TemplateGrid.tsx
      2. Assert: at least 1 match
    Expected Result: 1 match found
    Evidence: .sisyphus/evidence/task-2-loadmore-classes.txt
  ```

  **Commit**: NO (groups with Task 4)

- [ ] 3. Fix HeroSection subtitle class

  **What to do**:
  - In `components/sections/HeroSection.tsx`: change `heading-style-h6` to `heading-style-h5` on the subtitle div (line 14)
  - This matches the original all.html which uses `heading-style-h5` for the subtitle
  - Also update the hero description text in `components/pages/CategoryPage.tsx` HERO_DATA.all.description to match original: "Design resources, Tutorials, Ideas & Inspiration"

  **Must NOT do**:
  - Do NOT change HeroSection layout structure
  - Do NOT change hero data for other slugs (dashboards, mobile, etc.) — UNLESS they also use `heading-style-h5` in their original HTML (check: yes, they all do in the original)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2)
  - **Blocks**: Task 4
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `components/sections/HeroSection.tsx:14` — current `heading-style-h6` to change
  - `all.html:133` — original uses `heading-style-h5` for subtitle
  - `components/pages/CategoryPage.tsx:17-20` — HERO_DATA.all with current description text

  **Acceptance Criteria**:
  - [ ] HeroSection uses `heading-style-h5` class for subtitle
  - [ ] HERO_DATA.all.description is "Design resources, Tutorials, Ideas & Inspiration"

  **QA Scenarios**:

  ```
  Scenario: Correct subtitle class
    Tool: Bash (grep)
    Steps:
      1. Run: grep "heading-style-h5" components/sections/HeroSection.tsx
      2. Assert: 1 match
    Expected Result: 1 match for heading-style-h5
    Evidence: .sisyphus/evidence/task-3-hero-class.txt
  ```

  **Commit**: NO (groups with Task 4)

- [ ] 4. Wire everything in CategoryPage — Load More + CtaSubscribe + FAQ

  **What to do**:
  - Import `useState` from React in `components/pages/CategoryPage.tsx`
  - Import `CtaSubscribe` from `../sections/CtaSubscribe`
  - Add `PAGE_SIZE = 9` constant
  - Add `visibleCount` state: `const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)`
  - Reset visibleCount when slug changes (useEffect or key prop)
  - Pass `visibleCount` and `onLoadMore={() => setVisibleCount(c => c + PAGE_SIZE)}` to TemplateGrid
  - Add `<CtaSubscribe />` after the template grid section div, BEFORE `{faq.length > 0 && <FaqSection items={faq} />}`
  - The page structure becomes: SiteHeader → Breadcrumbs → HeroSection → CategoryTabs + TemplateGrid(with Load More) → CtaSubscribe → FaqSection → SiteFooter

  **Must NOT do**:
  - Do NOT add TemplateShowcase to this page (it links TO /all)
  - Do NOT change the routing in [slug].tsx
  - Do NOT change CategoryTabs component

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (sequential)
  - **Blocks**: Task 5
  - **Blocked By**: Tasks 1, 2, 3

  **References**:

  **Pattern References**:
  - `components/pages/CategoryPage.tsx` — file to modify (81 lines)
  - `components/pages/FreebiesListingPage.tsx:15-44` — Load More state pattern (PAGE_SIZE, visibleCount, hasMore)
  - `components/pages/FreebiesListingPage.tsx:203` — CtaSubscribe placement pattern
  - `components/sections/CtaSubscribe.tsx` — import path

  **Acceptance Criteria**:
  - [ ] CategoryPage imports and renders CtaSubscribe
  - [ ] CategoryPage passes visibleCount and onLoadMore to TemplateGrid
  - [ ] Page structure order: Header → Breadcrumbs → Hero → Tabs+Grid+LoadMore → CtaSubscribe → FAQ → Footer
  - [ ] `npx tsc --noEmit` passes with zero errors

  **QA Scenarios**:

  ```
  Scenario: /all page has Load More button
    Tool: Playwright
    Preconditions: Dev server running on localhost:3000
    Steps:
      1. Navigate to http://localhost:3000/all
      2. Count visible template cards (selector: .template-list-item)
      3. Assert: 9 cards visible initially
      4. Find Load More button (selector: a.button-small.outlined)
      5. Click Load More
      6. Count cards again
      7. Assert: more than 9 cards visible now
    Expected Result: Initially 9 cards, after click more cards appear
    Failure Indicators: No Load More button found, or all cards shown at once
    Evidence: .sisyphus/evidence/task-4-loadmore.png

  Scenario: /all page has CTA Subscribe section
    Tool: Playwright
    Preconditions: Dev server running on localhost:3000
    Steps:
      1. Navigate to http://localhost:3000/all
      2. Scroll to bottom
      3. Find element with text "Subscribe to Setproduct"
      4. Assert: element is visible
    Expected Result: CTA Subscribe section visible between grid and FAQ
    Evidence: .sisyphus/evidence/task-4-cta.png

  Scenario: /all page FAQ section works
    Tool: Playwright
    Preconditions: Dev server running on localhost:3000
    Steps:
      1. Navigate to http://localhost:3000/all
      2. Scroll to FAQ section (selector: .faq_wrapper)
      3. Assert: 7 FAQ items visible (selector: .faq_item-wrapper)
      4. Click first FAQ question (selector: .faq_question)
      5. Assert: answer wrapper appears (selector: .faq_answer-wrapper)
      6. Click same question again
      7. Assert: answer wrapper disappears
    Expected Result: 7 FAQ items, accordion open/close works
    Evidence: .sisyphus/evidence/task-4-faq.png

  Scenario: /dashboards page still works (regression)
    Tool: Playwright
    Preconditions: Dev server running on localhost:3000
    Steps:
      1. Navigate to http://localhost:3000/dashboards
      2. Assert: page loads, template cards visible
      3. Assert: FAQ section visible (dashboards has FAQ data)
      4. Assert: CTA Subscribe visible
    Expected Result: No regression on other category pages
    Evidence: .sisyphus/evidence/task-4-regression-dashboards.png

  Scenario: /blog page untouched (regression)
    Tool: Playwright
    Preconditions: Dev server running on localhost:3000
    Steps:
      1. Navigate to http://localhost:3000/blog
      2. Assert: page loads correctly
      3. Assert: blog posts visible
    Expected Result: Blog page works exactly as before
    Evidence: .sisyphus/evidence/task-4-regression-blog.png

  Scenario: /freebies page untouched (regression)
    Tool: Playwright
    Preconditions: Dev server running on localhost:3000
    Steps:
      1. Navigate to http://localhost:3000/freebies
      2. Assert: page loads correctly
      3. Assert: freebie cards visible
    Expected Result: Freebies page works exactly as before
    Evidence: .sisyphus/evidence/task-4-regression-freebies.png
  ```

  **Commit**: YES
  - Message: `fix(all): add Load More, FAQ, CTA Subscribe to /all page`
  - Files: `data/faq.ts`, `components/sections/FaqSection.tsx`, `components/sections/TemplateGrid.tsx`, `components/sections/HeroSection.tsx`, `components/pages/CategoryPage.tsx`
  - Pre-commit: `npx tsc --noEmit`

---

## Final Verification Wave

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists. For each "Must NOT Have": search codebase for forbidden patterns. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `npx tsc --noEmit`. Review all changed files for: inline styles, `as any`, empty catches, console.log. Check no AI slop: excessive comments, over-abstraction.
  Output: `Build [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start dev server. Navigate to /all, /dashboards, /mobile, /code, /dataviz, /websites, /blog, /freebies. Verify each page works. On /all specifically: verify Load More, FAQ accordion, CTA subscribe, hero text. Screenshot evidence.
  Output: `Pages [N/N pass] | /all features [N/N] | Regression [CLEAN/N issues] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  `git diff` all changes. Verify ONLY planned files were modified. Verify BlogListingPage.tsx and FreebiesListingPage.tsx are UNTOUCHED. Flag any unaccounted changes.
  Output: `Files [N/N compliant] | Untouched [CLEAN/N violations] | VERDICT`

---

## Commit Strategy

- After Task 4: `fix(all): add Load More, FAQ, CTA Subscribe to /all page` — all changed files
- Pre-commit: `npx tsc --noEmit`

---

## Success Criteria

### Verification Commands
```bash
npx tsc --noEmit  # Expected: no errors
npm run dev       # Expected: starts without errors
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] /all page matches original layout structure
- [ ] /blog and /freebies pages untouched
- [ ] Other category pages still work
