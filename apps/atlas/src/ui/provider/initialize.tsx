'use client';

import React from 'react';
import {
  useActiveItemInitialize,
  useAppshellInitialize,
  useLoadAppData,
  useNetworkInitialize,
  useSessionInitialize,
  useStoreNetwork,
  useUserStatesStore,
  useViewInitialize,
  useWorkspaceInitialize,
} from '@repo/store';
import { SessionCookie } from '@repo/types';
import { STORE_NAME } from '@repo/constants';

export default function Initialize({
  props,
  children,
}: {
  props: {
    baseUrl: string;
    session: SessionCookie | null;
  };
  children: React.ReactNode;
}) {
  // initialize stores

  useNetworkInitialize();

  const network = useStoreNetwork((s) => s.network);
  const isOnline = network?.online ?? false;

  useSessionInitialize(props.session || null);

  useWorkspaceInitialize(props.session);

  // useUserRoleStore();

  useAppshellInitialize();

  useViewInitialize();

  useActiveItemInitialize();

  useUserStatesStore();

  useLoadAppData({
    sourceSite: 'atlas',
    apiUrl: props.baseUrl,
    clientOnly: !props.session || !isOnline,
    storesToLoad: STORES_TO_LOAD,
  });

  return <div>{children}</div>;
}

const STORES_TO_LOAD = {
  [STORE_NAME.ACCOUNTS]: true,

  [STORE_NAME.WORKSPACES]: true,

  [STORE_NAME.FOLDERS]: true,

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
