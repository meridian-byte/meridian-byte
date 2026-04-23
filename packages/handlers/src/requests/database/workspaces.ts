/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import {
  WorkspaceCreate,
  WorkspaceRelations,
  WorkspaceUpdate,
} from '@repo/types/models/workspace';

const baseRequestUrl = `${API_URL}/workspaces`;

export const workspacesGet = async (params?: { userId?: string }) => {
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
    console.error('---> handler error - (get workspaces):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const workspacesUpdate = async (
  workspaces: WorkspaceRelations[],
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
      body: JSON.stringify({ workspaces, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update workspaces):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const workspaceGet = async (params: { workspaceId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.workspaceId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get workspace):', error);
    throw error;
  }
};

export const workspaceCreate = async (workspace: WorkspaceCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(workspace),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create workspace):', error);
    throw error;
  }
};

export const workspaceUpdate = async (workspace: WorkspaceUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${workspace.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(workspace),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update workspace):', error);
    throw error;
  }
};

export const workspaceDelete = async (workspaceId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${workspaceId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete workspace):', error);
    throw error;
  }
};
