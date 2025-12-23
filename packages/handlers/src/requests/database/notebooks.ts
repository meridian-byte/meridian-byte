/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import {
  NotebookCreate,
  NotebookRelations,
  NotebookUpdate,
} from '@repo/types/models/notebook';

const baseRequestUrl = `${API_URL}/notebooks`;

export const notebooksGet = async () => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get notebooks):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const notebooksUpdate = async (
  notebooks: NotebookRelations[],
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
      body: JSON.stringify({ notebooks, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update notebooks):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const notebookGet = async (params: { notebookId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.notebookId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get notebook):', error);
    throw error;
  }
};

export const notebookCreate = async (notebook: NotebookCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(notebook),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create notebook):', error);
    throw error;
  }
};

export const notebookUpdate = async (notebook: NotebookUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${notebook.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(notebook),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update notebook):', error);
    throw error;
  }
};

export const notebookDelete = async (notebookId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${notebookId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete notebook):', error);
    throw error;
  }
};
