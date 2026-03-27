/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import {
  CustomizationCreate,
  CustomizationRelations,
  CustomizationUpdate,
} from '@repo/types/models/customization';

const baseRequestUrl = `${API_URL}/customizations`;

export const customizationsGet = async (params?: { userId?: string }) => {
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
    console.error('---> handler error - (get customizations):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const customizationsUpdate = async (
  customizations: CustomizationRelations[],
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
      body: JSON.stringify({ customizations, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update customizations):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const customizationGet = async (params: { customizationId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.customizationId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get customization):', error);
    throw error;
  }
};

export const customizationCreate = async (
  customization: CustomizationCreate
) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(customization),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create customization):', error);
    throw error;
  }
};

export const customizationUpdate = async (
  customization: CustomizationUpdate
) => {
  try {
    const request = new Request(`${baseRequestUrl}/${customization.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(customization),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update customization):', error);
    throw error;
  }
};

export const customizationDelete = async (customizationId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${customizationId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete customization):', error);
    throw error;
  }
};
