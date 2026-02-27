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
  useUserStatesStore,
} from '@repo/hooks/store';

export default function Store({ children }: { children: React.ReactNode }) {
  // initialize stores

  useSessionStore({ options: { clientOnly: false } });
  // useUserRoleStore();
  useThemeStore();
  useAppshellStore();
  useLoadStores({
    options: {
      clientOnly: false,
      storesToLoad: {
        notes: true,
      },
    },
  });

  useUserStatesStore();

  return <div>{children}</div>;
}
