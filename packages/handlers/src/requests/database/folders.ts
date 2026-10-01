import { FolderCreate, FolderGet, FolderUpdate } from '@repo/types';
import { apiCall } from './fetch';

const segment = 'folders';

export const foldersGet = (params: { apiUrl: string; userId?: string }) => {
  const query = params?.userId ? `?userId=${params.userId}` : '';
  return apiCall(segment + query, 'GET', params.apiUrl);
};

let currentController: AbortController | null = null;

export const foldersUpdate = async (
  apiUrl: string,
  folders: FolderGet[],
  deletedIds?: string[],
) => {
  if (currentController) currentController.abort();
  currentController = new AbortController();

  try {
    return await apiCall(
      segment + '',
      'PUT',
      apiUrl,
      { folders, deletedIds },
      currentController.signal,
    );
  } finally {
    currentController = null;
  }
};

export const folderGet = (params: { apiUrl: string; folderId: string }) => {
  return apiCall(segment + `/${params.folderId}`, 'GET', params.apiUrl);
};

export const folderCreate = (apiUrl: string, folder: FolderCreate) => {
  return apiCall(segment + '/create', 'POST', apiUrl, folder);
};

export const folderUpdate = (apiUrl: string, folder: FolderUpdate) => {
  return apiCall(segment + `/${folder.id}`, 'PUT', apiUrl, folder);
};

export const folderDelete = (apiUrl: string, folderId: string) => {
  return apiCall(segment + `/${folderId}`, 'DELETE', apiUrl);
};
