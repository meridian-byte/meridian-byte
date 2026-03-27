/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import {
  ReminderCreate,
  ReminderRelations,
  ReminderUpdate,
} from '@repo/types/models/reminder';

const baseRequestUrl = `${API_URL}/reminders`;

export const remindersGet = async (params?: { userId?: string }) => {
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
    console.error('---> handler error - (get reminders):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const remindersUpdate = async (
  reminders: ReminderRelations[],
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
      body: JSON.stringify({ reminders, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update reminders):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const reminderGet = async (params: { reminderId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.reminderId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get reminder):', error);
    throw error;
  }
};

export const reminderCreate = async (reminder: ReminderCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(reminder),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create reminder):', error);
    throw error;
  }
};

export const reminderUpdate = async (reminder: ReminderUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${reminder.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(reminder),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update reminder):', error);
    throw error;
  }
};

export const reminderDelete = async (reminderId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${reminderId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete reminder):', error);
    throw error;
  }
};
