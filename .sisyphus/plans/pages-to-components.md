# Переделать legacy HTML страницы в React компоненты

## TL;DR

> **Quick Summary**: Заменить `dangerouslySetInnerHTML` pipeline на нативные React компоненты с CSS Modules для 11 root-level страниц.
> **Deliverables**: Shared секции + 11 page компонентов + CSS Modules + TS data files
> **Estimated Effort**: Large
> **Parallel Execution**: YES - 4 waves
> **Critical Path**: Tasks 1-3 → Tasks 4-8 → Tasks 9-19 → F1-F4

---

## Context

### Original Request
Переделать страницы в компоненты в layout'ах, вместо конвертации legacy HTML.

### Current Architecture
- Next.js Pages Router, TypeScript
- `legacy-pages/*.html` → `lib/legacy-page.ts` (regex parsing) → `PageShell.tsx` (`dangerouslySetInnerHTML`)
- `SiteHeader.tsx`, `SiteFooter.tsx`, `ScrollUpButton.tsx` — уже React
- Webflow CSS: normalize + webflow + setproduct.webflow.css + shared

### Interview Decisions
- **Скоуп**: 11 root-level страниц
- **CSS**: CSS Modules
- **Данные**: TS data files
- **Тесты**: Нет, визуальная QA через Playwright

---

## Work Objectives

### Core Objective
Заменить рендеринг 11 root-level страниц: dangerouslySetInnerHTML → React компоненты + CSS Modules.

### Must Have
- Pixel-perfect визуальное соответствие legacy HTML
- SEO meta (title, description, canonical) сохранены
- Все ссылки работают (внутренние + Gumroad)
- Responsive: desktop + mobile
- Inline styles из legacy HTML перенесены в CSS Modules

### Must NOT Have (Guardrails)
- НЕ трогать коллекции (blog/[slug], templates/[slug], freebies/[slug], legal/[slug], dashboard-templates/[slug])
- НЕ удалять legacy-pages/*.html и lib/legacy-page.ts — нужны для коллекций
- НЕ менять SiteHeader.tsx и SiteFooter.tsx
- НЕ добавлять npm зависимости
- НЕ трогать _document.tsx
- НЕ удалять Webflow CSS файлы

---

## Verification Strategy

- **Automated tests**: None
- **QA**: Agent-executed via Playwright — visual comparison + link checks
- **Build**: `next build` + `tsc --noEmit` must pass

---

## Execution Strategy

```
Wave 1 (Foundation):
├── Task 1: Extract data into TS files [deep]
├── Task 2: Shared CSS Module base [quick]
├── Task 3: Update PageShell for dual mode [quick]

Wave 2 (Shared components, after Wave 1):
├── Task 4: Breadcrumbs [quick]
├── Task 5: HeroSection [quick]
├── Task 6: TemplateGrid + ProductCard [unspecified-high]
├── Task 7: FAQ component [quick]
├── Task 8: CTA / Newsletter section [quick]

Wave 3 (Pages, after Wave 2 — MAX PARALLEL):
├── Task 9: HomePage (index) [unspecified-high]
├── Task 10: AllTemplatesPage [unspecified-high]
├── Task 11: DashboardsPage [unspecified-high]
├── Task 12: MobilePage [quick]
├── Task 13: CodePage [quick]
├── Task 14: DatavizPage [quick]
├── Task 15: WebsitesPage [quick]
├── Task 16: BundlePage [unspecified-high]
├── Task 17: FreebiesPage [unspecified-high]
├── Task 18: BlogListingPage [unspecified-high]
├── Task 19: TestimonialsPage [unspecified-high]

Wave FINAL:
├── F1: Plan compliance audit (oracle)
├── F2: Code quality review (unspecified-high)
├── F3: Visual QA all 11 pages (unspecified-high + playwright)
└── F4: Scope fidelity check (deep)
```

---

## TODOs

- [ ] 1. Extract data into TS files

  **What to do**:
  - Проанализировать legacy HTML всех 11 страниц и извлечь структурированные данные
  - Создать `data/products.ts` — массив продуктов с полями: slug, title, description, price, buyHref, image, imageSrcset, categories (array of strings вроде "Dashboards", "Mobile", "Code")
  - Создать `data/faqs.ts` — FAQ записи, сгруппированные по странице (dashboards, mobile и т.д.)
  - Создать `data/testimonials.ts` — отзывы с именем, текстом, аватаром
  - Создать `data/pages-meta.ts` — SEO metadata для каждой страницы (title, description, canonical, ogImage)
  - Данные извлекать из HTML файлов в `legacy-pages/`: index.html, all.html, dashboards.html, mobile.html, code.html, dataviz.html, websites.html, bundle.html, freebies.html, blog.html, testimonials.html
  - Продукты дедуплицировать — один и тот же продукт появляется на нескольких страницах (dashboards + all + code и т.д.), использовать categories для фильтрации

  **Must NOT do**:
  - Не трогать legacy-pages/*.html — только читать
  - Не делать API вызовы — всё статические данные

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: Tasks 6, 7, 8, 9-19
  - **Blocked By**: None

  **References**:
  - `legacy-pages/dashboards.html` — типичная страница с product grid, FAQ, CTA. Продукты в `w-dyn-item` блоках с ссылками, ценами, описаниями, srcset изображениями
  - `legacy-pages/testimonials.html` — карточки отзывов
  - `legacy-pages/index.html` — home page с hero + featured products
  - `legacy-pages/all.html` — полный каталог продуктов
  - `components/layout/SiteHeader.tsx:79-128` — паттерн: KIT_PREVIEWS массив с href, buyHref, buyLabel, image, title, description. Следовать этому паттерну для data files

  **QA Scenarios**:
  ```
  Scenario: Data files compile and export correctly
    Tool: Bash
    Steps:
      1. npx tsc --noEmit
      2. Verify files exist: data/products.ts, data/faqs.ts, data/testimonials.ts, data/pages-meta.ts
    Expected Result: No TypeScript errors, all files present
    Evidence: .sisyphus/evidence/task-1-data-compile.txt

  Scenario: Product data covers all pages
    Tool: Bash
    Steps:
      1. Write a quick script: import products, filter by category "Dashboards", verify count matches legacy HTML product count
    Expected Result: Product count per category matches legacy
    Evidence: .sisyphus/evidence/task-1-data-coverage.txt
  ```

  **Commit**: YES
  - Message: `feat(data): extract product, FAQ, testimonial data into TS files`
  - Files: `data/*.ts`

- [ ] 2. Create shared CSS Module base

  **What to do**:
  - Проанализировать inline `<style>` блоки из `<head>` legacy HTML страниц — они содержат общие overrides (text-style-3lines, text-style-2lines, scrollbar styles, form button hover, font smoothing)
  - Создать `styles/shared.module.css` — общие стили секций (section padding, spacers, containers)
  - Создать `styles/typography.module.css` — текстовые стили (heading-style-h1..h6, text-size-regular/small/tiny/medium/large, text-weight-bold/semibold, text-color-*)
  - Создать `styles/buttons.module.css` — кнопки (button, button-small, button-x-small, outlined, is-text, is-secondary)
  - Создать `styles/grid.module.css` — grid/layout стили (template-list-item, template-list-btn-wr, 2col-cards)
  - Извлечь значения из Webflow CSS файлов: `css/setproduct.webflow.css` и `css/setproduct.webflow.shared.css`
  - CSS Module классы должны соответствовать Webflow классам по визуалу, но использовать camelCase naming

  **Must NOT do**:
  - Не удалять глобальные Webflow CSS файлы (нужны legacy страницам)
  - Не менять _document.tsx

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3)
  - **Blocks**: Tasks 4-8, 9-19
  - **Blocked By**: None

  **References**:
  - `css/setproduct.webflow.css` — основные стили (section, container, heading-style-*, text-size-*, button-*)
  - `css/setproduct.webflow.shared.css` — shared стили
  - `legacy-pages/dashboards.html:12-128` — inline styles в `<head>` с text-style overrides, scrollbar, font smoothing
  - `legacy-pages/index.html:12-80` — аналогичные inline styles

  **QA Scenarios**:
  ```
  Scenario: CSS Module files valid
    Tool: Bash
    Steps:
      1. npx tsc --noEmit
      2. Verify CSS module files exist and are non-empty
    Expected Result: No errors, files present
    Evidence: .sisyphus/evidence/task-2-css-modules.txt
  ```

  **Commit**: YES (group with Task 3)
  - Message: `feat(styles): add shared CSS Modules for sections, typography, buttons, grid`
  - Files: `styles/*.module.css`

- [ ] 3. Update PageShell to support dual rendering mode

  **What to do**:
  - Модифицировать `components/layout/PageShell.tsx` чтобы поддерживать два режима:
    1. Legacy mode (текущий): `contentHtml: string` → `dangerouslySetInnerHTML`
    2. Component mode (новый): `children: ReactNode` → рендерит children
  - Обновить тип `PageShellProps` на union type: `{ contentHtml: string } | { children: ReactNode }`
  - Сохранить обратную совместимость — legacy страницы (collections) продолжают работать

  **Must NOT do**:
  - Не ломать legacy pipeline
  - Не менять SiteHeader/SiteFooter

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2)
  - **Blocks**: Tasks 9-19
  - **Blocked By**: None

  **References**:
  - `components/layout/PageShell.tsx` — текущая реализация (SiteHeader + dangerouslySetInnerHTML + SiteFooter + ScrollUpButton)
  - `components/LegacyPage.tsx` — использует PageShell с contentHtml
  - `pages/index.tsx` — пример использования LegacyPage

  **QA Scenarios**:
  ```
  Scenario: Legacy pages still work after PageShell change
    Tool: Playwright
    Steps:
      1. Start dev server: npm run dev
      2. Navigate to /blog/button-ui-design (legacy collection page)
      3. Assert page loads without error (no 500)
      4. Assert SiteHeader visible (selector: .navbar)
      5. Assert page content visible
    Expected Result: Legacy blog page renders correctly
    Evidence: .sisyphus/evidence/task-3-legacy-compat.png

  Scenario: Component mode renders children
    Tool: Bash
    Steps:
      1. npx tsc --noEmit — verify types work for both modes
    Expected Result: No type errors
    Evidence: .sisyphus/evidence/task-3-types.txt
  ```

  **Commit**: YES (group with Task 2)
  - Message: `refactor(layout): update PageShell to support children alongside legacy contentHtml`
  - Files: `components/layout/PageShell.tsx`

- [ ] 4. Breadcrumbs component

  **What to do**:
  - Создать `components/sections/Breadcrumbs.tsx` + `styles/breadcrumbs.module.css`
  - Props: `items: Array<{ label: string; href?: string }>` — последний элемент без ссылки (текущая страница)
  - Разделитель — иконка стрелки (из legacy HTML, SVG или img `/external/.../Icon.svg`)
  - CSS из Webflow класса `breadcrump-wr`, `breadcrump-icon`, `link-block no-margins`

  **Recommended Agent Profile**: `quick`, Skills: []
  **Parallelization**: Wave 2, parallel with 5-8. Blocked by: 2. Blocks: 9-19.

  **References**:
  - `legacy-pages/dashboards.html:133` — breadcrumbs section: Home > Templates > Dashboards
  - `css/setproduct.webflow.css` — `.breadcrump-wr`, `.breadcrump-icon` стили

  **QA Scenarios**:
  ```
  Scenario: Breadcrumbs render with correct links
    Tool: Bash
    Steps:
      1. npx tsc --noEmit
    Expected Result: Component compiles
    Evidence: .sisyphus/evidence/task-4-breadcrumbs.txt
  ```

  **Commit**: YES (group with Tasks 5-8)

- [ ] 5. HeroSection component

  **What to do**:
  - Создать `components/sections/HeroSection.tsx` + `styles/hero.module.css`
  - Props: `title: string`, `subtitle?: string` (может содержать HTML — rich text из Webflow)
  - Layout: `.heading-left-text-wr.max-width-900` > `h1.heading-style-h1` + `.heading-style-h6` subtitle
  - Для subtitle с HTML использовать dangerouslySetInnerHTML (только для rich text)

  **Recommended Agent Profile**: `quick`, Skills: []
  **Parallelization**: Wave 2, parallel with 4,6-8. Blocked by: 2. Blocks: 9-19.

  **References**:
  - `legacy-pages/dashboards.html:133` — hero section с h1 + subtitle с `<br/>` тегами
  - `legacy-pages/index.html` — hero section на главной (другой layout — может быть с CTA)

  **QA Scenarios**:
  ```
  Scenario: HeroSection renders title and subtitle
    Tool: Bash
    Steps:
      1. npx tsc --noEmit
    Expected Result: No errors
    Evidence: .sisyphus/evidence/task-5-hero.txt
  ```

  **Commit**: YES (group with Tasks 4,6-8)

- [ ] 6. TemplateGrid + ProductCard components

  **What to do**:
  - Создать `components/sections/ProductCard.tsx` + `styles/productCard.module.css`
  - ProductCard props: `product: Product` (из data/products.ts). Рендерит: image с srcset, title, description, Buy button (Gumroad link), Learn More button
  - Создать `components/sections/TemplateGrid.tsx` + `styles/templateGrid.module.css`
  - TemplateGrid props: `products: Product[]`, `filterTabs?: Array<{ label, href, isActive? }>` — опционально табы фильтрации вверху (All, Dashboards, Mobile, Charts, Code, Websites)
  - Layout: filter tabs row + grid из ProductCard items
  - Кнопки: `.button-small` (Buy, primary) + `.button-small.outlined` (Learn More) — оба с SVG arrow icon
  - Image: `.template-list-item-img-wr.is-height-480` > `img.image-cover` с srcset

  **Must NOT do**:
  - Не реализовывать client-side фильтрацию (Finsweet fs-cmsfilter) — только статические табы-ссылки

  **Recommended Agent Profile**: `unspecified-high`, Skills: []
  **Parallelization**: Wave 2, parallel with 4,5,7,8. Blocked by: 1,2. Blocks: 10-17.

  **References**:
  - `legacy-pages/dashboards.html:133-185` — template grid с product cards, filter tabs, Buy/Learn More кнопки
  - `legacy-pages/all.html` — тот же grid но со всеми продуктами
  - `components/layout/SiteHeader.tsx:79-128` — KIT_PREVIEWS паттерн (аналогичные данные)

  **QA Scenarios**:
  ```
  Scenario: ProductCard renders all product fields
    Tool: Bash
    Steps:
      1. npx tsc --noEmit
    Expected Result: No errors
    Evidence: .sisyphus/evidence/task-6-grid.txt
  ```

  **Commit**: YES (group with Tasks 4,5,7,8)

- [ ] 7. FAQ component

  **What to do**:
  - Создать `components/sections/FaqSection.tsx` + `styles/faq.module.css`
  - Props: `items: Array<{ question: string; answer: string }>`, `title?: string`
  - Accordion behavior: click question → toggle answer visibility
  - Icons: plus/minus SVG icons из legacy HTML (`.faq_icon.plus`, `.faq_icon.minus`)
  - CSS: `.faq_item-wrapper`, `.faq_question`, `.faq_answer`, `.faq_answer-wrapper`

  **Recommended Agent Profile**: `quick`, Skills: []
  **Parallelization**: Wave 2, parallel with 4-6,8. Blocked by: 1,2. Blocks: 9-19.

  **References**:
  - `legacy-pages/dashboards.html:185-192` — FAQ section с accordion items, plus/minus SVG icons
  - `data/faqs.ts` (Task 1) — данные FAQ

  **QA Scenarios**:
  ```
  Scenario: FAQ accordion toggles
    Tool: Bash
    Steps:
      1. npx tsc --noEmit
    Expected Result: No errors
    Evidence: .sisyphus/evidence/task-7-faq.txt
  ```

  **Commit**: YES (group with Tasks 4-6,8)

- [ ] 8. CTA / Newsletter section component

  **What to do**:
  - Создать `components/sections/CtaSection.tsx` + `styles/cta.module.css`
  - Reusable CTA block с заголовком + текстом + кнопкой/ссылкой
  - Варианты: простой CTA (title + button) и newsletter-style (уже есть в Footer, но на некоторых страницах есть inline CTA)
  - Props: `title: string`, `description?: string`, `buttonLabel: string`, `buttonHref: string`, `variant?: "default" | "outline"`

  **Recommended Agent Profile**: `quick`, Skills: []
  **Parallelization**: Wave 2, parallel with 4-7. Blocked by: 2. Blocks: 9-19.

  **References**:
  - `legacy-pages/dashboards.html` — CTA section внизу страницы перед footer
  - `legacy-pages/index.html` — CTA на home page

  **QA Scenarios**:
  ```
  Scenario: CTA renders correctly
    Tool: Bash
    Steps:
      1. npx tsc --noEmit
    Expected Result: No errors
    Evidence: .sisyphus/evidence/task-8-cta.txt
  ```

  **Commit**: YES (group with Tasks 4-7)
  - Message: `feat(components): add shared sections — Breadcrumbs, Hero, TemplateGrid, FAQ, CTA`
  - Files: `components/sections/*.tsx`, `styles/*.module.css`

- [ ] 9. HomePage (index)

  **What to do**:
  - Создать `components/pages/HomePage.tsx` + `styles/homePage.module.css`
  - Проанализировать `legacy-pages/index.html` и воспроизвести все секции как React JSX
  - Обновить `pages/index.tsx`: убрать getServerSideProps + LegacyPage, использовать PageShell с children + HomePage компонент
  - SEO: Head с title/description/canonical из `data/pages-meta.ts`
  - Homepage уникальна — hero с featured items, возможно carousel (Splide), showcase секции

  **Must NOT do**: Не реализовывать Splide carousel — заменить статичным grid или оставить как TODO

  **Recommended Agent Profile**: `unspecified-high`, Skills: []
  **Parallelization**: Wave 3, parallel with 10-19. Blocked by: 1-8.

  **References**:
  - `legacy-pages/index.html` — полная структура home page
  - `data/pages-meta.ts` (Task 1) — SEO данные
  - `pages/index.tsx` — текущий файл для замены

  **QA Scenarios**:
  ```
  Scenario: HomePage renders and matches legacy visually
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:3000/
      2. Take full-page screenshot at 1440px width
      3. Assert h1 exists
      4. Assert navigation links in header work
    Expected Result: Page loads, content visible, no errors
    Evidence: .sisyphus/evidence/task-9-homepage.png
  ```

  **Commit**: YES (group with Tasks 10, 11)

- [ ] 10. AllTemplatesPage (all)

  **What to do**:
  - Создать `components/pages/AllTemplatesPage.tsx` + `styles/allTemplatesPage.module.css`
  - Страница "all" — полный каталог продуктов с filter tabs (All, Dashboards, Mobile, Charts, Code, Websites)
  - Использовать TemplateGrid (Task 6) с полным списком products из `data/products.ts`
  - Breadcrumbs: Home > Templates
  - Обновить `pages/[slug].tsx` — добавить специальный case для slug "all" (или создать `pages/all.tsx`)

  **Recommended Agent Profile**: `unspecified-high`, Skills: []
  **Parallelization**: Wave 3, parallel with 9,11-19. Blocked by: 1-8.

  **References**:
  - `legacy-pages/all.html` — полный каталог
  - `components/sections/TemplateGrid.tsx` (Task 6) — grid component
  - `data/products.ts` (Task 1) — все продукты

  **QA Scenarios**:
  ```
  Scenario: All templates page shows all products
    Tool: Playwright
    Steps:
      1. Navigate to /all
      2. Assert TemplateGrid visible
      3. Count product cards — must match total products count
    Expected Result: All products displayed
    Evidence: .sisyphus/evidence/task-10-all.png
  ```

  **Commit**: YES (group with Tasks 9, 11)

- [ ] 11. DashboardsPage

  **What to do**:
  - Создать `components/pages/DashboardsPage.tsx` + `styles/dashboardsPage.module.css`
  - Breadcrumbs > Hero > TemplateGrid (filtered by "Dashboards") > Benefits section (2-column: text + image) > FAQ > CTA
  - Benefits section — уникальная для dashboards: rich text с `<ul>` + image. Создать как inline JSX или отдельный компонент
  - Обновить маршрут в pages/

  **Recommended Agent Profile**: `unspecified-high`, Skills: []
  **Parallelization**: Wave 3, parallel. Blocked by: 1-8.

  **References**:
  - `legacy-pages/dashboards.html` — полная структура: breadcrumbs, hero, product grid, benefits 2-col, FAQ, CTA

  **QA Scenarios**:
  ```
  Scenario: Dashboards page renders all sections
    Tool: Playwright
    Steps:
      1. Navigate to /dashboards
      2. Assert breadcrumbs, hero h1, product grid, FAQ section all visible
    Expected Result: All sections present
    Evidence: .sisyphus/evidence/task-11-dashboards.png
  ```

  **Commit**: YES (group with Tasks 9, 10)
  - Message: `feat(pages): convert index, all, dashboards to React components`

- [ ] 12. MobilePage

  **What to do**:
  - Создать `components/pages/MobilePage.tsx` + CSS Module
  - Структура аналогична DashboardsPage: Breadcrumbs > Hero > TemplateGrid (filtered "Mobile") > Benefits > FAQ
  - Использовать те же shared компоненты, другие данные

  **Recommended Agent Profile**: `quick`, Skills: []
  **Parallelization**: Wave 3, parallel. Blocked by: 1-8.

  **References**: `legacy-pages/mobile.html`

  **QA Scenarios**:
  ```
  Scenario: Mobile page renders
    Tool: Playwright
    Steps:
      1. Navigate to /mobile
      2. Assert content visible, products filtered correctly
    Expected Result: Page renders with mobile products
    Evidence: .sisyphus/evidence/task-12-mobile.png
  ```

  **Commit**: YES (group with 13, 14, 15)

- [ ] 13. CodePage

  **What to do**: Аналогично MobilePage — `components/pages/CodePage.tsx` + CSS Module. TemplateGrid filtered by "Code".
  **Recommended Agent Profile**: `quick`, Skills: []
  **Parallelization**: Wave 3. Blocked by: 1-8.
  **References**: `legacy-pages/code.html`
  **QA Scenarios**: Navigate to /code, assert products visible. Evidence: `.sisyphus/evidence/task-13-code.png`
  **Commit**: YES (group with 12, 14, 15)

- [ ] 14. DatavizPage

  **What to do**: Аналогично — `components/pages/DatavizPage.tsx`. TemplateGrid filtered by "Charts"/"Dataviz".
  **Recommended Agent Profile**: `quick`, Skills: []
  **Parallelization**: Wave 3. Blocked by: 1-8.
  **References**: `legacy-pages/dataviz.html`
  **QA Scenarios**: Navigate to /dataviz, assert products visible. Evidence: `.sisyphus/evidence/task-14-dataviz.png`
  **Commit**: YES (group with 12, 13, 15)

- [ ] 15. WebsitesPage

  **What to do**: Аналогично — `components/pages/WebsitesPage.tsx`. TemplateGrid filtered by "Websites".
  **Recommended Agent Profile**: `quick`, Skills: []
  **Parallelization**: Wave 3. Blocked by: 1-8.
  **References**: `legacy-pages/websites.html`
  **QA Scenarios**: Navigate to /websites, assert products visible. Evidence: `.sisyphus/evidence/task-15-websites.png`
  **Commit**: YES (group with 12, 13, 14)
  - Message: `feat(pages): convert mobile, code, dataviz, websites to React components`

- [ ] 16. BundlePage

  **What to do**:
  - `components/pages/BundlePage.tsx` + CSS Module
  - Bundle — уникальная страница: не grid, а одно предложение bundle со всеми UI кits
  - Проанализировать `legacy-pages/bundle.html` для точной структуры
  - Может содержать: comparison table, pricing tiers, feature list

  **Recommended Agent Profile**: `unspecified-high`, Skills: []
  **Parallelization**: Wave 3. Blocked by: 1-8.
  **References**: `legacy-pages/bundle.html`
  **QA Scenarios**: Navigate to /bundle, assert content visible. Evidence: `.sisyphus/evidence/task-16-bundle.png`
  **Commit**: YES (group with 17)

- [ ] 17. FreebiesPage

  **What to do**:
  - `components/pages/FreebiesPage.tsx` + CSS Module
  - Listing freebies — возможно TemplateGrid или специфичный grid
  - Проанализировать `legacy-pages/freebies.html`

  **Recommended Agent Profile**: `unspecified-high`, Skills: []
  **Parallelization**: Wave 3. Blocked by: 1-8.
  **References**: `legacy-pages/freebies.html`
  **QA Scenarios**: Navigate to /freebies, assert freebie cards visible. Evidence: `.sisyphus/evidence/task-17-freebies.png`
  **Commit**: YES (group with 16)
  - Message: `feat(pages): convert bundle, freebies to React components`

- [ ] 18. BlogListingPage

  **What to do**:
  - `components/pages/BlogListingPage.tsx` + CSS Module
  - Blog listing page (не отдельные статьи!) — grid/list блог-постов с categories filter
  - Проанализировать `legacy-pages/blog.html`
  - Данные блог-постов (title, image, slug, category, description) — в `data/blog-posts.ts`
  - Category tabs как ссылки (не client-side фильтрация)

  **Recommended Agent Profile**: `unspecified-high`, Skills: []
  **Parallelization**: Wave 3. Blocked by: 1-8.
  **References**: `legacy-pages/blog.html`
  **QA Scenarios**: Navigate to /blog (as root page, not collection), assert blog post cards visible. Evidence: `.sisyphus/evidence/task-18-blog.png`
  **Commit**: YES (group with 19)

- [ ] 19. TestimonialsPage

  **What to do**:
  - `components/pages/TestimonialsPage.tsx` + CSS Module
  - Grid/list отзывов из `data/testimonials.ts`
  - Проанализировать `legacy-pages/testimonials.html`
  - Карточки: quote text, author name, avatar/company

  **Recommended Agent Profile**: `unspecified-high`, Skills: []
  **Parallelization**: Wave 3. Blocked by: 1-8.
  **References**: `legacy-pages/testimonials.html`, `data/testimonials.ts` (Task 1)
  **QA Scenarios**: Navigate to /testimonials, assert testimonial cards visible. Evidence: `.sisyphus/evidence/task-19-testimonials.png`
  **Commit**: YES (group with 18)
  - Message: `feat(pages): convert blog listing, testimonials to React components`

---

## Final Verification Wave

- [ ] F1. **Plan Compliance Audit** — `oracle`. Verify all Must Have / Must NOT Have. Check evidence files.
- [ ] F2. **Code Quality Review** — `unspecified-high`. Run tsc + next build. Check for dangerouslySetInnerHTML in new code (FORBIDDEN).
- [ ] F3. **Visual QA** — `unspecified-high` + `playwright`. Screenshot all 11 pages at 1440px + 375px. Check images, links.
- [ ] F4. **Scope Fidelity** — `deep`. Verify legacy pipeline still works. Verify protected files untouched.

---

## Commit Strategy

- Wave 1: `feat(data): extract product and FAQ data into TS files`
- Wave 2: `feat(components): add shared section components`
- Wave 3: commits per 2-3 pages
- Final: `chore: cleanup unused legacy references`

---

## Success Criteria

```bash
npx next build    # Build succeeds
npx tsc --noEmit  # No type errors
```

- [ ] All 11 pages render via React components
- [ ] No dangerouslySetInnerHTML in new code
- [ ] Legacy pipeline works for collections
- [ ] Visual parity with legacy
