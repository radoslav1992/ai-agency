/**
 * Site-wide constants. Imported both by `astro.config.mjs` (hence `.mjs`)
 * and by components/pages.
 *
 * ⚠️ Контактите и домейнът са ЗАПЪЛВАЩИ. Смени ги с истинските, преди
 * сайтът да тръгне: от `url` се раждат canonical, hreflang, og:url и
 * картата на сайта, а от `email` — всяка връзка за връзка с агенцията.
 */
export const SITE = {
  name: 'AIA',
  shortName: 'AIA',
  /** Домейнът в производство. ЗАПЪЛВАЩ — смени го. */
  url: 'https://aia.bg',
  lang: 'bg',
  locale: 'bg_BG',
  title: 'AIA — AI агенти и автоматизации за бизнеса',
  description:
    'AI агенция за автоматизация: готови агенти за телефон, чат, поща и документи, автоматизации на повтарящи се процеси и AI върху фирмените ти данни.',
  /** Общ имейл за запитвания. ЗАПЪЛВАЩ — смени го. */
  email: 'hello@aia.bg',
  location: 'София, България',
  /** Година на основаване — стои във футъра и в структурираните данни. */
  founded: 2026,
  /** Официално име за футъра и правните страници. ЗАПЪЛВАЩО — смени го. */
  legalName: 'AIA',
  /**
   * Google Analytics 4 measurement ID. Зарежда се само след съгласие от
   * банера за бисквитки. `null` изключва аналитиката и банера изцяло.
   */
  gaId: null,
};

/**
 * Името на агенцията по език. „AIA“ е латиница и на двата езика — не се
 * транслитерира, защото е марка, а не дума.
 */
export const BRAND_BY_LOCALE = {
  bg: { shortName: 'AIA', suffix: '' },
  en: { shortName: 'AIA', suffix: '' },
};

/** Градът и държавата по език — стоят в героя и във футъра. */
export const LOCATION_BY_LOCALE = {
  bg: 'София, България',
  en: 'Sofia, Bulgaria',
};

/**
 * Име на изпълнителя за футъра и правните страници. ЗАПЪЛВАЩО — замени го
 * с регистрираното дружество (напр. „AIA ЕООД, ЕИК …“), когато има такова.
 */
export const LEGAL_NAME_BY_LOCALE = {
  bg: 'AIA',
  en: 'AIA',
};

/**
 * Заглавие и описание по език. Английското описание не е превод на
 * българското — то се чете от друг купувач, който не търси „в България“.
 */
export const META = {
  bg: {
    title: 'AIA — AI агенти и автоматизации за бизнеса',
    description:
      'AI агенция за автоматизация: готови агенти за телефон, чат, поща и документи, автоматизации на повтарящи се процеси и AI върху фирмените ти данни.',
  },
  en: {
    title: 'AIA — AI agents and automation for business',
    description:
      'An AI automation agency: ready-made agents for phone, chat, inbox and documents, automation of repetitive processes, and AI over your own company data.',
  },
};

/** Навигация по език. Двете са огледални — целият сайт е двуезичен. */
export const NAV_BY_LOCALE = {
  bg: [
    { label: 'Услуги', href: '/#services' },
    { label: 'AI агенти', href: '/agents/' },
    { label: 'Процес', href: '/#process' },
    { label: 'Цени', href: '/#pricing' },
  ],
  en: [
    { label: 'Services', href: '/#services' },
    { label: 'AI agents', href: '/agents/' },
    { label: 'Process', href: '/#process' },
    { label: 'Pricing', href: '/#pricing' },
  ],
};

export const CTA_BY_LOCALE = {
  bg: { label: 'Да поговорим', href: '/contact/' },
  en: { label: "Let's talk", href: '/contact/' },
};

/** Български по подразбиране — за местата, които още не са двуезични. */
export const NAV = NAV_BY_LOCALE.bg;
export const CTA = CTA_BY_LOCALE.bg;
