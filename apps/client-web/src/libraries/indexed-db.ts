/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { appName } from '@repo/constants/app';
import { STORE_NAME } from '@repo/constants/names';
import { DBConfig } from '@repo/types/indexed-db';

export const config: DBConfig = {
  name: appName.toLowerCase(),
  version: 1,
  stores: [
    {
      name: STORE_NAME.SETTINGS,
      keyPath: 'id',
    },
    {
      name: STORE_NAME.POSTS,
      keyPath: 'id',
      indexes: [{ name: 'by_categoryId', keyPath: 'category_id' }],
    },
    {
      name: STORE_NAME.CATEGORIES,
      keyPath: 'id',
    },
  ],
};
