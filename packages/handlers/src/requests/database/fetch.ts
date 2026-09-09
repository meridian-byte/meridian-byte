import { HEADERS } from '@repo/constants';

export const apiCall = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  baseRequestUrl: string,
  body?: any,
  signal?: AbortSignal,
) => {
  const url = `${baseRequestUrl}/${endpoint}`;
  const hasBody = !!body;
  const headers = hasBody ? HEADERS.WITH_BODY : HEADERS.WITHOUT_BODY;

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: hasBody ? JSON.stringify(body) : undefined,
      signal,
    });

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    // Try to parse as JSON if the response has content
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return response;
  } catch (error) {
    console.error(`---> handler error - (${method} ${endpoint}):`, error);
    throw error;
  }
};
