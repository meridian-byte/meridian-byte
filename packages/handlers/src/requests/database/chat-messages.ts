/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import {
  ChatMessageCreate,
  ChatMessageRelations,
  ChatMessageUpdate,
} from '@repo/types/models/chat-message';

const baseRequestUrl = `${API_URL}/chat-messages`;

export const chatMessagesGet = async (params?: { userId?: string }) => {
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
    console.error('---> handler error - (get chatMessages):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const chatMessagesUpdate = async (
  chatMessages: ChatMessageRelations[],
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
      body: JSON.stringify({ chatMessages, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update chatMessages):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const chatMessageGet = async (params: { chatMessageId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.chatMessageId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get chatMessage):', error);
    throw error;
  }
};

export const chatMessageCreate = async (chatMessage: ChatMessageCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(chatMessage),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create chatMessage):', error);
    throw error;
  }
};

export const chatMessageUpdate = async (chatMessage: ChatMessageUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${chatMessage.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(chatMessage),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update chatMessage):', error);
    throw error;
  }
};

export const chatMessageDelete = async (chatMessageId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${chatMessageId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete chatMessage):', error);
    throw error;
  }
};
