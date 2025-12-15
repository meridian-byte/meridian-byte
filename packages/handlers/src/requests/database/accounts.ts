/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import {
  AccountCreate,
  AccountRelations,
  AccountUpdate,
} from '@repo/types/models/account';

const baseRequestUrl = `${API_URL}/accounts`;

export const accountsGet = async () => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get accounts):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const accountsUpdate = async (
  accounts: AccountRelations[],
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
      body: JSON.stringify({ accounts, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update accounts):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const accountGet = async (params: { accountId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.accountId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get account):', error);
    throw error;
  }
};

export const accountCreate = async (account: AccountCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(account),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create account):', error);
    throw error;
  }
};

export const accountUpdate = async (account: AccountUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${account.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(account),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update account):', error);
    throw error;
  }
};

export const accountDelete = async (accountId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${accountId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete account):', error);
    throw error;
  }
};
