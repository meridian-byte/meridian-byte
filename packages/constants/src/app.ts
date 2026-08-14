/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

export const COMPANY_NAME = 'MeridianByte';

export const PHONES = {
  MAIN: '(254) 123 456-789',
};

export const EMAILS = {
  DEV: process.env.NEXT_PUBLIC_EMAIL_DEV,
  DELIVERY: process.env.NEXT_PUBLIC_EMAIL_DELIVERY,
  NO_REPLY: process.env.NEXT_PUBLIC_EMAIL_NOREPLY,
  INFO: process.env.NEXT_PUBLIC_EMAIL_INFO,
  SUPPORT: process.env.NEXT_PUBLIC_EMAIL_SUPPORT,
  NEWSLETTER: process.env.NEXT_PUBLIC_EMAIL_NEWSLETTER,
};

export const BUSINESS_HOURS = {
  DAYS: 'Mon - Fri',
  TIMES: '8 AM - 5 PM',
};

export const LOCATIONS = {
  MAIN: {
    LOCATION: '410 Terry Ave. North, Seattle, WA 98109',
    PIN: '#map-pin',
  },
};

export const SOCIALS = {
  X: {
    label: `X`,
    link: '#twitter',
  },
  FB: {
    label: `Facebook`,
    link: '#facebook',
  },
  IG: {
    label: `Instagram`,
    link: '#instagram',
  },
  LI: {
    label: `LinkedIn`,
    link: '#linkedin',
  },
};

export const APP_NAME = {
  API: `${COMPANY_NAME} Server`,
  WEB: COMPANY_NAME,
  ATLAS: `${COMPANY_NAME} Atlas`,
};

export const APP_NAMES_ATLAS = {
  PAVE: 'Pave',
  JOT: 'Jot',
  STRIDE: 'Stride',
  PRIME: 'Prime',
  TALLY: 'Tally',
};

export const SUBVIEW_NAMES = {
  PAVE: {
    HOME: `home`,
    DAY: `day`,
    WEEK: `week`,
    MONTH: `month`,
    YEAR: `year`,
  },
  JOT: {
    HOME: `home`,
  },
  STRIDE: {
    HOME: `home`,
    INBOX: `inbox`,
    TODAY: `today`,
    UPCOMING: `upcoming`,
    OVERDUE: `overdue`,
    COMPLETE: `complete`,
  },
};

export const ASIDE_VIEW_NAMES = {
  NEW: {
    ITEM: 'new',
    PAVE: {
      ITEM: 'new-pave-item',
      EVENT: 'new-event',
      CALENDAR: 'new-calendar',
    },
    JOT: {
      ITEM: 'new-jot-item',
      NOTE: 'new-note',
      FOLDER: 'new-folder',
    },
    STRIDE: {
      ITEM: 'new-stride-item',
      TASK: 'new-task',
      TASK_LIST: 'new-task-list',
    },
  },
};

export const MODAL_VIEW_NAMES = {
  SEARCH: 'search',
  CRUD: {
    PAVE: {
      CALENDAR: {
        UPDATE: 'crud-calendar-update',
        DELETE: 'crud-calendar-delete',
      },
    },
    JOT: {
      NOTE: {
        UPDATE: 'crud-note-update',
        DELETE: 'crud-note-delete',
      },
      FOLDER: {
        UPDATE: 'crud-folder-update',
        DELETE: 'crud-folder-delete',
      },
    },
    STRIDE: {
      TASK_LIST: {
        UPDATE: 'crud-task-list-update',
        DELETE: 'crud-task-list-delete',
      },
    },
  },
};

export const APP_DESC = {
  API: 'The MeridianByte API layer provides centralized business capabilities, data access, authentication, and communication patterns used across MeridianByte products.',
  WEB: 'This application provides the entry point for users, customers, and visitors to discover MeridianByte products, learn about solutions, and begin their journey into the ecosystem.',
  ATLAS:
    'Discover Atlas by Meridianbyte, an open-source productivity suite unifying notes, tasks, time tracking, fitness, and finance into a single, cohesive ecosystem.',
};
