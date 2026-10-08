'use client';

import { useEffect } from 'react';
import { DEFAULT_NAMES, STORAGE_NAME } from '@repo/constants';
import {
  generateUUID,
  getFromLocalStorage,
  getFromSessionStorage,
  saveToLocalStorage,
  saveToSessionStorage,
} from '@repo/utils';
import { useStoreActiveItems } from '../active-items';
import { useStoreWorkspace } from '../workspace';
import { AccountGet, SyncStatus, WorkspaceGet } from '@repo/types';
import { useStoreAccount } from '../account';
import { useStoreSession } from '../session';

export const useActiveItemInitialize = () => {
  const session = useStoreSession((s) => s.session);

  const accounts = useStoreAccount((s) => s.accounts);
  const workspaces = useStoreWorkspace((s) => s.workspaces);

  const setAccounts = useStoreAccount((s) => s.setAccounts);
  const setActiveItems = useStoreActiveItems((s) => s.setActiveItems);

  useEffect(() => {
    if (accounts === undefined) return;
    if (accounts === null) return;

    if (workspaces === undefined) return;
    if (workspaces === null) return;

    if (session === undefined) return;
    if (session === null) return;
    if (!session?.accounts?.[0]) return;

    const sessionAccount = session.accounts[0];

    // --------------------------------------------------
    // Account
    // --------------------------------------------------

    const account = accounts.find((item) => item.id === sessionAccount.id) ?? sessionAccount;

    // The session already owns the account data, but make
    // sure the account entity store has it too.
    if (!accounts.some((item) => item.id === account.id)) {
      setAccounts([...accounts, account]);
    }

    // --------------------------------------------------
    // Workspace
    // --------------------------------------------------

    // WorkspaceInitialize is responsible for creating /
    // restoring the workspace collection.
    const accountWorkspaces = workspaces.filter((workspace) => workspace.accountId === account.id);

    if (accountWorkspaces.length === 0) return;

    // --------------------------------------------------
    // Resolve active workspace for this tab
    // --------------------------------------------------

    let activeWorkspace = getFromSessionStorage(
      STORAGE_NAME.ACTIVE.WORKSPACE,
    ) as WorkspaceGet | null;

    // The stored workspace must still exist and belong
    // to the current account.
    if (
      !activeWorkspace ||
      activeWorkspace.accountId !== account.id ||
      !accountWorkspaces.some((workspace) => workspace.id === activeWorkspace!.id)
    ) {
      activeWorkspace = accountWorkspaces[0]!;
    }

    // --------------------------------------------------
    // Persist per-tab active selections
    // --------------------------------------------------

    saveToSessionStorage(STORAGE_NAME.ACTIVE.ACCOUNT, account);

    saveToSessionStorage(STORAGE_NAME.ACTIVE.WORKSPACE, activeWorkspace);

    // --------------------------------------------------
    // Active Zustand state
    // --------------------------------------------------

    const currentActive = useStoreActiveItems.getState().activeItems || {};

    const accountChanged = currentActive.account?.id !== account.id;

    const workspaceChanged = currentActive.workspace?.id !== activeWorkspace.id;

    if (accountChanged || workspaceChanged) {
      setActiveItems({
        ...currentActive,
        account,
        workspace: activeWorkspace,
      });
    }
  }, [session, accounts, workspaces, setAccounts, setActiveItems]);
};
