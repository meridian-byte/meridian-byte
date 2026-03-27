/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { SignIn, SignOut } from '@repo/types/auth';

export const signIn = async (params: SignIn & { apiUrl: string }) => {
  try {
    const response = await fetch(`${params.apiUrl}/auth/sign-in`, {
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
    const response = await fetch(
      `${params.options.baseUrl}/api/auth/sign-out`,
      {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    return response;
  } catch (error) {
    console.error('---> handler error (sign out):', error);
    throw error;
  }
};
