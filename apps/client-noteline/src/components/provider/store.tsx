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
  useLoadAppData,
  useActiveItemStore,
  useUserStatesStore,
} from '@repo/hooks/store';
import { User } from '@supabase/supabase-js';
import { AppShellValue } from '@repo/libraries/zustand/stores/shell';
import { WorkspaceType } from '@repo/types/models/enums';

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
  useAppshellStore();
  useActiveItemStore({ workspaceType: WorkspaceType.NOTELINE });

  useLoadAppData({
    clientOnly: false,
    storesToLoad: {
      workspaces: true,
      notes: true,
    },
  });

  useUserStatesStore();

  return <div>{children}</div>;
}
