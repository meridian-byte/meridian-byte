import { CalendarCreate, CalendarGet, CalendarUpdate } from '@repo/types';
import { apiCall } from './fetch';

const segment = 'calendars';

export const calendarsGet = (params: { apiUrl: string; userId?: string }) => {
  const query = params?.userId ? `?userId=${params.userId}` : '';
  return apiCall(segment + query, 'GET', params.apiUrl);
};

let currentController: AbortController | null = null;

export const calendarsUpdate = async (
  apiUrl: string,
  calendars: CalendarGet[],
  deletedIds?: string[],
) => {
  if (currentController) currentController.abort();
  currentController = new AbortController();

  try {
    return await apiCall(
      segment + '',
      'PUT',
      apiUrl,
      { calendars, deletedIds },
      currentController.signal,
    );
  } finally {
    currentController = null;
  }
};

export const calendarGet = (params: { apiUrl: string; calendarId: string }) => {
  return apiCall(segment + `/${params.calendarId}`, 'GET', params.apiUrl);
};

export const calendarCreate = (apiUrl: string, calendar: CalendarCreate) => {
  return apiCall(segment + '/create', 'POST', apiUrl, calendar);
};

export const calendarUpdate = (apiUrl: string, calendar: CalendarUpdate) => {
  return apiCall(segment + `/${calendar.id}`, 'PUT', apiUrl, calendar);
};

export const calendarDelete = (apiUrl: string, calendarId: string) => {
  return apiCall(segment + `/${calendarId}`, 'DELETE', apiUrl);
};
