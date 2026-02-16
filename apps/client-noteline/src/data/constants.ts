import { getUrlPrefix, HOSTNAME_CLIENT_NOTELINE } from '@repo/constants/paths';

export const BASE_URL_CLIENT = `${getUrlPrefix(HOSTNAME_CLIENT_NOTELINE)}${HOSTNAME_CLIENT_NOTELINE}`;

export const APP_NAME = 'Noteline';

export const APP_DESC =
  'A lightweight and optimized Next.js template for building fast, SEO-friendly websites.';

export const AUTH_URLS = {
  SIGN_IN: '/auth/sign-in',
  SIGN_UP: '/auth/sign-up',
  CHECK_EMAIL: '/auth/check-email',
  ERROR: '/auth/error',
  SIGN_OUT: '/auth/sign-out',
  REDIRECT: { DEFAULT: '/app' },
};

export const APPSHELL = {
  HEADER_HEIGHT: 48,
  SCROLLBAR_WIDTH: 8,
  NAVBAR_WIDTH: 48,
};
