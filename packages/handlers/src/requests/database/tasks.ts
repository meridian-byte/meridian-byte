/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { TaskCreate, TaskGet, TaskUpdate } from '@repo/types';
import { apiCall } from './fetch';

const segment = 'tasks';

export const tasksGet = (params: { apiUrl: string; userId?: string }) => {
  const query = params?.userId ? `?userId=${params.userId}` : '';
  return apiCall(segment + query, 'GET', params.apiUrl);
};

let currentController: AbortController | null = null;

export const tasksUpdate = async (apiUrl: string, tasks: TaskGet[], deletedIds?: string[]) => {
  if (currentController) currentController.abort();
  currentController = new AbortController();

  try {
    return await apiCall(
      segment + '',
      'PUT',
      apiUrl,
      { tasks, deletedIds },
      currentController.signal,
    );
  } finally {
    currentController = null;
  }
};

export const taskGet = (params: { apiUrl: string; taskId: string }) => {
  return apiCall(segment + `/${params.taskId}`, 'GET', params.apiUrl);
};

export const taskCreate = (apiUrl: string, task: TaskCreate) => {
  return apiCall(segment + '/create', 'POST', apiUrl, task);
};

export const taskUpdate = (apiUrl: string, task: TaskUpdate) => {
  return apiCall(segment + `/${task.id}`, 'PUT', apiUrl, task);
};

export const taskDelete = (apiUrl: string, taskId: string) => {
  return apiCall(segment + `/${taskId}`, 'DELETE', apiUrl);
};
