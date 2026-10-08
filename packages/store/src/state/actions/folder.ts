import { APP_NAMES_ATLAS } from '@repo/constants';
import { useStoreFolder } from '../folder';
import { useStoreSession } from '../session';
import { FolderGet } from '@repo/types';
import { SyncStatus } from '@repo/types';
import { generateUUID } from '@repo/utils';
import { useStoreCalendar } from '../calendar';
import { useStoreNote } from '../note';
import { useStoreTaskList } from '../task-list';
import { useStoreActiveItems } from '../active-items';

export const useFolderActions = () => {
  const session = useStoreSession((s) => s.session);
  const addFolder = useStoreFolder((s) => s.addFolder);
  const updateFolder = useStoreFolder((s) => s.updateFolder);
  const deleteFolder = useStoreFolder((s) => s.deleteFolder);

  const calendars = useStoreCalendar((s) => s.calendars);
  const setCalendars = useStoreCalendar((s) => s.setCalendars);
  const notes = useStoreNote((s) => s.notes);
  const setNotes = useStoreNote((s) => s.setNotes);
  const taskLists = useStoreTaskList((s) => s.taskLists);
  const setTaskLists = useStoreTaskList((s) => s.setTaskLists);
  const activeWorkspace = useStoreActiveItems((s) => s.activeItems?.workspace);

  const folderCreate = (params: Omit<Partial<FolderGet>, 'type'>) => {
    if (!session) return;
    if (!activeWorkspace) return;

    const id = generateUUID();
    const now = new Date();

    const newFolder: FolderGet = {
      id: params.id || id,
      name: params.name || 'New Folder',
      location: params.location || '',
      folderId: params.folderId || null,
      workspaceId: params.workspaceId || activeWorkspace.id,
      syncStatus: SyncStatus.PENDING,
      createdAt: new Date(params.createdAt || now).toISOString() as any,
      updatedAt: new Date(params.updatedAt || now).toISOString() as any,
    };

    addFolder(newFolder);

    return newFolder;
  };

  const folderUpdate = (params: FolderGet) => {
    if (!session) return;

    const now = new Date();

    const newFolder: FolderGet = {
      ...params,
      syncStatus: SyncStatus.PENDING,
      createdAt: new Date(params.createdAt).toISOString() as any,
      updatedAt: new Date(now).toISOString() as any,
    };

    updateFolder(newFolder);
  };

  const folderDelete = (params: FolderGet) => {
    if (!session) return;

    const folderLocation = params.location;

    let locationProps: { relatedItems: any[]; updateFunction: (i: any[]) => void } = {
      relatedItems: [],
      updateFunction: () => {},
    };

    switch (folderLocation) {
      case APP_NAMES_ATLAS.PAVE:
        locationProps = {
          relatedItems: calendars || [],
          updateFunction: (ci: any[]) => setCalendars(ci),
        };
        break;
      case APP_NAMES_ATLAS.JOT:
        locationProps = {
          relatedItems: notes || [],
          updateFunction: (ni: any[]) => setNotes(ni),
        };
        break;
      case APP_NAMES_ATLAS.STRIDE:
        locationProps = {
          relatedItems: taskLists || [],
          updateFunction: (tl: any[]) => setTaskLists(tl),
        };
        break;

      default:
        break;
    }

    const needsUnlink = locationProps.relatedItems.some((ri) => ri.folderId == params.id);

    // unlink relevant items from folder
    if (needsUnlink) {
      console.log('[INFO] linked folder items found. Unlinking');

      locationProps.updateFunction(
        locationProps.relatedItems.map((ri) => {
          if (ri.folderId != params.id) return ri;
          return { ...ri, folderId: null };
        }),
      );
    }

    const now = new Date();

    deleteFolder({
      ...params,
      syncStatus: SyncStatus.DELETED,
      createdAt: new Date(params.createdAt).toISOString() as any,
      updatedAt: new Date(now).toISOString() as any,
    });
  };

  return { folderCreate, folderUpdate, folderDelete };
};
