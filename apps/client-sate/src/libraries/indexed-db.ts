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
  name: linkify(APP_NAME),
  version: 2,
  stores: [
    {
      name: STORE_NAME.SETTINGS,
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
  ],
};
