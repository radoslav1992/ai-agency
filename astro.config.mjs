// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import { SITE } from './src/data/site.mjs';

export default defineConfig({
  site: SITE.url,
  output: 'static',
  integrations: [sitemap({ i18n: { defaultLocale: 'bg', locales: { bg: 'bg-BG', en: 'en' } } })],
  /**
   * Българският е основният език и стои на корена — `/` е български, `/en/`
   * е английски. Така адресите на основната аудитория остават най-къси.
   */
  i18n: {
    defaultLocale: 'bg',
    locales: ['bg', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  build: { format: 'directory' },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  /* `tailwindcss()` носи типовете на собствената си Vite версия — оттам и
     приведеният тип. Разминаването е само в декларациите, не в кода. */
  vite: { plugins: [/** @type {any} */ (tailwindcss())] },
});
