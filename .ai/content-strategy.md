# Content strategy — Setproduct blog

**Последнее обновление:** июнь 2026  
**Источники данных:** GSC (6 мес), GA4 (период), on-site search (апрель–июнь 2026)  
**Применять при:** написании нового поста, обновлении существующего, планировании контент-волн, обсуждении приоритетов

## 1. Базовые метрики на момент создания (baseline)

### Общие показатели за 6 месяцев (GSC)
- Всего кликов: 13,800
- Всего показов: 3,280,000
- Средний CTR: 0.4% (целевой бенчмарк индустрии: 2-3%)
- Средняя позиция: 13.4 (большая часть на странице 2 Google)

### Самый успешный пост (GA4)
- /blog/liquid-glass-design-explained-a-practical-guide
- 8,259 просмотров, 5,690 активных пользователей
- 36 секунд engagement
- Это в ~4 раза больше второго по популярности поста

### Эталон-бенчмарк качественного контента
- /blog/steps-ui-design
- CTR в GSC: 1.06% (лучший среди UI guide постов)
- Engagement в GA4: 21 секунда
- Формула: живой голос автора, FAQ-блок в конце, чек-лист "before you ship", отсутствие выдуманной статистики

### Антибенчмарк
- /blog/dashboard-design-best-practices-top-dashboard-ui-design-tips
- CTR в GSC: 0.022% (катастрофа)
- URL длиной 64 символа с двойным keyword stuffing
- Слабый title/description делают пост невидимым в SERP

## 2. Стратегические принципы из данных

### Validated: companion-post методология работает

Первый пост по обновлённой методологии — liquid-glass-vs-glassmorphism (опубликован 9 июня 2026). Подтверждает:
- Answer-first структура с TL;DR на 5 строк
- Сравнительная таблица 11×5 как центральный SEO-актив
- FAQ из 8 вопросов с самодостаточными ответами
- Голос автора в closing thoughts вместо нейтральной энциклопедии
- 6 внутренних ссылок + интеграция с собственным Gumroad-продуктом
- Только первичные источники в outbound links (WCAG, Apple HIG, Microsoft Fluent)
- Конкретные alt-тексты для каждой картинки

Эта формула должна применяться ко всем новым постам в Tier 1.

### Принцип 1. Большая часть трафика — НЕ из Google
Сравнение GSC и GA4 показывает: 50-95% трафика на популярные посты идёт из источников помимо Google поиска. Главные каналы: прямые заходы, рефералы, социалки, AI-инструменты (Claude/ChatGPT/Perplexity), newsletters. SEO — лишь один из каналов.

Следствие: оптимизация под AI-инструменты и social shareability — не теория, а реальный канал, который уже работает.

### Принцип 2. Liquid glass паттерн подтверждён тройной валидацией
- GA4: пост #1 по просмотрам (8,259)
- On-site search: 28 поисков по теме (8% от всех запросов)
- Качественный сигнал: пост опубликован в нужный момент тренда (после WWDC 2025)

Формула: trendy + practical + first-mover. Применять серийно.

### Принцип 3. Foundation tutorial — главный конвертер в продукты
- /blog/how-to-design-a-ui-kit-foundation — 2,482 просмотра, 40 секунд engagement
- Top-of-funnel контент: designers читают → покупают UI kits
- Серийный потенциал: "How to design a SaaS dashboard foundation", "How to design an AI app foundation"

### Принцип 4. Короткие opinionated посты конвертят рекордно
- /blog/strikethrough-text-deserves-more-love-in-ui — 44 просмотра, 9 key events = 20% конверсия
- /blog/guest-article-for-web-development — 99 просмотров, 7%
- Узкая ниша + сильное мнение + один CTA = мотивированный читатель идёт в продукт

### Принцип 5. Visual-decision контент конвертит без engagement
- /blog/pricing-ui-design — 6 секунд engagement, но 7.8% конверсия в key events
- Пользователь приходит смотреть примеры, кликает CTA, уходит. Низкий engagement здесь — это норма, не проблема.

### Принцип 6. Content cannibalization — реальная проблема
До pillar page для дашбордов: 8 постов про дашборды конкурировали друг с другом. После создания pillar page — трафик пошёл, методология подтверждена.

Применить тот же подход к другим темам.

### Принцип 7. Steps post — формула качественного UI guide
Из всех 26+ постов про UI компоненты Steps имеет лучший CTR (1.06% против среднего 0.4%). Отличия:
- Живой авторский голос ("Done poorly, it confuses. Done well, it leads"; "Clarity beats speed")
- FAQ-блок в конце (5-6 вопросов и ответов)
- Чек-лист "before you ship"
- Никаких выдуманных статистик
- Чёткая структура заголовков

Это эталон. Применять к новым постам и к refactor'у старых.

### Принцип 8. Liquid glass cluster — топ-1 интент аудитории
- 28 поисков из 356 (8%) — liquid glass + glass + liquid
- Аудитория активно ждёт продолжения

### Принцип 9. Retro/brutalist — uncovered high-intent ниша
- 11 поисков (3.1%): retro (5), brutalism (3), RETRO OS UI (3)
- Ноль контента в блоге
- Ноль канонических гайдов в индустрии
- Восходящий тренд 2025-2026
- Идеальная "вторая liquid glass" возможность

### Принцип 10. "Design like X" — востребованный формат
- "notion style ui" (3), "airbnb" (3) в on-site search
- Запрос на практические гайды "как делать в стиле известного продукта"
- Идеален для AI-цитирования

### Принцип 11. AI как поисковый запрос — недооценён на сайте
Только 2 поиска по "AI" на сайте, при том что AI-related посты получают сотни просмотров (Venice 681, Claude 480). Вывод: AI-аудитория приходит через Google и AI-tools, не через on-site discoverability. AI-content стратегия должна фокусироваться на внешнем SEO и AI-tool цитировании.

### Принцип 12. Мобильный поиск сломан (UX, не контент)
353 desktop / 2 mobile поисков. Мобильный поиск явно спрятан или неудобен. Это вопрос для Волны 6 (UX improvements), а не для контент-волн.

## 3. Контент-паттерны (формулы, которые работают)

### Pattern A — Trend deep-guide
- **Длина:** 2000-3000 слов
- **Структура:** TL;DR → context → 3-4 sub-aesthetics/styles → comparison table → examples gallery → decision framework → implementation → FAQ → opinion-closing
- **Когда применять:** новый design trend появляется (Apple/Google/Microsoft анонс, новый Awwwards winner pattern, viral aesthetic из социалок)
- **ROI:** очень высокий при правильном тайминге (4-8 недель после появления тренда)
- **Риск:** короткий lifespan если тренд умирает
- **Эталон:** liquid-glass-design-explained-a-practical-guide

### Pattern B — Foundation tutorial
- **Длина:** 2000-3000 слов
- **Структура:** definition → why it matters → step-by-step framework → real examples → common mistakes → conclusion
- **Когда применять:** для core тем дизайн-системы (UI kit, dashboard, design tokens, design system)
- **ROI:** высокий, evergreen, прямая конверсия в UI kits
- **Эталон:** how-to-design-a-ui-kit-foundation

### Pattern C — Niche opinion-short
- **Длина:** 600-900 слов
- **Структура:** strong opinion lead → 3-4 supporting points → one specific recommendation → single CTA
- **Когда применять:** есть конкретное мнение об узкой UI-детали, можно написать за 1-2 часа
- **ROI:** низкий трафик per post, но 7-20% конверсия + хорошо цитируется AI-tools
- **Эталон:** strikethrough-text-deserves-more-love-in-ui

### Pattern D — Visual-decision
- **Длина:** 1500-2000 слов
- **Структура:** intro → 10-20 examples с короткими подписями → comparison table → quick decision guide
- **Когда применять:** для тем "examples of X", "best X gallery"
- **ROI:** высокий conversion despite низкого engagement
- **Эталон:** pricing-ui-design

### Pattern E — Component-anatomy (существующий шаблон)
- **Длина:** 2000-3500 слов
- **Структура:** intro → anatomy → types → states → theming → use cases → UX tips → (опционально) FAQ + checklist
- **Когда применять:** для новых component-guide постов
- **ROI:** baseline SEO traffic, ниже engagement чем другие паттерны
- **Статус:** 26+ постов уже написано, фокус — оптимизация не создание новых (за исключением подтверждённых пробелов)
- **Эталон качества:** steps-ui-design

## 4. Правила для AI-tool трафика

AI-инструменты (Claude, ChatGPT, Perplexity, Google AI Overviews) становятся всё более значимым источником трафика. Чтобы быть процитированным:

### 4.1. Answer-first структура
- Первый параграф под H1 = прямой ответ на главный вопрос (40-80 слов)
- Первый параграф под каждым H2 = прямой ответ на подвопрос
- НИКАКИХ "Welcome to this guide", "Let's dive in" — сразу ценность

### 4.2. Проверяемая конкретика
- ❌ "58% reduction in support tickets" без источника
- ❌ "Spring physics (damping: 0.7, stiffness: 150)" out-of-context
- ✅ "WCAG 2.2 requires 44×44px minimum touch target"
- ✅ "Material Design 3 specifies dialog max-width as 560dp"

Это критично — AI-инструменты сверяют факты с другими источниками и исключают сайты с выдуманной статистикой из цитирования.

### 4.3. Сравнительные таблицы
В каждом новом посте обязательна минимум одна comparison-таблица (X vs Y vs Z, when to use what). AI-tools цитируют таблицы целиком.

### 4.4. FAQ schema
- FAQ-блок в конце каждого нового поста (5-7 Q&A)
- В будущем — генерация FAQPage JSON-LD (Волна 5)

### 4.5. Первичные источники
Линковать на:
- ✅ W3C, WCAG, ARIA spec
- ✅ Material Design, Apple HIG, Microsoft Fluent docs
- ✅ Nielsen Norman Group research
- ❌ Не Dribbble для авторитета (только для визуальных примеров)
- ❌ Не Codepen для авторитета

### 4.6. Freshness signals
- date в frontmatter
- lastUpdated в frontmatter (для Волны 5)
- В тексте по возможности: "As of 2026..."

## 5. Подтверждённые контент-пробелы

### Tier 1 — высокий приоритет (нет контента + явный спрос)

| Тема | Источник сигнала | Спрос |
|---|---|---|
| Retro/brutalist UI design 2026 | On-site search | 11 поисков, ноль контента |
| Liquid glass companion (vs glassmorphism etc.) | On-site search + GA4 | 28 поисков + пост #1 |
| Data table UI design | On-site search + GSC gap | 3 поиска + базовая дыра |
| Date picker UI design | On-site search + GSC gap | 3 поиска |
| AI chat interface UI design | Тренд индустрии + экспертиза | Растущая ниша |

### Tier 2 — средний приоритет (есть контент, но плохо работает)

| Тема | Существующий пост | Проблема |
|---|---|---|
| Modal & Dialog | /blog/how-to-design-dialogs | 127 просмотров, 19 сек engagement |
| Button group | /blog/button-group-guide | 418 просмотров, 23 сек engagement |
| Avatar | /blog/avatar-ui-design | 9 сек engagement |
| Badge | /blog/badge-ui-design | 14 сек engagement |
| Stepper | /blog/stepper-ui-design | 13 сек engagement |
| Empty state | /blog/empty-state-ui-design | 13 сек engagement |
| Dashboard best practices | dashboard-design-best-practices-... | CTR 0.022%, ужасный URL |

### Tier 3 — потенциал, не подтверждено (write later)

- Sign in / Sign up UI design
- Onboarding UI design
- Form validation UI design
- Skeleton screens UI design
- Bento grid layouts
- Streaming text UI design
- Sidebar / Navigation drawer

## 6. Posts requiring urgent content rescue

Посты, которые получат больше кликов после Wave 1 (CTR fix), но будут терять позиции из-за низкого engagement если не починить содержимое:

1. **effective-dashboard-design-principles** — 2 сек engagement, подозрение на технический сбой. **Проверить руками**.
2. **avatar-ui-design** — 9 сек
3. **stepper-ui-design** — 13 сек
4. **empty-state-ui-design** — 13 сек
5. **badge-ui-design** — 14 сек
6. **dashboard-design-best-practices-top-dashboard-ui-design-tips** — CTR 0.022%

Что делать:
- Переписать первый параграф (answer-first)
- Добавить TL;DR блок
- Сократить введение
- Добавить FAQ-блок
- Применить формулу Steps

## 7. Content cannibalization map

### Уже решено
- Dashboard cluster (8 постов) → решено через pillar page

### Кандидаты на pillar+cluster

**Form controls cluster:**
- Связать: input, checkbox, dropdown, slider, toggle, stepper, chip, button, radio (если есть)
- Pillar: "Form controls UI reference 2026"

**Feedback patterns cluster:**
- Связать: notifications, tooltip, badge, empty state, toast, alert, banner (если есть)
- Pillar: "Feedback and notification patterns UI reference"

**Navigation patterns cluster:**
- Связать: tabs, breadcrumbs, pagination, dropdown, sidebar (если есть), appbar
- Pillar: "Navigation patterns UI reference"

## 8. Roadmap волн оптимизации

### Wave 1. CTR recovery — В РАБОТЕ
- Переписывание title/description для топ-постов GSC
- Status: Батч 1 завершён (7 постов), ждём данных через 14 дней

### Wave 2. Featured snippets
- Добавление 40-60 слово answer-first блоков в топ-5 постов
- HowTo schema для постов с чек-листами
- Status: запланировано после результатов Wave 1

### Wave 3. Pillar pages + topical clusters
- Dashboard pillar — ✅ ГОТОВО
- Form controls pillar — запланировано
- Feedback patterns pillar — запланировано
- Navigation pillar — запланировано

### Wave 4. Fake stats cleanup
- Удаление выдуманной статистики (особенно tabs-ui-design)
- Защита от Helpful Content Update
- Status: запланировано

### Wave 5. Technical SEO
- Image alt texts + filenames
- Heading hierarchy (bold → H3/H4)
- lastUpdated infrastructure
- FAQ + HowTo schema
- Status: запланировано

### Wave 6. UX improvements (не контент)
- Починить мобильный поиск
- Header CTA уже улучшен ранее
- Status: запланировано, низкий приоритет

## 9. Рекомендованный план новых постов

### В течение 30 дней
1. **Retro/brutalist 2026** — ✅ ПУБЛИКОВАН
2. **Liquid glass companion (vs glassmorphism vs frosted UI)** — ✅ ПУБЛИКОВАН

### В течение 60 дней
3. **Data table UI design** — Pattern E, фундаментальный gap, следующий в очереди
4. **AI chat interface UI design** — ✅ ПУБЛИКОВАН
5. **First niche-opinion experiment** — Pattern C, 600 слов, проверить формулу strikethrough-text

### В течение 90 дней
6. **Date picker UI design** — Pattern E
7. **"Anatomy of Notion" — Design like X пилот** — новый Pattern
8. **Foundation tutorial #2** (e.g., "How to design an AI app foundation") — Pattern B

## 10. Update protocol

Этот файл — источник истины. Когда приходят новые данные:

### При обновлении этого файла
- Сохрани прошлую версию как .ai/content-strategy-archive-{YYYY-MM}.md
- Обнови раздел "Последнее обновление"
- В разделе 2 (принципы) добавь новые принципы внизу, не удаляй старые
- В разделе 5 (пробелы) обнови статусы (что уже написано)
- В разделе 8 (roadmap) обнови статусы волн

### При создании нового baseline-снимка
- Создать .ai/seo-baseline-{YYYY-MM-DD}.md с текущими цифрами
- Не перезаписывать предыдущие — это история

### При написании нового поста
- Проверить, какой Pattern применять
- Проверить, какие принципы (4.1-4.6) применять для AI-tool оптимизации
- Проверить, есть ли пост в списке "next content" (раздел 9)
- После публикации — обновить раздел 5 (gaps) и раздел 9 (roadmap)
