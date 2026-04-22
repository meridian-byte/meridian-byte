import { useStoreReminder } from '@repo/libraries/zustand/stores/reminder';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { ReminderGet } from '@repo/types/models/reminder';
import { Status, SyncStatus } from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';

export const useReminderActions = () => {
  const session = useStoreSession((s) => s.session);
  const addReminder = useStoreReminder((s) => s.addReminder);
  const updateReminder = useStoreReminder((s) => s.updateReminder);
  const deleteReminder = useStoreReminder((s) => s.deleteReminder);

  const reminderCreate = (params: Partial<ReminderGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newReminder: ReminderGet = {
      id: params.id || id,
      remind_at: (params.remind_at || now).toISOString() as any,
      sent: params.sent || false,
      task_id: params.task_id || '',
      profile_id: params.profile_id || session.id,
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at || now).toISOString() as any,
      updated_at: new Date(params.updated_at || now).toISOString() as any,
    };

    addReminder(newReminder);
  };

  const reminderUpdate = (params: ReminderGet) => {
    if (!session) return;

    const now = new Date();

    const newReminder: ReminderGet = {
      ...params,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    };

    updateReminder(newReminder);
  };

  const reminderDelete = (params: ReminderGet) => {
    if (!session) return;

    const now = new Date();

    deleteReminder({
      ...params,
      sync_status: SyncStatus.DELETED,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    });
  };

  return { reminderCreate, reminderUpdate, reminderDelete };
};
