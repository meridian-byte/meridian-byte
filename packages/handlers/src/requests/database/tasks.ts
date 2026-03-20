/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import { TaskCreate, TaskRelations, TaskUpdate } from '@repo/types/models/task';

const baseRequestUrl = `${API_URL}/tasks`;

export const tasksGet = async (params?: { userId?: string }) => {
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
    console.error('---> handler error - (get tasks):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const tasksUpdate = async (
  tasks: TaskRelations[],
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
      body: JSON.stringify({ tasks, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update tasks):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const taskGet = async (params: { taskId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.taskId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get task):', error);
    throw error;
  }
};

export const taskCreate = async (task: TaskCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(task),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create task):', error);
    throw error;
  }
};

export const taskUpdate = async (task: TaskUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${task.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(task),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update task):', error);
    throw error;
  }
};

export const taskDelete = async (taskId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${taskId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete task):', error);
    throw error;
  }
};
