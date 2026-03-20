import { useStoreNotification } from '@repo/libraries/zustand/stores/notification';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { NotificationGet } from '@repo/types/models/notification';
import { Status, SyncStatus } from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';

export const useNotificationActions = () => {
  const session = useStoreSession((s) => s.session);
  const addNotification = useStoreNotification((s) => s.addNotification);
  const updateNotification = useStoreNotification((s) => s.updateNotification);
  const deleteNotification = useStoreNotification((s) => s.deleteNotification);

  const notificationCreate = (params: Partial<NotificationGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newNotification: NotificationGet = {
      id: params.id || id,
      auth: params.auth || '',
      endpoint: params.endpoint || '',
      endpointId: params.endpointId || '',
      expirationTime: params.expirationTime || null,
      p256dh: params.p256dh || '',
      profile_id: session.id || params.profile_id || '',
      status: params.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at || now).toISOString() as any,
      updated_at: new Date(params.updated_at || now).toISOString() as any,
    };

    addNotification(newNotification);
  };

  const notificationUpdate = (params: NotificationGet) => {
    if (!session) return;

    const now = new Date();

    const newNotification: NotificationGet = {
      ...params,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    };

    updateNotification(newNotification);
  };

  const notificationDelete = (params: NotificationGet) => {
    if (!session) return;

    const now = new Date();

    deleteNotification({
      ...params,
      sync_status: SyncStatus.DELETED,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    });
  };

  return { notificationCreate, notificationUpdate, notificationDelete };
};
