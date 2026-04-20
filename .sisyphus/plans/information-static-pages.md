# Конвертация страниц Information в статические компоненты

## TL;DR

> **Quick Summary**: Конвертировать 3 страницы раздела Information (`/testimonials`, `/legal/license`, `/legal/refunds-policy`, плюс `/legal/terms-of-paid-posts` для корректного удаления динамического роута) из подхода `getServerSideProps + LegacyPage` в статические React-компоненты с контентом, точно соответствующим https://www.setproduct.com/.
>
> **Deliverables**:
> - 3 новых компонента в `components/pages/`: `LicensePage.tsx`, `RefundsPolicyPage.tsx`, `TermsOfPaidPostsPage.tsx`
> - 3 новых тонких page-wrapper в `pages/legal/`: `license.tsx`, `refunds-policy.tsx`, `terms-of-paid-posts.tsx`
> - Обновлённый `components/pages/TestimonialsPage.tsx` (замена placeholder на реальные 6 карточек)
> - Новые entries в `data/pages-meta.ts` и `data/breadcrumbs.ts`
> - Удалён `pages/legal/[slug].tsx`
>
> **Estimated Effort**: Medium
> **Parallel Execution**: YES — 3 волны
> **Critical Path**: T1 (pages-meta) → T3/T4/T5/T6 (компоненты) → T7/T8/T9 (wrappers) → T10 (удаление [slug]) → Final Wave

---

## Context

### Original Request
> "переделать страницы раздела Information в статичные компоненты без getServerSideProps и LegacyPage (/testimonials, /legal/license, /legal/refunds-policy). Контент страниц должен строго соответствовать оригинальным на https://www.setproduct.com/"

### Interview Summary

**User Decisions (confirmed)**:
- Конвертировать все 3 legal-страницы (включая `terms-of-paid-posts`) → удалить `pages/legal/[slug].tsx`
- Заменить placeholder в `TestimonialsPage.tsx` реальными 6 карточками из `testimonials.html`
- License TOC: хардкод 7 anchor-ссылок (без Finsweet, без scroll-spy)
- Refunds-policy `data-remodal-target="modal2"` — сохранить атрибут
- Test strategy: только agent-executed QA (Playwright + визуальное сравнение с live)

**Research Findings (ключевое)**:
- `pages/testimonials.tsx` уже тонкая обёртка (5 строк, без getServerSideProps) — менять не нужно, только контент компонента
- `pages/legal/[slug].tsx` — единственный пользователь `getServerSideProps` среди целевых страниц, используется для 3 slug'ов
- Канонический паттерн: `pages/xyz.tsx` (тонкая обёртка) + `components/pages/XyzPage.tsx` (Head + SiteHeader + main + SiteFooter + ScrollUpButton)
- `data/pages-meta.ts` — НЕТ записей для legal-страниц (нужно добавить)
- `data/breadcrumbs.ts` — НЕТ записей для legal-страниц (нужно добавить)

### Metis Review (критичные находки)

**Гаранты от Metis, отразить в guardrails**:

1. 🔴 `LegacyPage.tsx` / `PageShell.tsx` / `lib/legacy-page.ts` — **НЕЛЬЗЯ удалять**. После удаления `pages/legal/[slug].tsx` остаются 3 активных потребителя: `pages/[slug].tsx`, `pages/templates/[slug].tsx`, `pages/dashboard-templates/[slug].tsx`. Каскад: `lib/legacy-collections.ts` импортирует `lib/legacy-page.ts`; `PageShell.tsx` используется только в `LegacyPage.tsx`.
2. 🔴 Testimonials — это `.avif` скриншоты в Webflow-lightbox, **не** структурированные карточки с автором/цитатой. Рендерить как img-grid с `<a>`-wrapper (без JS-lightbox).
3. 🔴 h2 в `legacy-pages/legal/license.html` не имеют `id=` атрибутов — их нужно добавить вручную в JSX.
4. 🔴 В `legacy-pages/legal/refunds-policy.html` `href="https://www.setproduct.com/legal/refunds-policy"` приведёт к навигации на ту же страницу. Нужно заменить на `href="#"`.

---

## Work Objectives

### Core Objective
Переделать раздел Information (`/testimonials`, `/legal/license`, `/legal/refunds-policy`, `/legal/terms-of-paid-posts`) на статические React-компоненты без `getServerSideProps` и без `LegacyPage`, сохранив контент строго соответствующим https://www.setproduct.com/.

### Concrete Deliverables

**Новые файлы**:
- `components/pages/LicensePage.tsx` — полный статический компонент страницы License
- `components/pages/RefundsPolicyPage.tsx` — статический компонент Refunds Policy
- `components/pages/TermsOfPaidPostsPage.tsx` — статический компонент Terms of Paid Posts
- `pages/legal/license.tsx` — тонкая обёртка (5 строк)
- `pages/legal/refunds-policy.tsx` — тонкая обёртка (5 строк)
- `pages/legal/terms-of-paid-posts.tsx` — тонкая обёртка (5 строк)

**Изменённые файлы**:
- `components/pages/TestimonialsPage.tsx` — замена placeholder на 6 реальных карточек
- `data/pages-meta.ts` — добавлены 3 записи: `license`, `refunds-policy`, `terms-of-paid-posts`
- `data/breadcrumbs.ts` — добавлены 3 записи (2-уровневые: Home > Page)

**Удалённые файлы**:
- `pages/legal/[slug].tsx` — динамический роут больше не нужен

### Definition of Done
- [ ] `bun run build` проходит без ошибок (`tsc --noEmit` + next build)
- [ ] Playwright открывает каждую из 4 страниц — DOM содержит реальный контент (не placeholder)
- [ ] Текст h1/подзаголовка каждой страницы совпадает с live `https://www.setproduct.com/{path}`
- [ ] `/legal/unknown-slug` возвращает 404 (подтверждает, что [slug].tsx удалён чисто)
- [ ] Ни одна страница `/pages/[slug].tsx`, `/pages/templates/[slug].tsx`, `/pages/dashboard-templates/[slug].tsx` не затронута изменениями

### Must Have
- Все 4 целевые страницы работают без `getServerSideProps`
- Контент legal-страниц (h1, подзаголовки, rich-text) совпадает с оригиналом из `legacy-pages/legal/*.html`
- TestimonialsPage рендерит 6 реальных .avif карточек
- License TOC содержит 7 anchor-ссылок, каждая h2 имеет соответствующий `id`
- Breadcrumb на каждой странице: `Home > {PageTitle}`
- Metadata (title, description, canonical, ogImage) установлены через `PAGE_META`
- В refunds-policy `<a href="#" data-remodal-target="modal2">contact us</a>` (href перезаписан с полного URL на `#`)

### Must NOT Have (Guardrails)

**АБСОЛЮТНЫЕ ЗАПРЕТЫ (несоблюдение = REJECT)**:

- **НЕ удалять** `components/LegacyPage.tsx` — используется в 3 других динамических роутах
- **НЕ удалять** `components/layout/PageShell.tsx` — зависимость `LegacyPage.tsx`
- **НЕ удалять** `lib/legacy-page.ts` — используется в `lib/legacy-collections.ts` → `pages/[slug].tsx`
- **НЕ изменять** `pages/[slug].tsx`, `pages/templates/[slug].tsx`, `pages/dashboard-templates/[slug].tsx`
- **НЕ изменять** `pages/testimonials.tsx` — уже в целевом состоянии (тонкая обёртка)
- **НЕ изменять** `components/CtaSubscribe.tsx` — содержит сломанную ссылку на `/legal/terms-and-conditions`, это pre-existing bug, вне scope
- **НЕ добавлять** ссылку на `/legal/terms-of-paid-posts` в `SiteFooter.tsx` — на live-сайте её тоже нет
- **НЕ изменять** `public/sitemap.xml` — все 4 URL уже присутствуют
- **НЕ использовать** `getServerSideProps`, `getStaticProps`, `getStaticPaths` в новых файлах
- **НЕ использовать** `dangerouslySetInnerHTML` для main-контента новых страниц (допустимо только для inline-fragments типа spans если необходимо — но предпочтительно писать полный JSX)
- **НЕ вводить** новые npm зависимости (lightbox libs, TOC libs и т.п.) — только существующий стек
- **НЕ менять** глобальные стили, classes Webflow — использовать существующие CSS-классы как есть

**AI-slop запреты**:
- НЕ оборачивать каждый блок в дополнительный компонент ради абстракции
- НЕ генерировать TSDoc/JSDoc для статических контент-компонентов
- НЕ создавать новые types/interfaces если не требуется
- НЕ оптимизировать преждевременно (не нужен React.memo, useMemo и т.п. для статики)

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — все проверки выполняются агентом. Human не участвует.

### Test Decision
- **Infrastructure exists**: нет (в проекте нет unit/integration-тестов по данным исследования)
- **Automated tests**: None (unit-тесты — вне scope; статический контент не требует их)
- **Framework**: Agent-executed QA через Playwright

### QA Policy
Каждая задача включает agent-executed QA scenarios. Evidence сохраняется в `.sisyphus/evidence/task-{N}-{slug}.{ext}`.

- **UI pages** → Playwright (skill: `playwright`) — navigate, DOM assert, screenshot
- **Type/Config changes** → Bash (`tsc --noEmit`, `bun run build`) — validate compilation
- **Routing changes** → Playwright + curl — verify 200/404 statuses

**Сервер разработки**: Запуск через `bun run dev` (порт 3000 по умолчанию). Перед QA-сценариями агент запускает dev-сервер и ожидает ready-сигнал.

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (foundation — старт немедленно):
├── T1: Добавить entries в data/pages-meta.ts [quick]
└── T2: Добавить entries в data/breadcrumbs.ts [quick]

Wave 2 (после T1+T2 — компоненты страниц, параллельно):
├── T3: components/pages/LicensePage.tsx (depends: T1, T2) [unspecified-high]
├── T4: components/pages/RefundsPolicyPage.tsx (depends: T1, T2) [quick]
├── T5: components/pages/TermsOfPaidPostsPage.tsx (depends: T1, T2) [unspecified-high]
└── T6: Обновить TestimonialsPage.tsx (depends: T1) [quick]

Wave 3 (после Wave 2 — route-wrappers + удаление):
├── T7: pages/legal/license.tsx (depends: T3) [quick]
├── T8: pages/legal/refunds-policy.tsx (depends: T4) [quick]
├── T9: pages/legal/terms-of-paid-posts.tsx (depends: T5) [quick]
└── T10: Удалить pages/legal/[slug].tsx (depends: T7, T8, T9) [quick]

Wave FINAL (после всех задач — 4 параллельных ревью):
├── F1: Plan compliance audit (oracle)
├── F2: Code quality review (unspecified-high)
├── F3: Real manual QA (unspecified-high + playwright)
└── F4: Scope fidelity check (deep)
→ Presenting results → ожидание явного "okay" от user

Critical Path: T1 → T3 → T7 → T10 → F1-F4 → user okay
Parallel Speedup: ~55% vs sequential
Max Concurrent: 4 (Wave 2)
```

### Dependency Matrix

| Task | Depends On | Blocks |
|------|------------|--------|
| T1 | — | T3, T4, T5, T6 |
| T2 | — | T3, T4, T5 |
| T3 | T1, T2 | T7 |
| T4 | T1, T2 | T8 |
| T5 | T1, T2 | T9 |
| T6 | T1 | — (уже имеет wrapper) |
| T7 | T3 | T10 |
| T8 | T4 | T10 |
| T9 | T5 | T10 |
| T10 | T7, T8, T9 | Final Wave |

### Agent Dispatch Summary

- **Wave 1**: 2 tasks — T1-T2 → `quick` (простая добавка entries)
- **Wave 2**: 4 tasks — T3 → `unspecified-high` (двухколоночный layout с 7 секциями), T4 → `quick` (короткий rich-text), T5 → `unspecified-high` (10-пунктный ordered list), T6 → `quick` (6 карточек)
- **Wave 3**: 4 tasks — T7-T9 → `quick` (5 строк каждый), T10 → `quick` (удаление файла)
- **Final Wave**: 4 tasks — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep`

---

## TODOs

- [ ] 1. **Добавить PAGE_META entries для legal-страниц**

  **What to do**:
  - Открыть `data/pages-meta.ts`
  - Добавить 3 новых ключа в объект `PAGE_META`: `"license"`, `"refunds-policy"`, `"terms-of-paid-posts"`
  - Каждая запись должна содержать все 4 обязательных поля `PageMeta`: `title`, `description`, `ogImage`, `canonical`
  - Значения `title`, `description`, `canonical` — точно как в `<head>` соответствующего `legacy-pages/legal/*.html`
  - `ogImage` — скопировать значение из `PAGE_META.testimonials.ogImage` (использовать тот же generic Setproduct OG-image)
  - **Ключ — flat slug без префикса** (НЕ `"legal/license"`, а `"license"`)

  **Exact values to use** (извлечено из `legacy-pages/legal/*.html`):

  ```ts
  "license": {
    title: "Setproduct licensing agreement",
    description: "Choose an Individual license for single use or a Business license for unlimited users. Get the right license for your needs and make the most of our products.",
    ogImage: PAGE_META.testimonials.ogImage,  // или идентичный URL строкой
    canonical: "https://www.setproduct.com/legal/license",
  },
  "refunds-policy": {
    title: "Refunds policy - Setproduct UI kits and design systems",
    description: "Our refund policy ensures 100% customer satisfaction. Learn more about our easy and hassle-free refund process here.",
    ogImage: PAGE_META.testimonials.ogImage,
    canonical: "https://www.setproduct.com/legal/refunds-policy",
  },
  "terms-of-paid-posts": {
    title: "Terms of Service for Advertisement Paid Posts on Setproduct Design Blog",
    description: "By utilizing the Advertisement Paid Post feature on Setproduct Design Blog, you agree to the terms outlined below.",
    ogImage: PAGE_META.testimonials.ogImage,
    canonical: "https://www.setproduct.com/legal/terms-of-paid-posts",
  },
  ```

  **Must NOT do**:
  - НЕ изменять существующие записи
  - НЕ добавлять новых опциональных полей в тип `PageMeta`
  - НЕ использовать ключи с `/` внутри

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Простая добавка записей в объект, один файл, ~30 строк
  - **Skills**: []
    - Нет необходимости — trivial edit

  **Parallelization**:
  - **Can Run In Parallel**: YES (параллельно с T2)
  - **Parallel Group**: Wave 1 (с T2)
  - **Blocks**: T3, T4, T5, T6
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `data/pages-meta.ts:PAGE_META.testimonials` — использовать как образец структуры записи (все 4 поля)

  **Source References** (источники точных значений):
  - `legacy-pages/legal/license.html` строки 1-20 — `<title>` и `<meta name="description">` для License
  - `legacy-pages/legal/refunds-policy.html` строки 1-20 — metadata для Refunds Policy
  - `legacy-pages/legal/terms-of-paid-posts.html` строки 1-20 — metadata для Terms of Paid Posts

  **Type References**:
  - `types/data.ts:PageMeta` — тип записи (title, description, ogImage, canonical — все required)

  **WHY**: Metadata централизована в `PAGE_META`, каждый новый компонент читает `PAGE_META[key]`. Без этих записей новые компоненты не смогут получить metadata и будет `undefined`-ошибка.

  **Acceptance Criteria**:
  - [ ] `tsc --noEmit` проходит без ошибок после изменений
  - [ ] `grep -c "^  \"" data/pages-meta.ts` увеличилось на 3 по сравнению с baseline
  - [ ] В объекте есть ключи `"license"`, `"refunds-policy"`, `"terms-of-paid-posts"`

  **QA Scenarios**:

  ```
  Scenario: TypeScript компиляция с новыми entries
    Tool: Bash
    Preconditions: Изменения внесены в data/pages-meta.ts
    Steps:
      1. Запустить: bunx tsc --noEmit
      2. Assert exit code === 0
      3. Assert stdout не содержит "error TS"
    Expected Result: Exit code 0, нет TS-ошибок
    Failure Indicators: Ошибка "Object literal may only specify known properties" или missing required field
    Evidence: .sisyphus/evidence/task-1-tsc-check.txt

  Scenario: Все 3 ключа существуют и содержат правильные поля
    Tool: Bash (node)
    Preconditions: T1 выполнена
    Steps:
      1. Запустить: node -e "const m=require('./data/pages-meta.ts'); console.log(JSON.stringify(Object.keys(m.PAGE_META)))"
         (или читать файл grep'ом если .ts не исполняется напрямую)
      2. Assert вывод содержит "license", "refunds-policy", "terms-of-paid-posts"
      3. Для каждого ключа: assert что title, description, ogImage, canonical — непустые строки
    Expected Result: 3 новых ключа присутствуют, каждый имеет 4 непустых поля
    Evidence: .sisyphus/evidence/task-1-keys-check.txt
  ```

  **Commit**: YES
  - Message: `feat(data): add PAGE_META entries for legal pages`
  - Files: `data/pages-meta.ts`
  - Pre-commit: `bunx tsc --noEmit`

- [ ] 2. **Добавить breadcrumbs entries для legal-страниц**

  **What to do**:
  - Открыть `data/breadcrumbs.ts`
  - Добавить 3 новых ключа в `PAGE_BREADCRUMBS`: `"license"`, `"refunds-policy"`, `"terms-of-paid-posts"`
  - Структура — 2 уровня: `Home > {PageName}` (без промежуточного "Legal" уровня, потому что `pages/legal/index.tsx` не существует и ссылка вела бы на 404)
  - Последний элемент каждого массива — **без `href`** (активная страница)

  **Exact values**:

  ```ts
  "license": [
    { label: "Home", href: "/" },
    { label: "License" },
  ],
  "refunds-policy": [
    { label: "Home", href: "/" },
    { label: "Refunds policy" },
  ],
  "terms-of-paid-posts": [
    { label: "Home", href: "/" },
    { label: "Paid posts terms of service" },
  ],
  ```

  **Must NOT do**:
  - НЕ добавлять промежуточный "Legal" crumb (`pages/legal/index.tsx` не существует)
  - НЕ указывать `href` для последнего элемента (активная страница)
  - НЕ менять существующие записи

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Trivial edit одного файла, ~15 строк
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (параллельно с T1)
  - **Parallel Group**: Wave 1 (с T1)
  - **Blocks**: T3, T4, T5
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `data/breadcrumbs.ts:PAGE_BREADCRUMBS.testimonials` (строка 13) — образец 2-уровневого breadcrumb

  **Type References**:
  - `types/data.ts:BreadcrumbItem` (строка 8-11) — `{ label: string; href?: string }`

  **WHY**: Компоненты `LicensePage`/`RefundsPolicyPage`/`TermsOfPaidPostsPage` рендерят `<Breadcrumbs items={PAGE_BREADCRUMBS[key]} />`. Без записи — `.items` станет `undefined` и компонент не отрендерится (или упадёт).

  **Acceptance Criteria**:
  - [ ] `tsc --noEmit` проходит
  - [ ] 3 новых ключа присутствуют в объекте
  - [ ] Каждый массив содержит ровно 2 элемента
  - [ ] Первый элемент каждого массива = `{ label: "Home", href: "/" }`
  - [ ] Последний элемент каждого массива не содержит `href`

  **QA Scenarios**:

  ```
  Scenario: Структура breadcrumbs корректна
    Tool: Bash (grep + node)
    Preconditions: T2 выполнена
    Steps:
      1. Проверить: grep -q '"license":' data/breadcrumbs.ts && grep -q '"refunds-policy":' data/breadcrumbs.ts && grep -q '"terms-of-paid-posts":' data/breadcrumbs.ts
      2. Assert exit code === 0
      3. Для каждого ключа: визуально убедиться что первый item имеет href="/", последний — без href
    Expected Result: все 3 ключа существуют, структура правильная
    Evidence: .sisyphus/evidence/task-2-breadcrumbs-check.txt
  ```

  **Commit**: YES
  - Message: `feat(data): add breadcrumbs entries for legal pages`
  - Files: `data/breadcrumbs.ts`
  - Pre-commit: `bunx tsc --noEmit`

- [ ] 3. **Создать components/pages/LicensePage.tsx (статический компонент License)**

  **What to do**:
  - Создать файл `components/pages/LicensePage.tsx`
  - Следовать каноническому паттерну (см. `components/pages/TestimonialsPage.tsx` как reference)
  - Структура компонента:
    - `<Head>` с `title`, `description`, `canonical` из `PAGE_META.license`
    - `<SiteHeader />`
    - `<main>` содержащий:
      - `<Breadcrumbs items={PAGE_BREADCRUMBS.license} />`
      - Hero-секция: `<h1 class="heading-style-h1">Licensing terms</h1>` + `<div class="heading-style-h5">Pick an Individual license for single use, or Business for the unlimited amount of users</div>`
      - Двухколоночный layout `<div class="blogpost_content-section">`:
        - Левая колонка `<div class="blogpost_content-column1">` — **хардкод TOC из 7 anchor-ссылок** на h2-секции
        - Правая колонка `<div class="blogpost_content-column2">` с `<div class="rich-text-18 w-richtext">` — полный rich-text
      - Секция `<TemplateShowcase />` (опционально, НЕ ОБЯЗАТЕЛЬНО — см. decision ниже)
    - `<SiteFooter />`
    - `<ScrollUpButton />`

  **Контент rich-text (7 h2-секций)** — извлечь ТОЧНО из `legacy-pages/legal/license.html` (строки 436-458):
  1. Intro-параграфы (без h2)
  2. `<h2 id="end-product">An end product is one of the following</h2>`
  3. `<h2 id="you-are-allowed-to">You are allowed to</h2>` — bullet-список с ✔
  4. `<h2 id="you-are-not-allowed-to">You are not allowed to</h2>` — bullet-список с ✘
  5. `<h2 id="other-license-terms">Other license terms</h2>`
  6. `<h2 id="individual-license">Individual (Single license)</h2>`
  7. `<h2 id="business-license">Business (Unlimited)</h2>`

  **Anchor IDs (применить slugify к тексту заголовков)**:
  - `#end-product`, `#you-are-allowed-to`, `#you-are-not-allowed-to`, `#other-license-terms`, `#individual-license`, `#business-license`
  - (Первая секция — intro без h2 — TOC не нуждается в этом anchor)
  - Если секций для TOC 6 (intro не считается) — хардкодить 6 ссылок, а не 7

  **Must NOT do**:
  - НЕ использовать `dangerouslySetInnerHTML` для rich-text (писать полный JSX с `<p>`, `<ul>`, `<li>`)
  - НЕ добавлять Finsweet TOC (`fs-toc-element`)
  - НЕ добавлять scroll-spy JavaScript
  - НЕ менять существующие CSS-классы Webflow (использовать `className="blogpost_content-section"` и т.п. как есть)
  - НЕ добавлять `getServerSideProps` / `getStaticProps` / `getStaticPaths`
  - НЕ добавлять `<TemplateShowcase />` если его нет в других конвертированных legal-подобных страницах (default: НЕ добавлять, так как основная задача — content match, не повторение карусели)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Длинный rich-text (7 секций, ~80 строк контента) + двухколоночный layout + TOC. Не trivial.
  - **Skills**: []
    - Нет специфичных skills нужных

  **Parallelization**:
  - **Can Run In Parallel**: YES (с T4, T5, T6)
  - **Parallel Group**: Wave 2 (с T4, T5, T6)
  - **Blocks**: T7
  - **Blocked By**: T1, T2

  **References**:

  **Pattern References**:
  - `components/pages/TestimonialsPage.tsx` (42 строки) — канонический паттерн: Head + SiteHeader + main + SiteFooter + ScrollUpButton
  - `components/pages/HomePage.tsx` — более сложный пример с множественными секциями

  **Content References** (источник ТОЧНОГО текста):
  - `legacy-pages/legal/license.html` строки 408-463 — главная content-секция с двумя колонками
  - `legacy-pages/legal/license.html` строки 436-458 — rich-text с 7 h2
  - `legacy-pages/legal/license.html` строки 410-416 — hero-секция (h1 + subtitle)

  **Component References**:
  - `components/layout/SiteHeader.tsx`
  - `components/layout/SiteFooter.tsx`
  - `components/layout/ScrollUpButton.tsx`
  - `components/sections/Breadcrumbs.tsx` — принимает prop `items` типа `BreadcrumbItem[]`

  **Data References**:
  - `data/pages-meta.ts:PAGE_META.license` (созданный в T1)
  - `data/breadcrumbs.ts:PAGE_BREADCRUMBS.license` (созданный в T2)

  **External References**:
  - Live page: `https://www.setproduct.com/legal/license` — конечный эталон визуального соответствия

  **WHY References Matter**:
  - TestimonialsPage.tsx — самый близкий working reference для статического паттерна; копировать imports и структуру дословно
  - license.html содержит rich-text контент, который нужно перенести дословно (без изменения формулировок)
  - live setproduct.com — final visual comparison в QA

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: Страница /legal/license рендерится и содержит весь нужный контент
    Tool: Playwright (skill: playwright)
    Preconditions: Dev-сервер запущен (bun run dev); T3+T7 выполнены; T1+T2 выполнены
    Steps:
      1. Navigate: http://localhost:3000/legal/license
      2. Wait for: h1 visible, timeout 10s
      3. Assert page.title() === "Setproduct licensing agreement"
      4. Assert document.querySelector('h1').textContent.trim() === "Licensing terms"
      5. Assert document.querySelectorAll('h2').length >= 6  (6 anchor-секций + опционально 7-я)
      6. Assert document.querySelector('h2[id="individual-license"]') !== null
      7. Assert document.querySelector('h2[id="business-license"]') !== null
      8. Assert document.querySelector('.blogpost_content-section') !== null (двухколоночный layout)
      9. Screenshot: .sisyphus/evidence/task-3-license-rendered.png (full page, viewport 1440x900)
    Expected Result: Все assertions passed, screenshot сохранён
    Failure Indicators: h1 отсутствует, или h2 id не найден, или использует LegacyPage (проверить: в HTML не должно быть класса, специфичного для LegacyPage — main не должно иметь dangerouslySetInnerHTML)
    Evidence: .sisyphus/evidence/task-3-license-rendered.png

  Scenario: TOC anchor работает (клик → scroll к h2)
    Tool: Playwright
    Preconditions: T3+T7 выполнены
    Steps:
      1. Navigate: http://localhost:3000/legal/license
      2. Click: a[href="#individual-license"]  (в TOC-сайдбаре)
      3. Assert URL после клика: http://localhost:3000/legal/license#individual-license
      4. Assert document.querySelector('h2[id="individual-license"]').getBoundingClientRect().top близок к 0 (scroll сработал, ±100px)
      5. Screenshot после scroll: .sisyphus/evidence/task-3-license-anchor.png
    Expected Result: URL содержит хеш, scroll к нужной h2 произошёл
    Evidence: .sisyphus/evidence/task-3-license-anchor.png

  Scenario: Визуальное сравнение с live-сайтом
    Tool: Playwright
    Preconditions: T3+T7 выполнены, dev-сервер запущен
    Steps:
      1. Navigate: https://www.setproduct.com/legal/license
      2. Screenshot (viewport 1440x900): .sisyphus/evidence/task-3-license-live.png
      3. Navigate: http://localhost:3000/legal/license
      4. Screenshot (viewport 1440x900): .sisyphus/evidence/task-3-license-local.png
      5. Assert: оба screenshot показывают одинаковый h1, те же 7 h2-заголовков в том же порядке, с тем же текстом
    Expected Result: Контент визуально соответствует — h1/h2/параграфы совпадают
    Failure Indicators: Отсутствует h2, перепутан порядок, текст отличается
    Evidence: .sisyphus/evidence/task-3-license-live.png + .sisyphus/evidence/task-3-license-local.png
  ```

  **Commit**: YES
  - Message: `feat(legal): add static LicensePage component`
  - Files: `components/pages/LicensePage.tsx`
  - Pre-commit: `bunx tsc --noEmit`

- [ ] 4. **Создать components/pages/RefundsPolicyPage.tsx**

  **What to do**:
  - Создать файл `components/pages/RefundsPolicyPage.tsx`
  - Структура (простая — одна секция):
    - `<Head>` с metadata из `PAGE_META["refunds-policy"]`
    - `<SiteHeader />`
    - `<main>`:
      - `<Breadcrumbs items={PAGE_BREADCRUMBS["refunds-policy"]} />`
      - Секция: `<div class="section"><div class="section-padding top-80 bottom-80"><div class="container">`
      - Wrapper: `<div class="freebies_rich-text-component"><div class="rich-text-18 w-richtext">`
      - `<h1>Refunds policy</h1>`
      - 2 параграфа (см. точный текст ниже)
    - `<SiteFooter />`
    - `<ScrollUpButton />`

  **Contact-link fix (КРИТИЧНО — от Metis)**:
  В оригинальном HTML: `<a data-remodal-target="modal2" href="https://www.setproduct.com/legal/refunds-policy">contact us</a>`
  В новом JSX:

  ```tsx
  <a data-remodal-target="modal2" href="#">contact us</a>
  ```

  **Причина**: `href="https://www.setproduct.com/legal/refunds-policy"` приведёт к перезагрузке на ту же страницу и сломает modal.

  **Text content (дословно из `legacy-pages/legal/refunds-policy.html` строки 413-415)**:

  > If you're not satisfied with the product you've purchased — [contact us](#) and provide a trustworthy explanation of why you changed your mind. We do not proceed with a refund for a Design Bundle or Subscription. Due to the essence of the digital products, we can't verify you stopped using our assets and deleted it.
  >
  > For a single purchase, we may issue a refund or decline. It depends on a variety of circumstances, you have to explain in details before asking for a refund. Each situation is reviewing by our team independently and you'll be notified about our decision within 30 business days.

  **Must NOT do**:
  - НЕ использовать `dangerouslySetInnerHTML`
  - НЕ оставлять `href="https://www.setproduct.com/legal/refunds-policy"` в contact-link (заменить на `#`)
  - НЕ убирать `data-remodal-target="modal2"`
  - НЕ добавлять `getServerSideProps`
  - НЕ добавлять TOC (на оригинале нет)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Короткий контент (2 параграфа), одна секция, ~40 строк кода
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (с T3, T5, T6)
  - **Blocks**: T8
  - **Blocked By**: T1, T2

  **References**:

  **Pattern References**:
  - `components/pages/TestimonialsPage.tsx` — канонический паттерн

  **Content References**:
  - `legacy-pages/legal/refunds-policy.html` строки 408-420 — полный content-блок

  **Data References**:
  - `data/pages-meta.ts:PAGE_META["refunds-policy"]`
  - `data/breadcrumbs.ts:PAGE_BREADCRUMBS["refunds-policy"]`

  **External References**:
  - Live: `https://www.setproduct.com/legal/refunds-policy`

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: /legal/refunds-policy рендерится
    Tool: Playwright
    Preconditions: Dev-сервер запущен, T4+T8 выполнены
    Steps:
      1. Navigate: http://localhost:3000/legal/refunds-policy
      2. Wait: h1 visible
      3. Assert page.title() === "Refunds policy - Setproduct UI kits and design systems"
      4. Assert document.querySelector('h1').textContent.trim() === "Refunds policy"
      5. Assert page text contains "within 30 business days"
      6. Assert page text contains "Design Bundle or Subscription"
      7. Screenshot: .sisyphus/evidence/task-4-refunds-rendered.png
    Expected Result: h1 + оба параграфа присутствуют
    Evidence: .sisyphus/evidence/task-4-refunds-rendered.png

  Scenario: Contact-link имеет правильные атрибуты
    Tool: Playwright
    Preconditions: T4+T8 выполнены
    Steps:
      1. Navigate: http://localhost:3000/legal/refunds-policy
      2. Найти link с текстом "contact us": const link = await page.locator('a', { hasText: 'contact us' }).first()
      3. Assert await link.getAttribute('data-remodal-target') === "modal2"
      4. Assert await link.getAttribute('href') === "#"  (НЕ полный URL)
    Expected Result: data-remodal-target сохранён, href="#" (не полный URL)
    Failure Indicators: href содержит "setproduct.com" — значит fix не применён
    Evidence: .sisyphus/evidence/task-4-contact-link.txt

  Scenario: Визуальное сравнение с live
    Tool: Playwright
    Preconditions: T4+T8 выполнены
    Steps:
      1. Screenshot live: https://www.setproduct.com/legal/refunds-policy → task-4-refunds-live.png
      2. Screenshot local: http://localhost:3000/legal/refunds-policy → task-4-refunds-local.png
      3. Assert: h1, оба параграфа одинаковы по тексту
    Expected Result: Контент совпадает
    Evidence: task-4-refunds-live.png + task-4-refunds-local.png
  ```

  **Commit**: YES
  - Message: `feat(legal): add static RefundsPolicyPage component`
  - Files: `components/pages/RefundsPolicyPage.tsx`
  - Pre-commit: `bunx tsc --noEmit`

- [ ] 5. **Создать components/pages/TermsOfPaidPostsPage.tsx**

  **What to do**:
  - Создать файл `components/pages/TermsOfPaidPostsPage.tsx`
  - Структура:
    - `<Head>` с metadata из `PAGE_META["terms-of-paid-posts"]`
    - `<SiteHeader />`
    - `<main>`:
      - `<Breadcrumbs items={PAGE_BREADCRUMBS["terms-of-paid-posts"]} />`
      - Секция `<div class="section"><div class="section-padding top-80 bottom-80"><div class="container">`
      - `<div class="freebies_rich-text-component"><div class="rich-text-18 w-richtext">`
      - `<h1>Paid posts terms of service</h1>`
      - Intro-параграф с ссылкой на Gumroad paid post
      - `<ol>` с 10 пунктами (см. точный список ниже)
      - Closing-параграф
    - `<SiteFooter />`
    - `<ScrollUpButton />`

  **Контент — 10 ordered-list пунктов** (дословно из `legacy-pages/legal/terms-of-paid-posts.html` строки 413-428):
  1. Content Submission
  2. Payment
  3. Intellectual Property
  4. Post Modifications
  5. Post Duration
  6. Post Visibility
  7. Termination
  8. Non-refundable
  9. Limitation of Liability
  10. Modification of Terms

  Каждый пункт должен содержать **полный текст** из оригинала (не просто заголовок).

  **Must NOT do**:
  - НЕ добавлять в `SiteFooter.tsx` ссылку на эту страницу (на live-сайте её нет в footer)
  - НЕ использовать `dangerouslySetInnerHTML`
  - НЕ добавлять `getServerSideProps`

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: 10-пунктный список, значительный объём текста требующий точного переноса из оригинала
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (с T3, T4, T6)
  - **Blocks**: T9
  - **Blocked By**: T1, T2

  **References**:

  **Pattern References**:
  - `components/pages/TestimonialsPage.tsx` — канонический паттерн

  **Content References**:
  - `legacy-pages/legal/terms-of-paid-posts.html` строки 408-432 — полный content с ordered-list

  **Data References**:
  - `PAGE_META["terms-of-paid-posts"]`, `PAGE_BREADCRUMBS["terms-of-paid-posts"]`

  **External References**:
  - Live: `https://www.setproduct.com/legal/terms-of-paid-posts`

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: /legal/terms-of-paid-posts рендерится с 10 пунктами
    Tool: Playwright
    Preconditions: T5+T9 выполнены
    Steps:
      1. Navigate: http://localhost:3000/legal/terms-of-paid-posts
      2. Wait: h1 visible
      3. Assert page.title() содержит "Terms of Service for Advertisement Paid Posts"
      4. Assert document.querySelector('h1').textContent.trim() === "Paid posts terms of service"
      5. Assert document.querySelectorAll('ol > li').length === 10
      6. Assert page text содержит "Content Submission", "Non-refundable", "Modification of Terms"
      7. Screenshot: .sisyphus/evidence/task-5-terms-rendered.png
    Expected Result: h1 + 10 пунктов присутствуют
    Evidence: .sisyphus/evidence/task-5-terms-rendered.png

  Scenario: Прямая навигация работает (на страницу нет ссылок в UI)
    Tool: Bash (curl)
    Preconditions: T5+T9 выполнены, dev-сервер запущен
    Steps:
      1. curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/legal/terms-of-paid-posts
      2. Assert output === "200"
    Expected Result: Страница возвращает 200 OK
    Evidence: .sisyphus/evidence/task-5-http-status.txt

  Scenario: Визуальное сравнение с live
    Tool: Playwright
    Preconditions: T5+T9 выполнены
    Steps:
      1. Screenshot live: https://www.setproduct.com/legal/terms-of-paid-posts → task-5-terms-live.png
      2. Screenshot local: http://localhost:3000/legal/terms-of-paid-posts → task-5-terms-local.png
      3. Assert: h1, 10 пунктов ordered-list — одинаковые тексты
    Expected Result: Контент совпадает
    Evidence: task-5-terms-live.png + task-5-terms-local.png
  ```

  **Commit**: YES
  - Message: `feat(legal): add static TermsOfPaidPostsPage component`
  - Files: `components/pages/TermsOfPaidPostsPage.tsx`
  - Pre-commit: `bunx tsc --noEmit`

- [ ] 6. **Обновить TestimonialsPage.tsx: заменить placeholder на 6 реальных карточек**

  **What to do**:
  - Открыть `components/pages/TestimonialsPage.tsx`
  - Найти placeholder-параграф (что-то вроде "Testimonial content is dynamically loaded...")
  - Заменить его на grid из 6 testimonial-карточек (согласно `testimonials.html`)
  - Структура grid'а:
    - Wrapper: `<div class="testimonials_sect"><div class="testimonials_cl-wr w-dyn-list"><div class="testimonials_cl w-dyn-items">`
    - 6 items: `<div class="testimonials_cl-item w-dyn-item">` — каждый содержит `<a class="lightbox-link-with-zoom w-inline-block"><img ... /></a>`
    - **НЕ добавлять** `<script class="w-json">` внутрь `<a>` (это Webflow-JS, не работает в React)
    - **НЕ оборачивать** в `w-lightbox` (это тоже Webflow-JS)
    - Рендерить как простой `<a href={imageSrc} target="_blank" rel="noreferrer">` для открытия .avif в новой вкладке (или без href, как `<div>` — по усмотрению, но предпочтительно `<a>` для клика)

  **6 точных URL изображений** (из `testimonials.html`):
  1. `/external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/654ce7edafad7f95897a9370_DanJasnowski_testimo.avif` (+ srcset 500w)
  2. `/external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/654ce7dd29303a3832d8831e_Craig_Revi_-_Feb_27_.avif` (+ srcset 500w)
  3. `/external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/654ce7c64c53ed2ebfd26575_Berc_Topcu_-_Mar_15_.avif` (нет srcset)
  4. `/external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/654ce7b96be8fabc4f9ce662_Ash_-_Jun_2_2021.avif` (+ srcset 500w)
  5. `/external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/654ce7a933cff09f4d9ee160_Anqi_L_18-10-22-min.avif` (+ srcset 500w)
  6. `/external/cdn.prod.website-files.com/64d1f4894b9a964bb3b26df9/654ce78df8de29b8f399f74c_Andrzej_-_Mar_3_2021.avif` (+ srcset 500w)

  **ОЖИДАЕМЫЙ РЕЗУЛЬТАТ**: 6 скриншот-изображений .avif отображаются в сетке на странице. Это текущий доступный контент (page 3 of 3). Pages 1 и 2 с live недоступны локально — если позже понадобятся все ~18 testimonial'ов, это отдельная задача (вне scope).

  **Экстракция data** — рекомендуется создать локальный массив в компоненте (не отдельный data-файл, чтобы не раздувать инфраструктуру):

  ```tsx
  const TESTIMONIALS = [
    { alt: "Dan Jasnowski testimonial", src: "/external/.../654ce7edafad7f95897a9370_DanJasnowski_testimo.avif", srcSet: "..." },
    // ...остальные 5
  ];
  ```

  **Must NOT do**:
  - НЕ добавлять lightbox-JS-библиотеку
  - НЕ добавлять `<script type="application/json">` внутрь `<a>`
  - НЕ менять заголовок "Our satisfied Customers" и подзаголовок
  - НЕ удалять существующие imports (SiteHeader/SiteFooter и т.п.)
  - НЕ scraping live setproduct.com для получения всех ~18 testimonial'ов (вне scope)
  - НЕ переименовывать/передвигать компонент

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Замена текста на массив+map — простая операция в существующем файле
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (с T3, T4, T5)
  - **Blocks**: None (wrapper pages/testimonials.tsx уже существует)
  - **Blocked By**: T1

  **References**:

  **Pattern References**:
  - `components/pages/TestimonialsPage.tsx` (текущее состояние) — строки 1-42
  - Используемый HeroSection уже импортирован — оставить как есть

  **Content References**:
  - `testimonials.html` строки 133-180 — полная разметка testimonials grid с 6 item'ами (lightbox-link-with-zoom)
  - `testimonials.html` строки 132 — hero-блок (уже реализован в HeroSection)

  **WHY**: 6 точных URL нужно извлечь из `testimonials.html` без изменений (srcset URLs содержат CDN-пути с хешами). Передача alt-текста улучшает accessibility.

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: /testimonials рендерит 6 карточек
    Tool: Playwright
    Preconditions: T6 выполнен, dev-сервер запущен
    Steps:
      1. Navigate: http://localhost:3000/testimonials
      2. Wait: h1 visible
      3. Assert document.querySelector('h1').textContent.trim() === "Our satisfied Customers"
      4. Assert document.querySelectorAll('.testimonials_cl-item').length === 6  (или эквивалентный селектор)
      5. Assert document.querySelectorAll('.testimonials_cl-item img').length === 6
      6. Assert каждая img имеет непусто�� src начинающийся с "/external/cdn"
      7. Assert текст страницы НЕ содержит "placeholder" или "dynamically loaded" (старый placeholder удалён)
      8. Screenshot: .sisyphus/evidence/task-6-testimonials-rendered.png
    Expected Result: 6 img-элементов с CDN-URL, placeholder отсутствует
    Failure Indicators: менее 6 img, старый placeholder-текст остался
    Evidence: .sisyphus/evidence/task-6-testimonials-rendered.png

  Scenario: Изображения загружаются (HTTP 200)
    Tool: Playwright
    Preconditions: T6 выполнен
    Steps:
      1. Navigate: http://localhost:3000/testimonials
      2. Для каждой img на странице: assert await img.evaluate(el => el.naturalWidth > 0)
    Expected Result: все 6 изображений успешно загрузились (naturalWidth > 0)
    Failure Indicators: broken image (naturalWidth === 0), 404 на CDN
    Evidence: .sisyphus/evidence/task-6-img-loaded.txt

  Scenario: Визуальное сравнение с live
    Tool: Playwright
    Preconditions: T6 выполнен
    Steps:
      1. Navigate live: https://www.setproduct.com/testimonials
      2. Screenshot: .sisyphus/evidence/task-6-testimonials-live.png
      3. Navigate local: http://localhost:3000/testimonials
      4. Screenshot: .sisyphus/evidence/task-6-testimonials-local.png
      5. Assert: h1 "Our satisfied Customers" на обеих страницах
      6. Assert: локально показано 6 карточек (на live может быть больше из-за paginator — это ожидаемо)
    Expected Result: Hero одинаковый, 6 карточек на локале присутствуют
    Evidence: task-6-testimonials-live.png + task-6-testimonials-local.png
  ```

  **Commit**: YES
  - Message: `feat(testimonials): replace placeholder with real testimonial cards`
  - Files: `components/pages/TestimonialsPage.tsx`
  - Pre-commit: `bunx tsc --noEmit`

- [ ] 7. **Создать pages/legal/license.tsx (тонкая обёртка, 5 строк)**

  **What to do**:
  - Создать `pages/legal/license.tsx` ровно по канону:

  ```tsx
  import LicensePage from "../../components/pages/LicensePage";

  export default function LicenseRoute() {
    return <LicensePage />;
  }
  ```

  **Must NOT do**:
  - НЕ добавлять `getServerSideProps` / `getStaticProps` / `getStaticPaths`
  - НЕ добавлять дополнительную логику внутри функции
  - НЕ менять имя default export (должно быть `LicenseRoute`)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 5 строк, копия паттерна `pages/testimonials.tsx`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (с T8, T9)
  - **Parallel Group**: Wave 3 (с T8, T9)
  - **Blocks**: T10
  - **Blocked By**: T3

  **References**:
  - `pages/testimonials.tsx` — точный образец тонкой обёртки (5 строк)
  - `components/pages/LicensePage.tsx` (созданный в T3)

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: Файл соответствует каноническому паттерну
    Tool: Bash
    Preconditions: T7 выполнен
    Steps:
      1. Прочитать pages/legal/license.tsx
      2. Assert файл имеет ≤8 строк
      3. Assert содержит "import LicensePage"
      4. Assert содержит "export default function"
      5. Assert НЕ содержит "getServerSideProps", "getStaticProps", "getStaticPaths"
    Expected Result: Файл соответствует канону
    Evidence: .sisyphus/evidence/task-7-license-route.txt

  Scenario: Роут /legal/license отвечает 200
    Tool: Bash (curl)
    Preconditions: T7 выполнен, dev-сервер запущен
    Steps:
      1. curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/legal/license
      2. Assert output === "200"
    Expected Result: 200 OK
    Evidence: .sisyphus/evidence/task-7-http.txt
  ```

  **Commit**: YES
  - Message: `feat(legal): add /legal/license route`
  - Files: `pages/legal/license.tsx`
  - Pre-commit: `bunx tsc --noEmit`

- [ ] 8. **Создать pages/legal/refunds-policy.tsx (тонкая обёртка)**

  **What to do**:
  ```tsx
  import RefundsPolicyPage from "../../components/pages/RefundsPolicyPage";

  export default function RefundsPolicyRoute() {
    return <RefundsPolicyPage />;
  }
  ```

  **Must NOT do**:
  - НЕ добавлять server-side функции
  - НЕ менять имя роута на другое (filename `refunds-policy.tsx` — с дефисами, это валидно)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (с T7, T9)
  - **Blocks**: T10
  - **Blocked By**: T4

  **References**:
  - `pages/testimonials.tsx` — канонический паттерн
  - `components/pages/RefundsPolicyPage.tsx` (из T4)

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: Файл создан и следует паттерну
    Tool: Bash
    Preconditions: T8 выполнен
    Steps:
      1. Assert exists: pages/legal/refunds-policy.tsx
      2. Assert содержит "import RefundsPolicyPage"
      3. Assert НЕ содержит "getServerSideProps"
    Evidence: .sisyphus/evidence/task-8-refunds-route.txt

  Scenario: Роут отвечает 200
    Tool: Bash
    Preconditions: T8 выполнен, dev-сервер запущен
    Steps:
      1. curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/legal/refunds-policy
      2. Assert output === "200"
    Expected Result: 200 OK
    Evidence: .sisyphus/evidence/task-8-http.txt
  ```

  **Commit**: YES
  - Message: `feat(legal): add /legal/refunds-policy route`
  - Files: `pages/legal/refunds-policy.tsx`
  - Pre-commit: `bunx tsc --noEmit`

- [ ] 9. **Создать pages/legal/terms-of-paid-posts.tsx (тонкая обёртка)**

  **What to do**:
  ```tsx
  import TermsOfPaidPostsPage from "../../components/pages/TermsOfPaidPostsPage";

  export default function TermsOfPaidPostsRoute() {
    return <TermsOfPaidPostsPage />;
  }
  ```

  **Must NOT do**:
  - НЕ server-side функции
  - НЕ добавлять ссылку на эту страницу в footer

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (с T7, T8)
  - **Blocks**: T10
  - **Blocked By**: T5

  **References**:
  - `pages/testimonials.tsx` — паттерн
  - `components/pages/TermsOfPaidPostsPage.tsx` (из T5)

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: Файл следует паттерну
    Tool: Bash
    Preconditions: T9 выполнен
    Steps:
      1. Assert exists: pages/legal/terms-of-paid-posts.tsx
      2. Assert содержит "import TermsOfPaidPostsPage"
      3. Assert НЕ содержит "getServerSideProps"
    Evidence: .sisyphus/evidence/task-9-terms-route.txt

  Scenario: Роут отвечает 200
    Tool: Bash
    Steps:
      1. curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/legal/terms-of-paid-posts
      2. Assert output === "200"
    Expected Result: 200 OK
    Evidence: .sisyphus/evidence/task-9-http.txt
  ```

  **Commit**: YES
  - Message: `feat(legal): add /legal/terms-of-paid-posts route`
  - Files: `pages/legal/terms-of-paid-posts.tsx`
  - Pre-commit: `bunx tsc --noEmit`

- [ ] 10. **Удалить pages/legal/[slug].tsx и verify целостности legacy-инфраструктуры**

  **What to do**:
  - Удалить файл `pages/legal/[slug].tsx`
  - **ВАЖНО — НЕ удалять** никакие другие файлы. Только этот один.
  - После удаления запустить `bun run build` чтобы убедиться что:
    - Все 3 статических роута (`/legal/license`, `/legal/refunds-policy`, `/legal/terms-of-paid-posts`) продолжают работать
    - 3 других dynamic-роута (`pages/[slug].tsx`, `pages/templates/[slug].tsx`, `pages/dashboard-templates/[slug].tsx`) продолжают компилироваться (они импортируют `LegacyPage` — который остался жив)
    - `/legal/unknown-slug` теперь возвращает 404 (больше нет fallback-роутера)

  **Must NOT do** (ПОВТОР критичных guardrails):
  - **НЕ удалять** `components/LegacyPage.tsx`
  - **НЕ удалять** `components/layout/PageShell.tsx`
  - **НЕ удалять** `lib/legacy-page.ts`
  - **НЕ удалять** `lib/legacy-collections.ts`
  - **НЕ трогать** `pages/[slug].tsx`, `pages/templates/[slug].tsx`, `pages/dashboard-templates/[slug].tsx`
  - **НЕ удалять** HTML-файлы в `legacy-pages/legal/` (могут понадобиться для diff/reference, и `legacy-pages/` используется другими dynamic-роутами)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: `rm pages/legal/[slug].tsx` + `bun run build` verification
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (последняя задача, ожидает T7+T8+T9)
  - **Parallel Group**: Wave 3 (после T7-T9)
  - **Blocks**: Final Verification Wave
  - **Blocked By**: T7, T8, T9

  **References**:
  - `pages/legal/[slug].tsx` — файл на удаление
  - `pages/[slug].tsx` — НЕ трогать (также использует LegacyPage)
  - `pages/templates/[slug].tsx` — НЕ трогать
  - `pages/dashboard-templates/[slug].tsx` — НЕ трогать
  - `components/LegacyPage.tsx` — НЕ трогать (остаётся живым)

  **WHY**:
  - В Next.js file-based routing конкретные файлы имеют приоритет над `[slug].tsx`, но пока [slug].tsx существует, он будет catch-all'ить unknown slugs (например `/legal/foo`). Удаление даст корректный 404 для неизвестных slug'ов.
  - LegacyPage остаётся живым — мы удаляем только ОДИН из 4 потребителей.

  **Acceptance Criteria**:

  **QA Scenarios**:

  ```
  Scenario: Файл удалён
    Tool: Bash
    Preconditions: T7+T8+T9 выполнены
    Steps:
      1. Запустить: test ! -f 'pages/legal/[slug].tsx'
      2. Assert exit code === 0
    Expected Result: файл отсутствует
    Evidence: .sisyphus/evidence/task-10-file-absent.txt

  Scenario: Build успешен после удаления
    Tool: Bash
    Preconditions: T10 выполнен
    Steps:
      1. Запустить: bun run build
      2. Assert exit code === 0
      3. Assert stdout/stderr не содержит ошибок компиляции
    Expected Result: Build проходит, 3 других dynamic-роута не сломаны
    Failure Indicators: Module not found, type error в [slug].tsx других папок — значит задели лишнее
    Evidence: .sisyphus/evidence/task-10-build-log.txt

  Scenario: /legal/unknown-slug возвращает 404
    Tool: Bash (curl)
    Preconditions: T10 выполнен, dev-сервер запущен
    Steps:
      1. curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/legal/unknown-slug-12345
      2. Assert output === "404"
    Expected Result: 404 Not Found (подтверждает, что [slug].tsx больше не catch-all'ит)
    Failure Indicators: 200 OK — значит [slug].tsx не удалён или Next.js cache не очищен
    Evidence: .sisyphus/evidence/task-10-404-check.txt

  Scenario: LegacyPage и связанные файлы остались нетронутыми
    Tool: Bash
    Preconditions: T10 выполнен
    Steps:
      1. Assert exists: components/LegacyPage.tsx
      2. Assert exists: components/layout/PageShell.tsx
      3. Assert exists: lib/legacy-page.ts
      4. Assert exists: lib/legacy-collections.ts
      5. Assert exists: pages/[slug].tsx
      6. Assert exists: pages/templates/[slug].tsx
      7. Assert exists: pages/dashboard-templates/[slug].tsx
    Expected Result: Все critical-файлы на месте
    Failure Indicators: Любой из этих файлов удалён — REJECT
    Evidence: .sisyphus/evidence/task-10-legacy-intact.txt

  Scenario: Другие dynamic-роуты продолжают работать
    Tool: Bash (curl) + Playwright
    Preconditions: T10 выполнен, dev-сервер запущен
    Steps:
      1. Выбрать известный slug из `pages/[slug].tsx` (например `/all` или `/dashboards` — найти в lib/legacy-collections.ts)
      2. curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/{known-slug}
      3. Assert === "200"
    Expected Result: 200 OK — другие dynamic-роуты работают
    Evidence: .sisyphus/evidence/task-10-other-routes.txt
  ```

  **Commit**: YES
  - Message: `chore(legal): remove dynamic [slug] route after conversion to static pages`
  - Files: `pages/legal/[slug].tsx` (deleted)
  - Pre-commit: `bun run build`

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review-агента запускаются ПАРАЛЛЕЛЬНО. Все должны APPROVE. Презентация результатов user'у и ожидание явного "okay" перед завершением работы.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Прочитать план от начала до конца. Для каждого "Must Have": verify что реализовано (read file, curl endpoint, run command). Для каждого "Must NOT Have": grep codebase на запрещённые паттерны — reject с file:line если найдено (особенно: не удалён ли `LegacyPage.tsx`/`PageShell.tsx`/`lib/legacy-page.ts`; не затронуты ли `pages/[slug].tsx`/`pages/templates/[slug].tsx`/`pages/dashboard-templates/[slug].tsx`). Проверить существование evidence-файлов в `.sisyphus/evidence/`.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Запустить `bun run build` (включает `tsc --noEmit`). Проверить все изменённые файлы на: `as any`, `@ts-ignore`, пустые catch-блоки, console.log, закомментированный код, неиспользуемые импорты, AI slop (избыточные комментарии, преждевременная абстракция, generic names вроде `data`/`result`/`temp`, over-engineering для статических компонентов).
  Output: `Build [PASS/FAIL] | Files [N clean/N issues] | AI Slop [CLEAN/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ skill `playwright`)
  Запустить `bun run dev`. Через Playwright выполнить ВСЕ QA scenarios из T3-T10. Дополнительно: открыть `https://www.setproduct.com/legal/license`, `/legal/refunds-policy`, `/legal/terms-of-paid-posts`, `/testimonials` в одной вкладке и локальный `http://localhost:3000/...` в другой — сравнить визуально, записать diff. Проверить что `http://localhost:3000/legal/unknown-slug` возвращает 404. Screenshots в `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Visual parity [N/4 acceptable] | 404 test [PASS/FAIL] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  `git diff main...HEAD` — прочитать каждое изменение. Verify 1:1 со спецификацией: всё из "Deliverables" создано (нет пропусков), ничего сверх спецификации (нет creep). Проверить "Must NOT Have" compliance: не затронуты ли запрещённые файлы (`LegacyPage.tsx`, `PageShell.tsx`, `lib/legacy-page.ts`, `pages/[slug].tsx`, `pages/testimonials.tsx`, `CtaSubscribe.tsx`, `SiteFooter.tsx`, `sitemap.xml`).
  Output: `Tasks [N/N compliant] | Forbidden files [CLEAN/N touched] | Scope creep [CLEAN/N extras] | VERDICT`

---

## Commit Strategy

Каждая задача делает отдельный атомарный коммит после прохождения своих QA scenarios.

- **T1**: `feat(data): add PAGE_META entries for legal pages` — `data/pages-meta.ts`
- **T2**: `feat(data): add breadcrumbs entries for legal pages` — `data/breadcrumbs.ts`
- **T3**: `feat(legal): add static LicensePage component` — `components/pages/LicensePage.tsx`
- **T4**: `feat(legal): add static RefundsPolicyPage component` — `components/pages/RefundsPolicyPage.tsx`
- **T5**: `feat(legal): add static TermsOfPaidPostsPage component` — `components/pages/TermsOfPaidPostsPage.tsx`
- **T6**: `feat(testimonials): replace placeholder with real testimonial cards` — `components/pages/TestimonialsPage.tsx`
- **T7**: `feat(legal): add /legal/license route` — `pages/legal/license.tsx`
- **T8**: `feat(legal): add /legal/refunds-policy route` — `pages/legal/refunds-policy.tsx`
- **T9**: `feat(legal): add /legal/terms-of-paid-posts route` — `pages/legal/terms-of-paid-posts.tsx`
- **T10**: `chore(legal): remove dynamic [slug] route after conversion` — `pages/legal/[slug].tsx` (удалён)

Pre-commit проверка для каждого: `bun run build` (или минимум `tsc --noEmit`).

---

## Success Criteria

### Verification Commands
```bash
bun run build                                                           # Expected: compile OK
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/testimonials           # Expected: 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/legal/license          # Expected: 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/legal/refunds-policy   # Expected: 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/legal/terms-of-paid-posts  # Expected: 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/legal/unknown-slug     # Expected: 404
test ! -f pages/legal/[slug].tsx                                        # Expected: file absent
grep -r "getServerSideProps" pages/legal/ pages/testimonials.tsx        # Expected: no matches
```

### Final Checklist
- [ ] Все "Must Have" присутствуют (проверено F1)
- [ ] Все "Must NOT Have" отсутствуют (проверено F1 + F4)
- [ ] `bun run build` успешно (проверено F2)
- [ ] 4 целевые страницы визуально соответствуют live setproduct.com (проверено F3)
- [ ] `/legal/unknown-slug` → 404 (проверено F3)
- [ ] LegacyPage/PageShell/lib/legacy-page.ts — нетронуты, 3 других dynamic-роута работают (проверено F4)
