import { useStoreEvent } from '../event';
import { useStoreSession } from '../session';
import { EventGet } from '@repo/types';
import { SyncStatus } from '@repo/types';
import { generateUUID } from '@repo/utils';
import { useStoreActiveItems } from '../active-items';

export const useEventActions = () => {
  const session = useStoreSession((s) => s.session);
  const events = useStoreEvent((s) => s.events);
  const addEvent = useStoreEvent((s) => s.addEvent);
  const updateEvent = useStoreEvent((s) => s.updateEvent);
  const deleteEvent = useStoreEvent((s) => s.deleteEvent);
  const activeWorkspace = useStoreActiveItems((s) => s.activeItems?.workspace);

  const eventCreate = (params?: Partial<EventGet>) => {
    if (!session) return;
    if (!activeWorkspace) return;

    const id = generateUUID();
    const now = new Date();

    const newEvent: EventGet = {
      id: params?.id || id,
      title: params?.title || 'New Event',
      description: params?.description || null,
      start: new Date(params?.start || now).toISOString() as any,
      end: new Date(params?.end || now).toISOString() as any,
      allDay: params?.allDay || false,
      location: params?.location || null,
      profileId: params?.profileId || session.id,
      workspaceId: params?.workspaceId || activeWorkspace.id,
      calendarId: params?.calendarId || null,
      syncStatus: SyncStatus.PENDING,
      createdAt: new Date(params?.createdAt || now).toISOString() as any,
      updatedAt: new Date(params?.updatedAt || now).toISOString() as any,
    };

    addEvent(newEvent);

    return newEvent;
  };

  const eventUpdate = (params: EventGet) => {
    if (!session) return;
    if (!activeWorkspace) return;

    const now = new Date();

    const newEvent: EventGet = {
      ...params,
      start: new Date(params.start).toISOString() as any,
      end: new Date(params.end).toISOString() as any,
      syncStatus: SyncStatus.PENDING,
      updatedAt: new Date(now).toISOString() as any,
    };

    updateEvent(newEvent);
  };

  const eventDelete = (params: EventGet) => {
    if (!session) return;
    if (!events) return;
    if (!activeWorkspace) return;

    const now = new Date();

    deleteEvent({
      ...params,
      syncStatus: SyncStatus.DELETED,
      createdAt: new Date(params.createdAt).toISOString() as any,
      updatedAt: new Date(now).toISOString() as any,
    });
  };

  return {
    eventCreate,
    eventUpdate,
    eventDelete,
  };
};
