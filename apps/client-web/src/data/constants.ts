import { getUrlPrefix, HOSTNAME_CLIENT_WEB } from '@repo/constants/paths';

export const BASE_URL_CLIENT = `${getUrlPrefix(HOSTNAME_CLIENT_WEB)}${HOSTNAME_CLIENT_WEB}`;

export const AUTH_URLS = {
  SIGN_IN: `${BASE_URL_CLIENT}/auth/sign-in`,
  SIGN_UP: `${BASE_URL_CLIENT}/auth/sign-up`,
  CHECK_EMAIL: `${BASE_URL_CLIENT}/auth/check-email`,
  ERROR: `${BASE_URL_CLIENT}/auth/error`,
  SIGN_OUT: `${BASE_URL_CLIENT}/auth/sign-out`,
  REDIRECT: { DEFAULT: '/' },
};
