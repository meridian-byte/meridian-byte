import { useStoreNote } from '../note';
import { useStoreSession } from '../session';
import { NoteGet } from '@repo/types';
import { SyncStatus } from '@repo/types';
import { generateCopyTitle, generateUUID } from '@repo/utils';
import { useRouter } from 'next/navigation';
import { useStoreUserStates } from '../user-states';
import { linkify } from '@repo/utils';
import { useStoreActiveItems } from '../active-items';
import { useSubView, useViewModal } from '../../handler/view';
import { SUBVIEW_NAMES } from '@repo/constants';

export const useNoteActions = () => {
  const session = useStoreSession((s) => s.session);
  const notes = useStoreNote((s) => s.notes);
  const addNote = useStoreNote((s) => s.addNote);
  const updateNote = useStoreNote((s) => s.updateNote);
  const deleteNote = useStoreNote((s) => s.deleteNote);
  const activeWorkspace = useStoreActiveItems((s) => s.activeItems?.workspace);

  const userStates = useStoreUserStates((s) => s.userStates);
  const setUserStates = useStoreUserStates((s) => s.setUserStates);

  const { subViewValue, showSubViewJot } = useSubView();

  const { modalViewValue, closeModalView } = useViewModal();

  const noteCreate = (params?: Partial<NoteGet>) => {
    if (!session) return;
    if (!userStates) return;
    if (!activeWorkspace) return;
    if (notes === undefined || notes === null) return;

    const id = generateUUID();
    const now = new Date();

    // Extracts existing titles to check for collision
    const existingTitles = notes.map((n) => n.title);

    // Handles cleanly: if params?.title is undefined, defaults to "New Note" / "New Note 1"
    const title = generateCopyTitle(params?.title, existingTitles, 'New Note');

    const newNote: NoteGet = {
      id: params?.id || id,
      title,
      content: params?.content || '<p></p>',
      profileId: params?.profileId || session.id,
      workspaceId: params?.workspaceId || activeWorkspace.id,
      syncStatus: SyncStatus.PENDING,
      createdAt: new Date(params?.createdAt || now).toISOString() as any,
      updatedAt: new Date(params?.updatedAt || now).toISOString() as any,
    };

    addNote(newNote);

    showSubViewJot(`note: ${newNote.id}`);

    if (!userStates.editing) setUserStates({ ...userStates, editing: true });

    return newNote;
  };

  const noteUpdate = (params: NoteGet) => {
    if (!session) return;
    if (!activeWorkspace) return;

    const now = new Date();

    const newNote: NoteGet = {
      ...params,
      syncStatus: SyncStatus.PENDING,
      updatedAt: new Date(now).toISOString() as any,
    };

    updateNote(newNote);
  };

  const noteDelete = (params: NoteGet) => {
    if (!session) return;
    if (!activeWorkspace) return;
    if (notes === undefined || notes === null) return;

    const now = new Date();

    deleteNote({
      ...params,
      syncStatus: SyncStatus.DELETED,
      createdAt: new Date(params.createdAt).toISOString() as any,
      updatedAt: new Date(now).toISOString() as any,
    });

    // check if current note is in view
    if (subViewValue?.includes(params.id)) {
      showSubViewJot(SUBVIEW_NAMES.JOT.HOME);
    }

    if (!!modalViewValue) closeModalView();
  };

  // handler to create note copy
  const noteCopy = (params: { values: NoteGet }) => {
    if (!activeWorkspace) return;
    if (notes === undefined || notes === null) return;

    const existingTitles = notes.map((n) => n.title);
    const newTitle = generateCopyTitle(params.values.title ?? '', existingTitles);

    const noteCopy: NoteGet = {
      ...params.values,
      id: generateUUID(),
      title: newTitle,
    };

    // add copy to state
    noteCreate(noteCopy);

    return noteCopy;
  };

  // handler to merge 2 notes
  const noteMerge = (params: { from: NoteGet; to: NoteGet }) => {
    if (!activeWorkspace) return;

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
      content: mergeNoteContent(params.to.content || '', params.from.content || ''),
      syncStatus: SyncStatus.PENDING,
      createdAt: new Date(params.to.createdAt).toISOString() as any,
      updatedAt: new Date(now).toISOString() as any,
    };

    // add to note to state
    updateNote(note);

    showSubViewJot(`note: ${note.id}`);

    // delete merged note
    setTimeout(() => {
      noteDelete(params.from);
    }, 3000);

    return note;
  };

  return {
    noteCreate,
    noteUpdate,
    noteDelete,
    noteCopy,
    noteMerge,
  };
};
