/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { useCallback, useEffect } from 'react';
import { STORE_NAME } from '@repo/constants/names';
import { postsUpdate } from '@repo/handlers/requests/database/posts';
import { categoriesUpdate } from '@repo/handlers/requests/database/category';
import { useStorePost } from '@repo/libraries/zustand/stores/post';
import { useStoreCategory } from '@repo/libraries/zustand/stores/category';
import { SyncParams } from '@repo/types/sync';
import { useStoreNote } from '@repo/libraries/zustand/stores/note';
import { notesUpdate } from '@repo/handlers/requests/database/notes';
import { useStoreNotebook } from '@repo/libraries/zustand/stores/notebook';
import { notebooksUpdate } from '@repo/handlers/requests/database/notebooks';
import { useStoreLink } from '@repo/libraries/zustand/stores/link';
import { linksUpdate } from '@repo/handlers/requests/database/links';

export const useSyncPosts = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { syncFunction, online } = params;

  const {
    posts,
    deleted: deletedPosts,
    setPosts,
    clearDeletedPosts,
  } = useStorePost();

  const syncPosts = useCallback(() => {
    syncFunction({
      items: posts || [],
      deletedItems: deletedPosts,
      dataStore: STORE_NAME.POSTS,
      stateUpdateFunctionDeleted: () => clearDeletedPosts(),
      stateUpdateFunction: (i) => setPosts(i),
      serverUpdateFunction: async (i, di) => await postsUpdate(i, di),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts, deletedPosts, setPosts, clearDeletedPosts]);

  useEffect(() => syncPosts(), [posts, syncPosts, online]);

  return { syncPosts };
};

export const useSyncCategories = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { syncFunction, online } = params;

  const {
    categories,
    deleted: deletedCategories,
    setCategories,
    clearDeletedCategories,
  } = useStoreCategory();

  const syncCategories = useCallback(() => {
    syncFunction({
      items: categories || [],
      deletedItems: deletedCategories,
      dataStore: STORE_NAME.CATEGORIES,
      stateUpdateFunctionDeleted: () => clearDeletedCategories(),
      stateUpdateFunction: (i) => setCategories(i),
      serverUpdateFunction: async (i, di) => await categoriesUpdate(i, di),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, deletedCategories, setCategories, clearDeletedCategories]);

  useEffect(() => syncCategories(), [categories, syncCategories, online]);

  return { syncCategories };
};

export const useSyncNotes = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { syncFunction, online } = params;

  const {
    notes,
    deleted: deletedNotes,
    setNotes,
    clearDeletedNotes,
  } = useStoreNote();

  const syncNotes = useCallback(() => {
    syncFunction({
      items: notes || [],
      deletedItems: deletedNotes,
      dataStore: STORE_NAME.NOTES,
      stateUpdateFunctionDeleted: () => clearDeletedNotes(),
      stateUpdateFunction: (i) => setNotes(i),
      serverUpdateFunction: async (i, di) => await notesUpdate(i, di),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes, deletedNotes, setNotes, clearDeletedNotes]);

  useEffect(() => syncNotes(), [notes, syncNotes, online]);

  return { syncNotes };
};

export const useSyncNotebooks = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { syncFunction, online } = params;

  const {
    notebooks,
    deleted: deletedNotebooks,
    setNotebooks,
    clearDeletedNotebooks,
  } = useStoreNotebook();

  const syncNotebooks = useCallback(() => {
    syncFunction({
      items: notebooks || [],
      deletedItems: deletedNotebooks,
      dataStore: STORE_NAME.NOTEBOOKS,
      stateUpdateFunctionDeleted: () => clearDeletedNotebooks(),
      stateUpdateFunction: (i) => setNotebooks(i),
      serverUpdateFunction: async (i, di) => await notebooksUpdate(i, di),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notebooks, deletedNotebooks, setNotebooks, clearDeletedNotebooks]);

  useEffect(() => syncNotebooks(), [notebooks, syncNotebooks, online]);

  return { syncNotebooks };
};

export const useSyncLinks = (params: {
  syncFunction: (input: SyncParams) => void;
  online: boolean;
}) => {
  const { syncFunction, online } = params;

  const {
    links,
    deleted: deletedLinks,
    setLinks,
    clearDeletedLinks,
  } = useStoreLink();

  const syncLinks = useCallback(() => {
    syncFunction({
      items: links || [],
      deletedItems: deletedLinks,
      dataStore: STORE_NAME.LINKS,
      stateUpdateFunctionDeleted: () => clearDeletedLinks(),
      stateUpdateFunction: (i) => setLinks(i),
      serverUpdateFunction: async (i, di) => await linksUpdate(i, di),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [links, deletedLinks, setLinks, clearDeletedLinks]);

  useEffect(() => syncLinks(), [links, syncLinks, online]);

  return { syncLinks };
};
