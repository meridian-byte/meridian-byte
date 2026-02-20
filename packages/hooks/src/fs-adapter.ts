'use client';

import { defaultBackupConfig } from '@repo/libraries/fsa';
import { config } from '@repo/libraries/indexed-db/config';
import { useStoreAccount } from '@repo/libraries/zustand/stores/account';
import { useStoreAccountGroup } from '@repo/libraries/zustand/stores/account-group';
import { useStoreBudget } from '@repo/libraries/zustand/stores/budget';
import { useStoreCategory } from '@repo/libraries/zustand/stores/category';
import { useStoreTransaction } from '@repo/libraries/zustand/stores/transaction';
import { useDebouncedCallback } from '@mantine/hooks';
import { createFileSyncAdapter } from '@repo/libraries/fsa/handler';
import { openDatabase } from '@repo/libraries/indexed-db/actions';
import { FileSyncAdapter } from '@repo/types/fsa';
import { useEffect, useState } from 'react';

type BackupHandleRecord = {
  id: 'backupHandle';
  handle: FileSystemDirectoryHandle; // directory-based
};

export function useFileSyncAdapter() {
  const [handle, setHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [adapter, setAdapter] = useState<FileSyncAdapter | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean>(false);

  // Load previously saved directory handle
  useEffect(() => {
    (async () => {
      const db = await openDatabase(config);
      const saved = (await db.get('settings', 'backupDir')) as
        | BackupHandleRecord
        | undefined;

      if (!saved?.handle) {
        setHasAccess(false);
        return;
      }

      const perm = await (saved.handle as any).queryPermission({
        mode: 'readwrite',
      });
      if (perm === 'granted') {
        setHandle(saved.handle);
        setAdapter(
          createFileSyncAdapter(saved.handle, defaultBackupConfig.suggestedName)
        );
        setHasAccess(true);
      } else {
        setHandle(saved.handle);
        setAdapter(null);
        setHasAccess(false);
      }
    })();
  }, []);

  // Request directory access from user
  const requestDirHandle = async () => {
    const chosenDir = await (window as any).showDirectoryPicker();
    const db = await openDatabase(config);
    await db.put('settings', { id: 'backupDir', handle: chosenDir });

    setHandle(chosenDir);
    const newAdapter = createFileSyncAdapter(
      chosenDir,
      defaultBackupConfig.suggestedName
    );
    setAdapter(newAdapter);
    setHasAccess(true);
    return newAdapter;
  };

  const clearHandle = async () => {
    const db = await openDatabase(config);
    await db.delete('settings', { id: 'backupDir' } as any).catch(() => {});
    setHandle(null);
    setAdapter(null);
    setHasAccess(false);
  };

  return {
    fileSyncAdapter: adapter,
    requestDirHandle,
    clearHandle,
    hasHandle: !!handle,
    hasAccess,
    /**
     * Usage:
     * - hasHandle && !hasAccess → show “Restore access” button → requestDirHandle()
     * - !hasHandle → show “Enable Local Backup” button → requestDirHandle()
     */
  };
}

export function useBundledBackupSync({ clientOnly }: { clientOnly: boolean }) {
  const { fileSyncAdapter, hasHandle, hasAccess } = useFileSyncAdapter();
  const accounts = useStoreAccount((s) => s.accounts);
  const accountGroups = useStoreAccountGroup((s) => s.accountGroups);
  const budgets = useStoreBudget((s) => s.budgets);
  const categories = useStoreCategory((s) => s.categories);
  const transactions = useStoreTransaction((s) => s.transactions);

  const debouncedFsWrite = useDebouncedCallback(async () => {
    if (!fileSyncAdapter) return;
    const bundle = {
      accounts,
      accountGroups,
      budgets,
      categories,
      transactions,
    };
    await fileSyncAdapter.writeBackup(bundle); // atomic write internally
  }, 3000);

  useEffect(() => {
    if (!clientOnly || !fileSyncAdapter) return;
    if (!fileSyncAdapter || !hasHandle || !hasAccess) return; // show an in-app banner and stop trying until user action

    debouncedFsWrite();
  }, [
    clientOnly,
    fileSyncAdapter,
    debouncedFsWrite,
    hasAccess,
    hasHandle,
    accounts,
    accountGroups,
    budgets,
    categories,
    transactions,
  ]);
}
