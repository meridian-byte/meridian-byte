/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import { MassCreate, MassRelations, MassUpdate } from '@repo/types/models/mass';

const baseRequestUrl = `${API_URL}/masses`;

export const massesGet = async (params?: { userId?: string }) => {
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
    console.error('---> handler error - (get masses):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const massesUpdate = async (
  masses: MassRelations[],
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
      body: JSON.stringify({ masses, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update masses):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const massGet = async (params: { massId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.massId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get mass):', error);
    throw error;
  }
};

export const massCreate = async (mass: MassCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(mass),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create mass):', error);
    throw error;
  }
};

export const massUpdate = async (mass: MassUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${mass.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(mass),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update mass):', error);
    throw error;
  }
};

export const massDelete = async (massId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${massId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete mass):', error);
    throw error;
  }
};
