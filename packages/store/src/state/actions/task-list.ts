import { useStoreTaskList } from '../task-list';
import { useStoreSession } from '../session';
import { TaskListGet } from '@repo/types';
import { SyncStatus } from '@repo/types';
import { generateUUID } from '@repo/utils';
import { useStoreActiveItems } from '../active-items';
import { getUniqueColor } from '@repo/constants';

export const useTaskListActions = () => {
  const session = useStoreSession((s) => s.session);
  const taskLists = useStoreTaskList((s) => s.taskLists);
  const addTaskList = useStoreTaskList((s) => s.addTaskList);
  const updateTaskList = useStoreTaskList((s) => s.updateTaskList);
  const deleteTaskList = useStoreTaskList((s) => s.deleteTaskList);
  const activeWorkspace = useStoreActiveItems((s) => s.activeItems?.workspace);

  const taskListCreate = (params?: Partial<TaskListGet>) => {
    if (!session) return;
    if (!activeWorkspace) return;

    const id = generateUUID();
    const now = new Date();

    const newTaskList: TaskListGet = {
      id: params?.id || id,
      title: params?.title || 'New Task List',
      description: params?.description || null,
      color: params?.color || getUniqueColor(),
      folderId: params?.folderId || null,
      profileId: params?.profileId || session.id,
      workspaceId: params?.workspaceId || activeWorkspace.id,
      syncStatus: SyncStatus.PENDING,
      createdAt: new Date(params?.createdAt || now).toISOString() as any,
      updatedAt: new Date(params?.updatedAt || now).toISOString() as any,
    };

    addTaskList(newTaskList);

    return newTaskList;
  };

  const taskListUpdate = (params: TaskListGet) => {
    if (!session) return;
    if (!activeWorkspace) return;

    const now = new Date();

    const newTaskList: TaskListGet = {
      ...params,
      syncStatus: SyncStatus.PENDING,
      updatedAt: new Date(now).toISOString() as any,
    };

    updateTaskList(newTaskList);
  };

  const taskListDelete = (params: TaskListGet) => {
    if (!session) return;
    if (!taskLists) return;
    if (!activeWorkspace) return;

    const now = new Date();

    deleteTaskList({
      ...params,
      syncStatus: SyncStatus.DELETED,
      createdAt: new Date(params.createdAt).toISOString() as any,
      updatedAt: new Date(now).toISOString() as any,
    });
  };

  return {
    taskListCreate,
    taskListUpdate,
    taskListDelete,
  };
};
