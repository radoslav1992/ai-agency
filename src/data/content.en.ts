/**
 * English mirror of `content.ts`.
 *
 * The same rule applies: no result is claimed here that has not been
 * measured with a client. Until there is a concrete case, the copy says
 * what the system does — not what it has achieved.
 */

import type { Service, ProcessStep, Plan, Highlight } from './content.ts';

export const SERVICES: Service[] = [
  {
    number: '01',
    title: 'AI agents for the channels your customers actually use',
    problem:
      'Every day disappears into routine: missed calls, the same questions over email and chat, invoices retyped by hand, appointments forgotten. Separately, minutes. Together, a full-time job a day.',
    solution:
      'A specialised agent takes over one channel end to end — voice, chat, inbox or documents. It works strictly from your material, cites the source of every answer, keeps a record, and hands over to a person the moment the case needs judgement.',
    changes: [
      {
        title: 'Runs around the clock',
        body: 'Customers get an answer, service and a booked slot 24/7 — in the evening, on Saturday and while the line is busy.',
      },
      {
        title: 'Your team gets its hours back',
        body: 'People stop retyping and repeating themselves, and focus on the deals and decisions instead.',
      },
      {
        title: 'You stay in control',
        body: 'The agent stops where human judgement begins, and for sensitive data the model can run entirely on your side.',
      },
    ],
    link: { href: '/agents/', label: 'See the ready-made agents' },
  },
  {
    number: '02',
    title: 'Automation of repetitive processes',
    problem:
      'Someone copies data from emails into a spreadsheet. Every day, two hours at a time, with mistakes that surface a month later.',
    solution:
      'The system takes over the entry, the recognition and the preparation. A person reviews and approves — they do not type.',
    points: [
      'Less manual entry',
      'A trace of who approved what, and when',
      'It runs even when nobody is free to do it',
    ],
  },
  {
    number: '03',
    title: 'AI over your company documents',
    problem:
      'The answer is in the contract, the handbook or an old email. The person who knows where is on holiday — and everyone waits for them.',
    solution:
      'Plain-language search across your contracts, procedures and minutes, with a quote and a link to the exact document.',
    points: [
      'Answers cite their source, so they can be checked',
      'Different permissions for different people',
      'PDF, Word, Excel and scanned documents',
    ],
  },
  {
    number: '04',
    title: 'Connecting the systems you already run',
    problem:
      'AI is only useful if it reaches the data. And the data sits in the CRM, the accounting system and the inbox.',
    solution:
      'We build the connections between your tools so the data flows on its own instead of being carried across by hand.',
    points: [
      'CRM, ERP, accounting, calendar, chat',
      'Webhooks and APIs to in-house systems',
      'Monitoring and alerts when something stops',
    ],
  },
  {
    number: '05',
    title: 'Training for your team',
    body: 'Hands-on generative-AI training — with your documents and your processes in the exercises, not generic examples.',
  },
];

export const PROCESS: ProcessStep[] = [
  {
    number: '01',
    title: 'A call and one process',
    body: '30 minutes, free. We look at which channel costs you the most time — phone, inbox, documents. We start with that one only.',
  },
  {
    number: '02',
    title: 'A one-page quote',
    body: 'Scope, deadline and price. Running costs for servers, models and third-party services stated upfront, not afterwards.',
  },
  {
    number: '03',
    title: 'A pilot on real data',
    body: 'The agent learns from your material and runs for a few weeks alongside a person, so the results can be compared.',
  },
  {
    number: '04',
    title: 'Launch and support',
    body: 'We go live, watch it and keep training it. You see every conversation and can switch it off at any time.',
  },
];

export const TERMS: { title: string; body: string }[] = [
  {
    title: 'Who owns the solution?',
    body: 'After the final payment the code, the configuration and the project data are yours.',
  },
  {
    title: 'How does payment work?',
    body: 'In stages, against an invoice. The exact schedule is written into the quote.',
  },
  {
    title: 'What if the scope changes?',
    body: 'If new requirements appear, we first tell you how they affect the deadline and the price. Work on them starts only after your go-ahead.',
  },
  {
    title: 'What does support cover?',
    body: 'Monitoring, fixing errors and retraining the agent. The exact scope is written into the quote.',
  },
  {
    title: 'How is data protected?',
    body: 'We sign an NDA where needed. For sensitive data we use local models or infrastructure you control.',
  },
  {
    title: 'What if the AI gets it wrong?',
    body: 'That is why every project starts with a pilot that measures accuracy. Systems are designed so a person can check the result before it is used for an important decision.',
  },
];

export const PLANS: Plan[] = [
  {
    name: 'Pilot',
    pitch: 'A bounded project that tests whether the idea works on real data, before you invest in the full build.',
    price: 'from €1,500',
    features: [
      'One channel on your real data',
      'Answers with cited sources',
      'A local model if the data is sensitive',
      'Measurement of cases handled and mistakes made',
      'A straight recommendation on whether to continue',
    ],
  },
  {
    name: 'Rollout',
    pitch: 'The agent goes live, wired into your systems, with monitoring and ongoing training.',
    price: 'from €4,000',
    featured: true,
    badge: 'Most chosen',
    features: [
      'Live in real operation',
      'Integrations with CRM, inbox, calendar, chat',
      'A dashboard of conversations and handovers',
      'Retraining on the real cases',
      'Three months of support included',
    ],
  },
  {
    name: 'Support',
    pitch: 'A monthly arrangement for companies where the agent is already part of daily work.',
    price: 'from €400/mo',
    features: [
      'Monitoring and alerts when something breaks',
      'Retraining as new cases appear',
      'A report of what the agent handled',
      'Priority response during an incident',
    ],
  },
];

export const PRICING_PROMO: string | null = null;

export const HIGHLIGHTS: Highlight[] = [
  {
    icon: 'flask',
    title: 'Pilot first, budget after',
    body: 'A small project on real data tests the idea before serious money goes in.',
  },
  {
    icon: 'target',
    title: 'Price and deadline in the quote',
    body: 'Scope, deadline and price on one page. No vague extras later.',
  },
  {
    icon: 'clock',
    title: 'Runs around the clock',
    body: 'Agents take the calls and enquiries in the evening, on Saturday and while the line is busy.',
  },
  {
    icon: 'document',
    title: 'Answers with a source',
    body: 'Every answer points at the document and page it came from, so it can be checked.',
  },
  {
    icon: 'shield',
    title: 'Your data stays yours',
    body: 'For sensitive data the model runs in your own infrastructure and nothing leaves it.',
  },
  {
    icon: 'person',
    title: 'A person stays at the end',
    body: 'The agent stops where judgement begins and hands the case to a human.',
  },
];

export { INTEGRATIONS } from './content.ts';

export const NEEDS = [
  'An AI agent for phone, chat or inbox',
  'AI over our company documents',
  'Automation of a repetitive process',
  'Connecting the systems we run',
  'Training for the team',
  'Not sure yet',
];
