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
import { useStorePost } from '@/libraries/zustand/stores/post';
import { useStoreCategory } from '@/libraries/zustand/stores/category';
import { SyncParams } from '@repo/types/sync';

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
