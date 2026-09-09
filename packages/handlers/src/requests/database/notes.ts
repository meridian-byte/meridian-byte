import { NoteCreate, NoteGet, NoteUpdate } from '@repo/types';
import { apiCall } from './fetch';

const segment = 'notes';

export const notesGet = (params: { apiUrl: string; userId?: string }) => {
  const query = params?.userId ? `?userId=${params.userId}` : '';
  return apiCall(segment + query, 'GET', params.apiUrl);
};

let currentController: AbortController | null = null;

export const notesUpdate = async (apiUrl: string, notes: NoteGet[], deletedIds?: string[]) => {
  if (currentController) currentController.abort();
  currentController = new AbortController();

  try {
    return await apiCall(
      segment + '',
      'PUT',
      apiUrl,
      { notes, deletedIds },
      currentController.signal,
    );
  } finally {
    currentController = null;
  }
};

export const noteGet = (params: { apiUrl: string; noteId: string }) => {
  return apiCall(segment + `/${params.noteId}`, 'GET', params.apiUrl);
};

export const noteCreate = (apiUrl: string, note: NoteCreate) => {
  return apiCall(segment + '/create', 'POST', apiUrl, note);
};

export const noteUpdate = (apiUrl: string, note: NoteUpdate) => {
  return apiCall(segment + `/${note.id}`, 'PUT', apiUrl, note);
};

export const noteDelete = (apiUrl: string, noteId: string) => {
  return apiCall(segment + `/${noteId}`, 'DELETE', apiUrl);
};
