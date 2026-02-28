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
import { User } from '@supabase/supabase-js';

export default function Store({
  props,
  children,
}: {
  props?: { sessionUser: User | null };
  children: React.ReactNode;
}) {
  // initialize stores

  useSessionStore({
    sessionUser: props?.sessionUser || null,
    options: { clientOnly: false },
  });
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
