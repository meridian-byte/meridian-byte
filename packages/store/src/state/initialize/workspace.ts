import { useEffect } from 'react';
import { useStoreWorkspace } from '../workspace';
import { generateUUID, getFromLocalStorage, saveToLocalStorage } from '@repo/utils';
import { DEFAULT_NAMES, STORAGE_NAME } from '@repo/constants';
import { useStoreSession } from '../session';
import { SessionCookie, SyncStatus, WorkspaceGet } from '@repo/types';

export const useWorkspaceInitialize = (serverSession: SessionCookie | null) => {
  const session = useStoreSession((s) => s.session);

  const workspaces = useStoreWorkspace((s) => s.workspaces);
  const setWorkspaces = useStoreWorkspace((s) => s.setWorkspaces);

  useEffect(() => {
    if (workspaces === undefined || workspaces === null) return;
    if (workspaces.length > 0) return; // already initialized

    if (session === undefined || session === null) return;
    if (!session?.accounts?.[0]) return;

    const accountId = session.accounts[0].id;

    // --------------------------------------------------
    // Authenticated
    // --------------------------------------------------

    if (serverSession) {
      // Server/entity initialization owns the workspace
      // collection for authenticated users.
      //
      // If the workspaces have already been populated,
      // there is nothing for this hook to initialize.
      // if (workspaces.length > 0) return;

      return;
    }

    // --------------------------------------------------
    // Unauthenticated
    // --------------------------------------------------

    let storedWorkspaces = getFromLocalStorage(STORAGE_NAME.WORKSPACES) as WorkspaceGet[] | null;

    // Restore only workspaces belonging to this
    // anonymous account.
    const localWorkspaces =
      storedWorkspaces?.filter((workspace) => workspace.accountId === accountId) ?? [];

    if (localWorkspaces.length > 0) {
      setWorkspaces(localWorkspaces);
      return;
    }

    // No local workspaces yet → create the default one.
    const now = new Date().toISOString();

    const workspace: WorkspaceGet = {
      id: generateUUID(),
      name: DEFAULT_NAMES.WORKSPACE,
      accountId,
      syncStatus: SyncStatus.SYNCED,
      createdAt: now as any,
      updatedAt: now as any,
    };

    setWorkspaces([workspace]);

    saveToLocalStorage(STORAGE_NAME.WORKSPACES, [workspace]);
  }, [session, serverSession, workspaces, setWorkspaces]);
};
