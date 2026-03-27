/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { COMPANY_NAME } from '@repo/constants/app';
import { STORE_NAME } from '@repo/constants/names';
import { DBConfig } from '@repo/types/indexed-db';
import { linkify } from '@repo/utilities/url';

export const config: DBConfig = {
  name: linkify(COMPANY_NAME),
  version: 1,
  stores: [
    {
      name: STORE_NAME.SETTINGS,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.ACCOUNTS,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.ACCOUNT_GROUPS,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.BUDGETS,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.CATEGORIES,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.TRANSACTIONS,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.NOTES,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.LINKS,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.FOODS,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.MEALS,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.SERVINGS,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.EATS,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.MASSES,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.CHATS,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.CHAT_MESSAGES,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.CUSTOMIZATIONS,
      keyPath: 'id',
    },
  ],
};
