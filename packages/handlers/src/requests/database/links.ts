import { LinkCreate, LinkGet, LinkUpdate } from '@repo/types';
import { apiCall } from './fetch';

const segment = 'links';

export const linksGet = (params: { apiUrl: string; userId?: string }) => {
  const query = params?.userId ? `?userId=${params.userId}` : '';
  return apiCall(segment + query, 'GET', params.apiUrl);
};

let currentController: AbortController | null = null;

export const linksUpdate = async (apiUrl: string, links: LinkGet[], deletedIds?: string[]) => {
  if (currentController) currentController.abort();
  currentController = new AbortController();

  try {
    return await apiCall(
      segment + '',
      'PUT',
      apiUrl,
      { links, deletedIds },
      currentController.signal,
    );
  } finally {
    currentController = null;
  }
};

export const linkGet = (params: { apiUrl: string; linkId: string }) => {
  return apiCall(segment + `/${params.linkId}`, 'GET', params.apiUrl);
};

export const linkCreate = (apiUrl: string, link: LinkCreate) => {
  return apiCall(segment + '/create', 'POST', apiUrl, link);
};

export const linkUpdate = (apiUrl: string, link: LinkUpdate) => {
  return apiCall(segment + `/${link.id}`, 'PUT', apiUrl, link);
};

export const linkDelete = (apiUrl: string, linkId: string) => {
  return apiCall(segment + `/${linkId}`, 'DELETE', apiUrl);
};
