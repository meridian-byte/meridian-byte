'use client';

import { useEffect, useRef } from 'react';
import { DEFAULT_NAMES, LOCAL_STORAGE_NAME } from '@repo/constants';
import {
  getFromLocalStorage,
  getFromSessionStorage,
  saveToLocalStorage,
  saveToSessionStorage,
} from '@repo/utils';
import { useStoreActiveItems } from '../active-items';
import { useStoreWorkspace } from '../workspace';
import { useWorkspaceActions } from '../actions/workspace';
import { WorkspaceGet } from '@repo/types';

export const useActiveItemStore = () => {
  const workspaces = useStoreWorkspace((s) => s.workspaces);
  const { workspaceCreate } = useWorkspaceActions();
  const setActiveItems = useStoreActiveItems((s) => s.setActiveItems);

  const isInitializing = useRef(false);

  useEffect(() => {
    const initializeUserState = () => {
      if (isInitializing.current || !workspaces) return;
      isInitializing.current = true;

      // get active workspace
      const getActiveWorkspace = (): WorkspaceGet | null => {
        if (workspaces === undefined) return null;
        if (workspaces === null) return null;

        let workingId: string | null = null;

        // get active workspace id from session storage
        const activeSessionWorkspaceId = getFromSessionStorage(LOCAL_STORAGE_NAME.ACTIVE_WORKSPACE);

        if (!activeSessionWorkspaceId) {
          // get active workspace id from local storage
          const activeLocalWorkspaceId = getFromLocalStorage(LOCAL_STORAGE_NAME.ACTIVE_WORKSPACE);

          if (activeLocalWorkspaceId) {
            workingId = activeLocalWorkspaceId;
          }
        } else {
          workingId = activeSessionWorkspaceId;
        }

        if (!workingId) {
          let selectedWorkspace: WorkspaceGet | null = null;

          if (!workspaces.length) {
            // create default workspace
            const newDefaultWorkspace = workspaceCreate({
              name: DEFAULT_NAMES.WORKSPACE,
            });

            selectedWorkspace = newDefaultWorkspace || null;
          } else {
            // find default workspace
            const defaultWorkspace = workspaces.find((wi) => {
              return wi.name == DEFAULT_NAMES.WORKSPACE;
            });

            selectedWorkspace = defaultWorkspace || null;
          }

          if (selectedWorkspace) {
            saveToSessionStorage(LOCAL_STORAGE_NAME.ACTIVE_WORKSPACE, selectedWorkspace.id);

            saveToLocalStorage(LOCAL_STORAGE_NAME.ACTIVE_WORKSPACE, selectedWorkspace.id);
          }

          return selectedWorkspace;
        } else {
          // find active workspace from store
          const activeLocalWorkspace = workspaces.find((wi) => wi.id == workingId);

          return activeLocalWorkspace || null;
        }
      };

      setActiveItems({ workspace: getActiveWorkspace() });
    };

    initializeUserState();
  }, [setActiveItems, workspaces]);
};
