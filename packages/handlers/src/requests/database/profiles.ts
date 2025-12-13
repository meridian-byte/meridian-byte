/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import {
  ProfileCreate,
  ProfileRelations,
  ProfileUpdate,
} from '@repo/types/models/profile';

const baseRequestUrl = `${API_URL}/profiles`;

export const profilesGet = async () => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get profiles):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const profilesUpdate = async (
  profiles: ProfileRelations[],
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
      body: JSON.stringify({ profiles, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update profiles):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const profileGet = async (params: { profileId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.profileId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get profile):', error);
    throw error;
  }
};

export const profileCreate = async (profile: ProfileCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(profile),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create profile):', error);
    throw error;
  }
};

export const profileUpdate = async (profile: ProfileUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${profile.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(profile),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update profile):', error);
    throw error;
  }
};

export const profileDelete = async (profileId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${profileId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete profile):', error);
    throw error;
  }
};
