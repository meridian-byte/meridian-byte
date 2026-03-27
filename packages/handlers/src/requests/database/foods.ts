/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import {
  FoodCreate,
  FoodRelations,
  FoodUpdate,
} from '@repo/types/models/food';

const baseRequestUrl = `${API_URL}/foods`;

export const foodsGet = async () => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get foods):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const foodsUpdate = async (
  foods: FoodRelations[],
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
      body: JSON.stringify({ foods, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update foods):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const foodGet = async (params: { foodId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.foodId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get food):', error);
    throw error;
  }
};

export const foodCreate = async (food: FoodCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(food),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create food):', error);
    throw error;
  }
};

export const foodUpdate = async (food: FoodUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${food.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(food),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update food):', error);
    throw error;
  }
};

export const foodDelete = async (foodId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${foodId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete food):', error);
    throw error;
  }
};
