/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import { MealCreate, MealRelations, MealUpdate } from '@repo/types/models/meal';

const baseRequestUrl = `${API_URL}/meals`;

export const mealsGet = async (params?: { userId?: string }) => {
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
    console.error('---> handler error - (get meals):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const mealsUpdate = async (
  meals: MealRelations[],
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
      body: JSON.stringify({ meals, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update meals):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const mealGet = async (params: { mealId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.mealId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get meal):', error);
    throw error;
  }
};

export const mealCreate = async (meal: MealCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(meal),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create meal):', error);
    throw error;
  }
};

export const mealUpdate = async (meal: MealUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${meal.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(meal),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update meal):', error);
    throw error;
  }
};

export const mealDelete = async (mealId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${mealId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete meal):', error);
    throw error;
  }
};
