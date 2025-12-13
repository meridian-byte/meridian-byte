/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { SignIn, SignUp } from '@repo/types/auth';
import { API_URL } from '@repo/constants/paths';

export const signIn = async (params: SignIn) => {
  try {
    const response = await fetch(`${API_URL}/auth/sign-in`, {
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

export const signUp = async (params: SignUp) => {
  try {
    const response = await fetch(`${API_URL}/auth/sign-up`, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    return response;
  } catch (error) {
    console.error('---> handler error (sign up):', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/sign-out`, {
      method: 'POST',
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
