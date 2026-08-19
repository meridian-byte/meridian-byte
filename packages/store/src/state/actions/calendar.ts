import { useStoreCalendar } from '../calendar';
import { useStoreSession } from '../session';
import { CalendarGet } from '@repo/types';
import { SyncStatus } from '@repo/types';
import { generateUUID } from '@repo/utils';
import { useStoreActiveItems } from '../active-items';
import { getUniqueColor } from '@repo/constants';
import { useViewModal } from '../../handler/view';

export const useCalendarActions = () => {
  const session = useStoreSession((s) => s.session);
  const calendars = useStoreCalendar((s) => s.calendars);
  const addCalendar = useStoreCalendar((s) => s.addCalendar);
  const updateCalendar = useStoreCalendar((s) => s.updateCalendar);
  const deleteCalendar = useStoreCalendar((s) => s.deleteCalendar);
  const activeWorkspace = useStoreActiveItems((s) => s.activeItems?.workspace);
  const { modalViewValue, closeModalView } = useViewModal();

  const calendarCreate = (params?: Partial<CalendarGet>) => {
    if (!session) return;
    if (!activeWorkspace) return;

    const id = generateUUID();
    const now = new Date();

    const newCalendar: CalendarGet = {
      id: params?.id || id,
      title: params?.title || 'New Calendar',
      description: params?.description || null,
      color: params?.color || getUniqueColor(),
      profileId: params?.profileId || session.id,
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
    if (!calendars) return;
    if (!activeWorkspace) return;

    const now = new Date();

    deleteCalendar({
      ...params,
      syncStatus: SyncStatus.DELETED,
      createdAt: new Date(params.createdAt).toISOString() as any,
      updatedAt: new Date(now).toISOString() as any,
    });

    if (!!modalViewValue) closeModalView();
  };

  return {
    calendarCreate,
    calendarUpdate,
    calendarDelete,
  };
};
