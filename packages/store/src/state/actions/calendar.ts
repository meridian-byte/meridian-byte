import { useStoreCalendar } from '../calendar';
import { useStoreSession } from '../session';
import { CalendarGet } from '@repo/types';
import { SyncStatus } from '@repo/types';
import { generateCopyTitle, generateUUID } from '@repo/utils';
import { useStoreActiveItems } from '../active-items';
import { getUniqueColor } from '@repo/constants';
import { useStoreEvent } from '../event';

export const useCalendarActions = () => {
  const session = useStoreSession((s) => s.session);
  const calendars = useStoreCalendar((s) => s.calendars);
  const addCalendar = useStoreCalendar((s) => s.addCalendar);
  const updateCalendar = useStoreCalendar((s) => s.updateCalendar);
  const deleteCalendar = useStoreCalendar((s) => s.deleteCalendar);
  const activeWorkspace = useStoreActiveItems((s) => s.activeItems?.workspace);
  const events = useStoreEvent((s) => s.events);
  const setEvents = useStoreEvent((s) => s.setEvents);

  const calendarCreate = (params?: Partial<CalendarGet>) => {
    if (!session) return;
    if (!activeWorkspace) return;
    if (calendars === undefined || calendars === null) return;

    const id = generateUUID();
    const now = new Date();

    // Extracts existing titles to check for collision
    const existingTitles = calendars.map((n) => n.title);

    // Handles cleanly: if params?.title is undefined, defaults to "New ..." / "New ... 1"
    const title = generateCopyTitle(params?.title, existingTitles, 'New Calendar');

    const newCalendar: CalendarGet = {
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

    addCalendar(newCalendar);

    return newCalendar;
  };

  const calendarUpdate = (params: CalendarGet) => {
    if (!session) return;
    if (!activeWorkspace) return;

    const now = new Date();

    const newCalendar: CalendarGet = {
      ...params,
      syncStatus: SyncStatus.PENDING,
      updatedAt: new Date(now).toISOString() as any,
    };

    updateCalendar(newCalendar);
  };

  const calendarDelete = (params: CalendarGet) => {
    if (!session) return;
    if (!activeWorkspace) return;
    if (calendars === undefined) return;
    if (calendars === null) return;
    if (events === undefined) return;
    if (events === null) return;

    const now = new Date();

    // unlink events from this calendar
    const needsUnlink = events.some((ei) => ei.calendarId == params.id);
    if (needsUnlink) {
      setEvents(
        events.map((ei) => {
          if (ei.calendarId != params.id) return ei;
          return {
            ...ei,
            calendarId: null,
            syncStatus: SyncStatus.PENDING,
            updatedAt: new Date(now).toISOString() as any,
          };
        }),
      );
    }

    deleteCalendar({
      ...params,
      syncStatus: SyncStatus.DELETED,
      createdAt: new Date(params.createdAt).toISOString() as any,
      updatedAt: new Date(now).toISOString() as any,
    });
  };

  return {
    calendarCreate,
    calendarUpdate,
    calendarDelete,
  };
};
