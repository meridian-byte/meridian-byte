import { getUrlPrefix, HOSTNAME_CLIENT_NOTELINE } from '@repo/constants/paths';

export const APP_NAME = 'Noteline';

export const APP_DESC =
  'A simple tool for capturing and organizing ideas, tasks, and information. It lets users create, edit, search, and structure notes so they can quickly store and retrieve important content.';

export const BASE_URL_CLIENT = `${getUrlPrefix(HOSTNAME_CLIENT_NOTELINE)}${HOSTNAME_CLIENT_NOTELINE}`;

export const APPSHELL = {
  HEADER_HEIGHT: 48,
  SCROLLBAR_WIDTH: 8,
  NAVBAR_WIDTH: 48,
};
