/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { ReminderCreate, ReminderGet, ReminderUpdate } from '@repo/types';
import { apiCall } from './fetch';

const segment = 'reminders';

export const remindersGet = (params: { apiUrl: string; userId?: string }) => {
  const query = params?.userId ? `?userId=${params.userId}` : '';
  return apiCall(segment + query, 'GET', params.apiUrl);
};

let currentController: AbortController | null = null;

export const remindersUpdate = async (
  apiUrl: string,
  reminders: ReminderGet[],
  deletedIds?: string[],
) => {
  if (currentController) currentController.abort();
  currentController = new AbortController();

  try {
    return await apiCall(
      segment + '',
      'PUT',
      apiUrl,
      { reminders, deletedIds },
      currentController.signal,
    );
  } finally {
    currentController = null;
  }
};

export const reminderGet = (params: { apiUrl: string; reminderId: string }) => {
  return apiCall(segment + `/${params.reminderId}`, 'GET', params.apiUrl);
};

export const reminderCreate = (apiUrl: string, reminder: ReminderCreate) => {
  return apiCall(segment + '/create', 'POST', apiUrl, reminder);
};

export const reminderUpdate = (apiUrl: string, reminder: ReminderUpdate) => {
  return apiCall(segment + `/${reminder.id}`, 'PUT', apiUrl, reminder);
};

export const reminderDelete = (apiUrl: string, reminderId: string) => {
  return apiCall(segment + `/${reminderId}`, 'DELETE', apiUrl);
};
