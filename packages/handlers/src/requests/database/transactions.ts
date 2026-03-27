/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import {
  TransactionCreate,
  TransactionRelations,
  TransactionUpdate,
} from '@repo/types/models/transaction';

const baseRequestUrl = `${API_URL}/transactions`;

export const transactionsGet = async (params?: { userId?: string }) => {
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
    console.error('---> handler error - (get transactions):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const transactionsUpdate = async (
  transactions: TransactionRelations[],
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
      body: JSON.stringify({ transactions, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update transactions):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const transactionGet = async (params: { transactionId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.transactionId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get transaction):', error);
    throw error;
  }
};

export const transactionCreate = async (transaction: TransactionCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(transaction),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create transaction):', error);
    throw error;
  }
};

export const transactionUpdate = async (transaction: TransactionUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${transaction.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(transaction),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update transaction):', error);
    throw error;
  }
};

export const transactionDelete = async (transactionId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${transactionId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete transaction):', error);
    throw error;
  }
};
