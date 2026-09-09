import { ProfileCreate, ProfileGet, ProfileUpdate } from '@repo/types';
import { apiCall } from './fetch';

const segment = 'profiles';

export const profilesGet = (params: { apiUrl: string; userId?: string }) => {
  const query = params?.userId ? `?userId=${params.userId}` : '';
  return apiCall(segment + query, 'GET', params.apiUrl);
};

let currentController: AbortController | null = null;

export const profilesUpdate = async (
  apiUrl: string,
  profiles: ProfileGet[],
  deletedIds?: string[],
) => {
  if (currentController) currentController.abort();
  currentController = new AbortController();

  try {
    return await apiCall(
      segment + '',
      'PUT',
      apiUrl,
      { profiles, deletedIds },
      currentController.signal,
    );
  } finally {
    currentController = null;
  }
};

export const profileGet = (params: { apiUrl: string; profileId: string }) => {
  return apiCall(segment + `/${params.profileId}`, 'GET', params.apiUrl);
};

export const profileCreate = (apiUrl: string, profile: ProfileCreate) => {
  return apiCall(segment + `/${profile.id || 'create'}`, 'POST', apiUrl, profile);
};

export const profileUpdate = (apiUrl: string, profile: ProfileUpdate) => {
  return apiCall(segment + `/${profile.id}`, 'PUT', apiUrl, profile);
};

export const profileDelete = (apiUrl: string, profileId: string) => {
  return apiCall(segment + `/${profileId}`, 'DELETE', apiUrl);
};
