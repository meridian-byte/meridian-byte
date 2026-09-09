import { AUTH_URLS } from '@repo/constants';
import { SignIn, SignOut } from '@repo/types';

export const signIn = async (params: SignIn & { apiUrl: string }) => {
  try {
    const response = await fetch(`${params.apiUrl + AUTH_URLS.SIGN_IN}`, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    return response;
  } catch (error) {
    console.error('---> handler error (sign in):', error);
    throw error;
  }
};

export const signOut = async (params: SignOut) => {
  try {
    const response = await fetch(`${params.options.baseUrl}/api${AUTH_URLS.SIGN_OUT}`, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    return response;
  } catch (error) {
    console.error('---> handler error (sign out):', error);
    throw error;
  }
};
