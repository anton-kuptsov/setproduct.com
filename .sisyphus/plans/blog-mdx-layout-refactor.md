# Blog Post Layout Refactor: LegacyPage → BlogPostLayout + MDX

## TL;DR

> **Quick Summary**: Переводим страницу блог-поста `/pages/blog/[slug].tsx` с `LegacyPage` (dangerouslySetInnerHTML из Webflow-HTML) на новый `BlogPostLayout` + MDX-pipeline с SSG. Все 148 существующих постов мигрируются из `legacy-pages/blog/*.html` в `content/blog/*.mdx` через автоматический скрипт.
>
> **Deliverables**:
> - Новый `BlogPostLayout` компонент с Header/Footer, cover, title, meta (автор/дата/reading time), SEO (OG + Twitter + JSON-LD)
> - MDX pipeline: `next-mdx-remote` + `gray-matter` + `@tailwindcss/typography` + `rehype-pretty-code` (shiki)
> - Миграционный CLI-скрипт `scripts/migrate-blog-html-to-mdx.ts` (turndown + cheerio)
> - 148 mdx-файлов в `content/blog/*.mdx` с frontmatter
> - Изображения cover-ов в `public/blog/covers/*`
> - Playwright QA-сценарии с доказательствами в `.sisyphus/evidence/`
> - Обновлённый `/pages/blog/[slug].tsx` на `getStaticPaths` + `getStaticProps` (SSG)
>
> **Estimated Effort**: Large
> **Parallel Execution**: YES — 4 волны
> **Critical Path**: T1 → T2 → T7 → T12 → T15 → T17 → F1-F4 → user okay

---

## Context

### Original Request
Для страниц блог-постов `/blog/[slug].tsx` не использовать `LegacyPage`, а создать лейаут и подгружать туда MDX или MD контент (что лучше, проанализируй).

### Interview Summary
**Key Discussions**:
- MDX vs MD: выбор делегирован Prometheus → выбрано **MDX** (дизайн-блог, будущие интерактивные демо, нулевая стоимость при использовании как простого MD)
- Миграция: все 148 существующих HTML-постов → MDX
- Layout features: Header/Footer сайта + cover + title + author/date/reading-time + полное SEO (OG, Twitter Card, JSON-LD)
- Тесты: Playwright QA (без unit-инфраструктуры)

**Research Findings**:
- Route: `/pages/blog/[slug].tsx` (32 строки): SSR via `getServerSideProps` → `getCollectionPageData("blog", slug)` → `<LegacyPage {...pageData} />`
- LegacyPage (`/components/LegacyPage.tsx`): Head meta + PageShell с `dangerouslySetInnerHTML`
- Data builder (`/lib/legacy-page.ts:100-121`): regex-парсер HTML (title, description, canonical, inlineStyles, body) + rewriter ссылок + strip navbar/footer
- 148 HTML-файлов в `legacy-pages/blog/*.html` (Webflow-экспорт с inline-стилями, тяжёлой разметкой, `data-wf-item-slug`)
- Sample структура: `<title>`, `<meta name=description>`, `<link rel=canonical>`, `<h1 class="heading-style-h2">`, hero image, body прозы с таблицами/картинками
- Стек: Next.js latest + React latest + TypeScript 6 + Tailwind 4.2.2, **Pages Router**, **без MDX пакетов**
- Layout компоненты уже существуют: `SiteHeader`, `SiteFooter`, `ScrollUpButton`, `PageShell` в `/components/layout/`
- **LegacyPage НЕ удалять** — её всё ещё используют `/pages/templates/[slug].tsx`, `/pages/legal/[slug].tsx`, root `[slug].tsx`
- OG image и article:published_time в legacy HTML отсутствуют → значит дата/автор нужно извлекать из body или задать дефолты

### Self-Review (Metis aborted, manual review applied)
**Identified Gaps** (addressed in plan):
- Tailwind 4.2 использует новый синтаксис — `@tailwindcss/typography` подключается через `@plugin` в CSS, не через postcss config → T2
- `next-mdx-remote` v5+ имеет `serialize()` API; важно использовать v5 с поддержкой React 19 → T1
- Миграция 148 постов: скрипт должен быть идемпотентным, с флагами `--dry-run`, `--slug=<single>`, отчёт о неуспешных → T5
- Cover-image extraction: legacy HTML не имеет `og:image`, но имеет hero-img в body → парсер должен достать первую крупную картинку из hero-секции → T5
- Assets: картинки в legacy HTML могут ссылаться на внешние URL (Webflow CDN) — скрипт должен скачать их локально в `public/blog/covers/{slug}.{ext}` → T5
- Reading time: `reading-time` лучше вычислять на build-time из plain text поста, не хранить в frontmatter
- URL preservation: существующие слаги 1:1 сохраняются (файловое имя = слаг)
- SEO canonical: хранится в frontmatter `canonical`, извлекается из `<link rel=canonical>` при миграции
- Fallback для постов, где миграция провалилась: временно оставить маршрут через LegacyPage как safety-net (feature flag или slug whitelist) — см. T12

---

## Work Objectives

### Core Objective
Страница `/blog/[slug]` рендерится **без** компонента `LegacyPage`, использует новый `BlogPostLayout` + MDX как источник контента. Все существующие 148 постов доступны по тем же URL и корректно отрендерены.

### Concrete Deliverables
- Новый файл: `components/blog/BlogPostLayout.tsx`
- Новый файл: `lib/blog/mdx.ts` (загрузчик MDX + frontmatter)
- Новый файл: `lib/blog/reading-time.ts`
- Новый файл: `lib/blog/schema.ts` (JSON-LD BlogPosting)
- Новый файл: `types/blog.ts` (типы BlogFrontmatter, BlogPost)
- Новый файл: `mdx-components.tsx` (map кастомных компонентов для MDX)
- Новый файл: `components/blog/MDXImage.tsx`, `components/blog/BlogMeta.tsx`, `components/blog/BlogHero.tsx`
- Новая директория: `content/blog/` с 148 `.mdx` файлами
- Новая директория: `public/blog/covers/` с изображениями-обложками
- Новый скрипт: `scripts/migrate-blog-html-to-mdx.ts`
- Изменённый: `pages/blog/[slug].tsx` (SSG + BlogPostLayout, **без импорта LegacyPage**)
- Изменённый: `styles/globals.css` (или аналог — подключение @tailwindcss/typography)
- Изменённый: `package.json` (+ зависимости)
- Новая директория: `.sisyphus/evidence/` с результатами Playwright QA

### Definition of Done
- [ ] `grep -r "LegacyPage" pages/blog/` возвращает 0 совпадений
- [ ] `ls content/blog/*.mdx | wc -l` = 148
- [ ] `bun run build` (или `npm run build`) завершается без ошибок
- [ ] Playwright: случайные 5 из 148 URL блога возвращают 200 и содержат H1 + Header + Footer
- [ ] Playwright: cover image видима, OG-тег присутствует в HTML, JSON-LD валиден
- [ ] Visual smoke: страница `/blog/accordion-ui-design` рендерится без сломанного layout

### Must Have
- Сохранение ВСЕХ текущих URL блога (`/blog/{slug}` 1:1)
- Frontmatter поля: `title`, `description`, `slug`, `date`, `author`, `coverImage`, `tags`, `canonical`
- SEO: `<title>`, meta description, canonical, OG (title/description/image/type=article), Twitter Card (summary_large_image), JSON-LD BlogPosting schema
- Reading time (auto-computed из контента, не из frontmatter)
- Use existing `SiteHeader` и `SiteFooter` (консистентность)
- Tailwind `@tailwindcss/typography` для prose-стилизации body
- SSG (`getStaticPaths` + `getStaticProps`) вместо SSR
- Миграционный скрипт идемпотентен (повторный запуск безопасен)
- Все изображения сохранены локально (без зависимости от Webflow CDN)

### Must NOT Have (Guardrails)
- **НЕ удалять `components/LegacyPage.tsx`** — используется другими роутами (templates/legal/root)
- **НЕ изменять** `/pages/templates/[slug].tsx`, `/pages/legal/[slug].tsx`, `/pages/[slug].tsx`, `/pages/freebies/*`, `/pages/dashboard-templates/*`
- **НЕ изменять** `lib/legacy-page.ts`, `lib/legacy-collections.ts`, `components/layout/PageShell.tsx`
- **НЕ удалять** `legacy-pages/blog/*.html` в рамках этого плана (оставить на будущее решение после визуальной проверки)
- **НЕ создавать** `/pages/blog/index.tsx` (не в scope)
- **НЕ внедрять** CMS, RSS, sitemap generation, комментарии, лайки
- **НЕ редизайнить** — визуал нового layout следует существующему паттерну (header/main/footer)
- **НЕ использовать `dangerouslySetInnerHTML`** для MDX контента (весь смысл рефакторинга — уйти от него)
- **НЕ менять** URL-структуру (`/blog/{slug}` остаётся)
- **НЕ генерировать код через AI в runtime** — all content — статические файлы
- **НЕ создавать `console.log`** в продакшн-коде (кроме миграционного скрипта, который CLI-only)
- **НЕ использовать `any` / `@ts-ignore`** в новом коде
- **НЕ создавать дубликаты Header/Footer** — переиспользовать существующие `SiteHeader` и `SiteFooter`

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed.

### Test Decision
- **Infrastructure exists**: NO (в проекте нет vitest/jest/bun test setup)
- **Automated tests**: NO unit tests (user выбрал Playwright QA only)
- **Framework**: none для unit, **Playwright** для E2E/QA
- **Approach**: Implementation → Playwright QA scenarios для каждой задачи

### QA Policy
Every task MUST include agent-executed QA scenarios. Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI (layout + pages)**: Playwright — открыть страницу, проверить DOM, скриншот
- **CLI (migration script)**: Bash (запуск с `--dry-run`, парсинг stdout, проверка созданных файлов)
- **Library/Module (MDX loader, reading-time)**: Bash с inline Node-скриптом (import функции, вызов, assert result)
- **Build verification**: Bash `bun run build` (или `npm run build`) + grep по output

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — foundations, можно параллельно):
├── T1: Install MDX dependencies + update package.json [quick]
├── T2: Tailwind typography setup + globals.css [quick]
├── T3: Define types (types/blog.ts) [quick]
├── T4: Reading-time utility (lib/blog/reading-time.ts) [quick]
└── T5: Migration script skeleton + cheerio parser (scripts/migrate-blog-html-to-mdx.ts) [deep]

Wave 2 (After Wave 1 — content + components, parallel):
├── T6: MDX loader + frontmatter parser (lib/blog/mdx.ts) [deep] — depends: T1, T3
├── T7: JSON-LD schema builder (lib/blog/schema.ts) [quick] — depends: T3
├── T8: BlogHero component (cover + title) [visual-engineering] — depends: T3
├── T9: BlogMeta component (author/date/reading-time) [visual-engineering] — depends: T3, T4
├── T10: MDXImage component (next/image wrapper for MDX) [visual-engineering] — depends: T1
└── T11: Execute migration script on all 148 HTML files [deep] — depends: T5

Wave 3 (After Wave 2 — integration):
├── T12: BlogPostLayout component (compose Hero + Meta + MDX content + SEO Head) [visual-engineering] — depends: T6, T7, T8, T9, T10
├── T13: mdx-components.tsx (MDX component map) [quick] — depends: T10
└── T14: Verify content/blog/*.mdx quality (sample 10 posts) [unspecified-high] — depends: T11

Wave 4 (After Wave 3 — wiring + build):
├── T15: Rewrite pages/blog/[slug].tsx (SSG + BlogPostLayout) [deep] — depends: T12, T13
├── T16: Build verification (bun/npm run build) [quick] — depends: T15
└── T17: Playwright QA — 5 representative blog posts + edge cases [unspecified-high + playwright] — depends: T16

Wave FINAL (After ALL tasks — 4 parallel reviews, then user okay):
├── F1: Plan compliance audit (oracle)
├── F2: Code quality review (unspecified-high)
├── F3: Real manual QA (unspecified-high + playwright)
└── F4: Scope fidelity check (deep)
→ Present results → Get explicit user okay

Critical Path: T1 → T5 → T11 → T14 → T15 → T16 → T17 → F1-F4 → user okay
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 5 (Wave 1)
```

### Dependency Matrix

| Task | Depends On | Blocks |
|------|-----------|--------|
| T1 | — | T6, T10, T11, T16 |
| T2 | — | T8, T9, T12, T16 |
| T3 | — | T6, T7, T8, T9, T15 |
| T4 | — | T9, T6 |
| T5 | — | T11 |
| T6 | T1, T3, T4 | T12, T15 |
| T7 | T3 | T12 |
| T8 | T3, T2 | T12 |
| T9 | T3, T4, T2 | T12 |
| T10 | T1 | T12, T13 |
| T11 | T5, T1 | T14, T17 |
| T12 | T6, T7, T8, T9, T10 | T15 |
| T13 | T10 | T15 |
| T14 | T11 | T15 |
| T15 | T12, T13, T14 | T16 |
| T16 | T15 | T17 |
| T17 | T16 | F1-F4 |
| F1-F4 | ALL prior | user okay |

### Agent Dispatch Summary

| Wave | Tasks | Dispatch |
|------|-------|----------|
| 1 | 5 | T1 → `quick`, T2 → `quick`, T3 → `quick`, T4 → `quick`, T5 → `deep` |
| 2 | 6 | T6 → `deep`, T7 → `quick`, T8 → `visual-engineering`, T9 → `visual-engineering`, T10 → `visual-engineering`, T11 → `deep` |
| 3 | 3 | T12 → `visual-engineering`, T13 → `quick`, T14 → `unspecified-high` |
| 4 | 3 | T15 → `deep`, T16 → `quick`, T17 → `unspecified-high` + `playwright` skill |
| FINAL | 4 | F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high` + `playwright`, F4 → `deep` |

---

## TODOs

> Implementation + Test = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization + QA Scenarios.

- [x] 1. **Install MDX dependencies**

  **What to do**:
  - Установить runtime: `next-mdx-remote@^5.0.0`, `gray-matter@^4.0.3`, `reading-time@^1.5.0`
  - Установить MDX плагины: `remark-gfm@^4.0.0`, `rehype-pretty-code@^0.13.0`, `shiki@^1.22.0`
  - Установить typography: `@tailwindcss/typography@^0.5.15`
  - Установить dev-deps для миграции: `turndown@^7.2.0`, `@types/turndown`, `cheerio@^1.0.0`, `tsx@^4.19.0`, `node-fetch@^3.3.2`
  - Обновить `package.json`: добавить в `scripts` запись `"migrate:blog": "tsx scripts/migrate-blog-html-to-mdx.ts"`
  - Запустить установку: `npm install` (или `bun install`, смотреть по lock-файлу)

  **Must NOT do**:
  - НЕ устанавливать `@next/mdx` (используем `next-mdx-remote` — совместим с Pages Router и гибче)
  - НЕ устанавливать `contentlayer` / `contentlayer2` (избыточно для нашего кейса)
  - НЕ использовать `prismjs` / `rehype-highlight` (используем shiki через rehype-pretty-code)
  - НЕ редактировать `next.config.js` в этой задаче (не требуется для `next-mdx-remote`)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Установка зависимостей — тривиальная операция
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**: none (skills не требуются)

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (с T2, T3, T4, T5)
  - **Blocks**: T6, T10, T11, T16
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References** (existing code):
  - `/Users/antonkuptsov/code/setproduct_web/downloaded-site/setproduct.com/package.json:1-37` — текущий манифест с текущими dependencies/devDependencies; добавить новые туда же

  **External References**:
  - next-mdx-remote docs: https://github.com/hashicorp/next-mdx-remote — для Pages Router используется `serialize()` на server + `<MDXRemote />` на client
  - Tailwind Typography v0.5: https://github.com/tailwindlabs/tailwindcss-typography
  - rehype-pretty-code: https://rehype-pretty.pages.dev/

  **WHY Each Reference Matters**:
  - `package.json` — нужно корректно мёрджить новые записи, не сломать существующие (next/react/react-dom на "latest")
  - next-mdx-remote docs — убедиться что используем API v5+ (serialize в Node, рендер на клиенте)
  - Tailwind Typography — в Tailwind v4 подключение отличается (через `@plugin` в CSS, не через tailwind.config)

  **Acceptance Criteria**:
  - [ ] `cat package.json | grep next-mdx-remote` → присутствует
  - [ ] `cat package.json | grep gray-matter` → присутствует
  - [ ] `cat package.json | grep reading-time` → присутствует
  - [ ] `cat package.json | grep "@tailwindcss/typography"` → присутствует
  - [ ] `cat package.json | grep turndown` → присутствует в devDependencies
  - [ ] `cat package.json | grep tsx` → присутствует в devDependencies
  - [ ] `cat package.json | grep "migrate:blog"` → присутствует в scripts
  - [ ] `npm install` (или `bun install`) завершается без error

  **QA Scenarios**:

  ```
  Scenario: Dependencies installed and importable
    Tool: Bash
    Preconditions: package.json updated, `npm install` выполнен
    Steps:
      1. Запустить: node -e "const {serialize}=require('next-mdx-remote/serialize'); console.log(typeof serialize)"
      2. Запустить: node -e "const m=require('gray-matter'); console.log(typeof m)"
      3. Запустить: node -e "const r=require('reading-time'); console.log(typeof r)"
    Expected Result: каждая команда выводит 'function'
    Failure Indicators: MODULE_NOT_FOUND; TypeError
    Evidence: .sisyphus/evidence/task-1-deps-importable.txt (stdout всех 3 команд)

  Scenario: Migration CLI script alias is registered
    Tool: Bash
    Preconditions: package.json updated
    Steps:
      1. Запустить: npm run migrate:blog -- --help || true
      2. Assert: exit code ≠ 127 (script alias is found)
    Expected Result: npm сообщает что script обнаружен (пусть даже сам скрипт ещё не реализован — это T5)
    Evidence: .sisyphus/evidence/task-1-script-alias.txt (stdout)
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-1-deps-importable.txt`
  - [ ] `.sisyphus/evidence/task-1-script-alias.txt`

  **Commit**: YES (standalone)
  - Message: `chore(blog): add MDX + gray-matter + shiki dependencies`
  - Files: `package.json`, lock-file
  - Pre-commit: `npm install`

- [x] 2. **Tailwind typography setup**

  **What to do**:
  - Найти главный CSS файл проекта (`styles/globals.css` или аналог; подтвердить через `ls styles/`)
  - В Tailwind v4 синтаксис: добавить `@plugin "@tailwindcss/typography";` после `@import "tailwindcss";`
  - Проверить что стили `prose` будут доступны в компонентах
  - Опционально: добавить минимальные overrides для prose (если нужно под дизайн-систему) — максимум 5-10 строк, без agressive customization

  **Must NOT do**:
  - НЕ создавать `tailwind.config.js` если его нет (Tailwind v4 конфиг-less по дефолту)
  - НЕ перезаписывать существующие стили в globals.css
  - НЕ делать heavy customization prose — минимум нужный для интеграции

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Одна правка в CSS-файле
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: T8, T9, T12, T16
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - Существующий globals.css в `styles/` — сохранить всё текущее, дополнить
  - `components/layout/PageShell.tsx` — ссылки на стили (посмотреть какой CSS импортируется)

  **External References**:
  - Tailwind v4 plugin directive: https://tailwindcss.com/docs/adding-custom-styles#using-plugins
  - Typography classes: https://github.com/tailwindlabs/tailwindcss-typography

  **WHY Each Reference Matters**:
  - Tailwind v4 отличается от v3 — `@plugin` вместо `plugins: []` в JS конфиге; критично не сломать существующие стили

  **Acceptance Criteria**:
  - [ ] `grep -r "@tailwindcss/typography" styles/` → найдено одно совпадение
  - [ ] `npm run build` завершается без CSS ошибок (proof via T16)

  **QA Scenarios**:

  ```
  Scenario: Prose class compiles in Tailwind output
    Tool: Bash
    Preconditions: typography plugin подключён в CSS
    Steps:
      1. Создать тестовый файл: echo '<div class="prose"><h1>Test</h1></div>' > /tmp/prose-test.html
      2. Запустить: npx tailwindcss -i styles/globals.css -o /tmp/out.css --content "/tmp/prose-test.html" 2>&1
      3. Grep: grep -q "\.prose" /tmp/out.css
    Expected Result: prose-стили сгенерированы; grep возвращает exit 0
    Failure Indicators: "plugin not found"; prose-классы отсутствуют в output
    Evidence: .sisyphus/evidence/task-2-tailwind-prose.css (first 100 lines of output)
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-2-tailwind-prose.css`

  **Commit**: YES
  - Message: `style(blog): wire @tailwindcss/typography plugin`
  - Files: `styles/globals.css`
  - Pre-commit: `npm run build`

- [x] 3. **Define blog types**

  **What to do**:
  - Создать новый файл: `types/blog.ts`
  - Экспортировать типы:
    - `BlogFrontmatter`: `title: string`, `description: string`, `slug: string`, `date: string` (ISO 8601), `author: string`, `coverImage: string` (relative path `/blog/covers/...`), `coverImageAlt?: string`, `tags?: string[]`, `canonical?: string`
    - `BlogPost`: `{ frontmatter: BlogFrontmatter, mdxSource: MDXRemoteSerializeResult, readingTimeText: string, readingTimeMinutes: number }`
    - `BlogPostMeta`: subset для списочного view (frontmatter + readingTimeText) — понадобится в будущем

  **Must NOT do**:
  - НЕ использовать `any`; все поля строго типизированы
  - НЕ импортировать `LegacyPageData` — отдельная вселенная типов
  - НЕ добавлять поля "на всякий случай" — только что реально используется

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: T6, T7, T8, T9, T15
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `/Users/antonkuptsov/code/setproduct_web/downloaded-site/setproduct.com/types/legacy.ts:1-8` — паттерн расположения типов (файл-per-domain); следовать ему

  **External References**:
  - next-mdx-remote types: `import type { MDXRemoteSerializeResult } from "next-mdx-remote"`

  **WHY Each Reference Matters**:
  - `types/legacy.ts` показывает конвенцию проекта: простой `export type X = {...}` без лишнего boilerplate

  **Acceptance Criteria**:
  - [ ] Файл `types/blog.ts` существует
  - [ ] `bunx tsc --noEmit types/blog.ts` (или `npx tsc --noEmit`) без ошибок
  - [ ] Экспортируется `BlogFrontmatter`, `BlogPost`, `BlogPostMeta`

  **QA Scenarios**:

  ```
  Scenario: Types compile and are exportable
    Tool: Bash
    Preconditions: types/blog.ts создан
    Steps:
      1. Запустить: npx tsc --noEmit --project tsconfig.json 2>&1 | tee /tmp/tsc-out.txt
      2. Grep: grep -E "types/blog.ts" /tmp/tsc-out.txt | grep -iE "error"
      3. Assert: grep возвращает exit 1 (нет ошибок)
    Expected Result: tsc завершается без ошибок в types/blog.ts
    Evidence: .sisyphus/evidence/task-3-tsc-types-blog.txt

  Scenario: All three types exported correctly
    Tool: Bash
    Preconditions: types/blog.ts создан
    Steps:
      1. Запустить: node -e "const src=require('fs').readFileSync('types/blog.ts','utf8'); ['BlogFrontmatter','BlogPost','BlogPostMeta'].forEach(t=>{if(!src.includes('export type '+t)&&!src.includes('export interface '+t))throw new Error('missing '+t)}); console.log('OK')"
    Expected Result: stdout = "OK"
    Evidence: .sisyphus/evidence/task-3-types-exported.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-3-tsc-types-blog.txt`
  - [ ] `.sisyphus/evidence/task-3-types-exported.txt`

  **Commit**: YES
  - Message: `feat(blog): define BlogFrontmatter and BlogPost types`
  - Files: `types/blog.ts`
  - Pre-commit: `npx tsc --noEmit`

- [x] 4. **Reading-time utility**

  **What to do**:
  - Создать `lib/blog/reading-time.ts`
  - Экспортировать функцию `computeReadingTime(markdownContent: string): { text: string; minutes: number }` использующую пакет `reading-time`
  - Функция должна стрипать MDX-специфичный синтаксис (frontmatter, import/export statements) перед подсчётом
  - Учитывать русский язык: в пакете reading-time дефолт 200 wpm (ок для обоих)
  - Округление минут до ближайшего integer ≥ 1

  **Must NOT do**:
  - НЕ писать свою реализацию подсчёта — использовать `reading-time` пакет
  - НЕ хардкодить wpm значение

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: T6, T9
  - **Blocked By**: None (независимо от T1 концептуально — но factically нужен `reading-time` установленный; поэтому в Wave 1 параллельно, но тестировать после T1)

  **References**:

  **External References**:
  - reading-time npm: https://www.npmjs.com/package/reading-time

  **WHY Each Reference Matters**:
  - API `readingTime(text)` возвращает `{ text: "5 min read", minutes: 4.72, ... }` — используем поля `text` и `Math.max(1, Math.round(minutes))`

  **Acceptance Criteria**:
  - [ ] Файл существует `lib/blog/reading-time.ts`
  - [ ] Функция экспортируется как named export
  - [ ] Unit self-test в QA scenario ниже проходит

  **QA Scenarios**:

  ```
  Scenario: Reading time computes correctly for short text
    Tool: Bash
    Preconditions: T1 завершён (reading-time installed), файл создан
    Steps:
      1. Запустить: node -e "const {computeReadingTime}=require('./lib/blog/reading-time.ts'); const r=computeReadingTime('Hello world'.repeat(100)); console.log(JSON.stringify(r))" (через tsx)
      2. Точнее: npx tsx -e "import {computeReadingTime} from './lib/blog/reading-time.ts'; const r=computeReadingTime('Hello world '.repeat(100)); console.log(JSON.stringify(r))"
      3. Assert: JSON содержит поле `text` (string) и `minutes` (number ≥ 1)
    Expected Result: {"text":"1 min read","minutes":1} (или близкое)
    Evidence: .sisyphus/evidence/task-4-reading-time-short.txt

  Scenario: Reading time strips frontmatter and imports
    Tool: Bash
    Steps:
      1. Запустить: npx tsx -e "import {computeReadingTime} from './lib/blog/reading-time.ts'; const mdx='---\ntitle: x\n---\nimport X from \"y\";\n\nHello world '.repeat(200); const r=computeReadingTime(mdx); console.log(JSON.stringify(r))"
      2. Assert: minutes ≥ 1
    Expected Result: result.minutes ≥ 1 (frontmatter не ломает подсчёт)
    Evidence: .sisyphus/evidence/task-4-reading-time-mdx.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-4-reading-time-short.txt`
  - [ ] `.sisyphus/evidence/task-4-reading-time-mdx.txt`

  **Commit**: YES
  - Message: `feat(blog): add reading-time utility`
  - Files: `lib/blog/reading-time.ts`
  - Pre-commit: `npx tsc --noEmit`

- [x] 5. **Migration script: HTML → MDX**

  **What to do**:
  - Создать `scripts/migrate-blog-html-to-mdx.ts` — CLI-скрипт с `tsx`
  - Флаги CLI: `--dry-run` (не писать файлы), `--slug=<slug>` (один пост вместо всех), `--overwrite` (перезаписать существующие), `--verbose`
  - Алгоритм для каждого HTML файла в `legacy-pages/blog/*.html`:
    1. Прочитать HTML
    2. Парсить через `cheerio`
    3. Извлечь: `<title>`, `<meta name=description>`, `<link rel=canonical>`, `data-wf-item-slug`
    4. Из body найти hero секцию (первый `<h1>`, ближайший `<img>` с классом содержащим "hero" или первый крупный `<img>` в начале body)
    5. Извлечь автора и дату: искать `<meta property="article:author">`, `<meta property="article:published_time">`, либо в body по паттернам ("By <author>", date текст); если не найдено — дефолт `author: "Setproduct Team"`, `date: <file mtime>`
    6. Очистить body: удалить legacy navbar (класс `navbar w-nav`), footer, hero-секцию (она уже в frontmatter), все inline `<style>` и `<script>`
    7. Конвертировать очищенный body в markdown через `turndown` с конфигом:
       - `headingStyle: "atx"` (## вместо underline)
       - `codeBlockStyle: "fenced"`
       - Custom rules: `<img>` → оставлять как HTML (потом заменим на `<MDXImage>`) ИЛИ на markdown-image если src локальный
       - `<iframe>` → оставить HTML
    8. Для каждой `<img src>` в body и для cover-image: если src = external URL → скачать через `node-fetch` в `public/blog/covers/<slug>/<hash>.<ext>` (cover) или `public/blog/assets/<slug>/<n>.<ext>` (inline); переписать src на локальный путь
    9. Сгенерировать frontmatter YAML через `gray-matter`:
       ```yaml
       title: "..."
       description: "..."
       slug: "..."
       date: "YYYY-MM-DD"
       author: "..."
       coverImage: "/blog/covers/<slug>.<ext>"
       coverImageAlt: "..."
       tags: []
       canonical: "..."
       ```
    10. Склеить frontmatter + markdown body → записать в `content/blog/<slug>.mdx`
  - Отчёт в конце: `Migrated X / Y files. Errors: [list]. Skipped: [list]. Time: Xs.`
  - При ошибке парсинга конкретного файла — логировать и продолжать, НЕ падать

  **Must NOT do**:
  - НЕ использовать regex для парсинга HTML — только cheerio
  - НЕ падать на первой ошибке (batch-процесс должен быть устойчив)
  - НЕ хардкодить пути — использовать `path.resolve(__dirname, ...)`
  - НЕ создавать файлы если флаг `--dry-run`
  - НЕ модифицировать файлы в `legacy-pages/blog/` (read-only источник)

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Сложная логика: парсинг HTML различной структуры, скачивание ассетов, генерация корректного MDX, устойчивость к edge cases на 148 файлах
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES (с другими Wave 1 задачами)
  - **Parallel Group**: Wave 1
  - **Blocks**: T11
  - **Blocked By**: None (факт. нужен T1 для turndown/cheerio/tsx installed — но может писаться параллельно, запускаться в T11)

  **References**:

  **Pattern References**:
  - `/Users/antonkuptsov/code/setproduct_web/downloaded-site/setproduct.com/lib/legacy-page.ts:100-121` — существующий парсер (regex-based); показывает какие поля есть в legacy HTML (title/description/canonical/body/inlineStyles); НЕ копировать regex-подход, использовать cheerio
  - `/Users/antonkuptsov/code/setproduct_web/downloaded-site/setproduct.com/lib/legacy-page.ts:10-20` — `rewriteLegacyLinks` показывает какие URL-паттерны нужно переписать (`/blog/x.html` → `/blog/x`)
  - `/Users/antonkuptsov/code/setproduct_web/downloaded-site/setproduct.com/legacy-pages/blog/accordion-ui-design.html` — пример legacy HTML; структура: `<h1 class="heading-style-h2">Title</h1>`, `data-wf-item-slug="accordion-ui-design"`

  **External References**:
  - cheerio: https://cheerio.js.org/docs/intro
  - turndown rules: https://github.com/mixmark-io/turndown#extending-with-plugins
  - gray-matter stringify: https://github.com/jonschlinkert/gray-matter#stringify

  **WHY Each Reference Matters**:
  - `lib/legacy-page.ts` даёт full map полей в legacy HTML — используем как спецификацию что извлекать
  - `rewriteLegacyLinks` — такая же логика нужна для внутренних ссылок в markdown (иначе links сломаются)
  - cheerio docs — API для извлечения с CSS-селекторами и удаления элементов

  **Acceptance Criteria**:
  - [ ] Файл `scripts/migrate-blog-html-to-mdx.ts` существует
  - [ ] `npm run migrate:blog -- --dry-run --slug=accordion-ui-design` выполняется без ошибок
  - [ ] Dry-run выводит preview frontmatter + markdown без создания файлов
  - [ ] `--help` показывает описание флагов (можно простым `process.argv.includes('--help')`)

  **QA Scenarios**:

  ```
  Scenario: Script runs in dry-run for single post without creating files
    Tool: Bash
    Preconditions: T1 завершён (turndown/cheerio/tsx installed)
    Steps:
      1. Убедиться что content/blog/ пустой или отсутствует (для этого теста): rm -rf /tmp/content-backup && test -d content/blog && cp -r content/blog /tmp/content-backup 2>/dev/null || true
      2. Запустить: npm run migrate:blog -- --dry-run --slug=accordion-ui-design --verbose 2>&1 | tee /tmp/migrate-dry.txt
      3. Assert exit code 0
      4. Assert: ls content/blog/accordion-ui-design.mdx 2>/dev/null → NOT exists (dry-run не создаёт)
      5. Assert stdout: содержит "DRY RUN" или "dry-run" или "would write"
      6. Assert stdout: содержит "title:" и "slug: accordion-ui-design"
    Expected Result: файл не создан, preview показан
    Evidence: .sisyphus/evidence/task-5-migrate-dry-run.txt

  Scenario: Script handles missing slug gracefully
    Tool: Bash
    Steps:
      1. Запустить: npm run migrate:blog -- --slug=does-not-exist 2>&1 | tee /tmp/migrate-err.txt
      2. Assert exit code ≠ 0 OR stdout содержит "not found" / "Error"
    Expected Result: graceful error, не crash
    Evidence: .sisyphus/evidence/task-5-migrate-missing-slug.txt

  Scenario: Help flag shows available flags
    Tool: Bash
    Steps:
      1. Запустить: npm run migrate:blog -- --help 2>&1 | tee /tmp/migrate-help.txt
      2. Assert stdout: содержит "--dry-run", "--slug", "--overwrite"
    Expected Result: help текст показан
    Evidence: .sisyphus/evidence/task-5-migrate-help.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-5-migrate-dry-run.txt`
  - [ ] `.sisyphus/evidence/task-5-migrate-missing-slug.txt`
  - [ ] `.sisyphus/evidence/task-5-migrate-help.txt`

  **Commit**: YES
  - Message: `feat(scripts): scaffold HTML-to-MDX migration script`
  - Files: `scripts/migrate-blog-html-to-mdx.ts`, package.json (уже в T1)
  - Pre-commit: `npm run migrate:blog -- --dry-run --slug=accordion-ui-design`

- [x] 6. **MDX loader + frontmatter parser**

  **What to do**:
  - Создать `lib/blog/mdx.ts` с экспортами:
    - `getAllBlogSlugs(): string[]` — читает `content/blog/*.mdx`, возвращает массив slugs (имя файла без `.mdx`)
    - `getBlogPost(slug: string): Promise<BlogPost | null>` — читает файл, парсит frontmatter через `gray-matter`, сериализует MDX через `serialize()` с remark-gfm + rehype-pretty-code плагинами, вычисляет reading-time через `computeReadingTime`, возвращает `BlogPost` или `null` если файла нет
    - `getAllBlogPostsMeta(): BlogPostMeta[]` — для будущего списка (заготовка)
  - Использовать `path.join(process.cwd(), "content", "blog")` для разрешения путей
  - MDX serialize config:
    - `mdxOptions.remarkPlugins: [remarkGfm]`
    - `mdxOptions.rehypePlugins: [[rehypePrettyCode, { theme: "github-dark" }]]`
    - `parseFrontmatter: false` (gray-matter уже распарсил)

  **Must NOT do**:
  - НЕ использовать `dangerouslySetInnerHTML` — весь смысл pipeline
  - НЕ использовать `fs.readFileSync` на клиенте — только server-side (getStaticProps)
  - НЕ делать caching слой в Phase 1 (оптимизация по запросу, сейчас прямое чтение)
  - НЕ падать если файл не существует — возвращать `null`

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Интеграция нескольких пакетов (gray-matter + next-mdx-remote + rehype-pretty-code + reading-time), типизация, edge cases (missing file, invalid frontmatter)
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (с T7, T8, T9, T10, T11)
  - **Blocks**: T12, T15
  - **Blocked By**: T1, T3, T4

  **References**:

  **Pattern References**:
  - `/Users/antonkuptsov/code/setproduct_web/downloaded-site/setproduct.com/lib/legacy-collections.ts:1-35` — паттерн `getAllSlugs` + `getBySlug`; конвенция использовать `process.cwd()` для разрешения путей
  - `/Users/antonkuptsov/code/setproduct_web/downloaded-site/setproduct.com/types/blog.ts` (из T3) — типы для возврата

  **External References**:
  - next-mdx-remote/serialize: https://github.com/hashicorp/next-mdx-remote#apis
  - gray-matter: https://github.com/jonschlinkert/gray-matter#api
  - rehype-pretty-code: https://rehype-pretty.pages.dev/#usage

  **WHY Each Reference Matters**:
  - `legacy-collections.ts` показывает правильный паттерн: `process.cwd()` + `fs.readdirSync` + фильтр по расширению; следовать конвенции
  - next-mdx-remote/serialize — API ожидает `serialize(content, options)` на Node, возвращает `MDXRemoteSerializeResult`

  **Acceptance Criteria**:
  - [ ] Файл `lib/blog/mdx.ts` существует
  - [ ] `getAllBlogSlugs` возвращает 148 slugs после T11 (проверим в T14)
  - [ ] `getBlogPost("nonexistent")` возвращает `null`, не throws
  - [ ] `getBlogPost(existingSlug)` возвращает корректный `BlogPost` с `frontmatter`, `mdxSource`, `readingTimeText`

  **QA Scenarios**:

  ```
  Scenario: getAllBlogSlugs returns array of strings from content/blog
    Tool: Bash
    Preconditions: T11 не обязательно; создать fixture: mkdir -p content/blog && echo $'---\ntitle: Test\nslug: test-fixture\ndescription: d\ndate: 2026-01-01\nauthor: t\ncoverImage: /x.jpg\n---\n\n# Hello' > content/blog/test-fixture.mdx
    Steps:
      1. Запустить: npx tsx -e "import {getAllBlogSlugs} from './lib/blog/mdx.ts'; console.log(JSON.stringify(getAllBlogSlugs()))"
      2. Assert stdout: JSON array содержащий "test-fixture"
    Expected Result: включает "test-fixture"
    Evidence: .sisyphus/evidence/task-6-getAllSlugs.txt
    Cleanup: rm content/blog/test-fixture.mdx

  Scenario: getBlogPost returns null for missing slug
    Tool: Bash
    Steps:
      1. Запустить: npx tsx -e "import {getBlogPost} from './lib/blog/mdx.ts'; getBlogPost('definitely-not-exists-xyz123').then(r=>console.log(r===null?'NULL':'NOT_NULL'))"
      2. Assert stdout: "NULL"
    Expected Result: "NULL"
    Evidence: .sisyphus/evidence/task-6-getBlogPost-missing.txt

  Scenario: getBlogPost returns structured result for valid post
    Tool: Bash
    Preconditions: fixture файл (см. выше)
    Steps:
      1. mkdir -p content/blog && echo $'---\ntitle: Test\nslug: test-fixture\ndescription: d\ndate: 2026-01-01\nauthor: t\ncoverImage: /x.jpg\n---\n\n# Hello world' > content/blog/test-fixture.mdx
      2. Запустить: npx tsx -e "import {getBlogPost} from './lib/blog/mdx.ts'; getBlogPost('test-fixture').then(r=>console.log(JSON.stringify({hasFM:!!r?.frontmatter,hasMDX:!!r?.mdxSource,rtText:r?.readingTimeText,rtMin:r?.readingTimeMinutes})))"
      3. Assert stdout: все поля truthy/number
    Expected Result: {"hasFM":true,"hasMDX":true,"rtText":"...","rtMin":1}
    Evidence: .sisyphus/evidence/task-6-getBlogPost-valid.txt
    Cleanup: rm content/blog/test-fixture.mdx
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-6-getAllSlugs.txt`
  - [ ] `.sisyphus/evidence/task-6-getBlogPost-missing.txt`
  - [ ] `.sisyphus/evidence/task-6-getBlogPost-valid.txt`

  **Commit**: YES
  - Message: `feat(blog): MDX loader with frontmatter parsing`
  - Files: `lib/blog/mdx.ts`
  - Pre-commit: `npx tsc --noEmit`

- [x] 7. **JSON-LD BlogPosting schema builder**

  **What to do**:
  - Создать `lib/blog/schema.ts`
  - Экспортировать `buildBlogPostingJsonLd(frontmatter: BlogFrontmatter, url: string, readingTimeMinutes: number): object`
  - Возвращаемая структура (schema.org/BlogPosting):
    ```json
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "...",
      "description": "...",
      "image": "absolute URL to cover",
      "datePublished": "ISO date",
      "dateModified": "ISO date (= datePublished если нет updatedAt)",
      "author": { "@type": "Person", "name": "..." },
      "publisher": { "@type": "Organization", "name": "Setproduct", "logo": {...} },
      "mainEntityOfPage": { "@type": "WebPage", "@id": "url" },
      "timeRequired": "PT5M"
    }
    ```
  - `timeRequired` в ISO 8601 duration: `PT${readingTimeMinutes}M`
  - Image URL — абсолютный (prepend site URL); site URL вынести в `lib/blog/site-config.ts` с значением (можно hardcode `https://setproduct.com` или процессом env)

  **Must NOT do**:
  - НЕ добавлять поля вне schema.org/BlogPosting spec
  - НЕ возвращать `<script>` tag — только JSON-serializable object (инъекция в `<Head>` в T12)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Конструирование static JSON объекта по spec
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: T12
  - **Blocked By**: T3

  **References**:

  **External References**:
  - Schema.org BlogPosting: https://schema.org/BlogPosting
  - Google structured data: https://developers.google.com/search/docs/appearance/structured-data/article

  **WHY Each Reference Matters**:
  - Google использует именно эти поля для rich results; отступления от spec → невалидный rich snippet

  **Acceptance Criteria**:
  - [ ] Файл `lib/blog/schema.ts` существует
  - [ ] Функция возвращает валидный объект с обязательными полями
  - [ ] `@context`, `@type`, `headline`, `datePublished`, `author`, `publisher` всегда присутствуют

  **QA Scenarios**:

  ```
  Scenario: JSON-LD contains required BlogPosting fields
    Tool: Bash
    Steps:
      1. Запустить: npx tsx -e "import {buildBlogPostingJsonLd} from './lib/blog/schema.ts'; const r=buildBlogPostingJsonLd({title:'T',description:'D',slug:'s',date:'2026-01-01',author:'A',coverImage:'/c.jpg'},'https://setproduct.com/blog/s',5); console.log(JSON.stringify(r,null,2))"
      2. Parse stdout as JSON, assert fields: @context, @type === "BlogPosting", headline === "T", datePublished === "2026-01-01", author.name === "A", timeRequired === "PT5M"
    Expected Result: все проверки проходят
    Evidence: .sisyphus/evidence/task-7-jsonld.json

  Scenario: JSON-LD validates against schema.org (smoke)
    Tool: Bash
    Steps:
      1. Output из предыдущего теста pipe в: node -e "const d=JSON.parse(require('fs').readFileSync('.sisyphus/evidence/task-7-jsonld.json','utf8'));['@context','@type','headline','description','image','datePublished','author','publisher','mainEntityOfPage'].forEach(k=>{if(!d[k])throw new Error('missing '+k)});console.log('OK')"
    Expected Result: stdout = "OK"
    Evidence: .sisyphus/evidence/task-7-jsonld-validate.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-7-jsonld.json`
  - [ ] `.sisyphus/evidence/task-7-jsonld-validate.txt`

  **Commit**: YES
  - Message: `feat(blog): JSON-LD BlogPosting schema builder`
  - Files: `lib/blog/schema.ts`, `lib/blog/site-config.ts`
  - Pre-commit: `npx tsc --noEmit`

- [x] 8. **BlogHero component (cover + title)**

  **What to do**:
  - Создать `components/blog/BlogHero.tsx`
  - Props: `{ title: string; coverImage: string; coverImageAlt?: string }`
  - Рендер: секция с `next/image` cover-ом (priority, sizes='100vw', responsive) + заголовок H1 + минимальный отступ снизу
  - Адаптивные размеры: desktop 1200x600, mobile 100vw
  - Если `coverImage` отсутствует — рендерить только H1 без hero-секции (graceful)
  - Использовать Tailwind классы для стилизации (консистентно с проектом)

  **Must NOT do**:
  - НЕ использовать `<img>` без next/image
  - НЕ делать сложную анимацию / 3D-эффекты
  - НЕ хардкодить размеры в пикселях без responsive behavior
  - НЕ использовать inline styles

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: UI-компонент требующий знания responsive design + next/image API + дизайн-консистентности
  - **Skills**: [`frontend-ui-ux`, `next-best-practices`]
    - `frontend-ui-ux`: responsive hero composition best practices
    - `next-best-practices`: правильное использование next/image (priority, sizes, fill vs explicit dims)

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: T12
  - **Blocked By**: T3, T2

  **References**:

  **Pattern References**:
  - `/Users/antonkuptsov/code/setproduct_web/downloaded-site/setproduct.com/components/layout/SiteHeader.tsx` — паттерн TSX-компонента с Tailwind-классами (конвенция проекта)
  - `/Users/antonkuptsov/code/setproduct_web/downloaded-site/setproduct.com/legacy-pages/blog/accordion-ui-design.html` — посмотреть визуал hero в существующих постах для матчинга (H1 класс `heading-style-h2`)

  **External References**:
  - next/image docs: https://nextjs.org/docs/pages/api-reference/components/image

  **WHY Each Reference Matters**:
  - `SiteHeader.tsx` — конвенция: functional component, named props type, tailwind classes; следовать
  - Legacy HTML — визуально hero должен быть похож (уменьшить когнитивную нагрузку на читателя)

  **Acceptance Criteria**:
  - [ ] Файл `components/blog/BlogHero.tsx` существует
  - [ ] Компонент экспортируется как default
  - [ ] TypeScript проверка проходит
  - [ ] Компонент рендерится в Playwright сценарии

  **QA Scenarios**:

  ```
  Scenario: BlogHero renders title and cover image in Playwright
    Tool: Playwright
    Preconditions: T15 завершён (blog route подключён); dev сервер запущен: `bun run dev`
    Steps:
      1. Navigate: page.goto('http://localhost:3000/blog/accordion-ui-design')
      2. Wait: page.waitForSelector('h1', { timeout: 10000 })
      3. Assert: H1 visible, текст содержит "Accordion"
      4. Assert: cover image присутствует (img[alt] первый img в article/hero)
      5. Assert: cover src не пустой, не 404 (наблюдаемый статус: await page.request.get(coverSrc))
      6. Screenshot: await page.screenshot({ path: '.sisyphus/evidence/task-8-hero.png', fullPage: false, clip: { x:0, y:0, width:1280, height:800 } })
    Expected Result: H1 присутствует, cover image загружен (200), скриншот сохранён
    Failure Indicators: H1 not found; image 404; console error
    Evidence: .sisyphus/evidence/task-8-hero.png

  Scenario: BlogHero renders gracefully without cover image
    Tool: Bash (unit-level через tsx)
    Steps:
      1. Создать fixture MDX без coverImage (или coverImage: "") в content/blog/__test-no-cover.mdx
      2. Navigate Playwright: page.goto('/blog/__test-no-cover')
      3. Assert: H1 present, no broken image icon
      4. Screenshot: .sisyphus/evidence/task-8-hero-no-cover.png
    Expected Result: нет broken image, H1 виден
    Evidence: .sisyphus/evidence/task-8-hero-no-cover.png
    Cleanup: rm content/blog/__test-no-cover.mdx
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-8-hero.png`
  - [ ] `.sisyphus/evidence/task-8-hero-no-cover.png`

  **Commit**: YES
  - Message: `feat(blog): BlogHero component (cover + title)`
  - Files: `components/blog/BlogHero.tsx`
  - Pre-commit: `npx tsc --noEmit`

- [x] 9. **BlogMeta component (author/date/reading-time)**

  **What to do**:
  - Создать `components/blog/BlogMeta.tsx`
  - Props: `{ author: string; date: string (ISO); readingTimeText: string }`
  - Рендер: горизонтальная полоса с тремя элементами: `<time dateTime={date}>` (форматированная дата в человекочитаемом виде), разделитель, автор, разделитель, reading time
  - Форматирование даты: `Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(date))`
  - Tailwind классы для визуального тона (subtle/muted color)

  **Must NOT do**:
  - НЕ добавлять аватары авторов (not in scope)
  - НЕ использовать тяжёлую библиотеку для дат (`date-fns`/`dayjs`) — Intl достаточно

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: typography hierarchy для meta-информации

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: T12
  - **Blocked By**: T3, T4, T2

  **References**:

  **Pattern References**:
  - `/Users/antonkuptsov/code/setproduct_web/downloaded-site/setproduct.com/components/layout/SiteHeader.tsx` — TSX component convention
  - Sample legacy HTML — визуальный ориентир для meta-полосы

  **External References**:
  - Intl.DateTimeFormat: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat

  **WHY Each Reference Matters**:
  - `SiteHeader.tsx` — конвенция экспорта + стиля classes
  - Intl — нативный способ форматирования без зависимостей

  **Acceptance Criteria**:
  - [ ] Файл `components/blog/BlogMeta.tsx` существует
  - [ ] `<time dateTime="...">` присутствует (accessibility)
  - [ ] TypeScript проверка проходит

  **QA Scenarios**:

  ```
  Scenario: BlogMeta shows date, author, reading time
    Tool: Playwright
    Preconditions: T15 завершён, dev server running
    Steps:
      1. Navigate: page.goto('http://localhost:3000/blog/accordion-ui-design')
      2. Assert: page.locator('time').first() visible, getAttribute('datetime') matches /^\d{4}-\d{2}-\d{2}/
      3. Assert: page content contains "min read" (или аналог из reading-time пакета)
      4. Assert: page содержит author name (из frontmatter)
      5. Screenshot element: await page.locator('[data-testid="blog-meta"]').screenshot({ path: '.sisyphus/evidence/task-9-meta.png' })
    Expected Result: все три элемента видны
    Evidence: .sisyphus/evidence/task-9-meta.png

  Scenario: BlogMeta formats date in human-readable format
    Tool: Bash + Playwright console
    Steps:
      1. Navigate: '/blog/accordion-ui-design'
      2. Extract: const text = await page.locator('time').first().textContent()
      3. Assert: текст matches /\w+ \d+, \d{4}/ (например "April 18, 2026")
    Expected Result: формат корректный
    Evidence: .sisyphus/evidence/task-9-date-format.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-9-meta.png`
  - [ ] `.sisyphus/evidence/task-9-date-format.txt`

  **Commit**: YES
  - Message: `feat(blog): BlogMeta component (author/date/reading-time)`
  - Files: `components/blog/BlogMeta.tsx`
  - Pre-commit: `npx tsc --noEmit`

- [x] 10. **MDXImage component (next/image wrapper)**

  **What to do**:
  - Создать `components/blog/MDXImage.tsx`
  - Props: `{ src: string; alt: string; width?: number; height?: number; caption?: string }`
  - Рендер: `<next/image>` с defaults (если width/height не заданы — использовать `fill` + aspect-ratio container)
  - Если `caption` задан — обернуть в `<figure>` с `<figcaption>`
  - Для внешних URL (начинаются с http) — unoptimized или remotePatterns в next.config
  - Для локальных (/blog/...) — стандартная оптимизация

  **Must NOT do**:
  - НЕ использовать `<img>` — только next/image
  - НЕ добавлять remotePatterns в этой задаче (все изображения будут локальные после T11)
  - НЕ делать lightbox/zoom (не в scope)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`next-best-practices`]
    - `next-best-practices`: next/image API и оптимизации

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: T12, T13
  - **Blocked By**: T1

  **References**:

  **External References**:
  - next/image: https://nextjs.org/docs/pages/api-reference/components/image

  **WHY Each Reference Matters**:
  - Правильное использование fill/width-height избегает CLS и broken layout

  **Acceptance Criteria**:
  - [ ] Файл `components/blog/MDXImage.tsx` существует
  - [ ] Поддерживает режим `fill` (без явных размеров)
  - [ ] Поддерживает caption через `<figure>`

  **QA Scenarios**:

  ```
  Scenario: MDXImage renders with figure + figcaption
    Tool: Playwright
    Preconditions: T15 завершён; Blog post с inline image в MDX
    Steps:
      1. Navigate: /blog/accordion-ui-design (пост содержит inline images из legacy HTML)
      2. Assert: page.locator('article img').count() > 0
      3. Проверить что хотя бы один img имеет srcset (признак next/image optimization)
      4. Screenshot first inline image: locator('article img').first().screenshot({ path: '.sisyphus/evidence/task-10-mdx-image.png' })
    Expected Result: изображения optimized, не broken
    Evidence: .sisyphus/evidence/task-10-mdx-image.png

  Scenario: MDXImage handles missing src gracefully
    Tool: Bash
    Steps:
      1. Создать fixture MDX с MDXImage src="" в content/blog/__test-empty-img.mdx
      2. Playwright navigate → assert no unhandled exception (page.on('pageerror'))
    Expected Result: нет crash
    Evidence: .sisyphus/evidence/task-10-empty-src.txt
    Cleanup: rm content/blog/__test-empty-img.mdx
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-10-mdx-image.png`
  - [ ] `.sisyphus/evidence/task-10-empty-src.txt`

  **Commit**: YES
  - Message: `feat(blog): MDXImage component with next/image`
  - Files: `components/blog/MDXImage.tsx`
  - Pre-commit: `npx tsc --noEmit`

- [x] 11. **Execute migration: HTML → MDX for all 148 posts**

  **What to do**:
  - Убедиться что T5 завершён (скрипт готов) и T1 (deps установлены)
  - Запустить full migration: `npm run migrate:blog -- --verbose 2>&1 | tee migration-report.txt`
  - Проверить отчёт: `Migrated X / 148 files. Errors: [...]`
  - Для каждого failed файла: исследовать, поправить скрипт или создать вручную `content/blog/<slug>.mdx` с корректным frontmatter и содержимым (fallback)
  - Запустить `ls content/blog/*.mdx | wc -l` → должно быть 148
  - Проверить сохранение обложек: `ls public/blog/covers/ | wc -l` ≥ 148 (учитывая разные расширения)
  - Переместить `migration-report.txt` в `.sisyphus/evidence/task-11-migration-report.txt`

  **Must NOT do**:
  - НЕ игнорировать failed files — добиться 148/148
  - НЕ удалять `legacy-pages/blog/*.html` (source-of-truth на случай re-run)
  - НЕ модифицировать `legacy-pages/` вообще

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Запуск + разбор проблемных случаев + мануальный fix для edge cases; нужна итерация
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES (с T6, T7, T8, T9, T10 — они независимы)
  - **Parallel Group**: Wave 2
  - **Blocks**: T14, T17
  - **Blocked By**: T5, T1

  **References**:

  **Pattern References**:
  - `scripts/migrate-blog-html-to-mdx.ts` (из T5) — script который запускаем
  - `/Users/antonkuptsov/code/setproduct_web/downloaded-site/setproduct.com/legacy-pages/blog/` — источник 148 HTML

  **WHY Each Reference Matters**:
  - Нужно понимать контракт скрипта (флаги, output) чтобы правильно запустить и диагностировать

  **Acceptance Criteria**:
  - [ ] `ls content/blog/*.mdx | wc -l` возвращает 148
  - [ ] `ls public/blog/covers/` содержит файлы (≥ N уникальных cover-ов, может быть меньше 148 если legacy reuse)
  - [ ] Отчёт миграции сохранён в `.sisyphus/evidence/task-11-migration-report.txt`
  - [ ] Нет MDX файлов с пустым `title:` или пустым `slug:` (проверить grep)
  - [ ] `git status content/blog/ public/blog/` показывает новые untracked файлы (готовы к коммиту)

  **QA Scenarios**:

  ```
  Scenario: 148 MDX files exist after migration
    Tool: Bash
    Steps:
      1. Запустить: ls content/blog/*.mdx 2>/dev/null | wc -l > /tmp/count.txt
      2. Assert: cat /tmp/count.txt → 148
    Expected Result: 148
    Failure Indicators: count < 148; count > 148 (duplicate)
    Evidence: .sisyphus/evidence/task-11-file-count.txt

  Scenario: Every MDX has required frontmatter
    Tool: Bash
    Steps:
      1. Запустить: for f in content/blog/*.mdx; do head -20 "$f" | grep -qE "^title:" && head -20 "$f" | grep -qE "^slug:" && head -20 "$f" | grep -qE "^date:" || echo "MISSING: $f"; done > /tmp/frontmatter-check.txt
      2. Assert: /tmp/frontmatter-check.txt пустой (нет MISSING строк)
    Expected Result: 0 missing
    Evidence: .sisyphus/evidence/task-11-frontmatter-check.txt

  Scenario: All MDX files are parseable by gray-matter
    Tool: Bash
    Steps:
      1. Запустить: npx tsx -e "const fs=require('fs'),path=require('path'),m=require('gray-matter'); const dir='content/blog'; const files=fs.readdirSync(dir).filter(f=>f.endsWith('.mdx')); let ok=0,fail=[]; for(const f of files){try{m(fs.readFileSync(path.join(dir,f),'utf8'));ok++}catch(e){fail.push(f+':'+e.message)}}; console.log('OK:'+ok,'FAIL:'+fail.length); fail.forEach(x=>console.log(x))"
      2. Assert stdout: "OK:148", "FAIL:0"
    Expected Result: все 148 парсятся
    Evidence: .sisyphus/evidence/task-11-parseable.txt

  Scenario: Migration report artifact saved
    Tool: Bash
    Steps:
      1. Assert: test -s .sisyphus/evidence/task-11-migration-report.txt (non-empty)
      2. Assert: grep -E "Migrated.*/ ?148" .sisyphus/evidence/task-11-migration-report.txt
    Expected Result: отчёт существует и содержит финальную статистику
    Evidence: .sisyphus/evidence/task-11-migration-report.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-11-file-count.txt`
  - [ ] `.sisyphus/evidence/task-11-frontmatter-check.txt`
  - [ ] `.sisyphus/evidence/task-11-parseable.txt`
  - [ ] `.sisyphus/evidence/task-11-migration-report.txt`

  **Commit**: YES (big commit, content только)
  - Message: `chore(blog): migrate 148 HTML posts to MDX content`
  - Files: `content/blog/*.mdx` (148), `public/blog/covers/**`, `public/blog/assets/**`
  - Pre-commit: scripts пройдут проверку в `npm run build` (T16); здесь достаточно `ls content/blog | wc -l == 148`

- [x] 12. **BlogPostLayout component (compose all)**

  **What to do**:
  - Создать `components/blog/BlogPostLayout.tsx`
  - Props: `{ post: BlogPost }` (из `types/blog.ts`)
  - Структура:
    ```
    <>
      <Head>
        <title>{frontmatter.title} | Setproduct Blog</title>
        <meta name="description" content={frontmatter.description} />
        <link rel="canonical" href={frontmatter.canonical || defaultCanonical} />
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={frontmatter.title} />
        <meta property="og:description" content={frontmatter.description} />
        <meta property="og:image" content={absoluteCoverUrl} />
        <meta property="og:url" content={canonical} />
        <meta property="article:published_time" content={frontmatter.date} />
        <meta property="article:author" content={frontmatter.author} />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={frontmatter.title} />
        <meta name="twitter:description" content={frontmatter.description} />
        <meta name="twitter:image" content={absoluteCoverUrl} />
        {/* JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBlogPostingJsonLd(...)) }} />
      </Head>
      <SiteHeader />
      <main>
        <article>
          <BlogHero title={...} coverImage={...} />
          <BlogMeta author={...} date={...} readingTimeText={...} />
          <div className="prose prose-lg mx-auto">
            <MDXRemote {...post.mdxSource} components={mdxComponents} />
          </div>
        </article>
      </main>
      <SiteFooter />
      <ScrollUpButton />
    </>
    ```
  - **ВАЖНО**: `dangerouslySetInnerHTML` используется ТОЛЬКО для JSON-LD script (это стандартная практика, объект сериализуется безопасно); для MDX контента — `<MDXRemote />`, НЕ dangerouslySetInnerHTML
  - Использовать `SiteHeader`, `SiteFooter`, `ScrollUpButton` из `components/layout/`
  - `mdxComponents` импортируется из `mdx-components.tsx` (T13)

  **Must NOT do**:
  - **НЕ использовать `LegacyPage`** — всё с нуля
  - НЕ использовать `PageShell` — у него другой flow (HTML-injection); делаем прямую композицию
  - НЕ использовать `dangerouslySetInnerHTML` для MDX контента (весь смысл задачи)
  - НЕ добавлять sidebar / TOC (не в scope)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Композиция UI + SEO-meta + правильная структура article (accessibility)
  - **Skills**: [`frontend-ui-ux`, `next-best-practices`, `web-design-guidelines`]
    - `frontend-ui-ux`: верстка article / semantic HTML
    - `next-best-practices`: правильное использование `<Head>` на Pages Router
    - `web-design-guidelines`: accessibility (semantic article, headings, alt)

  **Parallelization**:
  - **Can Run In Parallel**: NO (central integration point)
  - **Parallel Group**: Wave 3 (с T13, T14)
  - **Blocks**: T15
  - **Blocked By**: T6, T7, T8, T9, T10

  **References**:

  **Pattern References**:
  - `/Users/antonkuptsov/code/setproduct_web/downloaded-site/setproduct.com/components/LegacyPage.tsx:1-27` — как делается Head + layout композиция (паттерн для inspiration, НЕ копирование)
  - `/Users/antonkuptsov/code/setproduct_web/downloaded-site/setproduct.com/components/layout/PageShell.tsx:1-18` — показывает порядок SiteHeader + main + SiteFooter + ScrollUpButton; следовать тому же порядку
  - `/Users/antonkuptsov/code/setproduct_web/downloaded-site/setproduct.com/lib/blog/schema.ts` (из T7) — JSON-LD builder

  **API/Type References**:
  - `types/blog.ts:BlogPost` — форма props

  **External References**:
  - MDXRemote client component: https://github.com/hashicorp/next-mdx-remote#mdxremote
  - OG protocol: https://ogp.me/
  - Twitter cards: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards

  **WHY Each Reference Matters**:
  - `LegacyPage.tsx` показывает какие поля Head нужны (title/description/canonical/inlineStyles) — но в новом компоненте inlineStyles не нужны (все стили через Tailwind)
  - `PageShell.tsx` — порядок header → main → footer → scrollup (консистентность с остальным сайтом)

  **Acceptance Criteria**:
  - [ ] Файл `components/blog/BlogPostLayout.tsx` существует
  - [ ] Импортирует `SiteHeader`, `SiteFooter`, `ScrollUpButton` из `components/layout/`
  - [ ] НЕ импортирует `LegacyPage`, `PageShell`
  - [ ] Рендерит OG, Twitter Card, JSON-LD в `<Head>`
  - [ ] TypeScript проверка проходит

  **QA Scenarios**:

  ```
  Scenario: Meta tags are rendered in HTML
    Tool: Bash (curl) + Playwright
    Preconditions: T15 завершён, dev server запущен
    Steps:
      1. curl -s http://localhost:3000/blog/accordion-ui-design > /tmp/post.html
      2. Assert: grep -q 'property="og:type" content="article"' /tmp/post.html
      3. Assert: grep -q 'property="og:title"' /tmp/post.html
      4. Assert: grep -q 'property="og:image"' /tmp/post.html
      5. Assert: grep -q 'name="twitter:card" content="summary_large_image"' /tmp/post.html
      6. Assert: grep -q 'application/ld+json' /tmp/post.html
      7. Assert: grep -q '"@type":"BlogPosting"' /tmp/post.html
      8. Assert: grep -q '<link rel="canonical"' /tmp/post.html
    Expected Result: all 7 grep checks pass
    Evidence: .sisyphus/evidence/task-12-seo-meta.html

  Scenario: Header and Footer are present on blog post
    Tool: Playwright
    Steps:
      1. Navigate: '/blog/accordion-ui-design'
      2. Assert: page.locator('header').first() visible
      3. Assert: page.locator('footer').first() visible
      4. Assert: page.locator('article').count() === 1
      5. Full page screenshot: '.sisyphus/evidence/task-12-layout-full.png'
    Expected Result: semantic structure correct
    Evidence: .sisyphus/evidence/task-12-layout-full.png

  Scenario: No LegacyPage import in layout
    Tool: Bash
    Steps:
      1. Запустить: grep -c "LegacyPage\|PageShell" components/blog/BlogPostLayout.tsx || echo "0"
      2. Assert: результат = 0
    Expected Result: zero imports of LegacyPage/PageShell
    Evidence: .sisyphus/evidence/task-12-no-legacy.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-12-seo-meta.html`
  - [ ] `.sisyphus/evidence/task-12-layout-full.png`
  - [ ] `.sisyphus/evidence/task-12-no-legacy.txt`

  **Commit**: YES
  - Message: `feat(blog): BlogPostLayout with SEO + Header/Footer`
  - Files: `components/blog/BlogPostLayout.tsx`
  - Pre-commit: `npx tsc --noEmit`

- [x] 13. **MDX components map**

  **What to do**:
  - Создать `mdx-components.tsx` в корне проекта (или `components/blog/mdx-components.tsx`)
  - Экспортировать `blogMdxComponents` — объект mapping HTML tags + custom components для MDX:
    ```ts
    export const blogMdxComponents = {
      img: MDXImage,  // из T10
      // h1/h2/h3/... могут использовать default (prose) — не переопределяем если не нужно
      // Optional custom: Callout, Alert (заготовка для будущего)
    };
    ```
  - НЕ переопределять стандартные элементы без необходимости — пусть prose-класс в BlogPostLayout делает typography

  **Must NOT do**:
  - НЕ добавлять кастомные компоненты "на всякий случай"
  - НЕ переопределять h1/h2/h3 если нет конкретной необходимости

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocks**: T15
  - **Blocked By**: T10

  **References**:

  **Pattern References**:
  - `components/blog/MDXImage.tsx` (из T10)

  **External References**:
  - MDXRemote components API: https://github.com/hashicorp/next-mdx-remote#adding-custom-components

  **Acceptance Criteria**:
  - [ ] Файл существует, экспортирует `blogMdxComponents`
  - [ ] Объект содержит как минимум `img: MDXImage`
  - [ ] TypeScript проверка проходит

  **QA Scenarios**:

  ```
  Scenario: Components map is importable and contains img mapping
    Tool: Bash
    Steps:
      1. Запустить: npx tsx -e "import {blogMdxComponents} from './components/blog/mdx-components'; console.log(Object.keys(blogMdxComponents))"
      2. Assert stdout contains 'img'
    Expected Result: ['img', ...]
    Evidence: .sisyphus/evidence/task-13-components-map.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-13-components-map.txt`

  **Commit**: YES
  - Message: `feat(blog): MDX component map`
  - Files: `components/blog/mdx-components.tsx`
  - Pre-commit: `npx tsc --noEmit`

- [x] 14. **Quality sample check (10 posts)**

  **What to do**:
  - Выбрать 10 случайных MDX-файлов из `content/blog/` (можно через `ls content/blog | shuf | head -10`)
  - Для каждого:
    1. Прочитать файл
    2. Убедиться что frontmatter валиден и содержит все обязательные поля (title, description, slug, date, author, coverImage)
    3. Убедиться что `coverImage` путь существует (`test -f public/blog/covers/...`)
    4. Проверить длину markdown body (≥ 100 символов — не empty)
    5. Убедиться что нет остаточного HTML мусора (inline `<style>`, `<script>`, Webflow-классы в большом количестве)
  - Если какой-то пост имеет критические проблемы — задокументировать в отчёте и поправить в T11 (loopback)

  **Must NOT do**:
  - НЕ проверять ВСЕ 148 (T17 сделает full QA через рендеринг)
  - НЕ переписывать контент вручную — это задача скрипта из T5/T11

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Нужна осмысленная валидация, возможно потребуется ручной поправить скрипт/файл
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocks**: T15
  - **Blocked By**: T11

  **References**:

  **Pattern References**:
  - `content/blog/*.mdx` (из T11)
  - `scripts/migrate-blog-html-to-mdx.ts` (из T5) — на случай нужны правки

  **Acceptance Criteria**:
  - [ ] Отчёт `.sisyphus/evidence/task-14-quality-report.txt` содержит результат 10 проверок
  - [ ] Все 10 пройдены (или исправлены и перепроверены)

  **QA Scenarios**:

  ```
  Scenario: 10 random MDX posts have valid structure
    Tool: Bash
    Steps:
      1. Запустить: ls content/blog/*.mdx | shuf -n 10 > /tmp/sample10.txt (или gshuf на macOS)
      2. Для каждого файла из /tmp/sample10.txt: npx tsx -e скрипт который проверяет 5 условий (frontmatter fields, coverImage exists, body length, no <style>, no <script>)
      3. Сохранить отчёт: .sisyphus/evidence/task-14-quality-report.txt
      4. Assert: в отчёте 10 строк "PASS"
    Expected Result: 10/10 PASS
    Failure Indicators: "FAIL" строки → фиксить скрипт в T11 и re-run
    Evidence: .sisyphus/evidence/task-14-quality-report.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-14-quality-report.txt`

  **Commit**: YES (может быть no-op если правок нет; или re-migration коммит)
  - Message: `chore(blog): fixture sampled MDX post quality`
  - Files: возможно `scripts/migrate-blog-html-to-mdx.ts` + re-generated `content/blog/*.mdx`

- [x] 15. **Rewrite pages/blog/[slug].tsx (SSG + BlogPostLayout)**

  **What to do**:
  - Полностью переписать `pages/blog/[slug].tsx`:
    - Убрать import `LegacyPage` и `getCollectionPageData`
    - Убрать `getServerSideProps`
    - Добавить `getStaticPaths` возвращающий все slugs через `getAllBlogSlugs()`
      - `fallback: false` (все 148 постов pre-rendered)
    - Добавить `getStaticProps` использующий `getBlogPost(params.slug)`:
      - Если `null` → `return { notFound: true }`
      - Сериализовать `mdxSource` можно уже внутри `getBlogPost` (T6)
      - Вернуть `{ props: { post } }`
    - Default export: `<BlogPostLayout post={post} />`
  - Сохранить типизацию: `GetStaticPaths`, `GetStaticProps`, `InferGetStaticPropsType`

  **Must NOT do**:
  - **НЕ импортировать `LegacyPage`** (цель всего плана)
  - НЕ импортировать `lib/legacy-collections.ts`, `lib/legacy-page.ts`
  - НЕ использовать `getServerSideProps`
  - НЕ менять имя файла / URL pattern

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Центральная точка интеграции, требует правильной типизации getStaticPaths/Props
  - **Skills**: [`next-best-practices`]
    - `next-best-practices`: SSG patterns, fallback strategy

  **Parallelization**:
  - **Can Run In Parallel**: NO (single file, gate-keeper)
  - **Parallel Group**: Wave 4
  - **Blocks**: T16
  - **Blocked By**: T12, T13, T14

  **References**:

  **Pattern References**:
  - `/Users/antonkuptsov/code/setproduct_web/downloaded-site/setproduct.com/pages/blog/[slug].tsx:1-32` — **ТЕКУЩИЙ** код который полностью заменяем
  - `/Users/antonkuptsov/code/setproduct_web/downloaded-site/setproduct.com/components/blog/BlogPostLayout.tsx` (из T12)
  - `/Users/antonkuptsov/code/setproduct_web/downloaded-site/setproduct.com/lib/blog/mdx.ts` (из T6)

  **API/Type References**:
  - `types/blog.ts:BlogPost`
  - Next.js types: `GetStaticPaths`, `GetStaticProps`, `InferGetStaticPropsType`

  **WHY Each Reference Matters**:
  - Текущий файл — spec того что убираем; надо убрать каждую строку с LegacyPage / legacy-collections
  - `BlogPostLayout` + `getBlogPost` — новый pipeline

  **Acceptance Criteria**:
  - [ ] `grep -c "LegacyPage" pages/blog/[slug].tsx` = 0
  - [ ] `grep -c "legacy-collections\|legacy-page" pages/blog/[slug].tsx` = 0
  - [ ] `grep -c "getServerSideProps" pages/blog/[slug].tsx` = 0
  - [ ] `grep -c "getStaticPaths\|getStaticProps" pages/blog/[slug].tsx` ≥ 2
  - [ ] `grep -c "BlogPostLayout" pages/blog/[slug].tsx` ≥ 1
  - [ ] TypeScript проверка проходит

  **QA Scenarios**:

  ```
  Scenario: No LegacyPage references in new file
    Tool: Bash
    Steps:
      1. Запустить: grep -n "LegacyPage\|legacy-collections\|legacy-page\|getServerSideProps" pages/blog/\[slug\].tsx > /tmp/legacy-refs.txt ; echo "exit=$?"
      2. Assert: grep exit=1 (no matches found) OR /tmp/legacy-refs.txt empty
    Expected Result: 0 references
    Evidence: .sisyphus/evidence/task-15-no-legacy-refs.txt

  Scenario: SSG hooks present
    Tool: Bash
    Steps:
      1. Запустить: grep -E "getStaticPaths|getStaticProps" pages/blog/\[slug\].tsx
      2. Assert: оба найдены
    Expected Result: оба хука присутствуют
    Evidence: .sisyphus/evidence/task-15-ssg-hooks.txt

  Scenario: File compiles with TypeScript
    Tool: Bash
    Steps:
      1. Запустить: npx tsc --noEmit 2>&1 | grep -E "pages/blog/\[slug\].tsx" || echo "CLEAN"
      2. Assert: "CLEAN"
    Expected Result: "CLEAN"
    Evidence: .sisyphus/evidence/task-15-tsc.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-15-no-legacy-refs.txt`
  - [ ] `.sisyphus/evidence/task-15-ssg-hooks.txt`
  - [ ] `.sisyphus/evidence/task-15-tsc.txt`

  **Commit**: YES
  - Message: `refactor(pages): blog/[slug] uses BlogPostLayout + SSG`
  - Files: `pages/blog/[slug].tsx`
  - Pre-commit: `npx tsc --noEmit`

- [x] 16. **Build verification**

  **What to do**:
  - Запустить production build: `npm run build` (или `bun run build`)
  - Убедиться что:
    - Все 148 страниц `/blog/[slug]` SSG-сгенерированы
    - Нет warnings о `<img>` без alt / missing next/image props
    - Нет TypeScript errors
  - Сохранить полный stdout build в `.sisyphus/evidence/task-16-build-output.txt`

  **Must NOT do**:
  - НЕ игнорировать build warnings — fix или задокументировать почему игнорируем
  - НЕ коммитить если build failed

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4
  - **Blocks**: T17
  - **Blocked By**: T15

  **References**:

  **Pattern References**:
  - `package.json:scripts.build` — команда сборки

  **Acceptance Criteria**:
  - [ ] Build exit code = 0
  - [ ] Build output упоминает 148 blog pages (или больше, включая прочие)
  - [ ] 0 TypeScript errors
  - [ ] 0 Next.js build errors

  **QA Scenarios**:

  ```
  Scenario: Production build succeeds
    Tool: Bash
    Steps:
      1. Запустить: npm run build 2>&1 | tee .sisyphus/evidence/task-16-build-output.txt
      2. Assert exit code 0
      3. Assert stdout: grep -E "blog/\[slug\]|○|●" .sisyphus/evidence/task-16-build-output.txt  (Next printов routes)
    Expected Result: build PASS, blog route отражён
    Failure Indicators: exit ≠ 0, "Failed to compile", "Type error:"
    Evidence: .sisyphus/evidence/task-16-build-output.txt

  Scenario: 148 blog pages pre-rendered
    Tool: Bash
    Steps:
      1. Запустить: ls .next/server/pages/blog/ 2>/dev/null | grep -c "\.html$" || ls .next/server/pages/blog/ 2>/dev/null | wc -l
      2. Assert: count = 148 (или ≥ 148 если учитывая manifest файлы)
    Expected Result: 148 pre-rendered html
    Evidence: .sisyphus/evidence/task-16-prerendered-count.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-16-build-output.txt`
  - [ ] `.sisyphus/evidence/task-16-prerendered-count.txt`

  **Commit**: YES (если build failed — не коммитим, итерируем)
  - Message: `chore(build): verify production build`
  - Files: (возможно fixes по build warnings)

- [x] 17. **Playwright QA — 5 representative blog posts + edge cases**

  **What to do**:
  - Запустить dev server: `npm run dev &` (или production: `npm run start &` после T16)
  - Выбрать 5 репрезентативных постов:
    1. `accordion-ui-design` (короткий)
    2. Самый длинный пост (по размеру MDX)
    3. Пост с множеством изображений
    4. Пост с таблицей или списком
    5. Пост с embed/iframe (если есть — можно найти grep по `<iframe>` в content/blog)
  - Через Playwright для каждого:
    - Navigate → wait for H1 → screenshot
    - Assert H1 text из frontmatter
    - Assert Header/Footer visible
    - Assert cover image loaded (не 404)
    - Extract `<head>` → assert OG/Twitter/JSON-LD present
    - Parse JSON-LD → assert `@type === "BlogPosting"`
  - Edge case test:
    - Navigate `/blog/nonexistent-slug-zzz` → assert 404 response
  - Сохранить все screenshots и отчёт в `.sisyphus/evidence/task-17-playwright/`

  **Must NOT do**:
  - НЕ запускать QA если build failed (T16 — prerequisite)
  - НЕ использовать `page.waitForTimeout` — использовать `waitForSelector`
  - НЕ игнорировать console errors — собирать и репортить через `page.on('console')`

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: нужна осмысленная навигация и проверки
  - **Skills**: [`playwright`]
    - `playwright`: канон Playwright MCP для browser automation

  **Parallelization**:
  - **Can Run In Parallel**: NO (final gate)
  - **Parallel Group**: Wave 4
  - **Blocks**: F1-F4
  - **Blocked By**: T16

  **References**:

  **Pattern References**:
  - `content/blog/*.mdx` (из T11)
  - `components/blog/BlogPostLayout.tsx` (из T12)

  **External References**:
  - Playwright skill

  **Acceptance Criteria**:
  - [ ] 5 постов успешно отрендерены (screenshots сохранены)
  - [ ] Все 5 имеют валидный OG, Twitter, JSON-LD
  - [ ] Edge case 404 работает
  - [ ] 0 console errors на всех страницах

  **QA Scenarios**:

  ```
  Scenario: 5 representative blog posts render correctly
    Tool: Playwright
    Preconditions: dev/prod server running
    Steps:
      1. For each of 5 slugs:
         a. Navigate: /blog/<slug>
         b. Wait: waitForSelector('h1')
         c. Assert: h1 text contains expected title substring
         d. Assert: locator('header').first() visible
         e. Assert: locator('footer').first() visible
         f. Extract: const html = await page.content(); grep for 'og:type', 'twitter:card', 'application/ld+json'
         g. Parse JSON-LD → assert @type === "BlogPosting"
         h. Check console errors: collect page.on('console') for 'error' level
         i. Screenshot: .sisyphus/evidence/task-17-playwright/<slug>.png (fullPage)
      2. Assert: 0 console errors
    Expected Result: 5/5 pass, 0 console errors
    Evidence: .sisyphus/evidence/task-17-playwright/*.png + report.json

  Scenario: 404 for non-existent slug
    Tool: Playwright
    Steps:
      1. Запросить: const resp = await page.goto('/blog/definitely-nonexistent-slug-xyz')
      2. Assert: resp.status() === 404
    Expected Result: 404 response
    Evidence: .sisyphus/evidence/task-17-playwright/404.txt

  Scenario: Cover image loads (not 404)
    Tool: Playwright
    Steps:
      1. For each of 5 slugs: navigate, get first img[alt] in article
      2. Execute: const src = await img.getAttribute('src'); const resp = await page.request.get(new URL(src, page.url()).href)
      3. Assert: resp.status() === 200
    Expected Result: 5/5 covers load
    Evidence: .sisyphus/evidence/task-17-playwright/covers.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-17-playwright/<slug>.png` × 5
  - [ ] `.sisyphus/evidence/task-17-playwright/404.txt`
  - [ ] `.sisyphus/evidence/task-17-playwright/covers.txt`
  - [ ] `.sisyphus/evidence/task-17-playwright/report.json` (summary)

  **Commit**: YES
  - Message: `test(blog): Playwright QA scenarios for blog posts`
  - Files: (evidence files не коммитим, но коммит логически помечает прохождение QA)
  - Pre-commit: все QA сценарии pass

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.

- [x] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify existence (read file, curl URL, run command). For each "Must NOT Have": grep codebase for forbidden patterns — reject with file:line if found. Checks: `grep -r "LegacyPage" pages/blog/` = 0, `ls content/blog/*.mdx | wc -l` = 148, LegacyPage.tsx still exists, templates/legal routes unchanged. Check evidence files in `.sisyphus/evidence/`.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [x] F2. **Code Quality Review** — `unspecified-high`
  Run `tsc --noEmit` + `bun run build`. Review all changed/new files for: `as any`, `@ts-ignore`, empty catches, `console.log` in prod code (migration script exempt), commented-out code, unused imports. Check for AI slop: excessive comments, over-abstraction, generic names (data/result/item/temp). Verify no `dangerouslySetInnerHTML` in new code.
  Output: `Build [PASS/FAIL] | tsc [PASS/FAIL] | Files [N clean/N issues] | No-LegacyPage-in-blog [YES/NO] | VERDICT`

- [x] F3. **Real Manual QA** — `unspecified-high` + `playwright` skill
  Start dev server (`bun run dev`). For 8 blog post URLs (include edge cases: long title, no cover, many images, tables): navigate, assert H1 text, assert Header presence, assert Footer presence, assert cover image loaded (not 404), capture OG meta from `<head>`, validate JSON-LD parses, screenshot full page. Save all to `.sisyphus/evidence/final-qa/{slug}/`. Also test: 404 for `/blog/nonexistent-slug`.
  Output: `URLs [N/N pass] | OG [N/N] | JSON-LD [N/N valid] | Screenshots [N] | VERDICT`

- [x] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do" + acceptance criteria, compare to actual `git diff`. Verify 1:1 — all spec items built, nothing beyond spec. Check "Must NOT Have": no changes to LegacyPage.tsx, templates/[slug].tsx, legal/[slug].tsx, root [slug].tsx, legacy-page.ts, legacy-collections.ts, PageShell.tsx. Check: legacy-pages/blog/*.html NOT deleted. No /pages/blog/index.tsx created.
  Output: `Tasks [N/N compliant] | Untouched-Files [N/N] | Unaccounted [CLEAN/N] | VERDICT`

---

## Commit Strategy

Один коммит на логическую задачу:

| Task | Commit Message |
|------|---------------|
| T1 | `chore(blog): add MDX + gray-matter + shiki dependencies` |
| T2 | `style(blog): wire @tailwindcss/typography plugin` |
| T3 | `feat(blog): define BlogFrontmatter and BlogPost types` |
| T4 | `feat(blog): add reading-time utility` |
| T5 | `feat(scripts): scaffold HTML-to-MDX migration script` |
| T6 | `feat(blog): MDX loader with frontmatter parsing` |
| T7 | `feat(blog): JSON-LD BlogPosting schema builder` |
| T8 | `feat(blog): BlogHero component (cover + title)` |
| T9 | `feat(blog): BlogMeta component (author/date/reading-time)` |
| T10 | `feat(blog): MDXImage component with next/image` |
| T11 | `chore(blog): migrate 148 HTML posts to MDX content` |
| T12 | `feat(blog): BlogPostLayout with SEO + Header/Footer` |
| T13 | `feat(blog): MDX component map` |
| T14 | `chore(blog): fixture sampled MDX post quality` |
| T15 | `refactor(pages): blog/[slug] uses BlogPostLayout + SSG` |
| T16 | `chore(build): verify production build` |
| T17 | `test(blog): Playwright QA scenarios for blog posts` |

Pre-commit на каждом: `bun run build` (или `npm run build`) — должен pass.

---

## Success Criteria

### Verification Commands
```bash
# No LegacyPage in blog route
grep -r "LegacyPage" pages/blog/ && exit 1 || echo "OK"
# Expected: OK

# 148 MDX posts exist
test $(ls content/blog/*.mdx | wc -l) -eq 148 && echo "OK"
# Expected: OK

# LegacyPage component still exists (used by other routes)
test -f components/LegacyPage.tsx && echo "OK"
# Expected: OK

# Templates/legal/root routes unchanged
git diff --name-only main -- pages/templates pages/legal pages/[slug].tsx
# Expected: (empty output)

# Build passes
bun run build || npm run build
# Expected: build succeeds with 148 static blog pages

# Dev server renders a blog post
curl -s http://localhost:3000/blog/accordion-ui-design | grep -q "Accordion UI design" && echo "OK"
# Expected: OK
```

### Final Checklist
- [ ] `pages/blog/[slug].tsx` не импортирует LegacyPage
- [ ] 148 MDX-файлов в `content/blog/`
- [ ] Все cover images в `public/blog/covers/` (нет внешних Webflow CDN ссылок на hero)
- [ ] `components/LegacyPage.tsx` остался на месте
- [ ] `pages/templates/[slug].tsx`, `pages/legal/[slug].tsx`, `pages/[slug].tsx` не изменены
- [ ] `bun run build` (или `npm run build`) проходит без ошибок
- [ ] Playwright QA: ≥8/8 репрезентативных постов рендерятся корректно
- [ ] OG + Twitter + JSON-LD присутствуют в HTML каждого поста
- [ ] Reading time показывается и вычисляется из контента
- [ ] URL `/blog/{slug}` сохранены 1:1
