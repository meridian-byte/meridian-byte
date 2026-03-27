/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import {
  BudgetCreate,
  BudgetRelations,
  BudgetUpdate,
} from '@repo/types/models/budget';

const baseRequestUrl = `${API_URL}/budgets`;

export const budgetsGet = async () => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get budgets):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const budgetsUpdate = async (
  budgets: BudgetRelations[],
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
      body: JSON.stringify({ budgets, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update budgets):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const budgetGet = async (params: { budgetId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.budgetId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get budget):', error);
    throw error;
  }
};

export const budgetCreate = async (budget: BudgetCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(budget),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create budget):', error);
    throw error;
  }
};

export const budgetUpdate = async (budget: BudgetUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${budget.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(budget),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update budget):', error);
    throw error;
  }
};

export const budgetDelete = async (budgetId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${budgetId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete budget):', error);
    throw error;
  }
};
