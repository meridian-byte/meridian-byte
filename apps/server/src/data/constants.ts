import { getUrlPrefix, HOSTNAME_CLIENT_WEB } from '@repo/constants/paths';

export const BASE_URL_CLIENT = `${getUrlPrefix(HOSTNAME_CLIENT_WEB)}${HOSTNAME_CLIENT_WEB}`;

export const AUTH_URLS = {
  SIGN_IN: `/auth/sign-in`,
  SIGN_UP: `/auth/sign-up`,
  CHECK_EMAIL: `/auth/check-email`,
  ERROR: `/auth/error`,
  SIGN_OUT: `/auth/sign-out`,
  REDIRECT: { DEFAULT: '/' },
};
