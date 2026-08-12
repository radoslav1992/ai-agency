/**
 * Заглавията и уводите на вътрешните страници, на двата езика.
 *
 * Стоят тук, а не в самите страници, за да не се разминат двата езика при
 * следваща промяна.
 */
export const PAGES = {
  bg: {
    agents: {
      metaTitle: 'AI агенти',
      metaDescription:
        'Готови AI агенти за малки и средни компании: рецепционист по телефона, чат на сайта, агент върху фирмените документи, обработка на фактури, оферти и отчети. С ясен обхват и пилот преди голяма инвестиция.',
      eyebrow: 'AI агенти',
      title: 'Агенти, които поемат конкретна работа',
      lead: 'Всеки от тях е пакетиран за познат проблем: ясен обхват, ясно какво е нужно от вас и ясно къде не става. Започваме с един канал и пилот с ваши данни — не с абонамент за „AI“.',
      jump: 'Списък с агентите',
      does: 'Какво прави',
      bestFor: 'За кого е',
      needs: 'Какво е нужно от вас',
      limits: 'Къде не става',
      processTitle: 'Как започва всеки агент',
    },
    contact: {
      metaTitle: 'Контакти',
      metaDescription:
        'Пишете на AIA — AI агент, автоматизация на процес, AI върху фирмени документи или обучение на екипа. Отговаряме до един работен ден.',
      eyebrow: 'Контакти',
      title: 'Да видим дали можем да помогнем.',
      lead: 'Разкажете ни накратко как работи процесът в момента и какво искате да подобрите. Ще прегледаме запитването и ще отговорим до един работен ден.',
      directTitle: 'Директен контакт',
      answerTitle: 'Отговор',
      answerBody: 'До един работен ден. Всяко запитване се чете от човек.',
    },
    notFound: {
      metaTitle: 'Страницата я няма',
      eyebrow: '404',
      title: 'Тази страница я няма',
      lead: 'Адресът е сгрешен или страницата е преместена. Оттук можете да продължите нататък.',
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
      processTitle: 'How every agent starts',
    },
    contact: {
      metaTitle: 'Contact',
      metaDescription:
        'Get in touch with AIA — an AI agent, process automation, AI over your company documents, or training for the team. We reply within one working day.',
      eyebrow: 'Contact',
      title: 'Let us find out whether we can help.',
      lead: 'Tell us briefly how the process runs today and what you want to improve. We read every enquiry and reply within one working day.',
      directTitle: 'Direct contact',
      answerTitle: 'Reply',
      answerBody: 'Within one working day. Every enquiry is read by a person.',
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
