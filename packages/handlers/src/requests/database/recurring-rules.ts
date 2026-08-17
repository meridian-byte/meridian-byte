/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { RecurringRuleCreate, RecurringRuleGet, RecurringRuleUpdate } from '@repo/types';
import { apiCall } from './fetch';

const segment = 'recurring-rules';

export const recurringRulesGet = (params: { apiUrl: string; userId?: string }) => {
  const query = params?.userId ? `?userId=${params.userId}` : '';
  return apiCall(segment + query, 'GET', params.apiUrl);
};

let currentController: AbortController | null = null;

export const recurringRulesUpdate = async (
  apiUrl: string,
  recurringRules: RecurringRuleGet[],
  deletedIds?: string[],
) => {
  if (currentController) currentController.abort();
  currentController = new AbortController();

  try {
    return await apiCall(
      segment + '',
      'PUT',
      apiUrl,
      { recurringRules, deletedIds },
      currentController.signal,
    );
  } finally {
    currentController = null;
  }
};

export const recurringRuleGet = (params: { apiUrl: string; recurringRuleId: string }) => {
  return apiCall(segment + `/${params.recurringRuleId}`, 'GET', params.apiUrl);
};

export const recurringRuleCreate = (apiUrl: string, recurringRule: RecurringRuleCreate) => {
  return apiCall(segment + '/create', 'POST', apiUrl, recurringRule);
};

export const recurringRuleUpdate = (apiUrl: string, recurringRule: RecurringRuleUpdate) => {
  return apiCall(segment + `/${recurringRule.id}`, 'PUT', apiUrl, recurringRule);
};

export const recurringRuleDelete = (apiUrl: string, recurringRuleId: string) => {
  return apiCall(segment + `/${recurringRuleId}`, 'DELETE', apiUrl);
};
