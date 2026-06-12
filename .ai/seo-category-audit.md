# SEO category content audit — 2026-05-30

Аудит всех 9 постов с `category: SEO` в [`content/blog/`](../content/blog).
Цель: понять, какие посты тянут категорию вниз по качеству и удержанию, какие можно спасти переписыванием, а какие — удалить или объединить.

## Контекст

Ни один из 9 постов не попадает в топ-28 страниц блога по кликам в [`.ai/seo-baseline-2026-05-28.md`](seo-baseline-2026-05-28.md). Бенчмарк качества — [`steps-ui-design.mdx`](../content/blog/steps-ui-design.mdx) (CTR 1.06%, средняя позиция 12). На этом фоне категория SEO выглядит как «свалка» гостевых и AI-постов: 2 поста явно про дашборды (мискатегоризованы), 1 про iOS-киты (мискатегоризован), и только 5 действительно про SEO/маркетинг.

## Сводная таблица

| # | Slug | Quality | Recommendation | Целевая категория |
|---|------|---------|----------------|-------------------|
| 1 | [`benefits-of-dashboards`](../content/blog/benefits-of-dashboards.mdx) | low | rewrite + recategorize | UI Design |
| 2 | [`why-are-dashboards-important`](../content/blog/why-are-dashboards-important.mdx) | low | consolidate с #1 + recategorize | UI Design |
| 3 | [`choosing-right-ios-kit`](../content/blog/choosing-right-ios-kit.mdx) | medium | leave + recategorize | Resources |
| 4 | [`optimizing-digital-marketing`](../content/blog/optimizing-digital-marketing.mdx) | low-medium | rewrite | Growth Hacking |
| 5 | [`seo-strategies-to-make-your-graphic-design-business-stand-out`](../content/blog/seo-strategies-to-make-your-graphic-design-business-stand-out.mdx) | medium | leave | SEO |
| 6 | [`seo-tools-compared`](../content/blog/seo-tools-compared.mdx) | high | leave | SEO |
| 7 | [`top-tips-for-new-businesses-looking-to-strengthen-their-online-presence`](../content/blog/top-tips-for-new-businesses-looking-to-strengthen-their-online-presence.mdx) | medium-high | leave | SEO |
| 8 | [`white-label-seo-reseller-platforms`](../content/blog/white-label-seo-reseller-platforms.mdx) | low-medium | deprecate | — |
| 9 | [`why-landing-page-optimization-is-essential`](../content/blog/why-landing-page-optimization-is-essential.mdx) | low | rewrite | Growth Hacking |

**Итого:** 1 high, 3 medium, 1 medium-low, 4 low/low-medium. Доля «качественного» контента в категории — около 22%.

---

## 1. [`benefits-of-dashboards.mdx`](../content/blog/benefits-of-dashboards.mdx)

**Title (сейчас):** "Top 10 Benefits Of Dashboards To Make Yourself Time-Efficient"
**Автор / дата:** Roman Kamushken / 2024-12-12

**Engagement-killing signals:**
- Title Case в title и H2 — нарушение правила sentence case
- AI-метафоры без конкретики: «turn the dashboard upside down for the maximum in efficiency», «watering can like water», «with a bird's eye view»
- Абзацы по 150–200+ слов без bullet'ов, нумерации, скриншотов
- 6 разделов «Benefits of Dashboards» с одинаковой структурой «Benefit X. Title — long paragraph»
- Сломанный `inlineCta`: пустые `buttonText: ""` и `buttonLink: ""` (кнопка ведёт в никуда)
- Сломанная ссылка в References: markdown `[…](https://www.google.com/url?sa=t&...&url=https%3A%2F%2Fchatgpt.com%2F)` — Google search referrer, а не источник
- Категория `SEO` не соответствует теме: пост про UX дашбордов, не про SEO

**Quality:** **low**
**Recommendation:** **rewrite + recategorize.** Тема пересекается с уже переписанным [`effective-dashboard-design-principles.mdx`](../content/blog/effective-dashboard-design-principles.mdx). Либо переписать в формате «Зачем компании дашборд: 10 бизнес-сценариев» и сменить категорию на UI Design, либо консолидировать с #2 в один большой пост.

---

## 2. [`why-are-dashboards-important.mdx`](../content/blog/why-are-dashboards-important.mdx)

**Title (сейчас):** "Why Are Dashboards Important And Their Crucial Purposes"
**Автор / дата:** Roman Kamushken / 2024-12-12

**Engagement-killing signals:**
- Title Case в title и почти всех H2/H3
- Длина ~5000 слов, при этом нет ни одного скриншота примера дашборда
- Объём раздут искусственно: «Types of Dashboards» (4 подпункта по абзацу), «Design Considerations» (5 подпунктов), «10 Purposes of Dashboards» — каждый по абзацу на 100–150 слов
- AI-обороты: «this dashboard would have realized», «rays of light», «through the rays», «a hawk's-eye view»
- Сломанный `inlineCta` с пустыми `buttonText` / `buttonLink` (как в #1)
- Дубликат темы с #1 — два поста одного автора в один день про «зачем дашборды»
- Категория `SEO` не соответствует теме

**Quality:** **low**
**Recommendation:** **consolidate с #1 + recategorize.** Объединить с [`benefits-of-dashboards.mdx`](../content/blog/benefits-of-dashboards.mdx) в один пост (например, slug `why-businesses-need-dashboards`), оставить редирект со старого slug, категорию сменить на UI Design.

---

## 3. [`choosing-right-ios-kit.mdx`](../content/blog/choosing-right-ios-kit.mdx)

**Title (сейчас):** "Choosing the right iOS UI kit: a designer's checklist"
**Автор / дата:** Roman Kamushken / 2023-08-22

**Engagement-killing signals:**
- Минимальные. Это старая статья 2023 года, написанная до волны AI-контента
- Есть нормальный TL;DR, структура pros/cons, реальный голос автора
- Title уже в sentence case
- Лёгкие признаки переоптимизации под ключевик «iOS UI kit», но без вреда читаемости

**Quality:** **medium**
**Recommendation:** **leave + recategorize.** Контент валидный, но категория `SEO` бессмысленна — пост про выбор UI-кита. Перенести в `Resources` (или `UI Design`). Текст не трогать.

---

## 4. [`optimizing-digital-marketing.mdx`](../content/blog/optimizing-digital-marketing.mdx)

**Title (сейчас):** "Optimizing your digital marketing for top efficiency"
**Автор / дата:** Roman Kamushken / 2024-09-10

**Engagement-killing signals:**
- Повторяющаяся шутка-наполнитель «everybody and their grandmothers» — встречается 3+ раз, читается как генеративный филлер
- Странные метафоры: «sequestered in a flowering meadow», «like a magpie collecting shiny coins»
- Длинные абзацы по 120–180 слов, мало bullet'ов
- Есть список внешних источников в конце (плюс), но половина — это блоги случайных агентств
- Тема не совсем SEO, скорее общий digital-маркетинг

**Quality:** **low-medium**
**Recommendation:** **rewrite.** Тема полезная (оптимизация digital-кампаний), но текущая реализация — типичный AI-блог-пост. Переписать в формате чек-листа «6 рычагов для оптимизации digital marketing», категорию сменить на `Growth Hacking`.

---

## 5. [`seo-strategies-to-make-your-graphic-design-business-stand-out.mdx`](../content/blog/seo-strategies-to-make-your-graphic-design-business-stand-out.mdx)

**Title (сейчас):** "SEO strategies to make your graphic design business stand out"
**Автор / дата:** JaMichael Hogan (EraBright, гостевой) / 2025

**Engagement-killing signals:**
- Лёгкие. Гостевой пост, но написан живым языком
- Есть структура: keyword research → on-page → backlinks → local SEO → content
- Абзацы средней длины, есть подзаголовки на каждом этапе
- Слегка generic ("focus on quality keywords", "build authority") без конкретных кейсов и скриншотов
- Нет ссылок на инструменты, только текстовые упоминания

**Quality:** **medium**
**Recommendation:** **leave.** Категория подходит, тема релевантна аудитории Setproduct (фрилансеры-дизайнеры). Можно при случае добавить скриншоты примеров и пару ссылок на инструменты, но это второстепенно.

---

## 6. [`seo-tools-compared.mdx`](../content/blog/seo-tools-compared.mdx)

**Title (сейчас):** "SEO tools compared: which one actually moves the needle"
**Автор / дата:** Connor Patterson / 2026-03

**Engagement-killing signals:**
- Минимальные. Сильный личный голос автора, реальные мнения и цифры
- Чёткая структура: Ahrefs vs Semrush vs Surfer vs Clearscope vs «free stack»
- Реальные выводы («Ahrefs для backlink-аудита, Surfer для on-page»)
- Custom `inlineCta` ведёт на publish.setproduct.com — рабочая ссылка
- Title уже в sentence case

**Quality:** **high**
**Recommendation:** **leave.** Эталон для категории. При следующем апдейте баseline проверить engagement в GA4 — этот пост должен быть в топе среди SEO-постов.

---

## 7. [`top-tips-for-new-businesses-looking-to-strengthen-their-online-presence.mdx`](../content/blog/top-tips-for-new-businesses-looking-to-strengthen-their-online-presence.mdx)

**Title (сейчас):** "Top tips for new businesses looking to strengthen their online presence"
**Автор / дата:** Connor Patterson / 2026-04

**Engagement-killing signals:**
- Лёгкие. Длинноватый title (можно сократить), но в sentence case
- Структура: брендинг → веб-сайт → SEO → соцсети → email → аналитика — стандартный, но работающий чек-лист
- Реальные примеры и формулировки, нет AI-метафор
- Можно усилить конкретикой (метрики, числа), но базово работает

**Quality:** **medium-high**
**Recommendation:** **leave.** Можно подсократить title до «How new businesses build online presence: 6 steps» при будущем SEO-апдейте, но это nice-to-have.

---

## 8. [`white-label-seo-reseller-platforms.mdx`](../content/blog/white-label-seo-reseller-platforms.mdx)

**Title (сейчас):** "White label SEO reseller platforms: top picks for agencies"
**Автор / дата:** гостевой автор / 2024

**Engagement-killing signals:**
- Listicle на 5–7 white-label платформ, каждая описана одинаково (один абзац + buллеты features)
- Все платформы поданы как одинаково хорошие — нет реальной критики или сравнения
- Текст похож на спонсорский / partnership-материал, не на редакционный
- Тема слабо релевантна аудитории Setproduct (дизайнеры, не SEO-агентства)
- Низкий потенциал органики: high-commercial-intent ключевик, конкуренция с DataForSEO, SEMrush и т.д. — Setproduct не конкурент

**Quality:** **low-medium**
**Recommendation:** **deprecate.** Пост не для нашей аудитории, не приведёт релевантный трафик. Удалить из публикации (или оставить файл, но снять с листинга через `draft: true`, если такое поле введём). Сделать 301 на [`seo-tools-compared.mdx`](../content/blog/seo-tools-compared.mdx).

---

## 9. [`why-landing-page-optimization-is-essential.mdx`](../content/blog/why-landing-page-optimization-is-essential.mdx)

**Title (сейчас):** "Why Landing Page Optimization Is Essential For Your Business"
**Автор / дата:** Roman Kamushken / 2024-12

**Engagement-killing signals:**
- Title Case в title и H2
- Псевдо-рефлексивный стиль с риторическими вопросами: «Maybe. Is it due to slow loading time? Maybe. Or is it…» — повторено 3+ раз
- AI-обороты: «see no rays of light at the end of the tunnel», «beat around the bush», «like a fish out of water»
- Абзацы по 150–200 слов без визуальной разбивки
- Тема правильная (CRO лендингов), но реализация — типичный AI-spam
- Категория `SEO` подходит частично; точнее `Growth Hacking` или `Startups & SaaS`

**Quality:** **low**
**Recommendation:** **rewrite.** Перетекст в формате «8 рычагов конверсии лендинга, которые двигают метрику», с конкретными примерами секций (hero, social proof, pricing, CTA). Категорию сменить на `Growth Hacking`.

---

## Action plan по приоритетам

1. **Wave 1 (быстро, мало риска):** Recategorize #3 → Resources. Это техническая правка frontmatter, без переписывания. Заодно почистить категорию от очевидного офтопа.
2. **Wave 2 (rewrite):** Переписать #9 (`why-landing-page-optimization-is-essential`) и #4 (`optimizing-digital-marketing`) в формате чек-листа. Шаблон — [`steps-ui-design.mdx`](../content/blog/steps-ui-design.mdx).
3. **Wave 3 (consolidate):** Объединить #1 и #2 в единый пост про дашборды, поставить 301-редиректы со старых slug'ов. Категорию обоих исходных постов сменить на UI Design ещё до объединения, чтобы не путать счётчики.
4. **Wave 4 (deprecate):** Снять #8 (white-label-seo-reseller-platforms) с публикации, 301 на [`seo-tools-compared.mdx`](../content/blog/seo-tools-compared.mdx).
5. **Leave as is:** #5, #6, #7 — продолжают работать в категории SEO.

После всех волн в категории `SEO` останется 3–4 качественных поста вместо текущих 9, средний engagement категории должен вырасти.
