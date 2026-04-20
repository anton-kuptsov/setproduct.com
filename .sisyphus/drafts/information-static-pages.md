# Draft: Конвертация страниц раздела Information в статические компоненты

## Requirements (confirmed)
- **Цель**: Переделать 3 страницы из раздела Information в статичные React-компоненты
- **Страницы**:
  1. `/testimonials` (сейчас `pages/testimonials.tsx`)
  2. `/legal/license` (сейчас через `pages/legal/[slug].tsx`)
  3. `/legal/refunds-policy` (сейчас через `pages/legal/[slug].tsx`)
- **Убрать**: `getServerSideProps` и `LegacyPage` компонент
- **Источник правды для контента**: https://www.setproduct.com/ (оригинальный сайт)
- **Контент должен строго соответствовать** оригиналу

## Technical Decisions
- Intent: REFACTORING существующих страниц
- Нужен статический Next.js Page без SSR/SSG через getServerSideProps

## Research Findings
### Текущее состояние
- `pages/testimonials.tsx` — уже тонкая обёртка (5 строк) без getServerSideProps ✅
- `components/pages/TestimonialsPage.tsx` — СУЩЕСТВУЕТ, но с placeholder-текстом вместо реальных карточек отзывов ⚠️
- `pages/legal/[slug].tsx` — использует `getServerSideProps` + `buildLegacyPageData()` + `LegacyPage` (dangerouslySetInnerHTML). Обслуживает 3 slug'а:
  - `license` → `legacy-pages/legal/license.html`
  - `refunds-policy` → `legacy-pages/legal/refunds-policy.html`
  - `terms-of-paid-posts` → `legacy-pages/legal/terms-of-paid-posts.html`
- `lib/legacy-page.ts` использует `fs.readFileSync` → не может быть в статике

### Канонический паттерн (из HomePage/DashboardsPage/TestimonialsPage)
```tsx
// pages/xyz.tsx (5 строк)
import XyzPage from "../components/pages/XyzPage";
export default function XyzRoute() { return <XyzPage />; }

// components/pages/XyzPage.tsx
<Head>title/description/canonical</Head>
<SiteHeader />
<main>...webflow-classes JSX...</main>
<SiteFooter />
<ScrollUpButton />
```
- Layout НЕ через Layout-компонент — SiteHeader/SiteFooter вставляются напрямую
- Метаданные читаются из `data/pages-meta.ts` через `PAGE_META[key]`
- Классы Webflow используются как есть (`className="section"`, `className="heading-style-h1"`)
- Изображения — обычные `<img>` с путями `/external/cdn.prod.website-files.com/...`

### Контент-карта страниц (извлечено из legacy-pages/*.html)
**License** (`legacy-pages/legal/license.html`):
- Hero: h1 "Licensing terms" + subtitle
- Две колонки: TOC (Finsweet) + rich-text с 7 секциями h2 (Intro, End product, Allowed ✔, Not allowed ✘, Other terms, Individual, Business)

**Refunds-policy** (`legacy-pages/legal/refunds-policy.html`):
- Одна секция: h1 "Refunds policy" + 2 параграфа с "contact us" ссылкой (modal2)

**Testimonials** (`testimonials.html`):
- Hero: h1 "Our satisfied Customers" + subtitle "We helped more than 3,000..."
- Grid из 6 testimonial карточек (lightbox + .avif изображения)
- В оригинальном сайте ~18 карточек (page 3 of 3), в локальных файлах только 6

### Необходимые правки данных
- `data/pages-meta.ts` — НЕТ записей для `license` и `refunds-policy` (нужно добавить)
- `data/breadcrumbs.ts` — НЕТ записей для legal pages
- `PAGE_META.testimonials` уже существует

## Open Questions
- terms-of-paid-posts — в задаче не упомянут. Конвертировать тоже (для удаления [slug].tsx) или оставить на LegacyPage?
- TestimonialsPage — заменить placeholder реальными карточками?
- Контент testimonials — использовать 6 локальных карточек или загрузить все ~18 с live-сайта?
- TOC license — хардкодить 7 anchor-ссылок или убрать колонку?
- "Contact us" link в refunds — mailto или оставить data-remodal-target?
- Удалять ли `LegacyPage.tsx`, `lib/legacy-page.ts`, `PageShell.tsx` если станут не нужны?

## Scope Boundaries
- INCLUDE: только 3 указанные страницы
- EXCLUDE: другие страницы, стили сайта, логика Layout-компонентов
