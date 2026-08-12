/**
 * Единственото място, което знае кой набор данни отива с кой език.
 *
 * Компонентите викат `content(lang)` и получават същите имена, каквито
 * биха ги внасяли директно — `SERVICES`, `PROCESS`, `TERMS`. Така добавянето на език
 * не преправя нито един компонент, а само подменя източника.
 */

import * as bgContent from '../data/content.ts';
import * as enContent from '../data/content.en.ts';
import * as bgAgents from '../data/agents.ts';
import * as enAgents from '../data/agents.en.ts';
import { UI } from './ui.ts';
import {
  META,
  NAV_BY_LOCALE,
  CTA_BY_LOCALE,
  LEGAL_NAME_BY_LOCALE,
  BRAND_BY_LOCALE,
  LOCATION_BY_LOCALE,
} from '../data/site.mjs';
import type { Locale } from './index.ts';

export function content(locale: Locale) {
  return locale === 'en' ? enContent : bgContent;
}

export function agents(locale: Locale) {
  return locale === 'en' ? enAgents : bgAgents;
}

export function ui(locale: Locale) {
  return UI[locale];
}

export function brand(locale: Locale) {
  return BRAND_BY_LOCALE[locale] ?? BRAND_BY_LOCALE.bg;
}

export function location(locale: Locale) {
  return LOCATION_BY_LOCALE[locale] ?? LOCATION_BY_LOCALE.bg;
}

export function legalName(locale: Locale) {
  return LEGAL_NAME_BY_LOCALE[locale] ?? LEGAL_NAME_BY_LOCALE.bg;
}

export function meta(locale: Locale) {
  return META[locale] ?? META.bg;
}

export function nav(locale: Locale) {
  return NAV_BY_LOCALE[locale] ?? NAV_BY_LOCALE.bg;
}

export function cta(locale: Locale) {
  return CTA_BY_LOCALE[locale] ?? CTA_BY_LOCALE.bg;
}
