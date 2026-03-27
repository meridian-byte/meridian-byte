/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { APP_NAME } from '@/data/constants';
import { STORE_NAME } from '@repo/constants/names';
import { DBConfig } from '@repo/types/indexed-db';

export const config: DBConfig = {
  name: APP_NAME.toLowerCase(),
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
      name: STORE_NAME.CATEGORIES,
      keyPath: 'id',
    },
  ],
};
