'use client';

/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import {
  useAppshellStore,
  useSessionStore,
  useThemeStore,
  useLoadStores,
} from '@repo/hooks/store';

export default function Store({ children }: { children: React.ReactNode }) {
  // initialize stores

  useSessionStore({ options: { clientOnly: true } });
  // useUserRoleStore();
  useThemeStore();
  useAppshellStore();
  useLoadStores({
    options: {
      clientOnly: true,
      storesToLoad: {
        transactions: true,
        accounts: true,
        accountGroups: true,
        categories: true,
      },
    },
  });

  return <div>{children}</div>;
}
