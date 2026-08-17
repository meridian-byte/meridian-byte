/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { COMPANY_NAME } from '@repo/constants';
import { STORE_NAME } from '@repo/constants';
import { DBConfig } from '@repo/types';
import { linkify } from '@repo/utils';

export const config: DBConfig = {
  name: linkify(COMPANY_NAME),
  version: 4,
  stores: [
    // {
    //   name: STORE_NAME.SETTINGS,
    //   keyPath: 'id',
    // },
    {
      name: STORE_NAME.WORKSPACES,
      keyPath: 'id',
    },

    // Pave
    {
      name: STORE_NAME.CALENDARS,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.EVENTS,
      keyPath: 'id',
    },

    // Jot
    {
      name: STORE_NAME.NOTES,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.LINKS,
      keyPath: 'id',
    },

    // Stride
    {
      name: STORE_NAME.TASK_LISTS,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.RECURRING_RULES,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.TASKS,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.REMINDERS,
      keyPath: 'id',
    },
    // {
    //   name: STORE_NAME.VIEWS,
    //   keyPath: 'id',
    // },
    // {
    //   name: STORE_NAME.NOTIFICATIONS,
    //   keyPath: 'id',
    // },

    // {
    //   name: STORE_NAME.ACCOUNTS,
    //   keyPath: 'id',
    // },
    // {
    //   name: STORE_NAME.ACCOUNT_GROUPS,
    //   keyPath: 'id',
    // },
    // {
    //   name: STORE_NAME.BUDGETS,
    //   keyPath: 'id',
    // },
    // {
    //   name: STORE_NAME.TRANSACTIONS,
    //   keyPath: 'id',
    // },

    // {
    //   name: STORE_NAME.FOODS,
    //   keyPath: 'id',
    // },
    // {
    //   name: STORE_NAME.MEALS,
    //   keyPath: 'id',
    // },
    // {
    //   name: STORE_NAME.SERVINGS,
    //   keyPath: 'id',
    // },
    // {
    //   name: STORE_NAME.EATS,
    //   keyPath: 'id',
    // },
    // {
    //   name: STORE_NAME.MASSES,
    //   keyPath: 'id',
    // },

    // {
    //   name: STORE_NAME.CHATS,
    //   keyPath: 'id',
    // },
    // {
    //   name: STORE_NAME.CHAT_MESSAGES,
    //   keyPath: 'id',
    // },
    // {
    //   name: STORE_NAME.CUSTOMIZATIONS,
    //   keyPath: 'id',
    // },
  ],
};
