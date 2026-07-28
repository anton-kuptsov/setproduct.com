# Affiliate integration plan — AI and design tools

**Статус:** черновик для ревью. Ничего в постах не изменено.
**Дата:** 1 июля 2026
**Источники данных:** [`.ai/seo-baseline-2026-05-28.md`](seo-baseline-2026-05-28.md) (GSC, дек 2025 — май 2026), [`.ai/seo-benchmarks.md`](seo-benchmarks.md) (GA4 refs), полнотекстовый поиск по [`content/blog/`](../content/blog).

---

## Прочти сначала: 4 факта, которые меняют картину

1. **Сайт уже монетизирован по affiliate.** В постах активны реферальные ссылки: Venice.ai (`venice.ai/chat?ref=ybiJ6R`), SolCard (`solcard.cc/r/setproduct`), Thorswap (`?ref=0xgm`), Jupiter (`jup.ag/?ref=...`), Nocra/Gumroad. То есть механика и голос disclosure у проекта **уже есть** — новые ссылки надо вписывать в этот же стиль, а не изобретать заново.

2. **Многие топовые UI-посты уже несут Venice.ai affiliate** (empty-state, steps, stepper, slider, toggle-switch, tooltip, button, marketing-dashboard и др.). Добавлять туда **второй** affiliate на Framer/Webflow — риск переспама: два разных «купи это» в одной статье как раз и создают ощущение, что ссылка — единственная цель. Для таких постов рекомендация ниже — **не стекать** партнёров, а либо заменить угол, либо не трогать.

3. **Framer, Webflow, Uizard — НЕ текущие партнёры.** Чтобы ссылки заработали, сначала надо вступить в их партнёрки (Framer Partner Program, Webflow Affiliates через Partnerize/impact, Uizard — нет публичной партнёрки на 2026, реальная альтернатива — Galileo AI / v0 / Relume). Без реального ref-параметра ссылка = обычный outbound, дохода не даёт. Это блокер, его надо закрыть до имплементации.

4. **Органичный угол для UI-гайдов уже отработан на Venice.ai:** «сгенерируй этот компонент AI-инструментом». Поэтому для гайдов по компонентам самый честный affiliate — это **AI-генератор UI** (Uizard / Galileo AI / v0), а не no-code билдер. Framer/Webflow органично ложатся только в посты про **лендинги, no-code, запуск SaaS и карьеру**, где инструмент обсуждается как рабочий выбор, а не как UX-пример.

---

## Как читать приоритет

Приоритет по трафику поста, **5 = самый высокий**:

| Приоритет | Что значит | Диапазон (GSC impressions / GA4 views) |
|---|---|---|
| 5 | Флагманский трафик | 50k+ impressions |
| 4 | Высокий | 25k–50k |
| 3 | Средний | 10k–25k |
| 2 | Низкий, но живой | 2k–10k |
| 1 | Evergreen без данных GSC | нет в топ-28, оценка |

«Fit» = насколько органично ложится ссылка: **strong** (инструмент уже обсуждается как выбор) / **medium** (инструмент как пример, угол «сгенерируй компонент») / **weak** (притянуто, лучше пропустить).

---

## Общие шаблоны disclosure (в голосе проекта)

Стиль совпадает с уже живущими в [`content/blog/solcard-review-...mdx`](../content/blog/solcard-review-usdt-crypto-card-that-actually-helps-pay-for-online-subscriptions.mdx) и [`content/blog/toggle-switch-ui-design.mdx`](../content/blog/toggle-switch-ui-design.mdx). Все — sentence case, первое лицо, честно.

- **Template A (обзор/сравнение инструментов):**
  *Note: this post contains affiliate links. My recommendations come from hands-on testing, not payouts — the ranking would read the same without the links.*

- **Template B (AI-генератор компонента внутри UI-гайда):**
  *Affiliate note: I use this AI tool to generate component variants for these guides. The link helps support the work, and it doesn't change what I recommend.*

- **Template C (no-code билдер в посте про запуск/карьеру):**
  *Disclosure: some builder links below are affiliate links. I only point to tools I have shipped real projects with, and using them costs you nothing extra.*

Место размещения disclosure — сразу под первым абзацем секции со ссылкой (как в solcard-посте), либо через существующее поле `affiliateDisclosure: true` во frontmatter (пока не рендерится, см. TODO в [`content/blog/best-no-kyc-crypto-card-2026-compared.mdx`](../content/blog/best-no-kyc-crypto-card-2026-compared.mdx)).

---

## Таблица: 20 постов

| # | Пост (slug) | Куда добавить (раздел) | Tool | Disclosure | Приоритет | Fit / заметка |
|---|---|---|---|---|---|---|
| 1 | `tabs-ui-design` | После примера с Notion tabs (overflow-секция) | Uizard / Galileo AI | B | 5 | medium · угол «сгенерируй tab-паттерн AI» |
| 2 | `notifications-ui-design` | Блок «Linear / Notion / GitHub» в конце | Uizard / Galileo AI | B | 5 | medium · уже 11 мин, места хватает |
| 3 | `filter-ui-design` | Секция паттернов фильтров | Uizard | B | 5 | medium · длинный (12 мин), Venice нет |
| 4 | `empty-state-ui-design` | Рядом с существующим Venice-блоком | — (не стекать) | — | 5 | ⚠ уже 2× Venice affiliate — НЕ добавлять второй партнёр |
| 5 | `pagination-ui-design` | Секция disabled/edge-states | Uizard | B | 4 | medium · 10 мин, Venice нет |
| 6 | `dropdown-ui-design` | После анатомии dropdown | Uizard / Galileo AI | B | 4 | medium |
| 7 | `carousel-ui-design` | Секция «когда carousel выигрывает» | Uizard | B | 4 | medium · 10 мин |
| 8 | `ai-chat-interface-ui-design` | Секция «coding assistant (Cursor, Cline)» | Cursor | A | 3 | strong · ~20 мин, Cursor уже центральный герой |
| 9 | `neumorphism-design-guide` | Абзац «prototype in Cursor, v0, Lovable» | v0 / Lovable | A | 3 | strong · инструменты уже названы |
| 10 | `claymorphism-design-guide` | Абзац «Cursor, Claude, v0» + Spline-секция | v0 / Spline | A | 3 | strong |
| 11 | `how-to-get-better-at-ui-design-by-studying-ai-generated-examples` | Метод изучения AI-примеров | Uizard / Galileo AI | B | 2 | strong · 12 мин, тема ровно про AI-генерацию |
| 12 | `how-to-study-saas-dashboard-in-the-ai-era` | Секция «generate several directions» (рядом с Venice) | Uizard (dashboard) | B | 2 | medium · Venice уже есть — заменить, не стекать |
| 13 | `how-to-cancel-adobe-subscription-without-fees` | Абзац про Affinity/Canva-альтернативы | Affinity / Framer | A | 2 | strong · 6k impr, 1.3% CTR ⚠ короткий (3 мин, <1500 слов) |
| 14 | `the-ui-designer-who-built-a-50k-month-template-store` | Абзац «versions for Framer & Webflow» | Framer / Webflow | C | 2 | strong · 8 мин |
| 15 | `start-a-saas-business-with-no-money` | Step 1 «Use Framer, Webflow» | Framer / Webflow | C | 2 | strong · инструменты уже перечислены |
| 16 | `8-designers-developers-success` | Профиль Jan Losert (Webflow-партнёр) | Webflow | C | 1 | strong · самый органичный кейс Webflow |
| 17 | `side-income-for-designers-and-developers` | Список no-code (Tilda, Wix, Webflow) + affiliate-секция | Framer / Webflow | C | 1 | strong · пост сам учит affiliate-модели |
| 18 | `top-design-tools` | Секция «Framer Sites Beta» | Framer | A | 1 | strong · Framer уже разобран как Figma-replacement ⚠ ~4 мин |
| 19 | `figma-10-tech-companies` | Абзац Zoom (Framer/InVision для прототипов) | Framer | A | 1 | medium · ⚠ 4 мин |
| 20 | `dark-side-of-figmas-updates` | Секция про Penpot/Sketch как Figma-alt | Penpot / Framer | A | 1 | strong · угол «Figma alternative» ⚠ 3 мин |

---

## Развёрнутые формулировки disclosure по строкам

Ниже — готовый текст, который можно вставлять как есть (все sentence case, аббревиатуры UI/AI сохранены).

- **#8 `ai-chat-interface-ui-design` (Cursor):**
  *Note: the Cursor link is an affiliate link. I have shipped AI features with it for two years — the recommendation stands with or without the payout.*

- **#9–10 neumorphism / claymorphism (v0, Lovable, Spline):**
  *Affiliate note: some of the AI prototyping tools linked here are affiliate links. I actually prototype these styles in them; using the link supports the guide at no cost to you.*

- **#11 `how-to-get-better-at-ui-design...` (Uizard / Galileo AI):**
  *Affiliate note: the AI generator linked below is an affiliate link. I use it to study component variations for these posts, and it doesn't change what I recommend.*

- **#13 `how-to-cancel-adobe-subscription...` (Affinity / Framer):**
  *Note: this post contains affiliate links, but the recommendations are based on hands-on testing — Affinity earns its spot on the switch list on its own merits.*

- **#14–17 Framer / Webflow в постах про запуск и карьеру:**
  Template C дословно.

- **#18–20 обзоры инструментов (Framer / Penpot):**
  Template A дословно.

---

## Что осознанно исключено и почему

- **empty-state, steps, stepper, slider, toggle-switch, tooltip, button, marketing-dashboard-guide, campaign-marketing-dashboards, user-profile-templates** — уже несут Venice.ai affiliate. Стекать второй партнёр = переспам. Если хочется монетизировать — менять существующий Venice-угол, а не добавлять Framer поверх.
- **Короткие посты (<1500 слов): dark-side-of-figmas-updates, figma-stop-taking-my-money, top-design-releases-2020, how-to-cancel-adobe, top-design-tools, figma-10-tech-companies** — часть включена из-за трафика/органичности, но помечена ⚠: перед вставкой стоит либо дописать секцию до ~1500 слов, либо принять риск, что ссылка заметна. Твоё решение на ревью.
- **crypto/SEO-посты (thorswap, jupiter, solcard, seo-tools-compared, white-label-seo)** — не по теме AI/design tools, свой affiliate уже стоит.
- **data-table-ui-design** — сознательно содержит фразу «there are no affiliate links» про TanStack. Ставить туда affiliate = прямое противоречие тексту, бьёт по E-E-A-T. Не трогать.

---

## Порядок имплементации (для отдельной задачи в code mode)

1. **Закрыть блокер партнёрок:** вступить в Framer Partner, Webflow Affiliates, выбрать AI-генератор с реальной партнёркой (Galileo AI / v0 / Relume вместо Uizard, если у Uizard нет ref). Зафиксировать ref-параметры.
2. **Начать с Fit=strong + высокий приоритет:** #8, #9, #10, #11 — максимальная органика при живом трафике.
3. **Правки атомарные, по одному посту = один коммит** (`feat: add affiliate link and disclosure to <slug>`), sentence case, без изменения версий и конфигов (по AGENTS.md).
4. **Каждая ссылка = один disclosure рядом.** Проверить, что заголовки затронутых секций тоже sentence case.
5. **Не запускать** `check_images.js` / `fix_images.js` / thumbs без отдельной просьбы.
6. После пачки — прогнать `npm run lint` и, по желанию, `node scripts/check-site.mjs http://localhost:3000` на битые ссылки.

---

## От��рытые вопросы к тебе

1. Ставим Framer/Webflow (нужны новые партнёрки) или ограничиваемся AI-генератором, у которого партнёрка уже проще?
2. Разрешаешь ли дописывать короткие посты (#13, #18, #19, #20) до 1500+ слов, или их выкинуть из списка?
3. Для постов с уже стоящим Venice.ai — менять угол или оставить как есть (мой дефолт — оставить)?
