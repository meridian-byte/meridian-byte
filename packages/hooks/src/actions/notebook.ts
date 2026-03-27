import { useStoreNotebook } from '@repo/libraries/zustand/stores/notebook';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { NotebookGet } from '@repo/types/models/notebook';
import { Status, SyncStatus } from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';
import { useStoreNote } from '@repo/libraries/zustand/stores/note';
import { useItemEditContext } from '../contexts/item-edit';

export const useNotebookActions = () => {
  const session = useStoreSession((s) => s.session);
  const notebooks = useStoreNotebook((s) => s.notebooks);
  const notes = useStoreNote((s) => s.notes);
  const setNotes = useStoreNote((s) => s.setNotes);
  const addNotebook = useStoreNotebook((s) => s.addNotebook);
  const updateNotebook = useStoreNotebook((s) => s.updateNotebook);
  const deleteNotebook = useStoreNotebook((s) => s.deleteNotebook);

  const { editing, editingId, setEditingState, startRename, inputRefs } =
    useItemEditContext();

  const notebookCreate = (params?: Partial<NotebookGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newNotebook: NotebookGet = {
      id: params?.id || id,
      title: params?.title || 'New Folder',
      profile_id: session.id || params?.profile_id || '',
      status: params?.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params?.created_at || now).toISOString() as any,
      updated_at: new Date(params?.updated_at || now).toISOString() as any,
    };

    addNotebook(newNotebook);
  };

  const notebookUpdate = (params: NotebookGet) => {
    if (!session) return;

    const now = new Date();

    const newNotebook: NotebookGet = {
      ...params,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    };

    updateNotebook(newNotebook);
  };

  // handler to create notebook copy
  const notebookCopy = (params: { values: NotebookGet }) => {
    if (!notebooks) return;
    if (!notes) return;

    const now = new Date();

    const baseTitle = params.values.title?.trim() ?? '';

    // helper to escape regex special chars in title
    function escapeRegex(str: string) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    const escapedBase = escapeRegex(baseTitle);

    // matches "<baseTitle>" or "<baseTitle> <number>" at the very end
    const titleRegex = new RegExp(`^${escapedBase}(?: (\\d+))?$`);

    // collect notebooks that are copies of this title
    const matchingCopies = notebooks.filter((n) => titleRegex.test(n.title));

    // find the highest numeric suffix already used
    let maxNumber = 0;
    for (const n of matchingCopies) {
      const match = n.title.match(titleRegex);
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (num > maxNumber) maxNumber = num;
      }
    }

    const nextNumber = maxNumber + 1;

    const notebookCopyId = generateUUID();

    const notebookCopy: Partial<NotebookGet> = {
      ...params.values,
      id: notebookCopyId,
      title: `${baseTitle} ${nextNumber}`,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.values.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    };

    // add copy to state
    notebookCreate(notebookCopy);

    const categoryNotes = notes.filter(
      (n) => n.notebook_id == params.values.id
    );

    if (categoryNotes.length) {
      const updatedCategoryNotes = categoryNotes.map((n) => {
        return {
          ...n,
          id: generateUUID(),
          notebook_id: notebookCopyId,
          sync_status: SyncStatus.PENDING,
          created_at: new Date(n.created_at).toISOString() as any,
          updated_at: new Date(now).toISOString() as any,
        };
      });

      // add notes to state
      setNotes([...notes, ...updatedCategoryNotes]);
    }

    return notebookCopy;
  };

  const notebookDelete = (params: NotebookGet) => {
    if (!session) return;

    const now = new Date();

    deleteNotebook({
      ...params,
      sync_status: SyncStatus.DELETED,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    });
  };

  return {
    notebookCreate,
    notebookUpdate,
    notebookCopy,
    notebookDelete,
    // rename stuff
    notebookEditing: editing,
    notebookEditingId: editingId,
    setNotebookEditingState: setEditingState,
    startNotebookRename: startRename,
    notebookInputRefs: inputRefs,
  };
};
