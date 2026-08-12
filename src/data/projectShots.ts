import type { ImageMetadata } from 'astro';

/**
 * Екранните снимки на проектите, намерени по домейн.
 *
 * `plumeo.ink` → `src/assets/projects/plumeo.png`. Стои отделно, защото се
 * ползва и от началната страница, и от `/projects/` — един глоб на две
 * места води до това едното да хване нов файл, а другото да го пропусне.
 */
const shots = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/projects/*.{png,jpg,jpeg,webp,avif}',
  { eager: true },
);

const byName = new Map<string, ImageMetadata>(
  Object.entries(shots).map(([path, mod]) => [
    path.split('/').pop()!.replace(/\.\w+$/, ''),
    mod.default,
  ]),
);

/** Домейнът без протокол и без завършваща наклонена черта. */
export function domainOf(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

/** Екранната снимка на проекта или `undefined`, ако още няма файл за него. */
export function projectShot(url: string): ImageMetadata | undefined {
  return byName.get(domainOf(url).replace(/\.[^.]+$/, ''));
}
