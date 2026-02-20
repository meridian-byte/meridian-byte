import { useStoreCategory } from '@repo/libraries/zustand/stores/category';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { CategoryGet } from '@repo/types/models/category';
import { CategoryType, Status, SyncStatus } from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';

export const useCategoryActions = () => {
  const session = useStoreSession((s) => s.session);
  const addCategory = useStoreCategory((s) => s.addCategory);
  const updateCategory = useStoreCategory((s) => s.updateCategory);
  const deleteCategory = useStoreCategory((s) => s.deleteCategory);

  const categoryCreate = (params: Partial<CategoryGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newCategory: CategoryGet = {
      id: params.id || id,
      title: params.title || '',
      type: params.type || CategoryType.DEBIT,
      profile_id: session.id || params.profile_id || '',
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at || now).toISOString() as any,
      updated_at: new Date(params.updated_at || now).toISOString() as any,
    };

    addCategory(newCategory);
  };

  const categoryUpdate = (params: CategoryGet) => {
    if (!session) return;

    const now = new Date();

    const newCategory: CategoryGet = {
      ...params,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    };

    updateCategory(newCategory);
  };

  const categoryDelete = (params: CategoryGet) => {
    if (!session) return;

    const now = new Date();

    deleteCategory({
      ...params,
      sync_status: SyncStatus.DELETED,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    });
  };

  return { categoryCreate, categoryUpdate, categoryDelete };
};
