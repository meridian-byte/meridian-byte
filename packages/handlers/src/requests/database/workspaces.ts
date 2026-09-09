import { WorkspaceCreate, WorkspaceGet, WorkspaceUpdate } from '@repo/types';
import { apiCall } from './fetch';

const segment = 'workspaces';

export const workspacesGet = (params: { apiUrl: string; userId?: string }) => {
  const query = params?.userId ? `?userId=${params.userId}` : '';
  return apiCall(segment + query, 'GET', params.apiUrl);
};

let currentController: AbortController | null = null;

export const workspacesUpdate = async (
  apiUrl: string,
  workspaces: WorkspaceGet[],
  deletedIds?: string[],
) => {
  if (currentController) currentController.abort();
  currentController = new AbortController();

  try {
    return await apiCall(
      segment + '',
      'PUT',
      apiUrl,
      { workspaces, deletedIds },
      currentController.signal,
    );
  } finally {
    currentController = null;
  }
};

export const workspaceGet = (params: { apiUrl: string; workspaceId: string }) => {
  return apiCall(segment + `/${params.workspaceId}`, 'GET', params.apiUrl);
};

export const workspaceCreate = (apiUrl: string, workspace: WorkspaceCreate) => {
  return apiCall(segment + '/create', 'POST', apiUrl, workspace);
};

export const workspaceUpdate = (apiUrl: string, workspace: WorkspaceUpdate) => {
  return apiCall(segment + `/${workspace.id}`, 'PUT', apiUrl, workspace);
};

export const workspaceDelete = (apiUrl: string, workspaceId: string) => {
  return apiCall(segment + `/${workspaceId}`, 'DELETE', apiUrl);
};
