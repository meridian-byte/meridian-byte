'use client';

/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import { useSessionStore, useStoreData } from '@/hooks/store';

export default function Store({ children }: { children: React.ReactNode }) {
  // initialize stores

  useSessionStore({ options: { clientOnly: true } });
  // useUserRoleStore();
  // useAppshellStore();
  useStoreData();

  return <div>{children}</div>;
}
