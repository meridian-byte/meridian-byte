'use client';

import React from 'react';
import {
  useActiveItemStore,
  useAppshellInitialize,
  useLoadAppData,
  useNetworkInitialize,
  useSessionStore,
  useStoreNetwork,
  useUserStatesStore,
  useViewInitialize,
} from '@repo/store';
import { UserObject } from '@repo/types';
import { AppShellValue } from '@repo/store';
import { STORE_NAME } from '@repo/constants';

export default function Initialize({
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
  const network = useStoreNetwork((s) => s.network);
  const isOnline = network?.online ?? false;

  useNetworkInitialize();

  useSessionStore({
    sessionUser: props?.sessionUser || null,
    options: {
      clientOnly: !isOnline,
    },
  });

  // useUserRoleStore();

  useAppshellInitialize();

  useViewInitialize();

  useActiveItemStore();

  useLoadAppData({
    sourceSite: 'atlas',
    apiUrl: props.baseUrl,
    clientOnly: !isOnline,
    storesToLoad: STORES_TO_LOAD,
  });

  useUserStatesStore();

  return <div>{children}</div>;
}

const STORES_TO_LOAD = {
  [STORE_NAME.FOLDERS]: true,
  [STORE_NAME.WORKSPACES]: true,
  [STORE_NAME.RECURRING_RULES]: true,
  [STORE_NAME.REMINDERS]: true,

  // Pave
  [STORE_NAME.CALENDARS]: true,
  [STORE_NAME.EVENTS]: true,

  // Jot
  [STORE_NAME.NOTES]: true,
  // [STORE_NAME.LINKS]: true,

  // Stride
  [STORE_NAME.TASK_LISTS]: true,
  [STORE_NAME.TASKS]: true,
};
