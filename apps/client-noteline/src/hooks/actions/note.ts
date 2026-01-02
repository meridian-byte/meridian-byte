import { useStoreNote } from '@/libraries/zustand/stores/note';
import { useStoreSession } from '@/libraries/zustand/stores/session';
import { NoteGet } from '@repo/types/models/note';
import { Status, SyncStatus } from '@repo/types/models/enums';
import { generateUUID } from '@repo/utilities/generators';
import { usePathname, useRouter } from 'next/navigation';
import { NotebookGet } from '@repo/types/models/notebook';
import { useItemEditContext } from '@/components/contexts/item-edit';

export const useNoteActions = () => {
  const { session } = useStoreSession();
  const { notes, addNote, updateNote, deleteNote } = useStoreNote();
  const pathname = usePathname();
  const router = useRouter();

  const { editing, editingId, setEditingState, startRename, inputRefs } =
    useItemEditContext();

  const noteCreate = (params?: Partial<NoteGet>) => {
    if (!session) return;

    const id = generateUUID();
    const now = new Date();

    const newNote: NoteGet = {
      id: params?.id || id,
      title: params?.title || 'New Note',
      content: params?.content || '<p></p>',
      profile_id: session.id || params?.profile_id || '',
      notebook_id: params?.notebook_id || '',
      status: params?.status || Status.ACTIVE,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params?.created_at || now).toISOString() as any,
      updated_at: new Date(params?.updated_at || now).toISOString() as any,
    };

    addNote(newNote);

    router.push(`/app?noteId=${newNote.id}`);

    return newNote;
  };

  const noteUpdate = (params: NoteGet) => {
    if (!session) return;

    const now = new Date();

    const newNote: NoteGet = {
      ...params,
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    };

    updateNote(newNote);
  };

  // handler to create note copy
  const noteCopy = (params: { values: NoteGet }) => {
    if (!notes) return;

    const baseTitle = params.values.title?.trim() ?? '';

    // helper to escape regex special chars in title
    function escapeRegex(str: string) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    const escapedBase = escapeRegex(baseTitle);

    // matches "<baseTitle>" or "<baseTitle> <number>" at the very end
    const titleRegex = new RegExp(`^${escapedBase}(?: (\\d+))?$`);

    // collect notes that are copies of this title
    const matchingCopies = notes.filter((n) => titleRegex.test(n.title));

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

    const noteCopy: NoteGet = {
      ...params.values,
      id: generateUUID(),
      title: `${baseTitle} ${nextNumber}`,
    };

    // add copy to state
    noteCreate(noteCopy);

    return noteCopy;
  };

  const noteDelete = (params: {
    values: NoteGet;
    options?: { noRedirect?: boolean };
  }) => {
    if (!session) return;

    const now = new Date();

    deleteNote({
      ...params.values,
      sync_status: SyncStatus.DELETED,
      created_at: new Date(params.values.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    });

    // check if current note is in view
    if (!params.options?.noRedirect && pathname.includes(params.values.id)) {
      router.replace(`/app`);
    }
  };

  // handler to merge 2 notes
  const noteMerge = (params: { from: NoteGet; to: NoteGet }) => {
    const now = new Date();

    function stripOuterPTags(html: string) {
      return html.replace(/^<p>/i, '').replace(/<\/p>$/i, '');
    }

    function mergeNoteContent(toContent: string, fromContent: string) {
      const strippedFrom = stripOuterPTags(fromContent);

      // Insert a line break before the new content
      return toContent.replace(/<\/p>$/i, `<br/>${strippedFrom}</p>`);
    }

    const note: NoteGet = {
      ...params.to,
      content: mergeNoteContent(
        params.to.content || '',
        params.from.content || ''
      ),
      sync_status: SyncStatus.PENDING,
      created_at: new Date(params.to.created_at).toISOString() as any,
      updated_at: new Date(now).toISOString() as any,
    };

    // add to note to state
    updateNote(note);

    router.push(`/app?noteId=${note.id}`);

    // delete merged note
    setTimeout(() => {
      noteDelete({
        values: params.from,
        options: { noRedirect: true },
      });
    }, 3000);

    return note;
  };

  // handler to move note
  const noteMove = (params: { values: NoteGet; notebook?: NotebookGet }) => {
    // update note notebook id
    if (params.notebook) {
      noteUpdate({
        ...params.values,
        notebook_id: params.notebook.id,
      });
    }
  };

  return {
    noteCreate,
    noteUpdate,
    noteCopy,
    noteDelete,
    noteMerge,
    noteMove,
    // rename stuff
    noteEditing: editing,
    noteEditingId: editingId,
    setNoteEditingState: setEditingState,
    startNoteRename: startRename,
    noteInputRefs: inputRefs,
  };
};
