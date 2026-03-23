/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import {
  RecurringRuleCreate,
  RecurringRuleGet,
  RecurringRuleUpdate,
} from '@repo/types/models/recurring-rule';

const baseRequestUrl = `${API_URL}/recurring-rules`;

export const recurringRulesGet = async (params?: { userId?: string }) => {
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
    console.error('---> handler error - (get recurringRules):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const recurringRulesUpdate = async (
  recurringRules: RecurringRuleGet[],
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
      body: JSON.stringify({ recurringRules, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update recurringRules):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const recurringRuleGet = async (params: { recurringRuleId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.recurringRuleId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get recurringRule):', error);
    throw error;
  }
};

export const recurringRuleCreate = async (
  recurringRule: RecurringRuleCreate
) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(recurringRule),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create recurringRule):', error);
    throw error;
  }
};

export const recurringRuleUpdate = async (
  recurringRule: RecurringRuleUpdate
) => {
  try {
    const request = new Request(`${baseRequestUrl}/${recurringRule.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(recurringRule),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update recurringRule):', error);
    throw error;
  }
};

export const recurringRuleDelete = async (recurringRuleId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${recurringRuleId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete recurringRule):', error);
    throw error;
  }
};
