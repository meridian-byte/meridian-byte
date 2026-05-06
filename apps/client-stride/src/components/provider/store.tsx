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
} from '@repo/hooks/store';
import { User } from '@supabase/supabase-js';
import { WorkspaceType } from '@repo/types/models/enums';

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
  useAppshellStore();
  useActiveItemStore({ workspaceType: WorkspaceType.STRIDE });
  useLoadAppData({
    clientOnly: false,
    storesToLoad: {
      tasks: true,
      categories: true,
      reminders: true,
      recurringRules: true,
      views: true,
      workspaces: true,
    },
  });

  return <div>{children}</div>;
}
