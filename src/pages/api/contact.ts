import type { APIRoute } from 'astro';
import { NEEDS as NEEDS_BG } from '../../data/content.ts';
import { NEEDS as NEEDS_EN } from '../../data/content.en.ts';
import { LOCALES, DEFAULT_LOCALE, type Locale } from '../../i18n/index.ts';

/** Единственият маршрут, който не се компилира предварително — работи във Worker-а. */
export const prerender = false;

type Submission = {
  name: string;
  email: string;
  message: string;
  need: string;
  /** Капанът за ботове — истинските хора го оставят празен. */
  website: string;
  /** Езикът на страницата, от която е дошло запитването. */
  lang: Locale;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Съобщенията за грешка са на езика на формата. Читателят, попълнил
 * английската страница, не бива да получи отговор на български.
 */
const ERRORS = {
  bg: {
    badRequest: 'Невалидно запитване.',
    name: 'Моля, попълнете името си.',
    email: 'Моля, попълнете валиден имейл адрес.',
    message: 'Моля, разкажете накратко за проекта.',
    notConfigured: 'Формата още не е свързана с имейл. Пишете ни директно на имейла отдолу.',
    send: 'Не успяхме да изпратим запитването. Пишете ни директно на имейла отдолу.',
  },
  en: {
    badRequest: 'Invalid request.',
    name: 'Please fill in your name.',
    email: 'Please fill in a valid email address.',
    message: 'Please tell us briefly about the project.',
    notConfigured: 'The form is not wired to an inbox yet. Email us directly at the address below.',
    send: 'We could not send your enquiry. Email us directly at the address below.',
  },
} as const;

/** Опциите, които формата наистина предлага — по език. */
const NEEDS: Record<Locale, readonly string[]> = { bg: NEEDS_BG, en: NEEDS_EN };

function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function localeOf(value: unknown): Locale {
  return (LOCALES as readonly string[]).includes(String(value)) ? (value as Locale) : DEFAULT_LOCALE;
}

async function readSubmission(request: Request): Promise<{ data: Submission; isJson: boolean }> {
  const contentType = request.headers.get('content-type') ?? '';
  let raw: Record<string, unknown> = {};
  let isJson = false;

  if (contentType.includes('application/json')) {
    isJson = true;
    raw = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  } else {
    const form = await request.formData();
    raw = Object.fromEntries(form.entries());
  }

  const lang = localeOf(raw.lang);
  const need = clean(raw.need, 200);

  return {
    isJson,
    data: {
      lang,
      name: clean(raw.name, 120),
      email: clean(raw.email, 180),
      message: clean(raw.message, 4000),
      website: clean(raw['company-website'], 100),
      /* Приемаме само стойност, която формата на този език наистина предлага. */
      need: NEEDS[lang].includes(need) ? need : '',
    },
  };
}

function validate(data: Submission): string | null {
  const errors = ERRORS[data.lang];
  if (data.name.length < 2) return errors.name;
  if (!EMAIL_RE.test(data.email)) return errors.email;
  if (data.message.length < 10) return errors.message;
  return null;
}

/**
 * В заглавките не бива да влиза суров нов ред — име или тема с такъв би
 * могло да вмъкне допълнителни заглавки в писмото.
 */
function headerSafe(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

/**
 * mimetext обявява кодирането, но не го прилага, а стойността му по
 * подразбиране `7bit` би обявила кирилско тяло за ASCII. Кодираме го сами,
 * пренесено на 76 знака на ред, колкото RFC 2045 позволява.
 */
function toBase64Body(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return (btoa(binary).match(/.{1,76}/g) ?? []).join('\r\n');
}

/**
 * Изпраща през `send_email` на Cloudflare Email Routing.
 *
 * Връзката доставя само до адреси, потвърдени като получатели в акаунта —
 * точно каквото трябва на форма за контакт. `cloudflare:email` съществува
 * само в средата на Worker-а, затова се внася лениво, за да продължат да
 * работят `astro dev` и `astro build` върху Node.
 */
async function sendEmail(env: Env, data: Submission): Promise<void> {
  const to = env.CONTACT_TO;
  const from = env.CONTACT_FROM;
  if (!env.SEND_EMAIL || !to || !from) throw new Error('send_email binding is not configured');

  // `mimetext/browser` е вариантът без вградените модули на Node — по-малък е.
  const [{ EmailMessage }, { createMimeMessage, Mailbox }] = await Promise.all([
    import('cloudflare:email'),
    import('mimetext/browser'),
  ]);

  const name = headerSafe(data.name);
  const need = data.need || '—';
  const labels =
    data.lang === 'en'
      ? { name: 'Name', email: 'Email', need: 'Needs', subject: 'Enquiry from' }
      : { name: 'Име', email: 'Имейл', need: 'Нужди', subject: 'Запитване от' };

  const body = [
    `${labels.name}: ${data.name}`,
    `${labels.email}: ${data.email}`,
    `${labels.need}: ${need}`,
    `Език: ${data.lang}`,
    '',
    data.message,
  ].join('\r\n');

  const msg = createMimeMessage();
  msg.setSender({ name: 'AIA', addr: from });
  msg.setRecipient(to);
  msg.setSubject(headerSafe(`${labels.subject} ${name}${data.need ? ` — ${need}` : ''}`));
  /* Позволява да се отговори директно на човека. Тук се иска Mailbox, а не
     обикновен низ — той кодира и кирилското име в заглавката. */
  msg.setHeader('Reply-To', new Mailbox({ name, addr: data.email }));
  msg.addMessage({
    contentType: 'text/plain',
    encoding: 'base64',
    data: toBase64Body(body),
  });

  await env.SEND_EMAIL.send(new EmailMessage(from, to, msg.asRaw()));
}

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  let submission: Awaited<ReturnType<typeof readSubmission>>;
  try {
    submission = await readSubmission(request);
  } catch {
    return Response.json({ ok: false, error: ERRORS.bg.badRequest }, { status: 400 });
  }

  const { data, isJson } = submission;
  const errors = ERRORS[data.lang];
  const contactPath = data.lang === DEFAULT_LOCALE ? '/contact/' : `/${data.lang}/contact/`;

  const respond = (ok: boolean, error?: string, status = 200) => {
    if (isJson) {
      return Response.json(ok ? { ok: true } : { ok: false, error }, { status });
    }
    /* Резервен вариант без JavaScript: връща на формата с четимо съобщение. */
    return redirect(
      ok ? `${contactPath}?sent=1` : `${contactPath}?error=${encodeURIComponent(error ?? errors.send)}`,
      303,
    );
  };

  // Капанът е попълнен → правим се, че всичко е наред, и изхвърляме писмото.
  if (data.website) return respond(true);

  const invalid = validate(data);
  if (invalid) return respond(false, invalid, 422);

  const env = locals.runtime?.env ?? ({} as Env);

  if (!env.SEND_EMAIL || !env.CONTACT_TO || !env.CONTACT_FROM) {
    console.warn('Contact form is not configured: missing SEND_EMAIL, CONTACT_TO or CONTACT_FROM.');
    return respond(false, errors.notConfigured, 503);
  }

  try {
    await sendEmail(env, data);
    return respond(true);
  } catch (error) {
    console.error('Contact form failed', error);
    return respond(false, errors.send, 502);
  }
};

/** Всичко друго освен POST на този маршрут. */
export const ALL: APIRoute = () =>
  new Response('Method Not Allowed', { status: 405, headers: { allow: 'POST' } });
