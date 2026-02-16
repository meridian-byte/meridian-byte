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
  useStoreData,
  useUserStatesStore,
} from '@/hooks/store';
import { useThemeStore } from '../../hooks/store';

export default function Store({ children }: { children: React.ReactNode }) {
  // initialize stores

  useSessionStore({ options: { clientOnly: false } });
  // useUserRoleStore();
  useThemeStore();
  useAppshellStore();
  useUserStatesStore();
  useStoreData({ options: { clientOnly: false } });

  return <div>{children}</div>;
}
