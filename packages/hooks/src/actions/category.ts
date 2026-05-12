import { useStoreCategory } from '@repo/libraries/zustand/stores/category';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { useStoreTask } from '@repo/libraries/zustand/stores/task';
import { CategoryGet } from '@repo/types/models/category';
import { CategoryType, Status, SyncStatus } from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';

export const useCategoryActions = () => {
  const session = useStoreSession((s) => s.session);
  const addCategory = useStoreCategory((s) => s.addCategory);
  const updateCategory = useStoreCategory((s) => s.updateCategory);
  const deleteCategory = useStoreCategory((s) => s.deleteCategory);
  const tasks = useStoreTask((s) => s.tasks);
  const setTasks = useStoreTask((s) => s.setTasks);

  const categoryCreate = (params: Partial<CategoryGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newCategory: CategoryGet = {
      id: params.id || id,
      title: params.title || 'New Project',
      type: params.type || CategoryType.TASK,
      profile_id: params.profile_id || session.id,
      parent_category_id: params.parent_category_id || '',
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

    if (params.type == CategoryType.TASK) {
      if (tasks?.length) {
        setTasks(
          tasks.map((ti) => {
            if (ti.category_id != params.id) return ti;
            return { ...ti, category_id: null };
          })
        );
      }
    }

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
