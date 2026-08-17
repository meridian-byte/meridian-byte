import { useStoreReminder } from '../reminder';
import { useStoreSession } from '../session';
import { ReminderGet } from '@repo/types';
import { SyncStatus } from '@repo/types';
import { generateUUID } from '@repo/utils';
import { useStoreActiveItems } from '../active-items';
import { useViewModal } from '../../handler/view';

export const useReminderActions = () => {
  const session = useStoreSession((s) => s.session);
  const reminders = useStoreReminder((s) => s.reminders);
  const addReminder = useStoreReminder((s) => s.addReminder);
  const updateReminder = useStoreReminder((s) => s.updateReminder);
  const deleteReminder = useStoreReminder((s) => s.deleteReminder);
  const activeWorkspace = useStoreActiveItems((s) => s.activeItems?.workspace);
  const { modalViewValue, closeModalView } = useViewModal();

  const reminderCreate = (params?: Partial<ReminderGet>) => {
    if (!session) return;
    if (!activeWorkspace) return;

    if (!params?.taskId) {
      // error notification goes here
      return;
    }

    const id = generateUUID();
    const now = new Date();

    const newReminder: ReminderGet = {
      id: params?.id || id,
      remindAt: new Date(params?.remindAt || now).toISOString() as any,
      sent: params?.sent ?? false,
      taskId: params.taskId,
      profileId: params?.profileId || session.id,
      workspaceId: params?.workspaceId || activeWorkspace.id,
      syncStatus: SyncStatus.PENDING,
      createdAt: new Date(params?.createdAt || now).toISOString() as any,
      updatedAt: new Date(params?.updatedAt || now).toISOString() as any,
    };

    addReminder(newReminder);

    return newReminder;
  };

  const reminderUpdate = (params: ReminderGet) => {
    if (!session) return;
    if (!activeWorkspace) return;

    const now = new Date();

    const newReminder: ReminderGet = {
      ...params,
      syncStatus: SyncStatus.PENDING,
      updatedAt: new Date(now).toISOString() as any,
    };

    updateReminder(newReminder);
  };

  const reminderDelete = (params: ReminderGet) => {
    if (!session) return;
    if (!reminders) return;
    if (!activeWorkspace) return;

    const now = new Date();

    deleteReminder({
      ...params,
      syncStatus: SyncStatus.DELETED,
      createdAt: new Date(params.createdAt).toISOString() as any,
      updatedAt: new Date(now).toISOString() as any,
    });

    if (!!modalViewValue) closeModalView();
  };

  return {
    reminderCreate,
    reminderUpdate,
    reminderDelete,
  };
};
