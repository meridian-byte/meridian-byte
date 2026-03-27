/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import { ViewCreate, ViewGet, ViewUpdate } from '@repo/types/models/view';

const baseRequestUrl = `${API_URL}/views`;

export const viewsGet = async (params?: { userId?: string }) => {
  try {
    const request = new Request(
      `${baseRequestUrl}?userId=${params?.userId || ''}`,
      {
        method: 'GET',
        headers: HEADERS.WITHOUT_BODY,
      }
    );

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get views):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const viewsUpdate = async (
  views: ViewGet[],
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
      body: JSON.stringify({ views, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update views):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const viewGet = async (params: { viewId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.viewId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get view):', error);
    throw error;
  }
};

export const viewCreate = async (view: ViewCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(view),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create view):', error);
    throw error;
  }
};

export const viewUpdate = async (view: ViewUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${view.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(view),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update view):', error);
    throw error;
  }
};

export const viewDelete = async (viewId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${viewId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete view):', error);
    throw error;
  }
};
