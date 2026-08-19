import { useStoreTask } from '../task';
import { useStoreSession } from '../session';
import { Priority, TaskGet } from '@repo/types';
import { SyncStatus } from '@repo/types';
import { generateUUID } from '@repo/utils';
import { useStoreActiveItems } from '../active-items';
import { useViewModal } from '../../handler/view';

export const useTaskActions = () => {
  const session = useStoreSession((s) => s.session);
  const tasks = useStoreTask((s) => s.tasks);
  const addTask = useStoreTask((s) => s.addTask);
  const updateTask = useStoreTask((s) => s.updateTask);
  const deleteTask = useStoreTask((s) => s.deleteTask);
  const activeWorkspace = useStoreActiveItems((s) => s.activeItems?.workspace);
  const { modalViewValue, closeModalView } = useViewModal();

  const taskCreate = (params?: Partial<TaskGet>) => {
    if (!session) return;
    if (!activeWorkspace) return;

    const id = generateUUID();
    const now = new Date();

    const newTask: TaskGet = {
      id: params?.id || id,
      title: params?.title || 'New Task',
      description: params?.description || null,
      complete: params?.complete ?? false,
      dueDate: !params?.dueDate ? null : (new Date(params.dueDate).toISOString() as any),
      priority: params?.priority || Priority.NOT_URGENT_UNIMPORTANT,
      recurringRuleId: params?.recurringRuleId || null,
      taskListId: params?.taskListId || null,
      profileId: params?.profileId || session.id,
      workspaceId: params?.workspaceId || activeWorkspace.id,
      syncStatus: SyncStatus.PENDING,
      createdAt: new Date(params?.createdAt || now).toISOString() as any,
      updatedAt: new Date(params?.updatedAt || now).toISOString() as any,
    };

    addTask(newTask);

    return newTask;
  };

  const taskUpdate = (params: TaskGet) => {
    if (!session) return;
    if (!activeWorkspace) return;

    const now = new Date();

    const newTask: TaskGet = {
      ...params,
      dueDate: !params?.dueDate ? null : (new Date(params.dueDate).toISOString() as any),
      syncStatus: SyncStatus.PENDING,
      updatedAt: new Date(now).toISOString() as any,
    };

    updateTask(newTask);
  };

  const taskDelete = (params: TaskGet) => {
    if (!session) return;
    if (!tasks) return;
    if (!activeWorkspace) return;

    const now = new Date();

    deleteTask({
      ...params,
      syncStatus: SyncStatus.DELETED,
      createdAt: new Date(params.createdAt).toISOString() as any,
      updatedAt: new Date(now).toISOString() as any,
    });

    if (!!modalViewValue) closeModalView();
  };

  return {
    taskCreate,
    taskUpdate,
    taskDelete,
  };
};
