# ai-agency

Двуезичен сайт на AI агенция: **българският е основният език и стои на корена**
(`/`), английският е вторичен и живее под `/en/`. Дизайнът е пренесен от шаблона
**AI Creative Studio / Optim AI**; текстът, данните и изображенията идват от
`radoslav1992/agency` (Кова студио).

## Стек

| Какво | Защо |
| --- | --- |
| [Astro 5](https://astro.build) | статичен изход, вградено `i18n` рутиране, оптимизация на изображенията |
| [Tailwind CSS v4](https://tailwindcss.com) | `@theme` блокът в `src/styles/global.css` възпроизвежда точките на шаблона |
| `@fontsource-variable/*` | шрифтовете се сервират от домейна, без заявка към Google Fonts |
| GSAP + `public/vendor/template.js` | анимационният двигател на шаблона, както е в оригинала |
| `@astrojs/cloudflare` + Wrangler | пускане като Worker със статични файлове |

Всичко се компилира предварително с изключение на `/api/contact` — няма база
данни и няма нищо, което да се рендира при заявка.

```bash
npm install
npm run dev      # http://localhost:4321
npm run check    # astro check — типове и разметка
npm run build    # dist/
npm run preview  # astro build + wrangler dev — както е на Cloudflare
npm run deploy   # astro build + wrangler deploy
```

## Двуезичие

`astro.config.mjs` задава `defaultLocale: 'bg'` с `prefixDefaultLocale: false`,
затова българските адреси нямат префикс, а английските получават `/en`.

- `src/i18n/index.ts` — езикът на страницата, адресът на същата страница на
  другия език, `hreflang` двойките. Списъкът `TRANSLATED` изброява страниците,
  които наистина съществуват и на двата езика; превключвателят в хедъра се
  показва само върху тях, за да не води в 404.
- `src/i18n/ui.ts` — надписите по компонентите.
- `src/i18n/pages.ts` — заглавията и уводите на вътрешните страници.
- `src/i18n/content.ts` — единственото място, което знае кой набор данни отива
  с кой език. Компонентите не получават език като свойство; взимат го от
  `Astro.currentLocale`.

**Блогът е само на български.** Публикациите не са преведени, а връзка, която
сменя езика под краката на читателя, е по-лоша от липсваща — затова английската
навигация няма „Блог“, а `hreflang` не сочи към несъществуващи страници.

| Български | Английски |
| --- | --- |
| `/` | `/en/` |
| `/agents/` | `/en/agents/` |
| `/projects/` | `/en/projects/` |
| `/contact/` | `/en/contact/` |
| `/terms/`, `/privacy/`, `/cookies/` | `/en/terms/`, `/en/privacy/`, `/en/cookies/` |
| `/blog/`, `/blog/<slug>/`, `/rss.xml` | — |

## Съдържание

Текстовете са данни, не разметка. Редактират се в `src/data/`:

| Файл | Какво съдържа |
| --- | --- |
| `site.mjs` | име, домейн, контакти, навигация, име на студиото и локация по език |
| `content.ts` / `content.en.ts` | услуги, процес, условия, „За мен“, пакети, опции във формата |
| `agents.ts` / `agents.en.ts` | каталогът с готовите AI агенти |
| `projects.ts` / `projects.en.ts` | портфолиото |
| `cases.ts` / `cases.en.ts` | трите водещи продукта на началната страница |

Публикациите в блога са Markdown файлове в `src/content/blog/` със схема,
описана в `src/content.config.ts`.

Изображенията се търсят по име: `src/data/agentShots.ts` намира рисунката на
агент по `id`, а `src/data/projectShots.ts` — екранната снимка на проект по
домейн (`plumeo.ink` → `src/assets/projects/plumeo.png`).

## Типография и кирилица

Шаблонът ползва Sora за заглавията, но **Sora няма кирилица**. Затова:

- на българските страници `--font-sora` се пренасочва към **Manrope**, който
  има и кирилица, и латиница — иначе заглавие като „AI агенти“ се изписва с два
  различни шрифта в рамките на един ред;
- английските страници остават със Sora, както е в шаблона;
- `font-feature-settings: 'locl' 0` изключва българските форми на кирилицата,
  защото Manrope ги има, а Inter Tight (текстът) — не, и разликата се вижда
  между заглавието и абзаца под него.

Всичко това е на едно място, в `src/styles/global.css`.

## Формата за контакт

`src/pages/api/contact.ts` е единственият маршрут, който не се компилира
предварително (`export const prerender = false`) — той работи във Worker-а и
изпраща писмото през **Cloudflare Email Routing**, без външна услуга и без ключ
за API.

- Валидацията е и от страна на сървъра, а съобщенията за грешка са на езика на
  формата — скритото поле `lang` пътува със заявката.
- Капанът за ботове (`company-website`) връща „изпратено“ и изхвърля писмото.
- Приемат се само стойности за „От какво имаш нужда?“, които формата на този
  език наистина предлага.
- `Reply-To` е адресът на подателя, за да се отговаря директно от пощата.
- Без JavaScript формата работи като обикновен `POST` и Worker-ът връща 303 към
  `/contact/?sent=1`; скриптът само прихваща изпращането, за да не се презарежда
  страницата. Заявки от чужд домейн се отхвърлят от вградената защита на Astro.

Тялото се кодира в base64 ръчно — `mimetext` обявява кодирането, но не го
прилага, а стойността му по подразбиране би обявила кирилско писмо за ASCII.

## Пускане на Cloudflare

Сайтът се качва като **Worker със статични файлове** (Pages и Workers вече са
един продукт): цялото `dist/` става статика, а до кода стига единствено
`/api/contact`.

```bash
npx wrangler login
npm run preview   # astro build + wrangler dev — Worker-ът върви локално
npm run deploy    # astro build + wrangler deploy
```

Настройките са в `wrangler.jsonc`. Преди първото пускане:

1. **Email Routing** — в Cloudflare, за зоната на домейна, включи Email Routing
   и потвърди адреса получател. Той трябва да съвпада едновременно с
   `send_email.destination_address` и с `vars.CONTACT_TO`; писмото няма да
   тръгне към непотвърден адрес.
2. **Подател** — `vars.CONTACT_FROM` трябва да е адрес в зона от същия акаунт с
   включен Email Routing (например `forma@kova.bg`).
3. **Домейн** — добави потребителски домейн на Worker-а и смени `SITE.url` в
   `src/data/site.mjs`; от него се генерират `canonical`, `hreflang`, `og:url`
   и картата на сайта.
4. **Аналитика** — `SITE.gaId` е ID-то на Google Analytics. `null` изключва и
   аналитиката, и банера за бисквитки.

`public/_headers` задава заглавките: `Cache-Control: immutable` за хешираните
файлове в `/_astro/`, плюс `nosniff`, `Referrer-Policy`, `X-Frame-Options`,
`Permissions-Policy` и HSTS. Адресите завършват с наклонена черта
(`html_handling: "auto-trailing-slash"`), а несъществуваща страница получава
`404.html` с код 404.

За пускане при всеки push вместо от команден ред: в Cloudflare → Workers &
Pages → Connect to Git, команда за компилиране `npm run build`, изходна папка
`dist`.

## Аналитика и бисквитки

Google Analytics се зарежда с Consent Mode v2 и `analytics_storage: 'denied'`;
банерът (`src/components/CookieConsent.astro`) го вдига само при „Приемам“.
`SITE.gaId = null` в `src/data/site.mjs` изключва и аналитиката, и банера.

## От шаблона

`public/vendor/` съдържа GSAP, ScrollTrigger, SplitText, Springer, Lenis и
infinite-marquee, както и `template.js` — това е `assets/main.js` на шаблона без
промени. Анимациите се задават с атрибути (`data-opai-animate`, `data-delay`,
`data-direction`, `data-spring`). Скриптовете са `defer`; без тях страницата се
показва напълно — `gsap.from` анимира към текущото състояние, не от скрито.

Градиентните фонове на шаблона бяха 12 MB PNG; тук са преобразувани в WebP
(`public/images/gradient/`, под 850 kB общо).
