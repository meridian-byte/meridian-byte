import { getUrlPrefix, HOSTNAME_CLIENT_FRAKT } from '@repo/constants/paths';

export const APP_NAME = 'Frakt';

export const APP_DESC =
  'A tool to help users track income, expenses, and savings in one place. It categorizes transactions, shows spending patterns, and provides insights to improve financial decisions and stay within budget.';

export const BASE_URL_CLIENT = `${getUrlPrefix(HOSTNAME_CLIENT_FRAKT)}${HOSTNAME_CLIENT_FRAKT}`;
