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
  useLoadAppData,
  useUserStatesStore,
} from '@repo/hooks/store';
import { User } from '@supabase/supabase-js';
import { AppShellValue } from '@repo/libraries/zustand/stores/shell';

export default function Store({
  props,
  children,
}: {
  props?: { sessionUser: User | null; cookie?: AppShellValue };
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

  useLoadAppData({
    clientOnly: false,
    storesToLoad: {
      notes: true,
    },
  });

  useUserStatesStore();

  return <div>{children}</div>;
}
