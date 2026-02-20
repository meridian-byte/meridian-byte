/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import { EatCreate, EatRelations, EatUpdate } from '@repo/types/models/eat';

const baseRequestUrl = `${API_URL}/eats`;

export const eatsGet = async (params?: { userId?: string }) => {
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
    console.error('---> handler error - (get eats):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const eatsUpdate = async (
  eats: EatRelations[],
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
      body: JSON.stringify({ eats, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update eats):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const eatGet = async (params: { eatId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.eatId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get eat):', error);
    throw error;
  }
};

export const eatCreate = async (eat: EatCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(eat),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create eat):', error);
    throw error;
  }
};

export const eatUpdate = async (eat: EatUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${eat.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(eat),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update eat):', error);
    throw error;
  }
};

export const eatDelete = async (eatId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${eatId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete eat):', error);
    throw error;
  }
};
