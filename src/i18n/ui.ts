/**
 * Надписите по компонентите, на двата езика.
 *
 * Българският е на „вие“: AIA е агенция, а не един човек, и учтивата форма
 * е това, което очаква читателят от фирмен сайт.
 *
 * Английският не е буквален превод навсякъде — английският няма учтива
 * форма, така че тонът идва от избора на думи, не от местоимението.
 */

export const UI = {
  bg: {
    layout: { skip: 'Към съдържанието' },

    header: { nav: 'Основна навигация', open: 'Отвори менюто', close: 'Затвори менюто', home: 'начало' },

    hero: {
      titleLead: 'Автоматизираме работата, която екипът ви още',
      titleAccent: 'върши на ръка',
      lead: 'Готови AI агенти за телефона, чата, пощата и документите. Поемат рутината, работят 24/7 и предават на човек, когато случаят го иска.',
      ctaPrimary: 'Запазете безплатен разговор',
      subnote:
        '30 минути, без ангажимент. Ако процесът ви не става за автоматизация, ще ви го кажем в разговора.',
    },

    carousel: {
      title: 'Готови AI агенти',
      all: (n: number) => `Всички ${n} агента →`,
      pick: 'Избор на агент',
    },

    services: {
      eyebrow: 'Услуги',
      title: 'С какво се занимаваме',
      note: 'Само AI и автоматизации. Технологията е средство — целта е процесът да стане по-бърз и да не зависи от това кой е на работа днес.',
      problem: 'Проблемът',
      solution: 'Решението',
      change: 'Какво се променя',
      more: 'Говорете с нас',
    },

    integrations: {
      title: 'Свързваме се с това, което вече ползвате',
      note: 'Агентът е полезен само ако стига до данните. Свързваме го с инструментите, в които екипът ви работи всеки ден.',
    },

    process: { eyebrow: 'Процес', title: 'Как протича работата', terms: 'Важните условия — ясни още в началото' },

    pilot: {
      eyebrow: 'Пилот',
      title: 'Започваме с един процес, не с абонамент',
      body: 'Имате идея за автоматизация, но първо искате да се уверите, че работи? Пилотът проверява точно това — с ваши реални данни и измерим резултат.',
      note: 'Накрая получавате работещ прототип и ясна препоръка: има ли смисъл да се продължава. Ако отговорът е „не“, ще ви го кажем.',
      cta: 'Заявете пилот',
    },

    pricing: {
      eyebrow: 'Цени',
      title: 'Ориентировъчни бюджети',
      note: 'Всеки проект е различен. Тези числа са, за да прецените още сега дали изобщо си говорим.',
      after:
        'Цената на пълното решение се определя след пилота и техническата оценка. Текущите разходи за сървъри, модели и външни услуги ги казваме предварително — в офертата, преди да започнем, не после.',
    },

    cta: {
      title: 'Имате процес, който яде твърде много време?',
      body: 'Разкажете ни как върви в момента. Ще ви кажем дали може да се автоматизира и откъде е разумно да се започне. Ако не сме подходящите, ще го чуете още в разговора.',
      button: 'Запазете безплатен разговор',
      note: '30 минути. Не се иска подготовка — покажете ни процеса както си е.',
    },

    footer: {
      nav: 'Долна навигация',
      navTitle: 'Навигация',
      contactTitle: 'Контакт',
      termsTitle: 'Условия',
      tagline: 'AI агенция за автоматизация на бизнес процеси.',
      promise: 'Всеки проект — с писмена оферта, договор и фактура.',
      rights: '. Всички права запазени.',
      terms: 'Общи условия',
      privacy: 'Политика за поверителност',
      cookies: 'Политика за бисквитки',
    },

    form: {
      name: 'Име',
      namePlaceholder: 'Име и фамилия',
      email: 'Имейл',
      need: 'От какво имате нужда?',
      message: 'Разкажете ни накратко',
      messagePlaceholder:
        'Опишете как работи процесът в момента, какво ви затруднява и какъв резултат искате да постигнете. Не е необходимо да имате готово техническо задание.',
      honeypot: 'Не попълвайте това поле',
      submit: 'Изпрати запитването',
      sending: 'Изпращам…',
      sent: 'Изпратено ✓',
      orEmail: 'Или просто ни пишете на ',
      thanks: 'Благодарим! Получихме запитването и ще отговорим до един работен ден.',
      /** Показва се, когато нищо по-конкретно не е дошло от сървъра. */
      error: 'Нещо се обърка при изпращането. Пишете ни директно на имейла отгоре.',
    },

    cookies: {
      label: 'Съгласие за бисквитки',
      bodyA: 'Използваме Google Analytics, за да разбираме кои страници са полезни. Аналитични бисквитки се поставят само с ваше съгласие —',
      link: 'вижте политиката за бисквитки',
      accept: 'Приемам',
      decline: 'Отказвам',
    },
  },

  en: {
    layout: { skip: 'Skip to content' },

    header: { nav: 'Main navigation', open: 'Open menu', close: 'Close menu', home: 'home' },

    hero: {
      titleLead: 'We automate the work your team still does',
      titleAccent: 'by hand',
      lead: 'Ready-made AI agents for the phone, the chat, the inbox and the documents. They take the routine, run around the clock, and hand over to a person when the case calls for it.',
      ctaPrimary: 'Book a free call',
      subnote:
        "30 minutes, no commitment. If your process isn't a good fit for automation, we'll tell you on the call.",
    },

    carousel: {
      title: 'Ready-made AI agents',
      all: (n: number) => `All ${n} agents →`,
      pick: 'Choose an agent',
    },

    services: {
      eyebrow: 'Services',
      title: 'What we do',
      note: "AI and automation, nothing else. Technology is the means — the point is a process that runs faster and doesn't depend on who happens to be in today.",
      problem: 'The problem',
      solution: 'The solution',
      change: 'What changes',
      more: 'Talk to us',
    },

    integrations: {
      title: 'We connect to what you already run',
      note: 'An agent is only useful if it reaches the data. We wire it into the tools your team works in every day.',
    },

    process: { eyebrow: 'Process', title: 'How the work goes', terms: 'The terms that matter — stated upfront' },

    pilot: {
      eyebrow: 'Pilot',
      title: 'We start with one process, not a subscription',
      body: 'Have an automation in mind but want proof it works first? That is exactly what the pilot tests — on your real data, with a measurable result.',
      note: 'You end up with a working prototype and a straight recommendation on whether to continue. If the answer is no, you will hear it.',
      cta: 'Request a pilot',
    },

    pricing: {
      eyebrow: 'Pricing',
      title: 'Indicative budgets',
      note: "Every project differs. These numbers are here so you can tell right now whether we're in the same range.",
      after:
        'The price of the full build is set after the pilot and the technical assessment. Running costs for servers, models and third-party services are stated upfront — in the quote, before we start, not after.',
    },

    cta: {
      title: 'Got a process eating too many hours?',
      body: "Tell us how it runs today. We'll tell you whether it can be automated and where it makes sense to start. If we're not the right fit, you'll hear that on the call.",
      button: 'Book a free call',
      note: 'Thirty minutes. No preparation needed — show us the process exactly as it is.',
    },

    footer: {
      nav: 'Footer navigation',
      navTitle: 'Navigation',
      contactTitle: 'Contact',
      termsTitle: 'Terms',
      tagline: 'An AI agency for business process automation.',
      promise: 'Every project comes with a written quote, a contract and an invoice.',
      rights: '. All rights reserved.',
      terms: 'Terms of service',
      privacy: 'Privacy policy',
      cookies: 'Cookie policy',
    },

    form: {
      name: 'Name',
      namePlaceholder: 'First and last name',
      email: 'Email',
      need: 'What do you need?',
      message: 'Tell us briefly',
      messagePlaceholder:
        'Describe how the process runs today, what makes it hard, and what result you want. You do not need a finished technical specification.',
      honeypot: 'Leave this field empty',
      submit: 'Send enquiry',
      sending: 'Sending…',
      sent: 'Sent ✓',
      orEmail: 'Or just email us at ',
      thanks: 'Thank you. We have your enquiry and will reply within one working day.',
      error: 'Something went wrong while sending. Email us directly at the address above.',
    },

    cookies: {
      label: 'Cookie consent',
      bodyA: 'We use Google Analytics to understand which pages are useful. Analytics cookies are set only with your consent —',
      link: 'read the cookie policy',
      accept: 'Accept',
      decline: 'Decline',
    },
  },
} as const;

export type UiStrings = (typeof UI)['bg'];
