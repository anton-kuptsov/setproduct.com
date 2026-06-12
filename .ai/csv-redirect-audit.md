# Аудит CSV-редиректов (data/webflow-redirects.csv)

> Фаза 1. Только анализ. CSV **не изменялся**. Дата аудита: 2026-06-08.

## ⚠️ Важное расхождение по объёму

В задаче указано «199 редиректов», но фактически в файле
[`data/webflow-redirects.csv`](data/webflow-redirects.csv:1) **226 строк данных**
(строки 2–227, плюс строка-заголовок `source,target`).
Все 226 строк ниже проверены. Ни одна строка не отброшена «молча» — расхождение
вынесено сюда явно. Жду подтверждения, что обрабатываем все 226.

---

## Duplicates in CSV

Найден **1 дубликат source**:

| source | target | строки | примечание |
|---|---|---|---|
| `/templates` | `/all` | 2 и 54 | Полностью идентичные строки (одинаковый target). |

**Влияние:** Next.js не падает на дубликатах source — при совпадении применяется
**первое** правило сверху, второе игнорируется. Поломки не будет, но это «мусорная»
строка.
**Рекомендация:** удалить одну из двух строк (`/templates,/all`) — на стороне
пользователя, т.к. CSV редактирует только пользователь. Для подсчёта валидных
правил считаю `/templates` один раз.

---

## Empty/malformed rows

- **Malformed:** не обнаружено. Все 226 строк имеют ровно одну запятую и формат
  `source,target`. Нет лишних запятых, нет кавычек, нет пробелов внутри значений.
- **Empty:** возможна одна завершающая пустая строка в конце файла (typical trailing
  newline). Она безопасна — в драфт-парсере отсекается через `.filter(line => line.trim())`.

**Вывод по парсингу:** утверждение из Фазы 2 («простой `split(',')` безопасен,
запятых/кавычек внутри значений нет») — **подтверждено фактическими данными**. ✓

---

## Targets that may not exist

Проверены все таргеты против источников правды:
[`TEMPLATE_PRODUCTS`](data/templates-listing.ts:12),
[`FREEBIE_PRODUCTS`](data/freebies-listing.ts:21),
файлы [`content/blog/*.mdx`](content/blog) и статические страницы в [`pages/`](pages).

### 🔴 1 проблемный таргет

| source | target | проблема | рекомендация |
|---|---|---|---|
| `/old-home` (строка 227) | `/home-new` | Маршрута `/home-new` **не существует**: нет `pages/home-new.tsx`, нет совпадения в данных (grep по `home-new` → 0). Редирект приведёт на 404 — то есть «чинит» один 404, создавая другой. | **Поменять target** на реальную страницу. Логичнее всего `/old-home → /` (главная). Правку делает пользователь в CSV. |

### ✅ Проверено и существует

- **Template-таргеты (`/templates/<slug>`):** все 30 уникальных слугов
  (`orion`, `material`, `rome`, `full-ios`, `react-ui-kit`, `appka-ios-ui-kit`,
  `material-desktop`, `landing`, `website`, `xela-swift`, `ios-ui-kit`,
  `android-ui-kit`, `nucleus-ui`, `charts`, `eclipse`, `hyper-charts`, `most`,
  `oe-enterprise`, `levitate`, `material-you`, `mobile-x`, `material-x`, `s8`,
  `neolex-dashboard`, `zeus`, `xela-flutter`, `xela-android`, `xela`, `xela-react`,
  `panda`) присутствуют в [`TEMPLATE_PRODUCTS`](data/templates-listing.ts:12). ✓
- **Freebie-таргеты (`/freebies/<slug>`):** все используемые слуги
  (`chart-cards`, `accordion-guide`, `design-system-starter`,
  `calendars-date-picker-templates`, `shopping-layout-for-web-app`,
  `charts-widgets-dark-light`, `responsive-imagery-cards`, `figma-email-templates`,
  `hyper-charts`, `eclipse-ui-kit`, `schedule-events-template`, `website-template`,
  `panda-dashboard-template`, `rome-ui-kit-lite`, `mobile-x-ui-kit`, `ios-datepickers`,
  `figma-ios-ui-kit`, `material-ui-styled`, `figma-grid-layouts`,
  `navigation-layout-4-samples`, `nav-templates`, `landing-page-web-blocks`,
  `xela-ui-kit-starter`, `dark-charts-ui-kit`, `fonts-playground`,
  `zeus-ui-free-website-template`, `messenger-app-desktop-template`,
  `mobile-tables-several-themes`, `free-ios-ui-kit`, `material-you-for-web-apps`,
  `12-free-mobile-templates`, `material-x-starter`, `orion-dataviz-templates`,
  `orion-dark-templates`) присутствуют в [`FREEBIE_PRODUCTS`](data/freebies-listing.ts:21). ✓
- **Blog-таргеты:**
  - `/blog/choosing-right-design-team` → [`content/blog/choosing-right-design-team.mdx`](content/blog/choosing-right-design-team.mdx) ✓
  - `/blog/latest-18-resources-boost-efficiency` → [`content/blog/latest-18-resources-boost-efficiency.mdx`](content/blog/latest-18-resources-boost-efficiency.mdx) ✓
  - `/blog/figma-to-react-buttons` → [`content/blog/figma-to-react-buttons.mdx`](content/blog/figma-to-react-buttons.mdx) ✓
- **Статические таргеты:** `/`, `/all`, `/blog`, `/bundle`, `/testimonials`,
  `/freebies`, `/legal/license`, `/legal/refunds-policy`,
  `/legal/terms-of-paid-posts` — все существуют в [`pages/`](pages). ✓

---

## Conflicts with existing redirects

Существующие правила в [`next.config.js`](next.config.js:18):
1. `/index.html → /`
2. `/:path+.html → /:path+` (generic catch-all для любого `.html`)
3. 4 blog-редиректа (dashboard-посты)

### 🔴 Конфликт порядка: generic `.html` catch-all vs `page*.html` из CSV

В CSV 6 «legacy Webflow» источников с расширением `.html`:

| source (строка) | желаемый target (CSV) |
|---|---|
| `/page6223045.html` (9) | `/` |
| `/page12111799.html` (80) | `/` |
| `/page41087029.html` (116) | `/blog` |
| `/page38339639.html` (223) | `/` |
| `/page33883598.html` (225) | `/` |
| `/page33693815.html` (226) | `/` |

**Проблема:** правило `/:path+.html → /:path+` матчит ЛЮБОЙ `.html` и сработает
первым (Next.js применяет правила сверху вниз, побеждает первое совпадение).
Например `/page6223045.html` уйдёт на `/page6223045` (который сам 404), и
специфичные CSV-правила **никогда не выполнятся**.

В драфте из Фазы 2 generic catch-all стоит ПЕРЕД спред-массивом CSV → конфликт
проявится.

**Рекомендация:** разместить CSV-редиректы (как минимум 6 `page*.html`) **ВЫШЕ**
generic-правила `/:path+.html`. Корректный порядок:
```
/index.html → /
...CSV redirects (включая page*.html)...
/:path+.html → /:path+        ← generic catch-all ПОСЛЕ конкретных
...4 blog-редиректа...
```
Конфликтов с 4 blog-редиректами нет — их source'ы (`/blog/dashboard-…` и т.п.)
в CSV отсутствуют.

---

## Conflicts with existing static pages

**Шэдоунинга реальных страниц не обнаружено.** Ни один source из CSV не совпадает
с существующей статической страницей, которая должна отдавать 200:

- Реальные страницы (`/all`, `/blog`, `/bundle`, `/code`, `/dashboards`,
  `/dataviz`, `/freebies`, `/mobile`, `/search`, `/testimonials`, `/websites`)
  **не встречаются** среди source'ов CSV. ✓
- `/templates` (source) — отдельной страницы `pages/templates/index.tsx` нет
  (есть только динамический `pages/templates/[slug].tsx`), поэтому `/templates`
  сейчас и так 404. Редирект на `/all` корректен, конфликта нет. ✓
- Все `/freebies/<legacy>` источники (`figma-charts`, `accordion-ui`,
  `designsystem`, `ios-ui-kit`, `full-ios`, `eclipse` и т.д.) — это **старые**
  имена, которых нет среди реальных freebie-слугов, т.е. они сейчас 404.
  Редиректы их не шэдоунят. ✓
- `/blog/button-ui-design/1000` (source) — это под-путь, НЕ совпадает с реальной
  страницей `/blog/button-ui-design`. Шэдоунинга нет. ✓

---

## Total valid redirects to be added: 225

Расчёт:
- 226 строк данных в CSV
- − 1 дубликат (`/templates` учтён один раз) → **225 уникальных source**
- Из них **224** имеют рабочий target; **1** (`/old-home → /home-new`) указывает на
  несуществующий маршрут (нужна правка target пользователем).
- **6** строк (`page*.html`) требуют размещения выше generic `.html`-правила
  (вопрос порядка, не валидности).

**Итог по действиям пользователя перед Фазой 3 (опционально, но рекомендуется):**
1. Удалить дубль строки `/templates,/all`.
2. Поменять target `/old-home` с `/home-new` на `/` (или иную реальную страницу).

**Решается на стороне кода (Фаза 3):**
3. Поставить CSV-редиректы выше `/:path+.html`, чтобы 6 `page*.html` сработали корректно.

---

### Напоминание
Согласно условиям задачи CSV — source of truth, правки в нём делает **только
пользователь**. Жду команду **«переходи к Фазе 2»**.
