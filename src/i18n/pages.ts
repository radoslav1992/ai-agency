/**
 * Заглавията и уводите на вътрешните страници, на двата езика.
 *
 * Текстовете са пренесени дума по дума от Кова студио — стоят тук, а не в
 * самите страници, за да не се разминат двата езика при следваща промяна.
 */
export const PAGES = {
  bg: {
    agents: {
      metaTitle: 'AI агенти',
      metaDescription:
        'Готови AI агенти за малки и средни компании: рецепционист по телефона, чат на сайта, агент върху фирмените документи, обработка на фактури, оферти и отчети. С ясен обхват и пилот преди голяма инвестиция.',
      eyebrow: 'AI агенти',
      title: 'Агенти, които поемат конкретна работа',
      lead: 'Всеки от тях е пакетиран за познат проблем: ясен обхват, ясно какво е нужно от теб и ясно къде не става. Започваме с един канал и пилот с твои данни — не с абонамент за „AI“.',
      jump: 'Списък с агентите',
      does: 'Какво прави',
      bestFor: 'За кого е',
      needs: 'Какво е нужно от теб',
      limits: 'Къде не става',
      demo: 'Може да се покаже на живо',
      processTitle: 'Как започва всеки агент',
    },
    projects: {
      metaTitle: 'Проекти',
      metaDescription:
        'Продукти, разработени от Кова студио — от първоначалната идея до пускането и поддръжката. Всеки от тях работи в момента и може да бъде изпробван.',
      eyebrow: 'Проекти',
      title: 'Продукти, които можеш да изпробваш',
      lead: 'Тук показвам продукти, които съм разработил от първоначалната идея до пускането и поддръжката. Всеки от тях работи в момента и може да бъде отворен и изпробван.',
      visit: 'Отвори',
    },
    contact: {
      metaTitle: 'Контакти',
      metaDescription:
        'Пиши на Кова студио — AI асистент, автоматизация, вътрешна система, бизнес сайт или обучение. Преглеждам всяко запитване лично и отговарям до един работен ден.',
      eyebrow: 'Контакти',
      title: 'Нека видим дали мога да помогна.',
      lead: 'Разкажи ми накратко как работи процесът в момента и какво искаш да подобриш. Ще прегледам запитването лично и ще ти отговоря до един работен ден.',
      directTitle: 'Директен контакт',
      answerTitle: 'Отговор',
      answerBody: 'До един работен ден. Всяко запитване го чета лично.',
    },
    blog: {
      metaTitle: 'Блог',
      metaDescription: 'Записки за AI, уеб и малкия бизнес — кратки, практични текстове без хайп.',
      eyebrow: 'Блог',
      title: 'Записки за AI, уеб и малкия бизнес',
      lead: 'Кратки, практични текстове. Без хайп, без „революция“ през ред.',
      back: '← Всички публикации',
      minutes: 'мин четене',
    },
    notFound: {
      metaTitle: 'Страницата я няма',
      eyebrow: '404',
      title: 'Тази страница я няма',
      lead: 'Адресът е сгрешен или страницата е преместена. Оттук можеш да продължиш нататък.',
      home: 'Към началото',
    },
  },

  en: {
    agents: {
      metaTitle: 'AI agents',
      metaDescription:
        'Ready-made AI agents for small and mid-sized companies: a phone receptionist, website chat, an agent over company documents, invoice processing, quotes and reports. Clear scope, and a pilot before any large investment.',
      eyebrow: 'AI agents',
      title: 'Agents that take over a specific job',
      lead: 'Each one is packaged around a familiar problem: a clear scope, a clear list of what is needed from you, and a clear statement of where it does not work. We start with one channel and a pilot on your data — not with a subscription to "AI".',
      jump: 'List of agents',
      does: 'What it does',
      bestFor: 'Best for',
      needs: 'What it needs from you',
      limits: 'Where it does not work',
      demo: 'Can be demonstrated live',
      processTitle: 'How every agent starts',
    },
    projects: {
      metaTitle: 'Projects',
      metaDescription:
        'Products built by Kova Studio — from the first idea through launch and support. Every one of them is live and can be tried right now.',
      eyebrow: 'Projects',
      title: 'Products you can try right now',
      lead: 'These are products I built from the first idea through launch and support. Every one of them is live, and you can open it and try it.',
      visit: 'Open',
    },
    contact: {
      metaTitle: 'Contact',
      metaDescription:
        'Get in touch with Kova Studio — an AI agent, automation, an internal system, a business website or training. I read every enquiry myself and reply within one working day.',
      eyebrow: 'Contact',
      title: 'Let us find out whether I can help.',
      lead: 'Tell me briefly how the process runs today and what you want to improve. I read every enquiry myself and reply within one working day.',
      directTitle: 'Direct contact',
      answerTitle: 'Reply',
      answerBody: 'Within one working day. I read every enquiry myself.',
    },
    blog: {
      metaTitle: 'Blog',
      metaDescription: 'Practical notes on AI, the web and small business — no hype.',
      eyebrow: 'Blog',
      title: 'Notes on AI, the web and small business',
      lead: 'Short, practical pieces. No hype, no "revolution" every other line.',
      back: '← All posts',
      minutes: 'min read',
    },
    notFound: {
      metaTitle: 'Page not found',
      eyebrow: '404',
      title: 'This page does not exist',
      lead: 'The address is wrong or the page has moved. You can carry on from here.',
      home: 'Back home',
    },
  },
} as const;

export type PageStrings = (typeof PAGES)['bg'];
