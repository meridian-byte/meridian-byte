import { getUrlPrefix, HOSTNAME_CLIENT_SATE } from '@repo/constants/paths';

export const APP_NAME = 'Sate';

export const APP_DESC =
  'A tool to record daily food intake and nutritional data. It helps users monitor calories, macros, and eating habits to support weight management and health goals.';

export const BASE_URL_CLIENT = `${getUrlPrefix(HOSTNAME_CLIENT_SATE)}${HOSTNAME_CLIENT_SATE}`;
