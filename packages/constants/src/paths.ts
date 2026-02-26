/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

const isProduction = process.env.NODE_ENV === 'production';
const useRemoteServer = process.env.NEXT_PUBLIC_USE_REMOTE_SERVER === 'true';

// Select web client host
export const HOSTNAME_CLIENT_WEB = isProduction
  ? process.env.NEXT_PUBLIC_HOST_CLIENT_WEB_PROD
  : process.env.NEXT_PUBLIC_HOST_CLIENT_WEB_DEV;

// Select frakt client host
export const HOSTNAME_CLIENT_FRAKT = isProduction
  ? process.env.NEXT_PUBLIC_HOST_CLIENT_FRAKT_PROD
  : process.env.NEXT_PUBLIC_HOST_CLIENT_FRAKT_DEV;

// Select KAIRO client host
export const HOSTNAME_CLIENT_KAIRO = isProduction
  ? process.env.NEXT_PUBLIC_HOST_CLIENT_KAIRO_PROD
  : process.env.NEXT_PUBLIC_HOST_CLIENT_KAIRO_DEV;

// Select MAI client host
export const HOSTNAME_CLIENT_MAI = isProduction
  ? process.env.NEXT_PUBLIC_HOST_CLIENT_MAI_PROD
  : process.env.NEXT_PUBLIC_HOST_CLIENT_MAI_DEV;

// Select sate client host
export const HOSTNAME_CLIENT_SATE = isProduction
  ? process.env.NEXT_PUBLIC_HOST_CLIENT_SATE_PROD
  : process.env.NEXT_PUBLIC_HOST_CLIENT_SATE_DEV;

// Select noteline client host
export const HOSTNAME_CLIENT_NOTELINE = isProduction
  ? process.env.NEXT_PUBLIC_HOST_CLIENT_NOTELINE_PROD
  : process.env.NEXT_PUBLIC_HOST_CLIENT_NOTELINE_DEV;

// Select server host
const HOSTNAME_SERVER = isProduction
  ? process.env.NEXT_PUBLIC_HOST_SERVER_PROD
  : useRemoteServer
    ? process.env.NEXT_PUBLIC_HOST_SERVER_PROD
    : process.env.NEXT_PUBLIC_HOST_SERVER_DEV;

export const getUrlPrefix = (host: string | undefined) => {
  if (!host) return 'http://';
  return host.includes('localhost') ? 'http://' : 'https://';
};

export const BASE_URL_SERVER = `${getUrlPrefix(HOSTNAME_SERVER)}${HOSTNAME_SERVER}`;

export const HOSTED_BASE_URL = {
  CLIENT_WEB: process.env.NEXT_PUBLIC_HOST_CLIENT_WEB_PROD || '',
  SERVER: process.env.NEXT_PUBLIC_HOST_SERVER_PROD || '',
};

export const PRODUCTION_BASE_URL_CLIENT_WEB = {
  DEFAULT: `https://template-next.com`,
};

export const API_URL = `${BASE_URL_SERVER}/api`;

export const GEO_DATA_URL = {
  COUNTRIES: `${process.env.NEXT_PUBLIC_REST_COUNTRIES_API_URL}`,
};

export const AUTH_URLS = {
  SIGN_IN: `/auth/sign-in`,
  SIGN_UP: `/auth/sign-up`,
  CHECK_EMAIL: `/auth/check-email`,
  ERROR: `/auth/error`,
  SIGN_OUT: `/auth/sign-out`,
  REDIRECT: {
    DEFAULT: '/app',
  },
};

export const BASE_URL_CLIENT = {
  FRAKT: `${getUrlPrefix(HOSTNAME_CLIENT_FRAKT)}${HOSTNAME_CLIENT_FRAKT}`,
  KAIRO: `${getUrlPrefix(HOSTNAME_CLIENT_KAIRO)}${HOSTNAME_CLIENT_KAIRO}`,
  MAI: `${getUrlPrefix(HOSTNAME_CLIENT_MAI)}${HOSTNAME_CLIENT_MAI}`,
  NOTELINE: `${getUrlPrefix(HOSTNAME_CLIENT_NOTELINE)}${HOSTNAME_CLIENT_NOTELINE}`,
  SATE: `${getUrlPrefix(HOSTNAME_CLIENT_SATE)}${HOSTNAME_CLIENT_SATE}`,
  WEB: `${getUrlPrefix(HOSTNAME_CLIENT_WEB)}${HOSTNAME_CLIENT_WEB}`,
};
