'use client';

import { useEffect } from 'react';
import { useStoreView, ViewValue } from '../../state/view';
import { getFromSessionStorage, saveToSessionStorage } from '@repo/utils';
import { SESSION_STORAGE_NAME } from '@repo/constants';

interface UseViewInitializeParams {
  initialView?: ViewValue;
}

export const useViewInitialize = (params?: UseViewInitializeParams) => {
  const view = useStoreView((s) => s.view);
  const setView = useStoreView((s) => s.setView);

  // 1. Initialization Effect
  useEffect(() => {
    const sessionData = getFromSessionStorage(SESSION_STORAGE_NAME.VIEW);

    // Establish base defaults:
    // Priorities: 1. Passed params -> 2. Session Storage -> 3. Fallback default
    const resolvedView: ViewValue = params?.initialView ??
      sessionData ?? {
        view: null,
        subView: null,
        asideView: null,
      };

    // Sync to store
    setView(resolvedView);

    // Sync to sessionStorage
    saveToSessionStorage(SESSION_STORAGE_NAME.VIEW, resolvedView);

    // We only want this to run once on component mount
  }, [setView]);

  // 2. Persistence Effect (Syncs store changes to sessionStorage)
  useEffect(() => {
    // Skip if the store hasn't been initialized yet
    if (view === undefined) return;

    saveToSessionStorage(SESSION_STORAGE_NAME.VIEW, view);
  }, [view]);
};
