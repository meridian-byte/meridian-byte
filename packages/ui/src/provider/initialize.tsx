'use client';

/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import {
  useActiveItemStore,
  useAppshellInitialize,
  useLoadAppData,
  useSessionStore,
  useUserStatesStore,
  useViewInitialize,
} from '@repo/store';
import { UserObject } from '@repo/types';
import { AppShellValue } from '@repo/store';
import { STORE_NAME } from '@repo/constants';

export function ProviderInitialize({
  props,
  children,
}: {
  props: {
    baseUrl: string;
    sessionUser: UserObject | null;
    cookie?: AppShellValue;
  };
  children: React.ReactNode;
}) {
  // initialize stores

  useSessionStore({
    sessionUser: props?.sessionUser || null,
    options: { clientOnly: false },
  });

  // useUserRoleStore();

  useAppshellInitialize();

  useViewInitialize();

  useActiveItemStore();

  useLoadAppData({
    apiUrl: props.baseUrl,
    clientOnly: false,
    storesToLoad: STORES_TO_LOAD,
  });

  useUserStatesStore();

  return <div>{children}</div>;
}

const STORES_TO_LOAD = {
  [STORE_NAME.WORKSPACES]: true,

  // Pave
  [STORE_NAME.CALENDARS]: true,
  [STORE_NAME.EVENTS]: true,

  // Jot
  [STORE_NAME.NOTES]: true,
  // [STORE_NAME.LINKS]: true,

  // Stride
  [STORE_NAME.TASK_LISTS]: true,
  // [STORE_NAME.RECURRING_RULES]: true,
  [STORE_NAME.TASKS]: true,
  // [STORE_NAME.REMINDERS]: true,
};
