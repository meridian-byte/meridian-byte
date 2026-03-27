/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import { LinkCreate, LinkGet, LinkUpdate } from '@repo/types/models/link';

const baseRequestUrl = `${API_URL}/links`;

export const linksGet = async (params?: { userId?: string }) => {
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
    console.error('---> handler error - (get links):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const linksUpdate = async (links: LinkGet[], deletedIds?: string[]) => {
  // Cancel previous request if still in-flight
  if (currentController) currentController.abort();

  // New controller for this request
  currentController = new AbortController();

  try {
    const request = new Request(baseRequestUrl, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify({ links, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update links):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const linkGet = async (params: { linkId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.linkId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get link):', error);
    throw error;
  }
};

export const linkCreate = async (link: LinkCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(link),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create link):', error);
    throw error;
  }
};

export const linkUpdate = async (link: LinkUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${link.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(link),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update link):', error);
    throw error;
  }
};

export const linkDelete = async (linkId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${linkId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete link):', error);
    throw error;
  }
};
