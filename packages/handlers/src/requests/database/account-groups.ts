/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import {
  AccountGroupCreate,
  AccountGroupRelations,
  AccountGroupUpdate,
} from '@repo/types/models/account-group';

const baseRequestUrl = `${API_URL}/accountGroups`;

export const accountGroupsGet = async (params?: { userId?: string }) => {
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
    console.error('---> handler error - (get accountGroups):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const accountGroupsUpdate = async (
  accountGroups: AccountGroupRelations[],
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
      body: JSON.stringify({ accountGroups, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update accountGroups):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const accountGroupGet = async (params: { accountGroupId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.accountGroupId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get accountGroup):', error);
    throw error;
  }
};

export const accountGroupCreate = async (accountGroup: AccountGroupCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(accountGroup),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create accountGroup):', error);
    throw error;
  }
};

export const accountGroupUpdate = async (accountGroup: AccountGroupUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${accountGroup.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(accountGroup),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update accountGroup):', error);
    throw error;
  }
};

export const accountGroupDelete = async (accountGroupId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${accountGroupId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete accountGroup):', error);
    throw error;
  }
};
