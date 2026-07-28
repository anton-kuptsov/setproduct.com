# Guest posts cluster — content rescue plan

**Snapshot date:** 1 Jul 2026
**Source:** GSC top-pages export (screenshot provided by user)
**Goal:** улучшение позиций (position lift) для 5 постов кластера «guest posts / guest articles». Вторично — восстановление CTR, потому что на двух постах он катастрофический при огромных показах.
**Scope guard:** метаданные (title / metaTitle / description / cardDescription / subtitle) правятся по скиллу `seo`; контентные и структурные правки — по образцу [`tabs-rescue-plan.md`](.ai/tabs-rescue-plan.md:1). Slug, canonical, coverImage, thumbImage, author, date — **не трогаем** (иначе нужны редиректы).

---

## 1. GSC baseline (patients)

| # | Slug | Impr. | Clicks | CTR | Position | Категория |
|---|---|---|---|---|---|---|
| 1 | [`submit-a-guest-post`](content/blog/submit-a-guest-post.mdx:1) | 5 309 | 223 | 4.2% | 20.7 | Presentation |
| 2 | [`guest-posting-opportunities`](content/blog/guest-posting-opportunities.mdx:1) | 49 798 | 152 | 0.3% | 22.7 | Research |
| 3 | [`guest-article-for-web-development`](content/blog/guest-article-for-web-development.mdx:1) | 2 046 | 91 | 4.4% | 28.5 | Presentation |
| 4 | [`guest-posts-vs-niche-edits`](content/blog/guest-posts-vs-niche-edits.mdx:1) | 19 538 | 44 | 0.2% | 11.5 | Research |
| 5 | [`benefits-of-guest-blogging`](content/blog/benefits-of-guest-blogging.mdx:1) | 9 246 | 43 | 0.5% | 19.5 | Research |

Простым языком: все пять статей сидят на 2–3 странице выдачи (позиции 11–29). Две из них (№2 и №4) получают гигантское число показов, но почти никто не кликает — Google их показывает, но заголовок/сниппет не убеждает. №4 буквально в шаге от первой страницы (позиция 11.5) — это самый быстрый выигрыш.

---

## 2. Приоритизация (по размеру возможности)

| Приоритет | Пост | Почему | Главный рычаг |
|---|---|---|---|
| 🥇 P1 | `guest-posts-vs-niche-edits` | Позиция 11.5 — на границе page 1, но CTR 0.2% при 19.5k показов. Малый толчок = попадание в топ-10 + кратный рост кликов. | Заголовок + углубление контента + внутренние ссылки |
| 🥈 P2 | `guest-posting-opportunities` | 49.8k показов (самый большой охват кластера), CTR 0.3%, устаревший «2025» в title. | Заголовок/сниппет + актуализация года + свежесть |
| 🥉 P3 | `benefits-of-guest-blogging` | 9.2k показов, CTR 0.5%, позиция 19.5. Стабильный середняк с потенциалом. | Заголовок + структура (FAQ, списки) |
| P4 | `submit-a-guest-post` | CTR уже хороший (4.2%), но позиция 20.7 — «служебная» страница write-for-us. | Позиционные факторы: контент-глубина + внутренние ссылки-хабы |
| P5 | `guest-article-for-web-development` | Самая низкая позиция (28.5), но малый охват (2k) и хороший CTR (4.4%). | Устранение «Complete Guide», нишевое углубление |

---

## 3. Сквозная проблема №1 — каннибализация и отсутствие кластера

Пять статей конкурируют за одни и те же запросы («guest posting», «guest blogging», «guest post»). Google не понимает, какая из них главная, и распыляет авторитет — отсюда потолок на 2–3 странице у всех сразу.

Решение — **топический кластер (pillar + spokes)**:

```
                    guest-posting-opportunities   ← PILLAR (49.8k показов, самый широкий интент)
                    "как найти площадки + весь гайд"
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                      │
benefits-of-           guest-posts-           guest-article-for-
guest-blogging         vs-niche-edits         web-development
"зачем это нужно"      "сравнение тактик"     "нишевый кейс: web dev"
        │                     │                      │
        └─────────────────────┴──────────────────────┘
                              │
                    submit-a-guest-post   ← CONVERSION page (write-for-us)
                    "а теперь подай нам пост"
```

Правила перелинковки (реализуются правкой тела MDX и полей `relatedSlugs`):
- Каждый spoke ссылается **вверх** на pillar (`guest-posting-opportunities`) контекстной ссылкой в теле.
- Pillar ссылается **вниз** на все 4 spoke в соответствующих разделах.
- Все 4 контентных поста ссылаются на конверсионную `submit-a-guest-post` через CTA «а если хотите опубликоваться у нас».
- Обновить `relatedSlugs` во frontmatter так, чтобы связанные посты замкнулись внутри кластера (сейчас они частично уводят на нерелевантные `how-to-cancel-adobe-subscription-without-fees` и т. п.).

Это снимает каннибализацию и передаёт весь внутренний вес pillar-странице.

---

## 4. Сквозная проблема №2 — заголовки нарушают правила проекта

Все 5 title написаны в Title Case (нарушение sentence-case из [`AGENTS.md`](AGENTS.md:41)) и содержат запрещённые скиллом элементы: слова «Complete»/«Comprehensive», двоеточие в title, устаревший «2025».

| Пост | Проблемы текущего title |
|---|---|
| submit-a-guest-post | Title Case |
| guest-posting-opportunities | Title Case + «Comprehensive» + «:» + устаревший «2025» |
| guest-article-for-web-development | Title Case + «Complete Guide» |
| guest-posts-vs-niche-edits | Title Case + «:» |
| benefits-of-guest-blogging | Title Case + «:» |

---

## 5. Пер-пост план правок

Для каждого поста ниже — **рекомендованное направление** title и description (sentence case проверен, длина проверена). На этапе внедрения скилл `seo` формально предложит по 3 варианта title и 3 варианта description с выбором пользователя; здесь зафиксирован рекомендуемый №1 как отправная точка.

### P1 — guest-posts-vs-niche-edits (Research, поз. 11.5)

**Текущий title:** `Niche Edits vs Guest Post Links: Choosing the Best Link-Building Strategy`
**Рекомендация:** `Guest posts vs niche edits for stronger backlinks in 2026` (57 симв.)
- Таргет-запрос: `guest posts vs niche edits` (порядок как в slug и в реальном запросе); хук — новизна (2026) + бенефит (stronger backlinks).
- Убраны Title Case и двоеточие.

**Текущий description → рекомендация:**
`Guest posts or niche edits? Compare cost, speed, risk, and SEO impact side by side, then use a decision checklist to pick the right link-building tactic.` (~150 симв.)

**Рычаги позиции (это ключевой пост):**
- Добавить answer-first TL;DR (40–80 слов) до первого H2 — прямой ответ «что выбрать и когда».
- Добавить **сравнительную таблицу** guest posts vs niche edits (строки: cost, speed, risk, control, SEO impact, best for).
- Добавить FAQ-блок (5–7 Q&A) под запросы «are niche edits safe», «what is cheaper» и т. п.
- Контекстная ссылка вверх на pillar `guest-posting-opportunities` + вниз/вбок на `benefits-of-guest-blogging`.
- Привести H2/H3 к sentence case в зоне правок.

### P2 — guest-posting-opportunities (Research, поз. 22.7, PILLAR)

**Текущий title:** `How to Find Guest Posting Opportunities in 2025: A Comprehensive Guide`
**Рекомендация:** `How to find guest posting opportunities in 2026` (48 симв.)
- Таргет-запрос: `how to find guest posting opportunities`; хук — новизна (актуальный год).
- Убраны Title Case, «Comprehensive», двоеточие, устаревший «2025».

**Текущий description → рекомендация:**
`Find guest posting opportunities that still work in 2026. Use competitor backlink analysis, search operators, and social listening to build a vetted outreach list.` (~160 симв.)

**Рычаги позиции (это pillar — на него работаем плотнее всего):**
- Обновить весь «2025» → «2026» в теле и заголовках (свежесть — сильный сигнал).
- Достроить до полноценного pillar: добавить/усилить разделы «search operators cheat-sheet», «how to vet a site (DA, traffic, spam score)», «outreach email templates».
- Добавить FAQ + «before you pitch» checklist.
- Вставить ссылки вниз на все 4 spoke-поста в тематически подходящих абзацах.
- H2/H3 → sentence case.

### P3 — benefits-of-guest-blogging (Research, поз. 19.5)

**Текущий title:** `Guest Blogging Benefits: Unlock SEO Success and Boost Your Brand`
**Рекомендация:** `9 benefits of guest blogging for SEO and brand growth` (53 симв.)
- Таргет-запрос: `benefits of guest blogging`; хук — специфичность (число) + бенефит.
- Убраны Title Case и двоеточие. (Число «9» синхронизировать с реальным количеством пунктов в теле.)

**Текущий description → рекомендация:**
`See how guest blogging builds backlinks, authority, referral traffic, and trust. Real benefits for SEO and brand growth, plus when guest posting is not worth it.` (~158 симв.)

**Рычаги позиции:**
- Превратить список бенефитов в чёткий нумерованный/H3-структурированный блок (совпадает с числом в title → featured-snippet-friendly).
- Добавить контр-угол «when guest blogging is NOT worth it» (E-E-A-T, уход от «тонкого» контента).
- FAQ-блок.
- Ссылка вверх на pillar + вбок на `guest-posts-vs-niche-edits`.

### P4 — submit-a-guest-post (Presentation, поз. 20.7, CONVERSION)

**Текущий title:** `Submit a Guest Post to Our Blog`
**Рекомендация:** `Submit a guest post to our design and dev blog` (46 симв.)
- Таргет-запросы: `submit a guest post`, `write for us design`; sentence case.

**Текущий description → рекомендация:**
`Submit a guest post to reach thousands of designers and developers. See our guidelines, do-follow link pricing, and how to pitch a topic we accept.` (~145 симв.)

**Рычаги позиции (страница уже хорошо конвертит по CTR — качаем позицию):**
- Расширить «write for us» контентом: чёткие guidelines, требования к тексту, что принимаем/что нет, сроки — это углубляет тонкую страницу.
- Принять входящий внутренний вес: на неё ссылаются все 4 контентных поста (CTA-хаб кластера).
- Проверить и заполнить пустые `inlineCta.buttonText` / `buttonLink` (сейчас `''`).

### P5 — guest-article-for-web-development (Presentation, поз. 28.5)

**Текущий title:** `The Complete Guide to Guest Posting for Web Development Companies`
**Рекомендация:** `Guest posting for web development companies that gets leads` (58 симв.)
- Таргет-запрос: `guest posting for web development`; хук — бенефит (leads); убрано «Complete Guide».

**Текущий description → рекомендация:**
`Turn guest posts into leads for your web development company. Get a pitch framework, topic ideas editors accept, and outreach steps that build backlinks.` (~152 симв.)

**Рычаги позиции:**
- Углубить нишу «web dev»: конкретные типы площадок, примеры тем, шаблон питча именно для web-dev компаний (сейчас текст общий и короткий — 3 min read).
- Подтянуть subtitle к sentence case.
- Ссылка вверх на pillar + на `submit-a-guest-post`.

---

## 6. Последовательность внедрения (волны)

**Wave A — метаданные (быстро, низкий риск, эффект на CTR за 2–4 недели):**
Правим только title / metaTitle / description / cardDescription / subtitle по всем 5 постам через скилл `seo` (по 3 варианта на выбор, атомарные коммиты `seo: improve title and description for <slug>`). Порядок: P1 → P2 → P3 → P4 → P5.

**Wave B — внутренняя перелинковка и кластер (эффект на позиции):**
- Обновить `relatedSlugs` во frontmatter всех 5 постов на внутрикластерные.
- Проставить контекстные ссылки pillar↔spokes↔conversion в теле MDX.

**Wave C — контент-углубление (главный драйвер позиций, эффект 4–8 недель):**
Порядок по приоритету: P1 (таблица + TL;DR + FAQ) → P2 (достройка pillar + 2025→2026) → P3 (структура бенефитов + контр-угол) → P5 (нишевое углубление) → P4 (расширение write-for-us).
Правки тела — атомарными шагами через `apply_diff`, с чекпоинтами (файлы > 500 строк: `guest-posts-vs-niche-edits` = 315, остальные меньше, но всё равно точечно).

**Wave D — свежесть:**
Обновить поле `date` только у постов с существенным контентным апдейтом (по явному согласию) — сигнал свежести для переиндексации.

---

## 7. План измерения

| Чекпоинт | Когда | Что смотрим |
|---|---|---|
| Day 7 | +7 дней | URL Inspection: переиндексированы ли 5 постов |
| Day 14 | +14 дней | Ранние сигналы CTR по P1/P2 (самые большие показы) |
| Day 30 | +30 дней | Позиция P1: пробила ли топ-10; CTR P2 vs baseline 0.3% |
| Day 60 | +60 дней | Полная оценка: позиции всех 5 vs baseline из §1 |

**Критерии успеха:**
- P1 `guest-posts-vs-niche-edits`: позиция 11.5 → топ-10, CTR 0.2% → ≥1.5%.
- P2 `guest-posting-opportunities`: CTR 0.3% → ≥1.0% (при 49.8k показов это кратный рост кликов).
- Средняя позиция по кластеру улучшается, ни один пост не проседает после переиндексации.

---

## 8. Открытый вопрос по бенчмаркам

Категории **Presentation** и **Research** сейчас не имеют заполненных бенчмарков в [`seo-benchmarks.md`](.ai/seo-benchmarks.md:141). Предлагаю после Wave A/C завести для них плейсхолдер-строки с post-slug и датой замера, чтобы отслеживать кластер как отдельную группу. Требует отдельного подтверждения перед правкой файла бенчмарков.

---

## 9. Out of scope (сознательно не трогаем)

- Slug / canonical / URL — менять нельзя без редиректов.
- coverImage / thumbImage / alt — отдельный image-alt воркфлоу.
- Schema / JSON-LD — отдельный скилл.
- Правка чужих (не-кластерных) постов из текущих `relatedSlugs`.
