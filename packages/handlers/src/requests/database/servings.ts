/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import {
  ServingCreate,
  ServingRelations,
  ServingUpdate,
} from '@repo/types/models/serving';

const baseRequestUrl = `${API_URL}/servings`;

export const servingsGet = async () => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get servings):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const servingsUpdate = async (
  servings: ServingRelations[],
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
      body: JSON.stringify({ servings, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update servings):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const servingGet = async (params: { servingId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.servingId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get serving):', error);
    throw error;
  }
};

export const servingCreate = async (serving: ServingCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(serving),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create serving):', error);
    throw error;
  }
};

export const servingUpdate = async (serving: ServingUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${serving.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(serving),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update serving):', error);
    throw error;
  }
};

export const servingDelete = async (servingId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${servingId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete serving):', error);
    throw error;
  }
};
