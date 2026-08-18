/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { TaskListCreate, TaskListGet, TaskListUpdate } from '@repo/types';
import { apiCall } from './fetch';

const segment = 'task-lists';

export const taskListsGet = (params: { apiUrl: string; userId?: string }) => {
  const query = params?.userId ? `?userId=${params.userId}` : '';
  return apiCall(segment + query, 'GET', params.apiUrl);
};

let currentController: AbortController | null = null;

export const taskListsUpdate = async (
  apiUrl: string,
  taskLists: TaskListGet[],
  deletedIds?: string[],
) => {
  if (currentController) currentController.abort();
  currentController = new AbortController();

  try {
    return await apiCall(
      segment + '',
      'PUT',
      apiUrl,
      { taskLists, deletedIds },
      currentController.signal,
    );
  } finally {
    currentController = null;
  }
};

export const taskListGet = (params: { apiUrl: string; taskListId: string }) => {
  return apiCall(segment + `/${params.taskListId}`, 'GET', params.apiUrl);
};

export const taskListCreate = (apiUrl: string, taskList: TaskListCreate) => {
  return apiCall(segment + '/create', 'POST', apiUrl, taskList);
};

export const taskListUpdate = (apiUrl: string, taskList: TaskListUpdate) => {
  return apiCall(segment + `/${taskList.id}`, 'PUT', apiUrl, taskList);
};

export const taskListDelete = (apiUrl: string, taskListId: string) => {
  return apiCall(segment + `/${taskListId}`, 'DELETE', apiUrl);
};
