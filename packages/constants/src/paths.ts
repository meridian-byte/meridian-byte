/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

const isProduction = process.env.NODE_ENV === 'production';
const useRemoteServer = process.env.NEXT_PUBLIC_USE_REMOTE_SERVER === 'true';

// Select API host
const HOSTNAME_API = isProduction
  ? process.env.NEXT_PUBLIC_HOST_API_PROD
  : useRemoteServer
    ? process.env.NEXT_PUBLIC_HOST_API_PROD
    : process.env.NEXT_PUBLIC_HOST_API_DEV;

// Select WEB host
export const HOSTNAME_WEB = isProduction
  ? process.env.NEXT_PUBLIC_HOST_WEB_PROD
  : process.env.NEXT_PUBLIC_HOST_WEB_DEV;

// Select ATLAS host
export const HOSTNAME_ATLAS = isProduction
  ? process.env.NEXT_PUBLIC_HOST_ATLAS_PROD
  : process.env.NEXT_PUBLIC_HOST_ATLAS_DEV;

export const AUTH_URLS = {
  SIGN_IN: `/auth/sign-in`,
  SIGN_UP: `/auth/sign-up`,
  CHECK_EMAIL: `/auth/check-email`,
  ERROR: `/auth/error`,
  SIGN_OUT: `/auth/sign-out`,
  SIGNED_OUT: `/auth/signed-out`,
  REDIRECT: {
    DEFAULT: '/',
  },
};

export const getUrlPrefix = (host: string | undefined) => {
  if (!host) return 'http://';
  return host.includes('localhost') ? 'http://' : 'https://';
};

export const BASE_URL = {
  API: `${getUrlPrefix(HOSTNAME_API)}${HOSTNAME_API}`,
  WEB: `${getUrlPrefix(HOSTNAME_WEB)}${HOSTNAME_WEB}`,
  ATLAS: `${getUrlPrefix(HOSTNAME_ATLAS)}${HOSTNAME_ATLAS}`,
};

export const API_URL = `${BASE_URL.API}/api`;

export const SHARED_VERCEL_SUBSTRING = 'meridianbyte';
