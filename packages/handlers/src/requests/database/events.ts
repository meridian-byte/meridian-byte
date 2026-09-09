import { EventCreate, EventGet, EventUpdate } from '@repo/types';
import { apiCall } from './fetch';

const segment = 'events';

export const eventsGet = (params: { apiUrl: string; userId?: string }) => {
  const query = params?.userId ? `?userId=${params.userId}` : '';
  return apiCall(segment + query, 'GET', params.apiUrl);
};

let currentController: AbortController | null = null;

export const eventsUpdate = async (apiUrl: string, events: EventGet[], deletedIds?: string[]) => {
  if (currentController) currentController.abort();
  currentController = new AbortController();

  try {
    return await apiCall(
      segment + '',
      'PUT',
      apiUrl,
      { events, deletedIds },
      currentController.signal,
    );
  } finally {
    currentController = null;
  }
};

export const eventGet = (params: { apiUrl: string; eventId: string }) => {
  return apiCall(segment + `/${params.eventId}`, 'GET', params.apiUrl);
};

export const eventCreate = (apiUrl: string, event: EventCreate) => {
  return apiCall(segment + '/create', 'POST', apiUrl, event);
};

export const eventUpdate = (apiUrl: string, event: EventUpdate) => {
  return apiCall(segment + `/${event.id}`, 'PUT', apiUrl, event);
};

export const eventDelete = (apiUrl: string, eventId: string) => {
  return apiCall(segment + `/${eventId}`, 'DELETE', apiUrl);
};
