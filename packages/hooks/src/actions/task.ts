import { useStoreTask } from '@repo/libraries/zustand/stores/task';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { TaskGet } from '@repo/types/models/task';
import { Priority, Status, SyncStatus } from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';
import { useStoreActiveItems } from '@repo/libraries/zustand/stores/active-items';

export const useTaskActions = () => {
  const session = useStoreSession((s) => s.session);
  const addTask = useStoreTask((s) => s.addTask);
  const updateTask = useStoreTask((s) => s.updateTask);
  const deleteTask = useStoreTask((s) => s.deleteTask);
  const activeTask = useStoreActiveItems((s) => s.activeItems?.task);
  const removeActiveTask = useStoreActiveItems((s) => s.removeActiveTask);

  const taskCreate = (params: Partial<TaskGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newTask: TaskGet = {
      id: params.id || id,
      category_id:
        !params.category_id || params.category_id == 'inbox'
          ? null
          : params.category_id,
      complete: params.complete || false,
      description: params.description || '',
      due_date: (params.due_date?.toISOString() as any) || null,
      priority: params.priority || Priority.NOT_URGENT_UNIMPORTANT,
      recurring_rule_id: params.recurring_rule_id || null,
      title: params.title || '',
      profile_id: params.profile_id || session.id,
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at || now).toISOString() as any,
      updated_at: new Date(params.updated_at || now).toISOString() as any,
    };

    addTask(newTask);
  };

  const taskUpdate = (params: TaskGet) => {
    if (!session) return;

    const now = new Date();

    const newTask: TaskGet = {
      ...params,
      category_id:
        !params.category_id || params.category_id == 'inbox'
          ? null
          : params.category_id,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    };

    updateTask(newTask);
  };

  const taskDelete = (params: TaskGet) => {
    if (!session) return;

    const now = new Date();

    if (activeTask?.id == params.id) removeActiveTask();

    deleteTask({
      ...params,
      sync_status: SyncStatus.DELETED,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    });
  };

  return { taskCreate, taskUpdate, taskDelete };
};
