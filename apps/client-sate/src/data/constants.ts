import { getUrlPrefix, HOSTNAME_CLIENT_SATE } from '@repo/constants/paths';

export const APP_NAME = 'Sate';

export const APP_DESC =
  'A lightweight and optimized Next.js template for building fast, SEO-friendly websites.';

export const BASE_URL_CLIENT = `${getUrlPrefix(HOSTNAME_CLIENT_SATE)}${HOSTNAME_CLIENT_SATE}`;

export const AUTH_URLS = {
  SIGN_IN: `${BASE_URL_CLIENT}/auth/sign-in`,
  SIGN_UP: `${BASE_URL_CLIENT}/auth/sign-up`,
  CHECK_EMAIL: `${BASE_URL_CLIENT}/auth/check-email`,
  ERROR: `${BASE_URL_CLIENT}/auth/error`,
  SIGN_OUT: `${BASE_URL_CLIENT}/auth/sign-out`,
  REDIRECT: {
    DEFAULT: '/app',
  },
};
