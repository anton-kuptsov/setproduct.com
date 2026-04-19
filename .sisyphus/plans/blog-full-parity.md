# Blog Full Parity with Original Setproduct.com

## TL;DR
Привести `/blog/[slug]` к оригинальному визуалу setproduct.com: 2-колоночный layout с sticky sidebar (TOC + mini subscribe + social share), новый hero (category badge, subtitle, breadcrumbs), author с аватаркой, inline Section CTA из CSV, TemplateShowcase slider, Related posts. Re-migrate 148 постов из CSV чтобы получить недостающие поля (Category, Subtitle, metaTitle, cardDescription, inlineCta).

## Context
- Оригинал: https://www.setproduct.com/blog/pay-for-claude-pro-with-usdt
- Legacy HTML: `legacy-pages/blog/*.html` — 148 постов
- CSV (145 постов из БД): `/Users/antonkuptsov/Downloads/Setproduct - Blog Posts - 65f1a0e98262e6d78310837e.csv`
- Текущий layout: `components/blog/BlogPostLayout.tsx` (упрощённый, 1-колоночный)

## User Decisions
- Slider: всегда `<TemplateShowcase />` (одинаковый набор)
- Аватарки: мануальный map `lib/blog/authors.ts` + скачать в `public/blog/authors/`
- CSV → frontmatter: Category, Subtitle, metaTitle, cardDescription, inlineCta (Section CTA)
- FAQ и Dashboards list — НЕ включаем (out of scope)

## Must Have
- 2-колоночный layout: sticky sidebar (column1) + content (column2)
- Hero: category badge, title, subtitle, cover, date+reading-time, breadcrumbs
- Author block с аватаркой и именем
- Sidebar: TOC (из H2), inline subscribe CTA, social share (copy/LinkedIn/Facebook/Twitter)
- Inline Section CTA между контентом и slider
- `<TemplateShowcase />` после CTA
- `<CtaSubscribe />` большой блок
- Related posts (3 поста той же категории)
- Визуал 1:1 с оригиналом (классы Webflow: `blogpost_content-section`, `blogpost_content-column1/2`, etc.)
- Все 148 постов рендерятся без ошибок

## Must NOT Have
- НЕ менять `lib/legacy-*` и другие роуты (templates/legal/root)
- НЕ добавлять FAQ (out of scope)
- НЕ добавлять Dashboards list per-post (slider всегда одинаковый)
- НЕ использовать `dangerouslySetInnerHTML` для MDX контента

## Execution Waves

**Wave 1 (parallel):**
- T1: CSV parser script + author extraction
- T2: `lib/blog/authors.ts` + download avatars to `public/blog/authors/`
- T3: Extend frontmatter types (BlogFrontmatter + new fields)

**Wave 2 (after T1):**
- T4: Re-migration script that merges CSV fields into existing MDX files (Category, Subtitle, metaTitle, cardDescription, inlineCta)
- T5: Execute re-migration on all 148 posts

**Wave 3 (after T3, parallel UI):**
- T6: New BlogHero (category, subtitle, breadcrumbs, meta)
- T7: BlogAuthor component (avatar + name link)
- T8: BlogSidebar component (TOC + mini-subscribe + share)
- T9: BlogTableOfContents (auto-gen from H2 in MDX)
- T10: BlogShareLinks component
- T11: BlogInlineCta component (renders when inlineCta in frontmatter)
- T12: BlogRelatedPosts component (3 same-category)

**Wave 4 (after Wave 3):**
- T13: Rewrite BlogPostLayout composing all new pieces in 2-column structure
- T14: Build verification (npm run build)
- T15: Playwright QA comparing against original site

**Final Wave:** F1-F4 review agents (oracle plan compliance, code quality, real QA, scope fidelity).

---

## TODOs

### T1. CSV parser + author extraction script

- Создать `scripts/analyze-blog-csv.ts`
- Парсить CSV правильно (используя `csv-parse` npm пакет — он корректно обрабатывает многострочные поля с embedded quotes)
- Вывести: unique authors list, unique categories, sample of Section CTA fields, Subtitle sample
- Output файл: `.sisyphus/evidence/csv-analysis.json` со статистикой
- Install dep: `npm install --save-dev csv-parse`
- Commit: `chore(scripts): add CSV parser for blog re-migration`

### T2. Author map + avatars

- Создать `lib/blog/authors.ts` с типом Author и map:
  ```
  { "roman-kamushken": { name: "Roman Kamushken", avatar: "/blog/authors/roman-kamushken.jpg", bio?, link? } }
  ```
- Извлечь аватарки из legacy HTML (`grep "blogpost_author-img" -A 3 legacy-pages/blog/*.html | grep "src=" | sort -u`) — найти unique avatar URLs
- Скачать в `public/blog/authors/<slug>.jpg`
- Авторы: roman-kamushken, jamshed-kasimov, kari-nelson, nick-rybak, jeff-flipper (плюс fallback "setproduct-team")
- Commit: `feat(blog): author map with avatars`

### T3. Extend BlogFrontmatter type

- В `types/blog.ts` добавить поля:
  ```
  category?: string;        // e.g. "technology"
  subtitle?: string;        // H1 subtitle in hero
  metaTitle?: string;       // SEO title (separate from H1)
  cardDescription?: string; // shorter for Related/Listing cards
  inlineCta?: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
  ```
- Category type: union `"tutorials" | "technology" | "startups-saas" | "growth-hacking" | "inspiration" | "resources" | "research"` (найти все из CSV)
- Commit: `feat(blog): extend frontmatter with category/subtitle/inlineCta`

### T4. CSV merger script

- Создать `scripts/merge-csv-into-mdx.ts`
- Для каждого поста в CSV:
  1. Найти соответствующий MDX файл по slug
  2. Прочитать существующий frontmatter через gray-matter
  3. Добавить/обновить поля: category (map CSV category lowercase to slug), subtitle (from "Blog post Subtitle"), metaTitle (from "Meta Title (SEO)"), cardDescription (from "Card Description")
  4. Если в CSV заполнены "Section CTA Title/Description/Button text/Button link" → добавить inlineCta объект
  5. Записать обратно через gray-matter stringify
- Флаги: `--dry-run`, `--slug=<s>`, `--verbose`
- НЕ трогать MDX body, только frontmatter
- Commit: `feat(scripts): CSV → MDX frontmatter merger`

### T5. Execute merge on all 148 posts

- Запустить `npm run merge-csv-blog -- --verbose`
- Проверить: grep `^category:` content/blog/*.mdx | wc -l → близко к 145 (CSV has 145)
- 3 поста без CSV match — логировать, они останутся без category (или выставить default "tutorials")
- Commit: `chore(blog): merge CSV fields into 148 MDX files`

### T6. New BlogHero

- Переделать `components/blog/BlogHero.tsx`:
  - Category badge (если есть category в frontmatter)
  - Title H1
  - Subtitle paragraph (если есть)
  - Cover image (next/image fill, responsive)
  - Meta row: "Published on {date}" | "{readingTime}"
  - Breadcrumbs внизу hero: "Tutorials" / "Technology" / etc → "[post title]"
- Использовать Webflow классы: `blogpost_hero-section`, `blogpost_hero-img-wr`, `blogpost_hero-info-wr`, `blogpost_hero-breadcrump-wr`
- Commit: `feat(blog): BlogHero with category/subtitle/breadcrumbs`

### T7. BlogAuthor component

- Создать `components/blog/BlogAuthor.tsx`
- Props: `{ authorSlug: string }` → resolve через `lib/blog/authors.ts`
- Рендер: `<a className="blogpost_author-wr">` → аватарка (next/image) + имя
- Fallback если author не найден в map: показать имя из frontmatter, без аватарки
- Commit: `feat(blog): BlogAuthor component with avatar`

### T8. BlogSidebar component

- Создать `components/blog/BlogSidebar.tsx`
- Props: `{ headings: Array<{id,text,level}> }` (для TOC)
- Использует T9 (BlogTableOfContents) + T10 (BlogShareLinks) + inline mini subscribe form
- Webflow классы: `blogpost_content-column1`, `blogpost_navigation-wr`, `blogpost_content-cta-wr`, `blogpost_content-share-wr`
- Sticky на desktop, hidden на мобильном (кроме share в конце статьи)
- Commit: `feat(blog): BlogSidebar with TOC + mini CTA + share`

### T9. BlogTableOfContents

- `components/blog/BlogTableOfContents.tsx`
- Props: `{ headings: Array<{id,text,level}> }`
- Автогенерация из H2/H3 в MDX — extract на сервере в `lib/blog/mdx.ts`, передать в layout
- В MDX loader добавить: парсить content через `remark-slug` + collect headings
- Active state при скролле (опционально, MVP без)
- Commit: `feat(blog): auto TOC from MDX headings`

### T10. BlogShareLinks

- `components/blog/BlogShareLinks.tsx`
- Props: `{ url: string; title: string }`
- 4 кнопки: copy link (uses navigator.clipboard), LinkedIn share, Facebook share, Twitter share
- URLs: `https://twitter.com/intent/tweet?url=...&text=...`, `https://www.facebook.com/sharer/sharer.php?u=...`, `https://www.linkedin.com/sharing/share-offsite/?url=...`
- Иконки: использовать те же SVG пути что в legacy HTML (external/cdn.prod.website-files.com...)
- Commit: `feat(blog): BlogShareLinks component`

### T11. BlogInlineCta

- `components/blog/BlogInlineCta.tsx`
- Props: `{ title, description, buttonText, buttonLink }` (из frontmatter.inlineCta)
- Рендер только если inlineCta присутствует
- Webflow классы: `section`, `main_cta-section` (вариация с центрированием)
- Commit: `feat(blog): BlogInlineCta component`

### T12. BlogRelatedPosts

- `components/blog/BlogRelatedPosts.tsx`
- Props: `{ currentSlug: string; currentCategory?: string }`
- На build-time: выбрать 3 поста с same category (fallback: latest 3 other posts)
- Карточки: cover image + title + cardDescription + date
- Webflow классы: похожие на те что в `BlogPostsHome.tsx`
- Функция в `lib/blog/mdx.ts`: `getRelatedPosts(currentSlug, category, limit=3)`
- Commit: `feat(blog): BlogRelatedPosts component`

### T13. Rewrite BlogPostLayout

- Полностью переписать `components/blog/BlogPostLayout.tsx`
- Структура:
  ```
  <Head>...all SEO + JSON-LD (keep existing)</Head>
  <SiteHeader />
  <main>
    <BlogHero {...} />
    <div className="blogpost_content-section">
      <BlogSidebar headings={headings} url={...} title={...} />
      <article className="blogpost_content-column2">
        <BlogAuthor authorSlug={frontmatter.author} />
        <div className="rich-text-18 w-richtext prose">
          <MDXRemote {...mdxSource} components={blogMdxComponents} />
        </div>
      </article>
    </div>
    {frontmatter.inlineCta && <BlogInlineCta {...frontmatter.inlineCta} />}
    <CtaSubscribe />
    <TemplateShowcase />
    <BlogRelatedPosts currentSlug={frontmatter.slug} currentCategory={frontmatter.category} />
  </main>
  <SiteFooter />
  <ScrollUpButton />
  ```
- Передать headings из getStaticProps (сгенерированные в mdx.ts)
- Commit: `refactor(blog): BlogPostLayout full parity with original`

### T14. Build verification

- `npm run build` passes
- 148 pages pre-rendered
- 0 TypeScript errors
- Save to `.sisyphus/evidence/task-14-build-output.txt`
- Commit: `chore(build): verify full parity build`

### T15. Playwright visual QA

- Открыть `http://localhost:3000/blog/pay-for-claude-pro-with-usdt`
- Screenshot full page → `.sisyphus/evidence/parity-qa/pay-for-claude-pro-with-usdt-local.png`
- Открыть `https://www.setproduct.com/blog/pay-for-claude-pro-with-usdt`
- Screenshot → `pay-for-claude-pro-with-usdt-original.png`
- Сравнить: 2 колонки, author avatar, TOC, share, CTA, slider, related — все на месте
- Проверить ещё 4 постов: `accordion-ui-design`, `button-ui-design`, `how-to-design-landing`, `settings-ui-design`
- Commit: `test(blog): visual parity QA`

---

## Final Verification

- [x] F1. **Plan Compliance** (oracle) — APPROVED
- [x] F2. **Code Quality** — APPROVED (tsc clean, no `as any`, no console.log)
- [x] F3. **Visual QA** — user iterating on visual fixes live (covers + Related markup + order fixed)
- [x] F4. **Scope Fidelity** — APPROVED (protected files untouched, no out-of-scope additions)

## Success Criteria

```bash
# 148 MDX exist
test $(ls content/blog/*.mdx | wc -l) -eq 148

# Build passes
npm run build

# No LegacyPage in blog
! grep -r "LegacyPage" pages/blog/

# Authors map exists
test -f lib/blog/authors.ts
ls public/blog/authors/*.{jpg,png,webp} 2>/dev/null | wc -l  # ≥ 4

# Original visual parity (check via Playwright)
curl -s localhost:3000/blog/pay-for-claude-pro-with-usdt | grep -c "blogpost_content-column"  # = 2
curl -s localhost:3000/blog/pay-for-claude-pro-with-usdt | grep -c "blogpost_author-wr"  # = 1
```
