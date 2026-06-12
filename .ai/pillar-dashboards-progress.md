# Phase 3A progress — pillar cluster linking

Связываем 10 cluster-постов с pillar-постом
[`dashboard-ui-design`](../content/blog/dashboard-ui-design.mdx) (Фаза 2).
В каждом посте ровно три изменения: pillar callout в начале тела,
обновлённые `relatedSlugs` (pillar первым + 2 тематических соседа),
`category` приведена к "UI Design". Тело и остальной frontmatter не тронуты.

Pillar title (используется в callout): **Dashboard UI design: From KPIs to
layouts that convert**.

Callout (одинаковый во всех 10):
> **Part of:** [Dashboard UI design: From KPIs to layouts that convert](/blog/dashboard-ui-design) — the complete reference to dashboard design on Setproduct.

## Status
- [x] Batch 1 (posts 1-3) — committed
- [x] Batch 2 (posts 4-6) — committed
- [x] Batch 3 / C-batch (posts 7-10) — committed

## relatedSlugs choices applied

| Post slug | relatedSlugs (1 = pillar, затем 2 соседа) | Логика соседства |
|---|---|---|
| how-to-study-saas-dashboard-in-the-ai-era | dashboard-ui-design, saas-dashboard-examples, top-dashboard-design-examples-ideas | SaaS + examples |
| types-of-dashboards-main-categories | dashboard-ui-design, effective-dashboard-design-principles, figma-tables-data-grid-design | theoretical/structural + data display |
| marketing-dashboard-ui-design-guide | dashboard-ui-design, campaign-marketing-dashboards-guide, effective-dashboard-design-principles | marketing domain + design principles |
| figma-tables-data-grid-design | dashboard-ui-design, effective-dashboard-design-principles, types-of-dashboards-main-categories | data display + component patterns |
| saas-dashboard-examples | dashboard-ui-design, best-analytics-dashboard-examples, e-commerce-dashboard-examples | industry examples cluster |
| best-analytics-dashboard-examples | dashboard-ui-design, saas-dashboard-examples, e-commerce-dashboard-examples | industry examples cluster |
| e-commerce-dashboard-examples | dashboard-ui-design, saas-dashboard-examples, best-analytics-dashboard-examples | industry examples cluster |
| campaign-marketing-dashboards-guide | dashboard-ui-design, marketing-dashboard-ui-design-guide, best-analytics-dashboard-examples | marketing domain + audience analytics |
| effective-dashboard-design-principles | dashboard-ui-design, types-of-dashboards-main-categories, figma-tables-data-grid-design | theoretical/structural + data display |
| top-dashboard-design-examples-ideas | dashboard-ui-design, saas-dashboard-examples, how-to-study-saas-dashboard-in-the-ai-era | examples cluster (reciprocal с how-to-study) |

## Category changes applied

| Post slug | Старая category | Новая category |
|---|---|---|
| how-to-study-saas-dashboard-in-the-ai-era | Inspiration | UI Design |
| types-of-dashboards-main-categories | Resources | UI Design |
| marketing-dashboard-ui-design-guide | Inspiration | UI Design |
| figma-tables-data-grid-design | UI Design | UI Design (без изменений) |
| saas-dashboard-examples | Inspiration | UI Design |
| best-analytics-dashboard-examples | Inspiration | UI Design |
| e-commerce-dashboard-examples | Inspiration | UI Design |
| campaign-marketing-dashboards-guide | Research | UI Design |
| effective-dashboard-design-principles | UI Design | UI Design (без изменений) |
| top-dashboard-design-examples-ideas | Inspiration | UI Design |

## Skipped or anomalies

- **figma-tables-data-grid-design** и **effective-dashboard-design-principles**:
  `category` уже была "UI Design" — по правилу задачи не трогали, в этих двух
  постах фактически по 2 изменения (callout + relatedSlugs), а не 3.
- **effective-dashboard-design-principles**: в старых `relatedSlugs` был
  D-пост `dashboard-design-best-practices-top-dashboard-ui-design-tips`
  (под deprecate в Фазе 4). При полной замене списка он удалён — ссылок на
  D-посты в обновлённых relatedSlugs нет нигде.
- **Группировка по коммитам.** Файлы закоммичены строго по исходной
  нумерации задачи: B-batch 1 = посты 1-3, B-batch 2 = посты 4-6,
  C-batch = посты 7-10. (В процессе редактирования порядок обработки
  e-commerce #7 и figma-tables #4 был переставлен, но на содержимое и
  итоговую группировку коммитов это не повлияло.)
- D-посты (`dashboard-design-best-practices-...`, `why-are-dashboards-important`,
  `benefits-of-dashboards`, `marketing-dashboard-examples-templates`) не
  трогали — они в Фазе 4.
- Pillar `dashboard-ui-design.mdx` не трогали (Фаза 2 закончена).
- `next.config.js` не трогали (redirects — Фаза 4).

---

# Phase 4 — deprecation completed

Удалили 4 низкокачественных D-поста с постоянными 301-редиректами на pillar.
Salvage-аудит ([`pillar-d-posts-salvage-check.md`](pillar-d-posts-salvage-check.md))
показал: уникального контента, изображений или ценного frontmatter ни в одном
из 4 постов нет — все удалены as-is, в pillar ничего не переносили.

## Status
- [x] Step 1 — salvage-check (4 поста, читали целиком) — нет salvage
- [x] Step 2 — поиск висячих ссылок — найдено 4 входящих
- [x] Step 4.2 — правка ссылок — commit `4d51e06`
- [x] Step 4.3 — 301-редиректы в `next.config.js` — commit `5305644`
- [x] Step 4.4 — `git rm` 4 MDX-файлов — commit `43a4e63`
- [x] Step 4.5 — lint + build + sitemap verify — commit `3b984c0`

## Deprecated posts and 301 targets

| Удалённый D-пост | 301 → |
|---|---|
| dashboard-design-best-practices-top-dashboard-ui-design-tips | /blog/dashboard-ui-design |
| why-are-dashboards-important | /blog/dashboard-ui-design |
| benefits-of-dashboards | /blog/dashboard-ui-design |
| marketing-dashboard-examples-templates | /blog/marketing-dashboard-ui-design-guide |

Редиректы добавлены в `redirects()` в `next.config.js` после существующих
`.html`-правил, все с `permanent: true` (Next отдаёт 308, Google трактует
как 301).

## Inbound links repaired (Step 4.2)

| Файл | Тип | Было → стало |
|---|---|---|
| marketing-dashboard-ui-design-guide.mdx:51 | body-ссылка | marketing-dashboard-examples-templates → /blog/dashboard-ui-design (устранён self-redirect loop) |
| how-to-study-saas-dashboard-in-the-ai-era.mdx:261 | body-ссылка | dashboard-design-best-practices-... → /blog/dashboard-ui-design |
| depth-in-ios-design.mdx | relatedSlugs | удалена запись dashboard-design-best-practices-... |
| liquid-glass-design-explained-a-practical-guide.mdx | relatedSlugs | удалена запись dashboard-design-best-practices-... |

В `data/*`, `pages/sitemap.xml.ts`, `components/` ссылок на D-слаги не было.

## Verification (Step 4.5)
- `npm run lint` (`tsc --noEmit`) — 0 ошибок.
- `npm run build` — 246 страниц, 0 ошибок (pre-existing warnings про размер
  data для `/search` и `/blog/filter-ui-design` не связаны с правками).
- sitemap: D-слаги отсутствуют (NONE); pillar `/blog/dashboard-ui-design`
  присутствует (1); `/blog/marketing-dashboard-ui-design-guide` присутствует (1).
- Редирект `/blog/benefits-of-dashboards` → `/blog/dashboard-ui-design`
  отдаёт 308 (permanent).

## Notes
- Картинки удалённых постов в `public/blog/assets/<slug>/` оставлены по
  инструкции (не удалялись).
- `data/blog-categories.ts` не трогали.
- B/C cluster-посты по контенту не перерабатывали — только точечная правка
  двух body-ссылок на удаляемые страницы (с явного «proceed» автора).
- git push не делали.

---

## Phase 5 — Launch (superseded by "Launched" below)

**Status:** pushed to origin/main on 2026-06-05 (see "Phase 5 — Launched")
**Total commits in launch batch:** 9 (8 previous + this docs commit)

### Manual steps remaining (user)
1. Source Control → Sync Changes
2. Verify Vercel deploy success
3. Production incognito checks (pillar URL, redirect URL, cluster callout)
4. GSC URL Inspection: submit pillar + 2-3 key cluster posts
5. Update baseline file post-launch with actual launch timestamp

### Monitoring plan (post-launch)
- Day 7: First reindexing check via GSC URL Inspection
- Day 14: First CTR data check for cluster
- Day 21: 301 redirect impression transfer check
- Day 30: First success criteria evaluation

---

## Phase 5 — Launched

**Launch date:** 2026-06-05
**Final commits in project:** 11
**Phase 3B (C-post content rescue):** deferred — will be prioritized after 21-day post-launch data
**Next strategic project:** Liquid glass cluster (to be planned separately)
