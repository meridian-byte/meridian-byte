/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import { NoteCreate, NoteRelations, NoteUpdate } from '@repo/types/models/note';

const baseRequestUrl = `${API_URL}/notes`;

export const notesGet = async () => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get notes):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const notesUpdate = async (
  notes: NoteRelations[],
  deletedIds?: string[]
) => {
  // Cancel previous request if still in-flight
  if (currentController) currentController.abort();

  // New controller for this request
  currentController = new AbortController();

  try {
    const request = new Request(baseRequestUrl, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify({ notes, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update notes):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const noteGet = async (params: { noteId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.noteId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get note):', error);
    throw error;
  }
};

export const noteCreate = async (note: NoteCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(note),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create note):', error);
    throw error;
  }
};

export const noteUpdate = async (note: NoteUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${note.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(note),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update note):', error);
    throw error;
  }
};

export const noteDelete = async (noteId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${noteId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete note):', error);
    throw error;
  }
};
