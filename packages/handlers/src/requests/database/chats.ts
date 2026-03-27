/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import {
  ChatCreate,
  ChatRelations,
  ChatUpdate,
} from '@repo/types/models/chat';

const baseRequestUrl = `${API_URL}/chats`;

export const chatsGet = async (params?: { userId?: string }) => {
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
    console.error('---> handler error - (get chats):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const chatsUpdate = async (
  chats: ChatRelations[],
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
      body: JSON.stringify({ chats, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update chats):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const chatGet = async (params: { chatId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.chatId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get chat):', error);
    throw error;
  }
};

export const chatCreate = async (chat: ChatCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(chat),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create chat):', error);
    throw error;
  }
};

export const chatUpdate = async (chat: ChatUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${chat.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(chat),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update chat):', error);
    throw error;
  }
};

export const chatDelete = async (chatId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${chatId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete chat):', error);
    throw error;
  }
};
