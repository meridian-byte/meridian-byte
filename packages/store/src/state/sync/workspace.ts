import { useEffect } from 'react';
import { useStoreWorkspace } from '../workspace';
import { getFromLocalStorage, saveToLocalStorage } from '@repo/utils';
import { STORAGE_NAME } from '@repo/constants';
import { SessionCookie, WorkspaceGet } from '@repo/types';
import { useStoreSession } from '../session';

export const useWorkspaceSync = (serverSession: SessionCookie | null) => {
  const session = useStoreSession((s) => s.session);
  const workspaces = useStoreWorkspace((s) => s.workspaces);

  useEffect(() => {
    if (workspaces === undefined || workspaces === null) return;
    if (!workspaces.length) return; // nothing to sync
    if (session === undefined || session === null) return;
    if (!session?.accounts?.[0]) return;

    // Authenticated workspaces are server-backed.
    // Do not persist them as anonymous local data.
    if (serverSession) return;

    // --------------------------------------------------
    // Unauthenticated
    // --------------------------------------------------

    const accountId = session.accounts[0].id;

    const localWorkspaces = getFromLocalStorage(STORAGE_NAME.WORKSPACES) as WorkspaceGet[] | null;

    const otherAccountWorkspaces =
      localWorkspaces?.filter((workspace) => workspace.accountId !== accountId) ?? [];

    const currentAccountWorkspaces = workspaces.filter(
      (workspace) => workspace.accountId === accountId,
    );

    saveToLocalStorage(STORAGE_NAME.WORKSPACES, [
      ...otherAccountWorkspaces,
      ...currentAccountWorkspaces,
    ]);
  }, [session, serverSession, workspaces]);
};
