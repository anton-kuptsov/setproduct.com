## Правила работы AI-агента в этом проекте

### Стиль общения
- Все объяснения — на русском языке, доступно для дизайнера 
  без программистского бэкграунда
- Технические термины используй, но кратко объясняй при первом упоминании
- Перед существенными изменениями всегда показывай план и жди подтверждения

### Соглашения по коду
- Не изменяй версии зависимостей в package.json без явного запроса
- Новые компоненты создавай в стиле существующих (TypeScript, 
  именованные экспорты, Tailwind-классы)
- Не трогай: vercel.json, emails/, scripts/, конфиги (.eslintrc, 
  tsconfig.json) без явного запроса
- check_images.js / fix_images.js — утилиты автора проекта, 
  не запускай без явной просьбы

### Workflow с git
- Все изменения делаются локально, без push на GitHub без явной команды
- Перед началом задачи проверяй текущее состояние git status
- Каждое логическое изменение — отдельный коммит
- Сообщения коммитов на английском по conventional commits 
  (feat:, fix:, docs:, style:, refactor:, chore:)
- Не делай git push автоматически

### MDX-блог
- При создании новой статьи всегда заполняй полный frontmatter
- Картинки кладутся в /public/blog/[slug-статьи]/
- После добавления картинок предупреди о необходимости
  запустить check_images.js

### File editing rules for AI agents
For any file > 500 lines in `content/blog/`:
- NEVER use write_to_file for content edits
- Use apply_diff or search_and_replace for targeted changes
- Break multi-edit tasks into atomic steps with checkpoints
- Report after each step, wait for explicit user OK before continuing
- If apply_diff fails on a section, STOP and ask — do not fall
  back to write_to_file

### Типографика заголовков и текста: только sentence case
Категорическое правило: НИКОГДА не использовать Title Case (где 
каждое значимое слово начинается с заглавной буквы). 
Использовать ТОЛЬКО sentence case.

Это применяется ко всем местам без исключения:
- title и metaTitle в frontmatter MDX
- description, cardDescription, subtitle во frontmatter
- inlineCta.title, inlineCta.buttonText, FAQ questions
- H1, H2, H3, H4, H5, H6 внутри тела MDX
- alt-тексты изображений
- coverImageAlt
- Названия секций и подразделов
- Тексты кнопок и ссылок в React-компонентах
- Метаданные в data/pages-meta.ts (title, description)
- Хлебные крошки в data/breadcrumbs.ts
- Сообщения коммитов (тоже sentence case, английский язык)

ПРИМЕРЫ — что правильно, что нет:

❌ НЕЛЬЗЯ (Title Case):
- "Tab UI Design Done Right: Anatomy, States, and Use Cases"
- "How to Design Tabs in 2026"
- "Best Practices for Notifications UI"
- "Frequently Asked Questions"
- "Get Started With Dropdowns"

✅ ПРАВИЛЬНО (sentence case):
- "Tab UI design done right: Anatomy, states, and use cases"
- "How to design tabs in 2026"  
- "Best practices for notifications UI"
- "Frequently asked questions"
- "Get started with dropdowns"

ИСКЛЮЧЕНИЯ — что ВСЕГДА сохраняет заглавные буквы:

1. Аббревиатуры:
   UI, UX, AI, ML, CSS, HTML, JS, TS, API, ARIA, SEO, CTA, FAQ, 
   MDX, JSON, XML, YAML, SaaS, KYC, GDPR, OS, iOS, IDE, CLI, 
   CRUD, REST, HTTP, URL, DOM, SVG, PDF, PNG, WebP, AVIF.
   Пример: "iOS design patterns", "CSS variables for theming"

2. Имена брендов, продуктов, компаний, технологий:
   Setproduct, Figma, Material Design, Material X, Material You, 
   Tailwind, Tailwind CSS, Next.js, React, Vue, Angular, Webflow, 
   Vercel, Resend, Google, Apple, Microsoft, Adobe, Notion, Slack, 
   Linear, Stripe, GitHub, Dribbble.
   Пример: "Building with Next.js and Tailwind CSS"

3. Имена людей:
   "Roman Kamushken", "Don Norman"

4. Первое слово предложения / заголовка: ВСЕГДА заглавная.

5. Первое слово после двоеточия в заголовке: заглавная.
   Пример: "Tab UI design: Anatomy and states" 
   (после ":" слово "Anatomy" с большой)

6. Слова после запятой, тире, точки с запятой: строчные 
   (если только это не имя собственное).
   Пример: "Tab UI design: Anatomy, states, and use cases"
   (после "," — "states" и "use cases" со строчной)

7. Слова после дефиса внутри составного слова: строчные.
   Пример: "Up-to-date checklist" (не "Up-To-Date")

ПРИ ЛЮБЫХ СОМНЕНИЯХ: если слово не входит в список исключений 
1-3 выше и не является первым словом — оно пишется со 
СТРОЧНОЙ буквы.

ДЛЯ КАЖДОГО предлагаемого заголовка перед записью в файл 
ПРОВЕРЯЙ это правило сам построчно. Если делаешь правку 
существующего поста — приведи в порядок и старые H2/H3, 
которые попали в зону твоего изменения, даже если они 
не были частью задачи.

# Анализ конфигурации проекта setproduct.com

## 1. Версии Next.js, React и ключевые зависимости

**Next.js и React:**
- [`next`](package.json:29): `"latest"` — версия не зафиксирована (риск нестабильных обновлений)
- [`react`](package.json:31) / [`react-dom`](package.json:32): `"latest"` — также не закреплены
- Типы указывают на актуальные мажоры: [`@types/react`](package.json:51) `^19.2.14` → **React 19**, что подразумевает **Next.js 15.x**
- Архитектура — **Pages Router** (`pages/_app.tsx`, `pages/api/*`), не App Router

**Ключевые зависимости по группам:**

| Категория | Пакеты |
|---|---|
| **Стилизация** | [`tailwindcss`](package.json:55) `^4.2.2`, [`@tailwindcss/postcss`](package.json:49) `^4.2.2`, [`@tailwindcss/typography`](package.json:24) `^0.5.15`, [`clsx`](package.json:25), [`tailwind-merge`](package.json:41) |
| **MDX / Blog** | [`next-mdx-remote`](package.json:30) `^6.0.0`, [`gray-matter`](package.json:27), [`remark-gfm`](package.json:38), [`rehype-slug`](package.json:37), [`rehype-highlight`](package.json:35), [`rehype-pretty-code`](package.json:36), [`shiki`](package.json:40), [`highlight.js`](package.json:28), [`reading-time`](package.json:34) |
| **Email** | [`resend`](package.json:39) `^6.12.0`, [`@react-email/components`](package.json:21) `^1.0.12` (шаблоны в `emails/`) |
| **Формы** | Отдельной form-библиотеки (react-hook-form / formik / zod) **нет** — формы реализованы вручную через API роуты [`pages/api/contact.ts`](pages/api/contact.ts) и [`pages/api/subscribe.ts`](pages/api/subscribe.ts), с CSRF ([`lib/csrf.ts`](lib/csrf.ts)) и rate limit ([`lib/rateLimit.ts`](lib/rateLimit.ts)) |
| **Аналитика** | Отдельных npm-пакетов нет — самописная обвязка GA4 в [`lib/gtag.ts`](lib/gtag.ts), ID через `NEXT_PUBLIC_GA_ID` |
| **UI / Медиа** | [`@splidejs/react-splide`](package.json:22) (карусели), [`react-photo-album`](package.json:33), [`yet-another-react-lightbox`](package.json:42), [`fuse.js`](package.json:26) (поиск), [`sharp`](package.json:54) (оптимизация изображений) |

⚠️ Использование `"latest"` для `next` / `react` — антипаттерн для production.

---

## 2. Конфигурация Next.js ([`next.config.js`](next.config.js:1))

- `reactStrictMode: true`, `trailingSlash: false`

**`images`** — тонко настроены:
- `unoptimized: isVercelPreview` — на превью-деплоях Vercel отключается оптимизатор (экономия квоты)
- `formats: ["image/webp", "image/avif"]` — WebP в приоритете, AVIF для современных браузеров
- `deviceSizes: [640, 1080, 1920]`, `imageSizes: [64, 256, 384]` — сокращённые наборы брейкпоинтов

**`redirects()`** — миграция со статического сайта:
- `/index.html` → `/` (301)
- `/:path+.html` → `/:path+` (301)

**`headers()`**:
- `/assets/:path*` → `Cache-Control: public, max-age=31536000, immutable`

**`rewrites`** — не настроены.

---

## 3. TypeScript ([`tsconfig.json`](tsconfig.json:1))

**Строгость:**
- `"strict": true` — весь набор строгих проверок включён
- `"forceConsistentCasingInFileNames": true`, `"allowJs": false`, `"isolatedModules": true`
- `"skipLibCheck": true` (стандарт для скорости)
- `"target": "ES2017"` — консервативный таргет
- `"moduleResolution": "bundler"` — современный режим для Next.js

**Path aliases:** ❌ **отсутствуют полностью.** Нет блока `"paths"`, нет `baseUrl`. Импорты используют относительные пути (`../../components/...`).

`lint`-скрипт = `tsc --noEmit` (ESLint не настроен).

---

## 4. Vercel ([`vercel.json`](vercel.json:1))

- `"cleanUrls": true` — Vercel редиректит `.html` → чистый URL автоматически
- `"trailingSlash": false` — согласовано с Next.js
- **`headers`** — дублирует правило из `next.config.js`:
  - `/assets/(.*)` → `Cache-Control: public, max-age=31536000, immutable`

**`redirects` / `rewrites`** — отсутствуют (логика редиректов в `next.config.js`).

📌 Дублирование заголовков для `/assets` в двух местах — на Vercel приоритет имеет `vercel.json`, в `next dev` работает только конфиг Next.

---

## 5. Переменные окружения ([`.env.example`](.env.example:1))

Минимальный набор — **2 переменные**:

| Переменная | Назначение |
|---|---|
| `RESEND_API_KEY` | API-ключ Resend для контактной формы и подписки ([`pages/api/contact.ts`](pages/api/contact.ts), [`pages/api/subscribe.ts`](pages/api/subscribe.ts)) |
| `NEXT_PUBLIC_GA_ID` | ID Google Analytics 4 (`G-XXXXXXXXXX`), используется в [`lib/gtag.ts`](lib/gtag.ts) |

Неявно используется `VERCEL_ENV` (см. [`next.config.js`](next.config.js:3)) — выставляется самим Vercel.

---

## 6. Стилевой стек

- **Tailwind CSS 4.x** ([`tailwindcss`](package.json:55) `^4.2.2`) — новейший мажор с движком на Rust
- PostCSS-плагин: [`@tailwindcss/postcss`](postcss.config.mjs:4) — единственный плагин в [`postcss.config.mjs`](postcss.config.mjs:1) (правильный способ подключения для Tailwind v4)
- **Нет** классического `tailwind.config.js` — в v4 конфигурация переехала в CSS (`@theme`, `@plugin` в `styles/*.css`)
- **Плагины Tailwind:**
  - [`@tailwindcss/typography`](package.json:24) `^0.5.15` — стилизация MDX-контента блога (классы `prose`)
- **Утилиты композиции классов:**
  - [`clsx`](package.json:25) — условные классы
  - [`tailwind-merge`](package.json:41) — устранение конфликтов утилит, обёрнуто в [`lib/cn.ts`](lib/cn.ts)
- Дополнительно — CSS-модули (`.module.css`) для отдельных страниц, напр. [`components/pages/BlogListingPage.module.css`](components/pages/BlogListingPage.module.css)

---

## Сводная таблица замечаний

| Область | Состояние | Замечание |
|---|---|---|
| Версии React/Next | ⚠️ | `"latest"` — недетерминированные сборки |
| TS path aliases | ⚠️ | Не настроены — длинные относительные пути |
| ESLint | ❌ | Не подключён, только `tsc --noEmit` |
| Дублирование headers | ℹ️ | В `next.config.js` и `vercel.json` одновременно |
| Tailwind v4 | ✅ | Современная установка через PostCSS-плагин |
| Изображения | ✅ | Грамотная оптимизация под Vercel |
| Безопасность форм | ✅ | CSRF + rate limit реализованы вручную |


# Анализ блога setproduct.com (MDX-инфраструктура)

## 1. Структура типичного MDX-файла блога

MDX-файлы лежат в [`content/blog/*.mdx`](content/blog) — один файл = одна статья, имя файла = slug. Каждый файл состоит из **YAML-frontmatter** и тела на Markdown + JSX.

Схема frontmatter описана в [`types/blog.ts`](types/blog.ts:12) (`BlogFrontmatter`):

**Обязательные поля:**
| Поле | Назначение |
|---|---|
| `title` | Заголовок статьи (H1, отображается в `<title>`) |
| `description` | Короткое описание для `<meta name="description">` и OG |
| `slug` | URL-сегмент (должен совпадать с именем файла) |
| `date` | Дата публикации в формате `YYYY-MM-DD` (строкой!) |
| `author` | Имя автора **или** его slug (см. п.5) |
| `coverImage` | Путь к обложке от корня `public/`, напр. `/blog/covers/foo.webp` |

**Опциональные поля:**
| Поле | Назначение |
|---|---|
| `thumbImage` | Превью для карточек (генерируется скриптом, см. ниже) |
| `coverImageAlt` | Alt-текст обложки |
| `tags` | Массив тегов (в реальных постах почти всегда пустой `[]`) |
| `canonical` | Канонический URL — фолбэк `${SITE_URL}/blog/${slug}` |
| `category` | Категория из [`data/blog-categories.ts`](data/blog-categories.ts:1) |
| `subtitle` | Подзаголовок в hero-блоке (фолбэк → `description`) |
| `metaTitle` | Заголовок для `<title>`/OG (фолбэк → `title`) |
| `cardDescription` | Текст в карточке листинга |
| `inlineCta` | Объект `{title, description, buttonText, buttonLink}` — заменяет дефолтную CTA-подписку в [`BlogPostLayout`](components/blog/BlogPostLayout.tsx:93) |
| `readingTimeText` | Ручное переопределение времени чтения; иначе считается автоматически в [`lib/blog/reading-time.ts`](lib/blog/reading-time.ts) |
| `relatedSlugs` | Массив slug'ов для блока "Related posts" (3 шт); если не указан — подбираются по `category` |

Пример из [`content/blog/badge-ui-design.mdx`](content/blog/badge-ui-design.mdx:1) — полный набор полей �� `inlineCta` и `relatedSlugs`.

⚠️ Категория должна **точно совпадать** со значением из массива `BLOG_CATEGORIES`, иначе статья не попадёт в фильтры.

---

## 2. Кастомные React-компоненты внутри MDX

Несмотря на «вес» MDX-файлов, **набор переопределений минимален**. Маппинг в [`components/blog/mdx-components.tsx`](components/blog/mdx-components.tsx:4):

| Тег | Поведение |
|---|---|
| `img` | Заменяется на [`MDXImage`](components/blog/MDXImage.tsx:9) — обычный `<img>` с `loading="lazy"`, дефолтным размером 1600×900, `border-radius`. **Next/Image НЕ используется в теле статьи.** |
| `a` | Все ссылки авто-получают `target="_blank"` + `rel="noopener noreferrer"`. Исключение — ссылки на `gumroad.com` (открываются в той же вкладке). |
| `ul` | Добавляется `mb-2` |
| `li` | Кастомный буллет через `::before` с символом `•` |

**Прямой импорт React-компонентов в MDX не настроен** — `getBlogPost` ([`lib/blog/mdx.ts`](lib/blog/mdx.ts:73)) использует `next-mdx-remote/serialize` без `scope`/`components`-маппинга на этапе компиляции, поэтому JSX-теги типа `<MyComponent />` в `.mdx` работать не будут.

Что реально встречается в MDX (видно по постам):
- Стандартный Markdown (заголовки H2/H3, списки, blockquote, code)
- `![alt](path)` — изображения
- `[text](url)` — ссылки
- HTML-вставки с классами: `<span class="blog_big-paragraph">…</span>` для лид-абзаца (стилизуется CSS-классом из общей таблицы)
- Подсветка кода через [`rehype-highlight`](lib/blog/mdx.ts:88) (классические fenced code blocks)

Дополнительные плагины remark/rehype, подключённые в [`lib/blog/mdx.ts`](lib/blog/mdx.ts:83):
- `remark-gfm` — GFM (таблицы, чек-листы, автоссылки)
- `rehype-slug` — `id` для заголовков
- `rehypeCleanIds` (свой) — нормализация id (убирает двойные дефисы)
- `rehype-highlight` — подсветка кода

Содержимое статьи рендерится в [`BlogPostLayout`](components/blog/BlogPostLayout.tsx:86) через `<MDXRemote {...mdxSource} components={blogMdxComponents} />`. Вокруг MDX-контента — собственные React-компоненты лейаута: [`BlogHero`](components/blog/BlogHero.tsx), [`BlogAuthor`](components/blog/BlogAuthor.tsx), [`BlogSidebar`](components/blog/BlogSidebar.tsx) (с TOC + share), [`BlogInlineCta`](components/blog/BlogInlineCta.tsx), [`BlogRelatedPosts`](components/blog/BlogRelatedPosts.tsx).

---

## 3. Организация изображений в блоге

Все изображения лежат в [`public/`](public/blog) и ссылаются абсолютными путями от корня сайта:

| Папка | Содержимое | Пример пути в frontmatter/MDX |
|---|---|---|
| [`public/blog/covers/`](public/blog) | Обложки статей (полный размер, webp) | `/blog/covers/badge-ui-design.webp` |
| [`public/blog/covers/thumbs/`](public/blog) | Сжатые превью (max 800px, q80) — **генерируются скриптом**, см. п.5 | `/blog/covers/thumbs/badge-ui-design.webp` |
| [`public/blog/assets/<slug>/`](public/blog) | Изображения внутри статьи — папка с именем slug | `![alt](/blog/assets/badge-ui-design/img-1.webp)` |
| [`public/blog/authors/`](public/blog) | Аватарки авторов (webp) | `/blog/authors/roman-kamushken.webp` |

**Конвенции:**
- Формат — **WebP** повсеместно (есть скрипты конвертации в [`scripts/convert-avif-to-webp.js`](scripts/convert-avif-to-webp.js), [`scripts/convert-to-webp.js`](scripts/convert-to-webp.js))
- Имена картинок в статье — `img-1.webp`, `img-2.webp`, … (нумерация по порядку)
- Внутри MDX используется обычный markdown-синтаксис `![alt](path)` — НЕ `<Image>` от Next.js
- В рендере все картинки получают `loading="lazy"` через [`MDXImage`](components/blog/MDXImage.tsx:26)

---

## 4. Объём и тематика блога

**Количество постов:** **152 файла** в [`content/blog/`](content/blog) (актуально на текущий снимок репозитория).

**Категории** (из [`data/blog-categories.ts`](data/blog-categories.ts:1)) — 14 штук:

| Категория | Что попадает |
|---|---|
| `UI Design` | Гайды по компонентам (badge, button, tooltip, slider…) |
| `Startups & SaaS` | Запуск SaaS, бизнес-аспекты |
| `Growth Hacking` | Маркетинг, привлечение пользователей |
| `Inspiration` | Подборки, тренды, креатив |
| `Resources` | Подборки инструментов, плагинов Figma |
| `Technology` | Крипто, AI, общие технические темы |
| `Research` | Аналитика, рынок |
| `Design Trends` | Тренды в дизайне |
| `SEO` | Линкбилдинг, гостевые посты |
| `Design & Code` | Связка дизайна и фронтенда (Figma → React) |
| `Typography` | Шрифты, типографика |
| `Case Studies` | Кейсы (`case-study-*.mdx`) |
| `Presentation` | Презентации, сторителлинг |
| `Career` | Фриланс, ставки, карьера |

На главной показываются только первые 7 категорий (`HOME_BLOG_CATEGORIES`).

**Основная масса контента** — UI Design (гайды по компонентам) и Startups & SaaS (по именам файлов это самые большие группы).

---

## 5. Чеклист: как добавить новую статью

### Шаг 1. Подготовить изображения
1. Положить обложку в [`public/blog/covers/<slug>.webp`](public/blog) (рекомендуемый размер ~1600×900, формат WebP).
2. Создать папку [`public/blog/assets/<slug>/`](public/blog) и положить туда внутренние картинки как `img-1.webp`, `img-2.webp`, …
3. Запустить генерацию превью:
   ```
   npm run thumbs:blog
   ```
   Скрипт [`scripts/generate-blog-thumbs.js`](scripts/generate-blog-thumbs.js:1) автоматически создаст [`public/blog/covers/thumbs/<slug>.webp`](public/blog) (max 800px, quality 80, идемпотентно). Это и есть путь для `thumbImage`.

### Шаг 2. Создать MDX-файл
Создать [`content/blog/<slug>.mdx`](content/blog) — **имя файла без расширения должно совпадать с полем `slug`**.

Минимальный валидный frontmatter:
```yaml
---
title: "Заголовок статьи"
description: "Короткое описание (150-160 символов)"
slug: my-new-article
date: "2026-05-26"
author: Roman Kamushken
coverImage: /blog/covers/my-new-article.webp
---
```

Рекомендуемый расширенный набор (как в [`content/blog/badge-ui-design.mdx`](content/blog/badge-ui-design.mdx:1)):
```yaml
coverImageAlt: "Alt-текст обложки"
canonical: "https://www.setproduct.com/blog/my-new-article"
category: UI Design       # ровно из data/blog-categories.ts
subtitle: "Подзаголовок в hero"
metaTitle: "SEO-заголовок для <title> и OG"
cardDescription: "Текст для карточки в листинге"
thumbImage: /blog/covers/thumbs/my-new-article.webp
relatedSlugs:
  - other-article-slug-1
  - other-article-slug-2
  - other-article-slug-3
# Опциональный кастомный CTA (иначе будет дефолтная подписка)
inlineCta:
  title: "Заголовок CTA"
  description: "Описание"
  buttonText: "Кнопка"
  buttonLink: "https://..."
```

### Шаг 3. Проверить автора
Поле `author` должно либо:
- совпадать с одним из ключей `AUTHORS` в [`lib/blog/authors.ts`](lib/blog/authors.ts:7) (slug вида `roman-kamushken`), либо
- быть именем, которое после `toLowerCase().replace(/\s+/g, "-")` приведётся к существующему slug (например, `"Roman Kamushken"` → `roman-kamushken`).

Иначе будет подставлен `FALLBACK_AUTHOR` ("Setproduct Team"). Если автор новый — добавить запись в `AUTHORS` и положить аватарку в [`public/blog/authors/<slug>.webp`](public/blog/authors).

### Шаг 4. Написать тело статьи
- Использовать заголовки `## H2` и `### H3` — они автоматически попадают в TOC сайдбара ([`extractHeadings`](lib/blog/mdx.ts:48))
- Картинки: `![alt](/blog/assets/<slug>/img-1.webp)`
- Ссылки: обычный `[text](url)` — внешние авто-откроются в новой вкладке
- Лид-абзац (опционально): `<span class="blog_big-paragraph">…</span>`
- Code blocks с fenced syntax — подсвечиваются автоматически
- GFM-таблицы / чек-листы — поддерживаются

### Шаг 5. Проверить и задеплоить
1. Локально: `npm run dev` → открыть `/blog/<slug>`
2. Type-check: `npm run lint` (это `tsc --noEmit`)
3. Sitemap обновится автоматически — [`pages/sitemap.xml.ts`](pages/sitemap.xml.ts) генерируется на основе `getAllBlogSlugs()`
4. Related-блок и листинги — тоже обновляются автоматически на следующем билде (`fallback: false` в [`getStaticPaths`](pages/blog/[slug].tsx:20)), новый файл попадает в сборку без правок других файлов

### Что НЕ нужно делать
- ❌ Регистрировать статью в каком-либо `index`/`registry` — система автоматически читает [`content/blog/`](content/blog) через `fs.readdirSync`
- ❌ Импортировать React-компоненты в `.mdx` — не настроено
- ❌ Использовать `<Image>` от Next/Image внутри MDX — все `img` рендерятся через [`MDXImage`](components/blog/MDXImage.tsx) (обычный `<img>`)

---

## Замечания по архитектуре блога

| Аспект | Состояние |
|---|---|
| Тип рендера | SSG (`getStaticPaths` + `getStaticProps`, `fallback: false`) — все посты статичны |
| Валидация frontmatter | ❌ Нет (zod/yup отсутствуют) — опечатка в `category` молча сломает фильтры |
| Изображения в MDX | ⚠️ Используется обычный `<img>`, а не `next/image` — оптимизация Next отсутствует, но есть `loading="lazy"` и заранее сгенерированные WebP |
| TOC и share | ✅ Автоматические — из заголовков H2/H3 |
| JSON-LD `BlogPosting` | ✅ Генерируется в [`lib/blog/schema.ts`](lib/blog/schema.ts) |
| Author fallback | ✅ Есть safety net (Setproduct Team) |
| Related posts fallback | ✅ По категории, если `relatedSlugs` пуст |


# Архитектура UI: components/, styles/, hooks/

## 1. Карта компонентов

В проекте **45 компонентов** организованы в 5 функциональных групп:

### 📂 `components/layout/` — глобальный каркас сайта
| Компонент | Назначение |
|---|---|
| [`SiteHeader`](components/layout/SiteHeader.tsx) | Главная навбар с мобильным drawer-меню, дропдаунами (Tutorials/Design Kits/Information), поиском и адаптивом |
| [`SiteFooter`](components/layout/SiteFooter.tsx) | Подвал сайта с навигацией и подпиской |
| [`FooterSocialIcons`](components/layout/FooterSocialIcons.tsx) | Иконки соцсетей в футере |
| [`ScrollUpButton`](components/layout/ScrollUpButton.tsx) | Кнопка «наверх», появляющаяся при скролле |
| [`LaunchAppCallout`](components/layout/LaunchAppCallout.tsx) | Промо-выноска "Launch App" с анимацией `swing-in-top-bck` |

### 📂 `components/sections/` — переиспользуемые секции (это «строительные блоки»)
| Компонент | Назначение |
|---|---|
| [`HeroSection`](components/sections/HeroSection.tsx) | Универсальный hero c `title` + многострочным `description` (классы `heading-style-h1` / `h5`) |
| [`TemplateHero`](components/sections/TemplateHero.tsx) | Hero страницы конкретного шаблона |
| [`Breadcrumbs`](components/sections/Breadcrumbs.tsx) | Хлебные крошки на основе [`data/breadcrumbs.ts`](data/breadcrumbs.ts) |
| [`CategoryTabs`](components/sections/CategoryTabs.tsx) | Табы категорий (для блога и каталога) |
| [`TemplateGrid`](components/sections/TemplateGrid.tsx) | Сетка карточек шаблонов с пагинацией "load more" |
| [`TemplateCard`](components/sections/TemplateCard.tsx) | Базовая карточка шаблона |
| [`TemplateCarousel`](components/sections/TemplateCarousel.tsx) | Splide-карусель шаблонов |
| [`TemplateGallery`](components/sections/TemplateGallery.tsx) | Галерея превью шаблона с lightbox-оверлеем |
| [`TemplateImageSection`](components/sections/TemplateImageSection.tsx) | Полноширинная картинка-секция в детальной странице |
| [`TemplateBeforeAfter`](components/sections/TemplateBeforeAfter.tsx) | Сравнительный слайдер «до/после» |
| [`TemplateVideo`](components/sections/TemplateVideo.tsx) | Видео-секция |
| [`TemplateTabs`](components/sections/TemplateTabs.tsx) / [`TemplateTabsWithSplitter`](components/sections/TemplateTabsWithSplitter.tsx) | Табы внутри детальной страницы шаблона |
| [`TemplatePricing`](components/sections/TemplatePricing.tsx) | Блок с ценами/планами |
| [`TemplateCtaHire`](components/sections/TemplateCtaHire.tsx) | CTA "нанять на работу" |
| [`TemplateShowcase`](components/sections/TemplateShowcase.tsx) | Показ топовых шаблонов в нижней части других страниц |
| [`SliderTemplateCard`](components/sections/SliderTemplateCard.tsx) / [`SliderPagination`](components/sections/SliderPagination.tsx) | Карточки и пагинация Splide |
| [`BlogPostsHome`](components/sections/BlogPostsHome.tsx) | Блок «свежие посты» на главной (CSS-модуль) |
| [`BundleCard`](components/sections/BundleCard.tsx) | Карточка бандла |
| [`FreebiesShowcase`](components/sections/FreebiesShowcase.tsx) / [`FreebieTemplateCard`](components/sections/FreebieTemplateCard.tsx) | Витрина freebies |
| [`FaqSection`](components/sections/FaqSection.tsx) | Аккордеон FAQ из [`data/faq.ts`](data/faq.ts) |
| [`CtaSubscribe`](components/sections/CtaSubscribe.tsx) | CTA-секция подписки (использует [`useSubscribe`](hooks/useSubscribe.ts)) |
| [`ArrowIcon`](components/sections/ArrowIcon.tsx) | Иконка-стрелка для кнопок |

### 📂 `components/pages/` — целые страницы (одна страница = один компонент)
[`HomePage`](components/pages/HomePage.tsx), [`BlogListingPage`](components/pages/BlogListingPage.tsx), [`CategoryPage`](components/pages/CategoryPage.tsx), [`SearchPage`](components/pages/SearchPage.tsx), [`TemplateDetailPage`](components/pages/TemplateDetailPage.tsx), [`DashboardsPage`](components/pages/DashboardsPage.tsx), [`DashboardTemplatePage`](components/pages/DashboardTemplatePage.tsx), [`FreebiesListingPage`](components/pages/FreebiesListingPage.tsx), [`FreebieDetailPage`](components/pages/FreebieDetailPage.tsx), [`BundlePage`](components/pages/BundlePage.tsx), [`TestimonialsPage`](components/pages/TestimonialsPage.tsx), [`LicensePage`](components/pages/LicensePage.tsx), [`RefundsPolicyPage`](components/pages/RefundsPolicyPage.tsx), [`TermsOfPaidPostsPage`](components/pages/TermsOfPaidPostsPage.tsx).

Подкаталог [`components/pages/templates/`](components/pages/templates) содержит спец-варианты:
- [`GenericTemplatePage`](components/pages/templates/GenericTemplatePage.tsx) — общий шаблон детальной страницы продукта
- [`ChartsTemplatePage`](components/pages/templates/ChartsTemplatePage.tsx) — кастомная страница для «Charts» UI Kit

Каждая «page»-страница использует одинаковую структуру: `<SiteHeader>` → `<main>` с набором секций → `<SiteFooter>` → `<ScrollUpButton>`.

### 📂 `components/blog/` — блог
| Компонент | Назначение |
|---|---|
| [`BlogPostLayout`](components/blog/BlogPostLayout.tsx) | Главный layout статьи (Head + Hero + Sidebar + MDX + CTA + Related) |
| [`BlogHero`](components/blog/BlogHero.tsx) | Hero статьи с обложкой и метой |
| [`BlogAuthor`](components/blog/BlogAuthor.tsx) | Карточка автора (резолвится через [`getAuthor`](lib/blog/authors.ts:66)) |
| [`BlogMeta`](components/blog/BlogMeta.tsx) | Дата + время чтения + категория |
| [`BlogSidebar`](components/blog/BlogSidebar.tsx) | Сайдбар с TOC и кнопками шеринга (использует [`useStickyInContainer`](hooks/useStickyInContainer.ts)) |
| [`BlogTableOfContents`](components/blog/BlogTableOfContents.tsx) | Оглавление по заголовкам H2/H3 |
| [`BlogShareLinks`](components/blog/BlogShareLinks.tsx) | Кнопки соцсетей для шеринга |
| [`BlogInlineCta`](components/blog/BlogInlineCta.tsx) | Кастомный CTA-блок внутри статьи (из frontmatter) |
| [`BlogRelatedPosts`](components/blog/BlogRelatedPosts.tsx) | Блок связанных статей |
| [`MDXImage`](components/blog/MDXImage.tsx) | Замена `<img>` в MDX |
| [`mdx-components.tsx`](components/blog/mdx-components.tsx) | Маппинг HTML-тегов → React в MDX |

### 📂 `components/modals/` — модальные окна
- [`ContactModalContext`](components/modals/ContactModalContext.tsx) — React Context для управления состоянием модалки (открыта/закрыта). Провайдер обёрнут в [`pages/_app.tsx`](pages/_app.tsx:28)
- [`ContactModal`](components/modals/ContactModal.tsx) — сама форма контакта (отправка через `/api/contact`)

---

## 2. Дизайн-система — её НЕТ в традиционном смысле

❌ **Нет переиспользуемых примитивов** уровня `<Button>`, `<Card>`, `<Heading>`, `<Input>` как отдельных React-компонентов.

Вместо них используется **унаследованная от Webflow CSS-система классов** — каждый компонент пишет HTML с готовыми классами:

```jsx
<a className="button w-inline-block" href="...">
  <div className="text-size-large text-weight-bold">Launch App</div>
</a>

<h1 className="heading-style-h1">…</h1>
<h2 className="heading-style-h2">…</h2>
<div className="heading-style-h5">…</div>
```

**Полу-примитивы**, которые всё же стоит знать (это карточки и иконки, но не «дизайн-система»):
- `TemplateCard`, `BundleCard`, `FreebieTemplateCard`, `SliderTemplateCard` — карточки разных типов
- `ArrowIcon` — единственный «icon-primitive» (остальные иконки — inline-SVG прямо в компонентах, см. [`FaqSection`](components/sections/FaqSection.tsx:6))

**Утилита для классов:** [`lib/cn.ts`](lib/cn.ts) (`clsx` + `tailwind-merge`) — используется для условной композиции.

📌 Вывод: сайт построен на **Webflow CSS-классах** + Tailwind v4 поверх. Любой новый компонент должен использовать существующие классы, а не изобретать свои.

---

## 3. Где определены цвета, типографика, отступы

Дизайн-токены разнесены по **трём с��оям**:

### Слой 1: CSS-переменные в [`public/css/setproduct.webflow.shared.css`](public/css/setproduct.webflow.shared.css:2092)
**Главный источник цветов**:
```css
:root {
  --black: #19181b;
  --primary: #7c4dff;          /* основной фиолетовый */
  --white: white;
  --light-primary: #ebe0ff;
  --light-purple: #fbfaff;
  --dark-primary: #39198f;
  --black-transparent: #19181b26;
  --grey: #adadad;
  --light-grey: #f7f7f7;
  /* + палитра Flowui Component Library: gray-200..900, primary-base/dark */
}
```

### Слой 2: Webflow-классы для типографики и отступов
Тоже в [`public/css/setproduct.webflow.shared.css`](public/css/setproduct.webflow.shared.css) и [`public/css/webflow.css`](public/css/webflow.css):
- **Типографика:** `heading-style-h1` … `heading-style-h6`, `text-size-large` / `regular` / `small` / `tiny-normal`, `text-weight-bold`
- **Сетка/отступы:** `section`, `section-padding`, `container`, `top-80`, `bottom-64`, `spacer-16` / `spacer-32` / `spacer-40`
- **Лимиты ширины:** `max-width-800`, `max-width-900`, `max-width-768-centered`
- **Лейаут-блоки:** `heading-center-wr`, `heading-left-text-wr`, `main_hero-section`, `hero-cta-row`
- **Кнопки:** `button`, `button secondary`, `w-inline-block`, `button-small`
- **Шрифт:** `Uncutsans` (грузится из [`public/fonts/`](public))
- **Внимание:** базовый `font-size` в `body` равен `0.0694445vw` (это `1/14.4 vw` ≈ масштабирование под Figma 1440px). Все размеры в Webflow-классах используют единицу `em`, не `rem`/`px`.

### Слой 3: Tailwind v4 в [`styles/globals.css`](styles/globals.css:1)
- `@import "tailwindcss";` + `@plugin "@tailwindcss/typography";`
- **Кастомная конфигурация (theme, цвета, плагины) — отсутствует.** Используются дефолтные утилиты Tailwind v4 (`mb-2`, `mt-18`, `disabled:opacity-70`, `animate-spin` и т.д.)
- Остальные ~450 строк — это **переопределения для рич-текста MDX**, подсветка `highlight.js` (тема Material Palenight), мобильный navbar-drawer, анимации (`swing-in-top-bck`), фиксы Webflow

### Слой 4: CSS-модули — только для трёх компонентов
- [`components/pages/BlogListingPage.module.css`](components/pages/BlogListingPage.module.css)
- [`components/pages/FreebiesListingPage.module.css`](components/pages/FreebiesListingPage.module.css)
- [`components/sections/BlogPostsHome.module.css`](components/sections/BlogPostsHome.module.css)

**Где править токены:**
- Изменить **цвет бренда** → CSS-переменная `--primary` в [`setproduct.webflow.shared.css`](public/css/setproduct.webflow.shared.css:2094)
- Добавить **новые отступы/типографику** → лучше через Tailwind-утилиты в JSX
- Не существует `tailwind.config.js` — конфиг Tailwind v4 строится из `@theme` в CSS (но в проекте директива `@theme` ещё не используется)

---

## 4. Кастомные хуки

В проекте всего **2 кастомных хука** в [`hooks/`](hooks):

### [`useStickyInContainer`](hooks/useStickyInContainer.ts:10)
Реализует sticky-позиционирование сайдбара относительно конкретного контейнера, а не всей страницы. Имеет три состояния:
- `static` — сайдбар в обычном потоке (контейнер выше viewport-top + offset)
- `fixed` — прилип к верху viewport во время скролла внутри контейнера
- `stuck` — упёрся в нижнюю границу контейнера, дальше не идёт

Используется в [`BlogSidebar`](components/blog/BlogSidebar.tsx) — TOC и share-кнопки следят за прокруткой статьи, но не выходят за пределы тела поста.

Параметры: `topOffset` (по умолчанию 80px — учёт навбара), `enabled` (для отключения на мобильных).

### [`useSubscribe`](hooks/useSubscribe.ts:3)
Хук для формы email-подписки с:
1. Получением CSRF-токена через `GET /api/csrf`
2. Отправкой `POST /api/subscribe` с `email` + `_token` + `_timestamp`
3. Honeypot-полем `website` (для защиты от ботов)
4. Возврат: `{ isSubscribed, isSubmitting, handleSubscribe }`

Используется в [`CtaSubscribe`](components/sections/CtaSubscribe.tsx:4) и в футере.

❌ **Хуков для модалок, табов, аккордеонов, lightbox — нет**. Их со��тояние локально внутри компонентов через `useState` ([`FaqSection`](components/sections/FaqSection.tsx:29), [`HomePage`](components/pages/HomePage.tsx:28)).

---

## 5. Чеклист: как добавить новую секцию на главную в стиле проекта

Допустим, нужно добавить блок «Featured collections» на [`HomePage`](components/pages/HomePage.tsx).

### Что обязательно переиспользовать:

**1. Структуру обёртки секции** — копировать без изменений:
```jsx
<div className="section">                          {/* можно + background-color-light-primary */}
  <div className="section-padding top-80 bottom-80"> {/* варианты: top-80 bottom-64, top-64 bottom-80 */}
    <div className="container">
      {/* ... содержимое ... */}
    </div>
  </div>
</div>
```

**2. Заголовок секции** — использовать `heading-style-h2` внутри обёртки:
```jsx
<div className="heading-center-wr">           {/* или heading-left-text-wr */}
  <h2 className="heading-style-h2">Заголовок секции</h2>
  <div className="heading-style-h5">Подзаголовок</div>
</div>
<div className="spacer-32" />                  {/* отступ перед контентом */}
```

**3. Карточки** — если показываются продукты/шаблоны:
- [`TemplateGrid`](components/sections/TemplateGrid.tsx) — сетка с пагинацией (передаются `products`, `variant`, `visibleCount`, `onLoadMore`)
- [`TemplateCard`](components/sections/TemplateCard.tsx) — одна карточка шаблона
- [`BundleCard`](components/sections/BundleCard.tsx) — карточка бандла
- [`TemplateCarousel`](components/sections/TemplateCarousel.tsx) — Splide-карусель, если нужен горизонтальный скролл

**4. Кнопки CTA**:
```jsx
<a className="button w-inline-block" href="...">
  <div className="text-size-large text-weight-bold">Primary action</div>
</a>
<Link className="button secondary w-inline-block" href="/...">
  <div className="text-size-large text-weight-bold">Secondary</div>
  <div className="button-icon w-embed"><ArrowIcon /></div>
</Link>
```
(пример — [`HomePage`](components/pages/HomePage.tsx:55))

**5. Иконку-стрелку** — [`ArrowIcon`](components/sections/ArrowIcon.tsx) (не рисовать SVG заново).

**6. Условный CTA подписки** — если уместно завершить секцию подпиской, использовать [`CtaSubscribe`](components/sections/CtaSubscribe.tsx) (уже подключённый к [`useSubscribe`](hooks/useSubscribe.ts)).

**7. FAQ** — если нужен аккордеон с вопросами, [`FaqSection`](components/sections/FaqSection.tsx) принимает `items: FaqItem[]` из [`data/faq.ts`](data/faq.ts).

### Что писать с нуля
- Сам новый компонент-секцию, например [`components/sections/FeaturedCollections.tsx`](components/sections/FeaturedCollections.tsx). Внутри обязательно — использовать классы из слоя Webflow (`section`, `container`, `heading-style-*`, `text-size-*`, цвета через `var(--primary)` если нужно из inline-style)
- Данные положить в [`data/`](data) (пример: [`data/products.ts`](data/products.ts), [`data/bundles.ts`](data/bundles.ts), [`data/blog-categories.ts`](data/blog-categories.ts))
- Типы данных — добавить в [`types/data.ts`](types/data.ts)

### Что НЕ делать
- ❌ Не писать новые цвета хардкодом — брать из `var(--primary)`, `var(--black)`, `var(--light-primary)`
- ❌ Не делать Tailwind-конфиг с кастомным `theme` — это сломает консистентность; либо использовать дефолты Tailwind, либо Webflow-классы
- ❌ Не импортировать никакой `<Button>` примитив — его нет; писать `<a className="button w-inline-block">` или `<Link className="button secondary w-inline-block">`
- ❌ Не использовать `<Heading level={2}>` — нет такого; писать прямо `<h2 className="heading-style-h2">`
- ❌ Не оборачивать в Tailwind-padding/margin контейнеры верхнего уровня секции — для этого `section-padding top-80 bottom-80`
- ❌ Не плодить `*.module.css` — есть только 3 и только для сложного грид-лейаута листингов

### Финальный шаблон новой секции (boilerplate)
```jsx
// components/sections/FeaturedCollections.tsx
import Link from "next/link";
import ArrowIcon from "./ArrowIcon";
import type { Collection } from "../../types/data";

type Props = { collections: Collection[] };

export default function FeaturedCollections({ collections }: Props) {
  return (
    <div className="section">
      <div className="section-padding top-80 bottom-64">
        <div className="container">
          <div className="heading-center-wr">
            <h2 className="heading-style-h2">Featured collections</h2>
            <div className="heading-style-h5">
              Hand-picked bundles for the season
            </div>
          </div>
          <div className="spacer-32" />
          {/* ... сетка карточек ... */}
          <div className="spacer-40" />
          <Link className="button secondary w-inline-block" href="/all">
            <div className="text-size-large text-weight-bold">See all</div>
            <div className="button-icon w-embed"><ArrowIcon /></div>
          </Link>
        </div>
      </div>
    </div>
  );
}
```

Затем вставить `<FeaturedCollections collections={…} />` в [`HomePage`](components/pages/HomePage.tsx) между существующими `<div className="section">…</div>`, передав данные из новой записи в `data/`.

---

## Сводное замечание по архитектуре

| Аспект | Состояние |
|---|---|
| Дизайн-система | ⚠️ Унаследована от Webflow как CSS-классы, без React-примитивов |
| Tailwind v4 | ⚠️ Установлен, но используется фрагментарно (mb, mt, animate, disabled-state) |
| Источник истины для цветов | CSS-переменные в Webflow CSS, **не** в Tailwind theme |
| Хуки | Минимум (2 шт), оба узкоспециализированные |
| Состояние UI | Локальный `useState` в компонентах; нет глобальных стейт-менеджеров |
| Контексты | Только один — [`ContactModalContext`](components/modals/ContactModalContext.tsx) для модалки |
| Иконки | Inline SVG в JSX, кроме общей [`ArrowIcon`](components/sections/ArrowIcon.tsx) |

**Главный практический вывод:** при добавлении нового UI — сначала ищем подходящий Webflow-класс в [`public/css/setproduct.webflow.shared.css`](public/css/setproduct.webflow.shared.css) или существующий компонент в `components/sections/`, и только если их нет — пишем своё с использованием тех же конвенций именования и токенов.


# Карта роутинга проекта setproduct.com

Проект использует **Next.js Pages Router**. Файлы в [`pages/`](pages) автоматически становятся маршрутами.

---

## 1. Полная карта URL → файл

### Главные/категорийные страницы (статика)
| URL | Файл | Что показывает |
|---|---|---|
| `/` | [`pages/index.tsx`](pages/index.tsx:1) | Главная — hero, превью блога, грид шаблонов, FAQ |
| `/all` | [`pages/all.tsx`](pages/all.tsx:1) | Все шаблоны (Figma templates & UI kits) |
| `/blog` | [`pages/blog.tsx`](pages/blog.tsx:1) | Листинг блога |
| `/bundle` | [`pages/bundle.tsx`](pages/bundle.tsx:1) | Страница «бандла» (комплекта) |
| `/code` | [`pages/code.tsx`](pages/code.tsx:1) | Категория «Design & Code» (React/Swift/Flutter UI kits) |
| `/dashboards` | [`pages/dashboards.tsx`](pages/dashboards.tsx:1) | Категория дашбордов |
| `/dataviz` | [`pages/dataviz.tsx`](pages/dataviz.tsx:1) | Категория Data Viz |
| `/freebies` | [`pages/freebies.tsx`](pages/freebies.tsx:1) | Листинг бесплатных шаблонов |
| `/mobile` | [`pages/mobile.tsx`](pages/mobile.tsx:1) | Категория Mobile UI kits |
| `/websites` | [`pages/websites.tsx`](pages/websites.tsx:1) | Категория Web UI kits |
| `/search` | [`pages/search.tsx`](pages/search.tsx:1) | Полнотекстовый поиск (Fuse.js) |
| `/testimonials` | [`pages/testimonials.tsx`](pages/testimonials.tsx:1) | Отзывы клиентов |

### Динамические страницы
| URL-паттерн | Файл | Источник slug'ов |
|---|---|---|
| `/blog/[slug]` | [`pages/blog/[slug].tsx`](pages/blog/[slug].tsx:1) | Файлы в [`content/blog/*.mdx`](content/blog) |
| `/templates/[slug]` | [`pages/templates/[slug].tsx`](pages/templates/[slug].tsx:1) | [`data/templates-listing.ts`](data/templates-listing.ts) (`TEMPLATE_PRODUCTS`) |
| `/freebies/[slug]` | [`pages/freebies/[slug].tsx`](pages/freebies/[slug].tsx:1) | [`data/freebies-listing.ts`](data/freebies-listing.ts) (`FREEBIE_PRODUCTS`) |
| `/dashboard-templates/[slug]` | [`pages/dashboard-templates/[slug].tsx`](pages/dashboard-templates/[slug].tsx:1) | [`data/dashboard-templates.ts`](data/dashboard-templates.ts) (`DASHBOARD_TEMPLATES`) |

### Юридические страницы (статика)
| URL | Файл |
|---|---|
| `/legal/license` | [`pages/legal/license.tsx`](pages/legal/license.tsx:1) |
| `/legal/refunds-policy` | [`pages/legal/refunds-policy.tsx`](pages/legal/refunds-policy.tsx:1) |
| `/legal/terms-of-paid-posts` | [`pages/legal/terms-of-paid-posts.tsx`](pages/legal/terms-of-paid-posts.tsx:1) |

### Системные/служебные
| URL | Файл | Назначение |
|---|---|---|
| `/404` | [`pages/404.tsx`](pages/404.tsx:1) | Кастомная 404-страница |
| `/sitemap.xml` | [`pages/sitemap.xml.ts`](pages/sitemap.xml.ts:1) | Динамически генерируемый sitemap (SSR) |
| `/api/contact` | [`pages/api/contact.ts`](pages/api/contact.ts:1) | API-эндпоинт контактной формы |
| `/api/subscribe` | [`pages/api/subscribe.ts`](pages/api/subscribe.ts:1) | API-эндпоинт подписки |
| `/api/csrf` | [`pages/api/csrf.ts`](pages/api/csrf.ts:1) | Выдача CSRF-токена |

**Итого:** 13 статических верхнеуровневых страниц + 3 в `/legal` + 4 динамических роута + 3 API + sitemap + 404.

---

## 2. Статика vs Динамические маршруты

### Статические страницы (SSG через `getStaticProps`)
Все категорийные/листинговые страницы используют `export const getStaticProps`, который **на этапе билда** подтягивает данные. Например, [`pages/index.tsx`](pages/index.tsx:10):
```ts
export const getStaticProps: GetStaticProps<Props> = async () => ({
  props: { blogPosts: getBlogPostPreviews() },
});
```

Все 13 категорийных страниц + 3 legal-страницы пре-рендерятся в HTML на этапе `next build`.

### Динамические маршруты (SSG + `getStaticPaths`)
Все 4 динамических роута используют **полную SSG-стратегию** с `fallback: false` (то есть страницы создаются только для slug'ов, известных на момент билда; всё остальное → 404):

```ts
// pages/blog/[slug].tsx
export const getStaticPaths = async () => ({
  paths: slugs.map(slug => ({ params: { slug } })),
  fallback: false,
});
```

⚠️ `fallback: false` означает: чтобы новый пост/шаблон стал доступен, **нужен повторный билд** (или ISR, но он здесь не настроен).

Один **`getServerSideProps`** во всём проекте — только в [`pages/sitemap.xml.ts`](pages/sitemap.xml.ts:108) (на лету генерирует XML с кэшем `s-maxage=3600`).

📌 Особый случай в [`pages/templates/[slug].tsx`](pages/templates/[slug].tsx:40): один роут рендерит **3 разных компонента-страницы**:
- `charts` → [`ChartsTemplatePage`](components/pages/templates/ChartsTemplatePage.tsx) (кастомная)
- если есть запись в [`data/template-content/`](data/template-content) → [`GenericTemplatePage`](components/pages/templates/GenericTemplatePage.tsx) (новый формат)
- иначе → [`TemplateDetailPage`](components/pages/TemplateDetailPage.tsx) (старый формат)

---

## 3. Источники данных

### Слой `data/` — статические TypeScript-объекты
Это **главный источник истины** для большинства страниц. Все файлы — обычные TS-модули с экспортом массивов/объектов:

| Файл | Назначение |
|---|---|
| [`data/products.ts`](data/products.ts) (`PRODUCTS`) | Все шаблоны для категорийных грид-страниц |
| [`data/templates-listing.ts`](data/templates-listing.ts) (`TEMPLATE_PRODUCTS`) | Шаблоны с детальными страницами (для `/templates/[slug]`) |
| [`data/freebies-listing.ts`](data/freebies-listing.ts) (`FREEBIE_PRODUCTS`) | Freebies для `/freebies/[slug]` |
| [`data/dashboard-templates.ts`](data/dashboard-templates.ts) (`DASHBOARD_TEMPLATES`) | Дашборды для `/dashboard-templates/[slug]` |
| [`data/bundles.ts`](data/bundles.ts) | Бандлы |
| [`data/categories.ts`](data/categories.ts) | Категории каталога |
| [`data/blog-categories.ts`](data/blog-categories.ts) | Категории блога (14 шт) |
| [`data/pages-meta.ts`](data/pages-meta.ts) (`PAGE_META`) | SEO мета (title/description/canonical/ogImage) для всех страниц |
| [`data/breadcrumbs.ts`](data/breadcrumbs.ts) (`PAGE_BREADCRUMBS`) | Хлебные крошки для каждой страницы |
| [`data/faq.ts`](data/faq.ts) (`PAGE_FAQ`) | FAQ-блоки, разбитые по slug страницы |
| [`data/slider-products.ts`](data/slider-products.ts) | Карусели на главной |
| [`data/template-content/<slug>.ts`](data/template-content) | **Контент конкретного шаблона** (галерея, табы, цены) — отдельный TS-файл на каждый продукт. Подгружается динамически через [`getTemplateContent`](data/template-content/index.ts) |

### Слой `content/` — MDX-файлы
Только для блога. Читается через `fs.readdirSync` в [`lib/blog/mdx.ts`](lib/blog/mdx.ts:65) и [`lib/blog/get-blog-post-previews.ts`](lib/blog/get-blog-post-previews.ts).

### `getStaticProps` оркестрирует
Каждая страница в `getStaticProps` собирает свои props из `data/` + блог-превью из MDX. Типичный паттерн:
```ts
export const getStaticProps = async () => ({
  props: { blogPosts: getBlogPostPreviews({ maxPerCategory: 6 }) },
});
```
**Блог-превью присутствуют на каждой странице** — они нужны для [`SiteHeader`](components/layout/SiteHeader.tsx) (мега-меню в навбаре показывает свежие статьи).

### API
**Только для форм** (POST контакт/подписка) и CSRF. Клиентский код данные с API не запрашивает.

---

## 4. `_app.tsx`, `_document.tsx`, `_error.tsx`

### [`pages/_app.tsx`](pages/_app.tsx:1)
Особенности:
1. Импортирует глобальный CSS — [`styles/globals.css`](styles/globals.css) (Tailwind v4 + кастом)
2. Оборачивает приложение в [`<ContactModalProvider>`](components/modals/ContactModalContext.tsx) — глобальный контекст для модалки контакта
3. **Google Analytics 4** через [`next/script`](pages/_app.tsx:31) с `strategy="afterInteractive"`:
   - Загружает `gtag.js` только если `NEXT_PUBLIC_GA_ID` определён
   - Подписывается на `router.events.routeChangeComplete` для трекинга SPA-навигации через [`pageview`](lib/gtag.ts)
   - `send_page_view: false` в начальной конфигурации (контролируется вручную)

### [`pages/_document.tsx`](pages/_document.tsx:1)
Особенности:
1. `<Html lang="en" data-scroll-behavior="smooth">`
2. **Подключает три унаследованных Webflow CSS** напрямую через `<link>` (не через `import`):
   - [`/css/normalize.css`](public/css/normalize.css)
   - [`/css/webflow.css`](public/css/webflow.css)
   - [`/css/setproduct.webflow.shared.css`](public/css/setproduct.webflow.shared.css) — здесь живёт `:root` с CSS-переменными
3. Внешний CSS Splide (`splide-core.min.css`) с jsDelivr
4. Favicon в формате WebP (`/images/fav-32.webp`)

### `_error.tsx` — **отсутствует**
Используется только кастомная [`pages/404.tsx`](pages/404.tsx:1) — минималистичная страница с inline-стилями, без `SiteHeader`/`SiteFooter`. Для 500-х ошибок будет дефолтная страница Next.js.

---

## 5. API Routes

Все эндпоинты используют единый защитный паттерн:

### Защита (общая для `/api/contact` и `/api/subscribe`)
1. **Проверка метода:** только `POST`, иначе `405`
2. **CORS Origin whitelist:** разрешены только
   - `https://setproduct.com`
   - `https://www.setproduct.com`
   - `http://localhost:3000`
   
   Иначе `403`
3. **Rate limiting** через [`lib/rateLimit.ts`](lib/rateLimit.ts) — 1 запрос за 3 секунды по IP (`getClientIp` достаёт из заголовков)
4. **Honeypot:** скрытое поле `website` в форме — если заполнено, `400` (значит бот)
5. **CSRF:** проверка `_token` + `_timestamp` через [`lib/csrf.ts`](lib/csrf.ts) (HMAC-токен с TTL). Сначала клиент вызывает `GET /api/csrf`, получает токен и отправляет его в POST

### Эндпоинты

#### `GET /api/csrf` ([`pages/api/csrf.ts`](pages/api/csrf.ts:1))
Выдаёт пару `{ token, timestamp }`. Используется клиентом перед отправкой форм.

#### `POST /api/contact` ([`pages/api/contact.ts`](pages/api/contact.ts:1))
Принимает `{ email, message, website, _token, _timestamp }`.
- Шаблон письма: [`emails/ContactEmail.tsx`](emails/ContactEmail.tsx) (React Email)
- Отправляется через [Resend](pages/api/contact.ts:7): `contact@setproduct.com` → `hello@setproduct.com`
- Subject: `Contact form: ${email}`

#### `POST /api/subscribe` ([`pages/api/subscribe.ts`](pages/api/subscribe.ts:1))
Принимает `{ email, website, _token, _timestamp }`.
- Шаблон письма: [`emails/SubscribeEmail.tsx`](emails/SubscribeEmail.tsx)
- Та же логика отправки через Resend, subject: `New subscriber to Setproduct newsletter`
- Используется хуком [`useSubscribe`](hooks/useSubscribe.ts) в [`CtaSubscribe`](components/sections/CtaSubscribe.tsx) и футере

📌 Подписчики **не сохраняются в базу** — только триггерят письмо администратору. Это упрощённый MVP-подход.

---

## 6. Чеклист: добавить новую страницу `/about-team`

### Выбор шаблона

В проекте есть **три паттерна** статических страниц. Для `/about-team` (произвольная контентная страница) подходящий вариант — паттерн «лёгкой обёртки», как [`pages/testimonials.tsx`](pages/testimonials.tsx:1) или [`pages/bundle.tsx`](pages/bundle.tsx:1):

**Паттерны:**
| Паттерн | Когда использовать | Пример |
|---|---|---|
| **Обёртка над page-компонентом** | Когда у страницы свой уникальный лейаут | [`pages/testimonials.tsx`](pages/testimonials.tsx) → [`TestimonialsPage`](components/pages/TestimonialsPage.tsx) ✅ — **подходит для `/about-team`** |
| **CategoryPage** | Если страница — список шаблонов категории с FAQ и крошками | [`pages/code.tsx`](pages/code.tsx), [`pages/all.tsx`](pages/all.tsx) |
| **Динамический [slug]** | Если контент — это набор сущностей (>3 шт), которые отличаются только данными | [`pages/blog/[slug].tsx`](pages/blog/[slug].tsx) |

### Пошаговый план

**Шаг 1.** Добавить SEO-мета в [`data/pages-meta.ts`](data/pages-meta.ts:3):
```ts
"about-team": {
  title: "Our team | Setproduct",
  description: "Meet the people behind Setproduct…",
  ogImage: "/images/setproduct2.webp",
  canonical: "https://www.setproduct.com/about-team",
},
```

**Шаг 2.** (Опционально) Добавить хлебные крошки в [`data/breadcrumbs.ts`](data/breadcrumbs.ts) — если страница глубже, чем верхний уровень.

**Шаг 3.** (Опционально) Добавить данные в новый файл `data/team.ts`:
```ts
export type TeamMember = { name: string; role: string; avatar: string; bio: string };
export const TEAM: TeamMember[] = [ /* ... */ ];
```
Соответствующие типы добавить в [`types/data.ts`](types/data.ts).

**Шаг 4.** Создать page-компонент [`components/pages/AboutTeamPage.tsx`](components/pages/AboutTeamPage.tsx):
```tsx
import Head from "next/head";
import SiteHeader from "../layout/SiteHeader";
import SiteFooter from "../layout/SiteFooter";
import ScrollUpButton from "../layout/ScrollUpButton";
import HeroSection from "../sections/HeroSection";
import CtaSubscribe from "../sections/CtaSubscribe";
import { PAGE_META } from "../../data/pages-meta";
import { TEAM } from "../../data/team";
import type { BlogPostPreview } from "../../types/data";

type Props = { blogPosts: BlogPostPreview[] };

export default function AboutTeamPage({ blogPosts }: Props) {
  const meta = PAGE_META["about-team"];
  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta content={meta.description} name="description" />
        <link href={meta.canonical} rel="canonical" />
      </Head>
      <SiteHeader blogPosts={blogPosts} />
      <main className="mt-18">
        <HeroSection title="Meet our team" description="The people behind Setproduct" />
        <div className="section">
          <div className="section-padding top-64 bottom-80">
            <div className="container">
              {/* Сетка из TEAM */}
            </div>
          </div>
        </div>
        <CtaSubscribe />
      </main>
      <SiteFooter />
      <ScrollUpButton />
    </>
  );
}
```

**Шаг 5.** Создать роут [`pages/about-team.tsx`](pages/about-team.tsx) (по образцу [`pages/testimonials.tsx`](pages/testimonials.tsx)):
```tsx
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import AboutTeamPage from "../components/pages/AboutTeamPage";
import { getBlogPostPreviews } from "../lib/blog/get-blog-post-previews";
import type { BlogPostPreview } from "../types/data";

type Props = { blogPosts: BlogPostPreview[] };

export const getStaticProps: GetStaticProps<Props> = async () => ({
  props: { blogPosts: getBlogPostPreviews({ maxPerCategory: 6 }) },
});

export default function AboutTeamRoute({ blogPosts }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <AboutTeamPage blogPosts={blogPosts} />;
}
```

**Шаг 6.** Добавить путь `/about-team` в массив `STATIC_PATHS` в [`pages/sitemap.xml.ts`](pages/sitemap.xml.ts:11), чтобы страница попала в sitemap:
```ts
const STATIC_PATHS = [
  "/",
  "/about-team",   // ← новая
  "/all",
  // ...
];
```

**Шаг 7.** (Если нужно) Добавить ссылку на страницу в [`SiteHeader`](components/layout/SiteHeader.tsx) и/или [`SiteFooter`](components/layout/SiteFooter.tsx).

**Шаг 8.** Проверить:
- `npm run dev` → открыть `/about-team`
- `npm run lint` (это `tsc --noEmit`)
- На прод-билде Next/Vercel `cleanUrls: true` ([`vercel.json`](vercel.json:2)) гарантирует, что `/about-team` отдаёт ту же HTML без хвостового `.html`

### Что НЕ делать
- ❌ Не использовать `getServerSideProps` для обычной статики — все страницы проекта SSG
- ❌ Не вставлять контент прямо в `pages/about-team.tsx` — соблюдать разделение «роут → page-компонент»
- ❌ Не забывать про `blogPosts` в props — `SiteHeader` ожидает их для мега-меню
- ❌ Не подключать новые CSS через `<link>` в `_document` — стили класть либо в [`styles/globals.css`](styles/globals.css), либо рядом как CSS-модуль
- ❌ Не дублировать вёрстку хедера/футера — использовать [`SiteHeader`](components/layout/SiteHeader.tsx) + [`SiteFooter`](components/layout/SiteFooter.tsx) + [`ScrollUpButton`](components/layout/ScrollUpButton.tsx)

---

## Сводная таблица архитектуры роутинга

| Аспект | Состояние |
|---|---|
| Тип роутера | Pages Router (не App Router) |
| Стратегия рендера | SSG для всех страниц + 1 SSR (sitemap) |
| ISR (`revalidate`) | ❌ Не используется — для обновления контента нужен ребилд |
| Динамические роуты | 4 шт, все с `fallback: false` |
| Источник статичного контента | `data/*.ts` (TS-модули) |
| Источник блог-контента | `content/blog/*.mdx` |
| Глобальный state | `ContactModalContext` для модалки + локальный `useState` |
| API | 3 эндпоинта, все защищены CORS + rate limit + CSRF + honeypot |
| Email | Resend + React Email (`@react-email/components`) |
| Sitemap | Динамический SSR с in-edge кэшем (1 час) |
| 404 | Кастомная, минималистичная, без layout |
| 500 | Дефолтная Next.js (не переопределена) |

# Анализ вспомогательных файлов и тулинга

## 1. `emails/` — шаблоны писем для Resend

В папке **только два React Email шаблона**, которые рендерятся в HTML на сервере и отправляются через Resend API.

| Файл | Пропсы | Что в письме | Куда отправляется |
|---|---|---|---|
| [`emails/ContactEmail.tsx`](emails/ContactEmail.tsx:8) | `email`, `message` | Заголовок «New Contact Form Submission», email отправителя, текст сообщения | hello@setproduct.com (см. [`pages/api/contact.ts`](pages/api/contact.ts:20)) |
| [`emails/SubscribeEmail.tsx`](emails/SubscribeEmail.tsx:7) | `email` | Заголовок «New Newsletter Subscription», email подписчика | hello@setproduct.com (см. [`pages/api/subscribe.ts`](pages/api/subscribe.ts:20)) |

**Стилизация:** inline-styles (так и должно быть для email — внешний CSS почтовые клиенты режут). Шрифт `Arial`, фон `#f4f4f4`, контейнер белый со скруглением 8px. Компоненты из `@react-email/components` (`Html`, `Head`, `Body`, `Container`, `Text`, `Heading`, `Hr`).

### Как работает подписочный эндпоинт

```
Клиент                                    Сервер
──────────────────────────────────────────────────────────────
1. GET /api/csrf          ───────────►   csrf.ts: generateToken() → { token, timestamp }
2. POST /api/subscribe    ───────────►   subscribe.ts:
   { email, website,                       • проверка Origin (whitelist)
     csrfToken, csrfTimestamp }            • rate limit 1 req / 3 sec по IP
                                           • honeypot (website должен быть "")
                                           • verifyToken(csrfToken, csrfTimestamp)
                                           • render(<SubscribeEmail email={email} />)
                                           • resend.emails.send({
                                               from: "contact@setproduct.com",
                                               to:   "hello@setproduct.com",
                                               subject: "New Subscription",
                                               html
                                             })
                                           • return { success: true }
```

Хук-обёртка для клиента: [`hooks/useSubscribe.ts`](hooks/useSubscribe.ts:3) — делает CSRF→POST в одном `handleSubscribe`. Используется в [`components/sections/CtaSubscribe.tsx`](components/sections/CtaSubscribe.tsx:3).

### ⚠️ Где список подписчиков

**Списка подписчиков нет нигде.** В проекте отсутствует БД, нет аудиенций Resend, нет интеграции с Mailchimp / ConvertKit / Brevo. Каждое нажатие «Subscribe» = одно уведомление на hello@setproduct.com, и всё. Чтобы реально собирать аудиторию, нужно дописать одно из:

- **Resend Audiences** — добавить `resend.contacts.create({ email, audienceId })` в [`pages/api/subscribe.ts`](pages/api/subscribe.ts:20) (требует создания Audience в Resend dashboard и `RESEND_AUDIENCE_ID` в env).
- Внешний сервис (Mailchimp / Buttondown / ConvertKit) через их REST API.
- Своя БД (Vercel Postgres / Supabase / Upstash Redis).

### Что делать с `emails/`

| Сценарий | Действие |
|---|---|
| Поменять текст/дизайн письма | ✅ Редактируйте `ContactEmail.tsx` / `SubscribeEmail.tsx`. Помните про inline-стили. |
| Превью писем локально | ❌ Не настроено. Можно поднять `npm i -D react-email && npx react-email dev` (доп. зависимость, не в проекте). |
| Добавить новый тип письма | Создайте `emails/NewTemplate.tsx` + новый API-route + новый хук по аналогии с `useSubscribe`. |

---

## 2. Корневые `check_images.js` / `check_images2.js` / `fix_images.js`

Это **разовые скрипты миграции из Webflow**, не интегрированы в `npm scripts`, не вызываются из CI/билда.

| Файл | Назначение | Идемпотентность |
|---|---|---|
| [`check_images.js`](check_images.js:1) | Сканирует `*.mdx/ts/tsx/css`, ищет пути `/images/...` и `/blog/authors/...` в кавычках/скобках, печатает отсутствующие в `public/`. **Только чтение.** | ✅ Безопасен |
| [`check_images2.js`](check_images2.js:1) | То же, но регексп более широкий — без требования обрамляющих кавычек (ловит больше форматов). **Только чтение.** | ✅ Безопасен |
| [`fix_images.js`](fix_images.js:1) | **Пишет в файлы.** Ищет паттерн `[a-f0-9]{24}_filename.ext` (Webflow CDN-хэши) и удаляет хэш-префикс, если файл уже лежит в `public/images/` без префикса. | ⚠️ Меняет MDX/TSX/CSS |

### Что делать при добавлении новых картинок

| Что вы делаете | Нужно ли запускать |
|---|---|
| Кладёте новую картинку в `public/images/` и используете её | ❌ Не нужно — скрипты не для этого. |
| Хотите проверить, что нет битых ссылок после массового редактирования MDX | ✅ Запустите `node check_images2.js` — он покажет «Missing image: ...». |
| Импортируете старый контент из Webflow с хэш-именами файлов | ✅ Один раз: положите файлы без хэшей в `public/images/` → `node fix_images.js` → проверьте `git diff`. |
| Регулярная работа | ❌ Эти скрипты — артефакты миграции, в обычном flow не нужны. |

**Рекомендация:** эти три файла стоит либо удалить, либо перенести в `scripts/legacy/` чтобы не путаться. Они не требуются ни build, ни dev, ни deploy.

---

## 3. `scripts/` — служебные утилиты

12 файлов, **ни один не привязан к `npm run build`**. Единственный задействован в `package.json`: `generate-blog-thumbs.js` через `npm run thumbs:blog`.

### Группировка

**🔧 Миграция/конверсия изображений (одноразовые):**

| Файл | Что делает | Опасность |
|---|---|---|
| [`scripts/convert-to-webp.js`](scripts/convert-to-webp.js:1) | Конвертирует все `.jpg/.jpeg/.png` в `public/` в `.webp` (q80) **и удаляет оригиналы**. | 🔴 Деструктивный |
| [`scripts/convert-avif-to-webp.js`](scripts/convert-avif-to-webp.js:1) | То же для `.avif` → `.webp`. **Удаляет .avif.** | 🔴 Деструктивный |
| [`scripts/update-references.js`](scripts/update-references.js:1) | Меняет в исходниках расширения `.png/.jpg` → `.webp` в путях. **Пишет файлы.** | 🔴 Деструктивный |
| [`scripts/fix-svg-as-jpg.mjs`](scripts/fix-svg-as-jpg.mjs:1) | Находит файлы с расширением `.jpg`, чьё содержимое реально SVG (Webflow глюк), переименовывает в `.svg` и правит ссылки в MDX. Есть `--dry`. | 🟡 С `--dry` безопасно |
| [`scripts/fix-broken-image-links.mjs`](scripts/fix-broken-image-links.mjs:1) | Чинит шаблон `[\n\n![](src)\n\n](url)` в MDX → `[![](src)](url)`. Есть `--dry`. | 🟡 С `--dry` безопасно |

**🖼️ Генерация превью (могут пригодиться):**

| Файл | Что делает |
|---|---|
| [`scripts/generate-blog-thumbs.js`](scripts/generate-blog-thumbs.js:1) | `npm run thumbs:blog` — генерит 800px webp-превью для блог-обложек. Идемпотентный (`isFresh` сравнивает mtime). |
| [`scripts/generate-thumbs.js`](scripts/generate-thumbs.js:5) | Хардкод-скрипт для двух конкретных обложек → ресайз до 400px в `public/blog/covers/thumbs/`. Не общего назначения. |

**🔍 Аудит и QA:**

| Файл | Что делает |
|---|---|
| [`scripts/check-site.mjs`](scripts/check-site.mjs:1) | **Полезный.** `node scripts/check-site.mjs https://preview-url` — берёт sitemap, обходит все 245 страниц, парсит `<a>`/`<img>`/`<source>`/`<script>`/`<link>`/og:image, проверяет HTTP-статусы. Пишет `scripts/report.json` + `scripts/report.md`. |
| [`scripts/find-unused-images.js`](scripts/find-unused-images.js:1) | Ищет картинки в `public/`, которые не упоминаются ни в одном `.ts/tsx/mdx/css`. |
| [`scripts/verify-image-link-fix.mjs`](scripts/verify-image-link-fix.mjs:1) | Проверяет результат `fix-broken-image-links.mjs` — пытается сериализовать пост через `next-mdx-remote/serialize`, считает картинки внутри ссылок. |
| [`scripts/report.json`](scripts/report.json:1), [`scripts/report.md`](scripts/report.md:1) | **Артефакты последнего прогона** `check-site.mjs`. На момент скана: 245/245 страниц OK, 354 битых внешних ссылок (в основном codepen 403 и медленные сайты с fetch failed). |

### Что делать с `scripts/`

| Сценарий | Действие |
|---|---|
| Добавил картинку в `public/images/` | ❌ Ничего не запускать. |
| Добавил новый блог-пост с обложкой | ⚠️ Опционально: `npm run thumbs:blog` (но кода, который реально использует тамбы из `/thumbs/`, я в компонентах блога не вижу — проверьте перед использованием). |
| Перед релизом большой пачки правок | ✅ `node scripts/check-site.mjs http://localhost:3000` после `npm run build && npm start` — найдёт битые ссылки. |
| Хочу почистить неиспользуемые картинки | ✅ `node scripts/find-unused-images.js`, потом **руками** удалить (не автоматизировано). |
| Массовая конвертация форматов | 🔴 НЕ запускайте `convert-*.js` / `update-references.js` без коммита и осмысленного бэкапа. Это одноразовая миграционная штука. |

**Рекомендация:** добавить в `package.json` алиасы для безопасных скриптов:
```json
"scripts:health": "node scripts/check-site.mjs",
"scripts:unused": "node scripts/find-unused-images.js"
```

---

## 4. `test-next-redirect.js` / `test-redirect.js`

| Файл | Содержимое | Что это |
|---|---|---|
| [`test-next-redirect.js`](test-next-redirect.js:1) | Одна импортная строка `require('next/dist/lib/load-custom-routes')` + комментарий «Actually it's easier to just look at next.config.js and simplify it». | **Брошенный черновик.** Автор начал писать тест редиректов, передумал. |
| [`test-redirect.js`](test-redirect.js:1) | Проверяет регексп `/:path+.html` через `pathToRegexp` из Next.js. Печатает true/false для `/legal/license.html`, `/blog/my-post.html`, `/about.html`, `/index.html`. | **Дебаг-снипет** для проверки правила в [`next.config.js`](next.config.js:18) (тот самый редирект `.html` → без `.html`). |

Это **не тесты в смысле test-runner** (нет jest/vitest/playwright). Это два разовых REPL-снипета.

### Что делать

❌ В обычной разработке **не нужны**. Можно удалить или перенести в `scripts/dev/`. Если хочется реальные тесты — нужно ставить Vitest/Playwright и писать с нуля (в проекте тестов нет вообще).

---

## 5. `.vscode/` — настройки редактора

Содержит **только один файл**:

```json
// .vscode/settings.json
{
  "git.ignoreLimitWarning": true
}
```

[`.vscode/settings.json`](.vscode/settings.json:1) — это единственная настройка: подавляет варнинг VS Code про большое количество файлов в репозитории (Git Source Control panel ругается, когда меняется >10k файлов — а у нас `public/` действительно жирный).

**Чего НЕТ:**
- ❌ Рекомендуемых расширений (`extensions.json`)
- ❌ Настроек format-on-save
- ❌ Настроек Tailwind IntelliSense
- ❌ Tasks / Launch configs

### Что было бы полезно добавить (опционально)

```json
// .vscode/extensions.json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "unifiedjs.vscode-mdx",
    "esbenp.prettier-vscode"
  ]
}
```

---

## 6. Линтер / форматтер — есть ли, что запускать перед коммитом?

### Что есть

| Инструмент | Установлен? | Сконфигурирован? |
|---|---|---|
| **ESLint** | ❌ Нет (нет ни `eslint`, ни `eslint-config-next` в [`package.json`](package.json:1)) | ❌ Нет `.eslintrc*` |
| **Prettier** | ❌ Нет | ❌ Нет `.prettierrc*` |
| **Husky / lint-staged** | ❌ Нет | ❌ Pre-commit хуков нет |
| **TypeScript check** | ✅ Установлен | ✅ `npm run lint` = `tsc --noEmit` |
| **Тест-раннер** | ❌ Нет | ❌ Нет jest/vitest/playwright |

**Команды из [`package.json`](package.json:6):**

```bash
npm run dev        # next dev
npm run build      # next build
npm run start      # next start
npm run lint       # tsc --noEmit  ← НЕ ESLint, а только type-check
npm run thumbs:blog # генерация превью обложек
```

### Чеклист перед коммитом

| Команда | Зачем |
|---|---|
| `npm run lint` | **Обязательно** — упадёт билд на Vercel, если есть TS-ошибки. |
| `npm run build` | Желательно — поймает SSG/SSR-ошибки, проверит `getStaticProps`/`getStaticPaths` всех страниц, валидность MDX. |
| `node scripts/check-site.mjs http://localhost:3000` | Опционально перед крупным деплоем — найдёт битые внутренние ссылки. |

### Если хотите добавить линтер/форматтер

Минимально-инвазивный сетап для этого проекта:

```bash
npm i -D prettier prettier-plugin-tailwindcss
echo '{"printWidth":110,"singleQuote":false,"semi":true,"plugins":["prettier-plugin-tailwindcss"]}' > .prettierrc.json
```

Добавить в `scripts`:
```json
"format": "prettier --write \"**/*.{ts,tsx,mdx,css}\""
```

ESLint в Next 15 + React 19 ставится через:
```bash
npm i -D eslint eslint-config-next
npx next lint  # создаст .eslintrc.json интерактивно
```

⚠️ Учитывая, что в [`package.json`](package.json:20) все версии стоят как `"latest"` (антипаттерн), добавление ESLint может неожиданно зафейлить билд новым правилом при следующем апгрейде Next. Поэтому перед линтером — **сначала зафиксировать версии**.

---

## Итоговая таблица: «трогать или нет»

| Файл / папка | Назначение | Запускать руками? | Можно удалить? |
|---|---|---|---|
| [`emails/ContactEmail.tsx`](emails/ContactEmail.tsx:1), [`emails/SubscribeEmail.tsx`](emails/SubscribeEmail.tsx:1) | React Email шаблоны | ❌ (используются из API) | ❌ Нужны |
| [`check_images.js`](check_images.js:1) | Поиск битых ссылок (читает) | По необходимости | ✅ Можно (migration leftover) |
| [`check_images2.js`](check_images2.js:1) | То же, шире | По необходимости | ✅ Можно |
| [`fix_images.js`](fix_images.js:1) | Удаление Webflow-хэшей (пишет) | ❌ Миграция закончена | ✅ Можно |
| [`scripts/check-site.mjs`](scripts/check-site.mjs:1) | Health-check сайта | ✅ Перед релизом | ❌ Полезно |
| [`scripts/find-unused-images.js`](scripts/find-unused-images.js:1) | Поиск мёртвых ассетов | По необходимости | ❌ Полезно |
| [`scripts/generate-blog-thumbs.js`](scripts/generate-blog-thumbs.js:1) | `npm run thumbs:blog` | После добавления обложек | ❌ Нужно |
| [`scripts/convert-*.js`](scripts/convert-to-webp.js:1), [`scripts/update-references.js`](scripts/update-references.js:1) | Webflow-миграция | ❌ Деструктивно | ✅ Можно (или перенести в `legacy/`) |
| [`scripts/fix-*.mjs`](scripts/fix-broken-image-links.mjs:1), [`scripts/verify-*.mjs`](scripts/verify-image-link-fix.mjs:1) | MDX-патчи + проверка | По необходимости (с `--dry`) | ⚠️ Сохранить для истории |
| [`scripts/report.json`](scripts/report.json:1), [`scripts/report.md`](scripts/report.md:1) | Артефакт прогона | — | ✅ Можно (регенерируется) |
| [`test-next-redirect.js`](test-next-redirect.js:1) | Брошенный черновик | ❌ | ✅ Да |
| [`test-redirect.js`](test-redirect.js:1) | Дебаг регекспа редиректа | ❌ | ✅ Да |
| [`.vscode/settings.json`](.vscode/settings.json:1) | Подавление git warning | — | ❌ Оставить |

## Главные выводы

1. **Подписчики никуда не сохраняются.** Эндпоинт `/api/subscribe` только шлёт письмо админу. Если нужна реальная рассылка — нужно интегрировать Resend Audiences или внешний сервис.
2. **В корне накоплен мусор миграции** (`check_images*.js`, `fix_images.js`, `test-*.js`) — безопасно вычистить или перенести в `scripts/legacy/`.
3. **`scripts/` — это смесь полезного и одноразового.** Самое ценное — [`scripts/check-site.mjs`](scripts/check-site.mjs:1) для health-check перед релизом и [`scripts/generate-blog-thumbs.js`](scripts/generate-blog-thumbs.js:1) (уже в `package.json`). Остальное — Webflow-миграционные артефакты.
4. **Линтера и форматтера НЕТ.** `npm run lint` — это `tsc --noEmit`, не ESLint. Перед коммитом достаточно `npm run lint && npm run build`. Pre-commit хуков нет, CI-проверок (кроме Vercel-билда) тоже нет.
5. **`.vscode/` минимален.** Один лайн про git limit warning. Имеет смысл добавить `extensions.json` с рекомендациями Tailwind IntelliSense + MDX.