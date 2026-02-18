import { companyName } from '@repo/constants/app';
import { getUrlPrefix, HOSTNAME_CLIENT_WEB } from '@repo/constants/paths';

export const APP_NAME = companyName;

export const APP_DESC =
  'A lightweight and optimized Next.js template for building fast, SEO-friendly websites.';

export const BASE_URL_CLIENT = `${getUrlPrefix(HOSTNAME_CLIENT_WEB)}${HOSTNAME_CLIENT_WEB}`;
