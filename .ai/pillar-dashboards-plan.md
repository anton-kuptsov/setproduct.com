# Pillar page для Dashboards — план

> **Статус:** Фаза 1 (планирование). Этот файл — единственный артефакт фазы.
> Никакие MDX-файлы не трогались, новые посты не создавались, коммитов нет.
> Дата составления: 2026-06-03.
>
> ⚠️ `.ai/content-strategy.md` **не существует** на момент составления плана.
> Стратегические принципы взяты из `.ai/seo-baseline-2026-05-28.md`,
> `.ai/seo-benchmarks.md` и `.ai/seo-category-audit.md`. Если ты создашь
> `content-strategy.md` отдельно — план нужно будет сверить с ним.

---

## Executive summary

Делаем один pillar-пост про дизайн дашбордов, который собирает вокруг себя
кластер из **14 существующих постов**. Сейчас кластер раздроблён: 6 почти
одинаковых listicle-постов «examples», 3 дубля «что такое / зачем дашборд»,
и несколько сильных нишевых гайдов без перелинковки между собой. Главная
боль — пост [`dashboard-design-best-practices-top-dashboard-ui-design-tips`](../content/blog/dashboard-design-best-practices-top-dashboard-ui-design-tips.mdx)
имеет **40 449 показов при 9 кликах (CTR 0.022%)** — это второй худший
результат во всём блоге и главный кандидат, чьи показы должен перехватить
новый pillar с чистым URL.

Затрагиваем 14 постов: **1** становится/замещается pillar, **5** остаются
сильными cluster-постами (только добавить ссылку), **4** требуют content
rescue (низкое качество по аудиту), **4** идут под merge/deprecate.

Ожидаемый эффект: перехват ~40k показов «dashboard-best-practices» на
оптимизированный URL, консолидация дублей (рост среднего engagement
категории), и топик-кластерная структура для ранжирования по головным
запросам «dashboard ui design», «dashboard design».

---

## Inventory of dashboard posts

Все 14 постов. Метрики — из `seo-baseline-2026-05-28.md`. Где данных нет —
`(no data)`. GSC-baseline покрывает только топ-28 постов блога, поэтому у
большинства dashboard-постов GSC/GA4 данных в файле нет.

| # | Slug | Category | Date | Words | GSC показы / клики / CTR | Содержание (1 фраза) |
|---|------|----------|------|-------|--------------------------|----------------------|
| 1 | dashboard-design-best-practices-top-dashboard-ui-design-tips | Design Trends | 2024-06-03 | 4121 | **40 449 / 9 / 0.022%** (critical) | Длинный generic-гайд «что такое дашборд + best practices + шаги дизайна». |
| 2 | top-dashboard-design-examples-ideas | Inspiration | 2024-06-21 | 4298 | (no data) | Большой listicle: типы, компоненты, 7 примеров от клиентов, best practices. |
| 3 | types-of-dashboards-main-categories | Resources | 2024-06-13 | 3568 | (no data) | Классификация типов дашбордов (операционные, аналитические, стратегические). |
| 4 | why-are-dashboards-important | SEO (мискатег.) | 2024-06-14 | 3730 | (no data) | «Зачем нужны дашборды + цели + типы» — дубль темы #6. |
| 5 | marketing-dashboard-examples-templates | Inspiration | 2024-06-24 | 3448 | (no data) | Listicle: что такое marketing dashboard, типы, топ-5 шаблонов, best practices. |
| 6 | benefits-of-dashboards | SEO (мискатег.) | 2024-05-30 | 2327 | (no data) | «Польза дашбордов для б��знеса» — дубль темы #4, низкое качество по аудиту. |
| 7 | e-commerce-dashboard-examples | Inspiration | 2024-06-27 | 2376 | (no data) | Listicle: e-commerce метрики, топ-5 примеров, best practices. |
| 8 | best-analytics-dashboard-examples | Inspiration | 2024-06-24 | 2323 | (no data) | Listicle: что такое аналитический дашборд, топ-5 примеров, best practices. |
| 9 | how-to-study-saas-dashboard-in-the-ai-era | Inspiration | 2026-03-24 | 2101 | (no data, свежий) | Как изучать паттерны SaaS-дашбордов в эпоху AI — сильный editorial-голос. |
| 10 | saas-dashboard-examples | Inspiration | 2024-06-27 | 2004 | (no data) | Listicle: определение SaaS-дашборда, ключевые элементы, топ-5 примеров. |
| 11 | effective-dashboard-design-principles | UI Design | 2024-06-07 | 1904 | (no data) | 8 принципов дизайна дашбордов + anti-patterns + checklist + FAQ. Качественный. |
| 12 | figma-tables-data-grid-design | UI Design | 2019-04-28 | 1117 | (no data) | Как собрать гибкий data grid в Figma из cell-компонента. Узкая Figma-тема. |
| 13 | campaign-marketing-dashboards-guide | Research | 2025-03-18 | 1075 | (no data) | Дашборды для аудиторной аналитики кампаний (демография, гео, поведение). |
| 14 | marketing-dashboard-ui-design-guide | Inspiration | 2025-03-14 | 1011 | 9 379 / 14 / 0.15% (Tier 4) | Гайд по UI marketing-дашборда: anatomy, charts, mobile, handoff, a11y. |

### Примечания по метрикам (Шаг 2, кросс-референс)

- **GSC-данные в baseline есть только для 2 постов кластера:** #1
  (`dashboard-design-best-practices…`, 40 449 / 9 / 0.022%) и #14
  (`marketing-dashboard-ui-design-guide`, 9 379 / 14 / 0.15%).
- **GA4 views, engagement time:** в `seo-baseline-2026-05-28.md` поле
  отдельной GA4-колонки нет — baseline оперирует GSC показами/кликами/CTR.
  Поэтому engagement time по всем 14 постам = `(no data в baseline)`. Если
  у тебя в памяти проекта или в GA4-экспорте есть engagement-цифры (как
  упомянутые в benchmarks 2 сек для `effective-dashboard-design-principles`)
  — впиши их в open decisions, это меняет классификацию C-постов.
- **Связанный косвенный запрос:** `dashboard ui kit — 24 клика / 1023 показа`
  (из top queries baseline) — это коммерческий запрос, который pillar должен
  обслуживать секцией про шаблоны/UI-kits.
- **Аудит:** `seo-category-audit.md` уже пометил #6 `benefits-of-dashboards`
  и #4 `why-are-dashboards-important` как **low quality, мискатегоризованы в
  SEO, рекомендация consolidate + recategorize в UI Design**. Это прямо
  ложится в категорию D ниже.

---

## Classification

Ровно один pillar-слот, остальные распределены по B / C / D.

### A) Pillar candidate (ровно один)

| Решение | Детали |
|---|---|
| **Новый slug** `dashboard-ui-design` | Рекомендуется создать **новый** pillar-пост, а не апгрейдить #1. Причина: URL #1 (`dashboard-design-best-practices-top-dashboard-ui-design-tips`) — длинный, переоптимизированный, с CTR 0.022%. Чистить его в pillar дороже, чем построить новый чистый URL и 301-redirect-нуть на него показы старого. |
| Альтернатива | Если не хочешь плодить URL — можно назначить pillar'ом #1 «на месте», но тогда обязателен полный rewrite заголовка/контента и сохранение длинного URL (минус для CTR). См. open decisions. |

### B) Strong cluster — оставить, добавить только ссылку на pillar

Хороший/уникальный контент, отдельный search-intent, не дублируется.

| Slug | Почему остаётся как cluster |
|---|---|
| effective-dashboard-design-principles (#11) | Качественный: 8 принципов + anti-patterns + checklist + FAQ. Целевой donor для секций pillar, но живёт сам. |
| how-to-study-saas-dashboard-in-the-ai-era (#9) | Свежий (2026-03), сильный editorial-голос, уникальный угол «AI era». |
| types-of-dashboards-main-categories (#3) | Обслуживает запрос «types of dashboards» — pillar делегирует туда. |
| marketing-dashboard-ui-design-guide (#14) | Единственный кроме #1 с GSC-данными, узкий intent «marketing dashboard UI». |
| figma-tables-data-grid-design (#12) | Узкая Figma data-grid тема, отдельный intent (Figma tables), исторический пост 2019. |

### C) Weak cluster — needs content rescue (остаются cluster + content fix)

Тематически валидны, но низкое качество / дубли формата listicle / низкий
ожидаемый CTR. Остаются, но требуют правки контента вместе с ссылкой.

| Slug | Проблема | Нужен fix |
|---|---|---|
| saas-dashboard-examples (#10) | Шаблонный listicle «топ-5 примеров», одинаковая структура с #5/#7/#8. | Дифференцировать, убрать дубль-секции, добавить ссылку на pillar. |
| best-analytics-dashboard-examples (#8) | Тот же listicle-паттерн. | То же. |
| e-commerce-dashboard-examples (#7) | Тот же паттерн, узкая ниша e-comm. | То же. |
| campaign-marketing-dashboards-guide (#13) | Короткий (1075 слов), Research-категория, AI-филлерные H2 («Stalking your audience (Legally)»). | Подчистить, решить — слить с marketing-кластером или оставить. |

### D) Merge or deprecate (контент → в pillar, пост удалить/сократить)

| Slug | Действие | Обоснование |
|---|---|---|
| dashboard-design-best-practices-top-dashboard-ui-design-tips (#1) | **Merge → pillar, 301 redirect** | Лучшие части (определение, best practices) переезжают в pillar; старый URL 301-редиректится на `dashboard-ui-design`, чтобы перехватить 40k показов. |
| why-are-dashboards-important (#4) | **Merge → pillar + deprecate** | Дубль темы #6, low quality, мискатег. в SEO. Контент «зачем/цели» → секции 1–2 pillar. 301 на pillar. |
| benefits-of-dashboards (#6) | **Merge → pillar + deprecate** | Дубль #4, low quality (по `seo-category-audit.md`). Контент «benefits» → секция 2 pillar. 301 на pillar. |
| top-dashboard-design-examples-ideas (#2) | **Merge ИЛИ оставить — решить** | 4298 слов, но дублирует «examples + types + best practices». Кандидат на частичную интеграцию в секцию 5, либо сокращение до чистого «examples gallery». См. open decisions. |
| marketing-dashboard-examples-templates (#5) | **Merge-частично** | Сильно пересекается с #14 и #10. Решить: оставить как «marketing examples» cluster или влить в pillar/#14. |

> Итог по числам: A=1 (новый slug), B=5, C=4, D=4 (из них #2 и #5 —
> «merge-or-keep», финальное решение за тобой в open decisions).

---

## Proposed pillar structure

### URL / slug — 3 варианта

| Вариант | Коллизия? | Оценка |
|---|---|---|
| **`/blog/dashboard-ui-design`** ✅ рекомендую | свободен (проверено `ls`) | Самый чистый. Бьёт по «dashboard ui design», «dashboard ui». Совпадает с неймингом UI-design кластера (`tabs-ui-design`, `badge-ui-design` и т.д.) — консистентно. |
| `/blog/dashboard-design-guide` | свободен | Чисто, но «guide» — слабый хвост по правилам benchmarks (anti-pattern «bare Guide»). Хуже бьёт по «dashboard ui». |
| `/blog/dashboards-design` (3-й вариант) | свободен | Короткий, ловит «dashboards design». Минус: грамматически слабее, меньше совпадает с head-запросом «dashboard ui design». |

**Рекомендация:** `dashboard-ui-design` — покрывает 3 из 4 целевых
запросов («dashboard ui design», «dashboard ui», «dashboards design» через
семантику) и совпадает с конвенцией кластера.

### Outline H2-разделов (14 разделов)

Все заголовки — sentence case (по AGENTS.md). H1/title будет предложен в
Фазе 2 по skill `seo-content-optimization` (60–65 симв., с хуком).

| # | H2 (sentence case) | Цель раздела | Рекрутируемый cluster-пост | Длина |
|---|--------------------|--------------|----------------------------|-------|
| 1 | What is a dashboard? | Прямое определение 50–60 слов для featured snippet и AI-цитирования. | (donor: #1, #4) | 50–60 слов |
| 2 | Why dashboard design matters | Бизнес-контекст: решения, скорость, ROI. | donor: #6 benefits-of-dashboards | 250–350 |
| 3 | Anatomy of a modern dashboard | Компоненты: KPI-карточки, чарты, фильтры, навигация. | donor: #14 (anatomy-секция) | 350–450 |
| 4 | Types of dashboards | Матрица типов (operational / analytical / strategic). Делегирует вглубь. | **Read more →** types-of-dashboards-main-categories (#3) | 300–400 |
| 5 | Dashboard examples by industry | 4–6 индустрий короткими саммари с deep-links. | **Read more →** saas-dashboard-examples (#10), marketing-dashboard-examples-templates (#5), e-commerce-dashboard-examples (#7), best-analytics-dashboard-examples (#8), top-dashboard-design-examples-ideas (#2) | 400–500 |
| 6 | Layout patterns | Single-page vs multi-page vs progressive disclosure. | donor: #1 (steps-секция) | 250–350 |
| 7 | Data visualization principles | Выбор чартов, кодирование цветом, плотность данных. | **Read more →** effective-dashboard-design-principles (#11); figma-tables-data-grid-design (#12) для таблиц | 300–400 |
| 8 | Navigation patterns in dashboards | Сайдбары, табы, drill-down, breadcrumbs внутри дашборда. | (внутренняя ссылка на breadcrumbs-ui-design, tabs-ui-design) | 200–300 |
| 9 | Mobile and responsive dashboards | Адаптив, приоритизация KPI на узком экране. | donor: #14 (mobile-секция), #13 (watch-screen) | 200–300 |
| 10 | Accessibility and performance | Контраст, ARIA, скорость рендера данных. | donor: #14 (a11y-секция) | 200–300 |
| 11 | Common anti-patterns | Чего не делать: data dump, vanity-метрики, перегруз. | **Read more →** effective-dashboard-design-principles (#11, anti-patterns); ⚠️ TECH AUDIT engagement | 250–350 |
| 12 | Frequently asked questions | FAQPage schema, 5–7 вопросов (head-запросы «what is», «types», «best»). | donor: FAQ из #11 | 250–350 |
| 13 | Dashboard templates and UI kits | Продажа: Material You, Eclipse, Neolex Dashboard, Material Desktop. Ловит «dashboard ui kit» (24 клика/1023 показа). | внутренние ссылки на /dashboards, /dashboard-templates | 200–300 |
| 14 | Continue reading | Ссылки на cluster-посты, не попавшие в deep-links выше. | how-to-study-saas-dashboard-in-the-ai-era (#9), campaign-marketing-dashboards-guide (#13) | 100–150 |

Суммарный ориентир объёма pillar: **~3 500–4 500 слов** (соразмерно
текущим #1/#2, но без дублей и AI-филлера).

---

## Cluster mapping

| Existing post slug | Maps to pillar section | Action needed |
|---|---|---|
| dashboard-design-best-practices-top-dashboard-ui-design-tips | Sections 1, 2, 6 (donor) | **MERGE → pillar, 301 redirect** старого URL. Перехват 40k показов. |
| top-dashboard-design-examples-ideas | Section 5 OR merge | **DECIDE:** оставить как examples-cluster (добавить ссылку) ИЛИ влить лучшие примеры в Section 5 и сократить. |
| types-of-dashboards-main-categories | Section 4 (deep-link target) | Keep as-is, add link to pillar + обратную ссылку. |
| saas-dashboard-examples | Section 5 (industry examples) | Keep, content rescue (убрать дубль-структуру), add link to pillar. |
| marketing-dashboard-examples-templates | Section 5 OR merge with #14 | **DECIDE:** оставить ИЛИ слить с marketing-dashboard-ui-design-guide. |
| e-commerce-dashboard-examples | Section 5 (industry examples) | Keep, content rescue, add link to pillar. |
| best-analytics-dashboard-examples | Section 5 (industry examples) | Keep, content rescue, add link to pillar. |
| effective-dashboard-design-principles | Sections 7 + 11 (anti-patterns) | **TECH AUDIT:** проверить engagement (benchmarks упоминают ~2 сек). Keep, add link to pillar. |
| marketing-dashboard-ui-design-guide | Sections 3, 9, 10 (donor anatomy/mobile/a11y) | Keep (есть GSC-данные), add link to pillar. |
| figma-tables-data-grid-design | Section 7 (data grid sub-link) | Keep as-is, add link to pillar. |
| how-to-study-saas-dashboard-in-the-ai-era | Section 14 (continue reading) | Keep as-is, add link to pillar. |
| campaign-marketing-dashboards-guide | Section 14 (continue reading) | Keep ИЛИ merge в marketing-кластер. Content cleanup. |
| why-are-dashboards-important | Sections 1, 2 (donor) | **MERGE → pillar + DEPRECATE,** 301 на pillar. |
| benefits-of-dashboards | Section 2 (donor) | **MERGE → pillar + DEPRECATE,** 301 на pillar. |

---

## Open decisions

Нужны твои ответы до старта Фазы 2:

1. **Slug pillar'а.** Беру `dashboard-ui-design` (рекомендую),
   `dashboard-design-guide` или `dashboards-design`?

2. **Судьба `dashboard-design-best-practices-top-dashboard-ui-design-tips`
   (40k показов, CTR 0.022%).** Подтверждаешь стратегию «новый pillar +
   301 redirect старого URL на него»? Или предпочитаешь апгрейд #1 на
   месте (сохранить длинный URL, переписать контент)? Это влияет на риск
   потери показов при переиндексации.

3. **Категория D — что реально удаляем, а что сокращаем.**
   - `why-are-dashboards-important` + `benefits-of-dashboards` →
     подтверждаешь merge-контента в pillar и **301 + удаление** обоих?
   - `top-dashboard-design-examples-ideas` (4298 слов) → **оставляем** как
     examples-cluster или **вливаем в Section 5 и удаляем**?
   - `marketing-dashboard-examples-templates` → оставить отдельно или
     **слить** с `marketing-dashboard-ui-design-guide`?

4. **Саммари cluster-разделов внутри pillar.** Ты пишешь собственные
   короткие саммари к разделам (Sections 4, 5, 7), или я генерирую их
   автоматически из cluster-постов? (Авто = быстрее, но риск
   дублирования контента с cluster-постом → нужно перефразировать.)

5. **FAQ отдельной H2 (Section 12).** Подтверждаешь FAQPage schema
   отдельным разделом? **Рекомендую: да** — даёт шанс на rich-snippet и
   обслуживает head-запросы «what is a dashboard», «types of dashboards».

6. **Engagement-данные (нужны для классификации C).** Есть ли у тебя GA4
   engagement time по постам кластера? Baseline их не содержит. Особенно
   важно для `effective-dashboard-design-principles` (benchmarks намекают
   на ~2 сек — если так, он переедет из B в C).

7. **Recategorization.** После pillar — приводим категории кластера к
   единой? Сейчас разнобой: Design Trends / Inspiration / Resources / SEO /
   Research / UI Design. Предлагаю всё дашбордное → `UI Design` (как уже
   рекомендовал `seo-category-audit.md` для #4/#6).

8. **`.ai/content-strategy.md` отсутствует.** Создаёшь его отдельно (как
   обещал), чтобы я сверил план со стратегией, или работаем по baseline +
   benchmarks?

---

## Phase 2 readiness checklist

Перед стартом Фазы 2 (создание pillar и правка кластера) нужно:

- [ ] Получены твои ответы на все 8 open decisions выше.
- [ ] Зафиксирован финальный slug pillar'а.
- [ ] Решена судьба 40k-показов URL (`#1`): redirect vs in-place upgrade.
- [ ] Утверждён список D-постов на удаление (для 301-redirect-карты).
- [ ] Подготовлена redirect-карта (старый slug → `/blog/dashboard-ui-design`)
      для добавления в `next.config.js` `redirects()`.
- [ ] (Если есть) предоставлены GA4 engagement-данные для уточнения
      B/C-классификации.
- [ ] Создан `.ai/content-strategy.md` (или явное «работаем без него»).
- [ ] Подготовлены/выбраны обложка `coverImage` и `thumbImage` для pillar
      (`/blog/covers/dashboard-ui-design.webp` + thumb через
      `npm run thumbs:blog`).
- [ ] Утверждён title pillar'а (Фаза 2, по skill `seo-content-optimization`:
      60–65 симв., sentence case, с хуком, без «complete/ultimate/guide»).
- [ ] Явное «ОК на коммит» от тебя — до этого ни одного git-коммита.

### Что Фаза 2 НЕ делает без отдельного твоего «ОК»

- Не удаляет MDX-файлы (только помечает к удалению; реальное удаление +
  301 — отдельный шаг).
- Не меняет `next.config.js` без подтверждения redirect-карты.
- Не пушит в GitHub.
