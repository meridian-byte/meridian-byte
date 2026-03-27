/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import {
  NotificationCreate,
  NotificationGet,
  NotificationUpdate,
} from '@repo/types/models/notification';

const baseRequestUrl = `${API_URL}/notifications`;

export const notificationsGet = async (params?: { userId?: string }) => {
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
    console.error('---> handler error - (get notifications):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const notificationsUpdate = async (
  notifications: NotificationGet[],
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
      body: JSON.stringify({ notifications, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update notifications):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const notificationGet = async (params: { notificationId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.notificationId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get notification):', error);
    throw error;
  }
};

export const notificationCreate = async (notification: NotificationCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(notification),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create notification):', error);
    throw error;
  }
};

export const notificationUpdate = async (notification: NotificationUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${notification.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(notification),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update notification):', error);
    throw error;
  }
};

export const notificationDelete = async (notificationId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${notificationId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete notification):', error);
    throw error;
  }
};
