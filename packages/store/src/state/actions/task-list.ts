import { useStoreTaskList } from '../task-list';
import { useStoreSession } from '../session';
import { TaskListGet } from '@repo/types';
import { SyncStatus } from '@repo/types';
import { generateCopyTitle, generateUUID } from '@repo/utils';
import { useStoreActiveItems } from '../active-items';
import { getUniqueColor, SUBVIEW_NAMES } from '@repo/constants';
import { useStoreTask } from '../task';
import { useSubView } from '../../handler/view';

export const useTaskListActions = () => {
  const session = useStoreSession((s) => s.session);
  const taskLists = useStoreTaskList((s) => s.taskLists);
  const addTaskList = useStoreTaskList((s) => s.addTaskList);
  const updateTaskList = useStoreTaskList((s) => s.updateTaskList);
  const deleteTaskList = useStoreTaskList((s) => s.deleteTaskList);
  const activeWorkspace = useStoreActiveItems((s) => s.activeItems?.workspace);
  const tasks = useStoreTask((s) => s.tasks);
  const setTasks = useStoreTask((s) => s.setTasks);

  const { subViewValue, showSubViewStride } = useSubView();

  const taskListCreate = (params?: Partial<TaskListGet>) => {
    if (!session) return;
    if (!activeWorkspace) return;
    if (taskLists === undefined || taskLists === null) return;

    const id = generateUUID();
    const now = new Date();

    // Extracts existing titles to check for collision
    const existingTitles = taskLists.map((n) => n.title);

    // Handles cleanly: if params?.title is undefined, defaults to "New ..." / "New ... 1"
    const title = generateCopyTitle(params?.title, existingTitles, 'New Task List');

    const newTaskList: TaskListGet = {
      id: params?.id || id,
      title,
      description: params?.description || null,
      color: params?.color || getUniqueColor(),
      folderId: params?.folderId || null,
      workspaceId: params?.workspaceId || activeWorkspace.id,
      syncStatus: SyncStatus.PENDING,
      createdAt: new Date(params?.createdAt || now).toISOString() as any,
      updatedAt: new Date(params?.updatedAt || now).toISOString() as any,
    };

    addTaskList(newTaskList);

    showSubViewStride(`list: ${newTaskList.id}`);

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
    if (!activeWorkspace) return;
    if (taskLists === undefined) return;
    if (taskLists === null) return;
    if (tasks === undefined) return;
    if (tasks === null) return;

    const now = new Date();

    // unlink tasks from this task list
    const needsUnlink = tasks.some((ti) => ti.taskListId == params.id);
    if (needsUnlink) {
      setTasks(
        tasks.map((ti) => {
          if (ti.taskListId != params.id) return ti;
          return {
            ...ti,
            taskListId: null,
            syncStatus: SyncStatus.PENDING,
            updatedAt: new Date(now).toISOString() as any,
          };
        }),
      );
    }

    // check if current task list is in view
    if (subViewValue?.includes(params.id)) {
      showSubViewStride(SUBVIEW_NAMES.STRIDE.HOME);
    }

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
