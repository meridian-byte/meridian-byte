import { defaultBackupConfig } from '@/libraries/fsa';
import { config } from '@/libraries/indexed-db';
import { useStoreCategory } from '@/libraries/zustand/stores/category';
import { useStorePost } from '@/libraries/zustand/stores/post';
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

      const perm = await saved.handle.queryPermission({ mode: 'readwrite' });
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
    const chosenDir = await window.showDirectoryPicker();
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
  const { posts } = useStorePost();
  const { categories } = useStoreCategory();

  const debouncedFsWrite = useDebouncedCallback(async () => {
    if (!fileSyncAdapter) return;
    const bundle = { posts, categories };
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
    posts,
    categories,
  ]);
}
