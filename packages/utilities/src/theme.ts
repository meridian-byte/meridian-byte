import { COOKIE_NAME } from '@repo/constants/names';
import { getCookieServer } from './cookie-server';
import { DEFAULT_COLOR_SCHEME } from '@repo/constants/other';
import { ColorScheme } from '@repo/types/enums';

export const getThemeLogo = async (params: {
  lightImage: string;
  darkImage: string;
}) => {
  // 1. Get the CALCULATED theme from middleware (not the 'auto' state)
  const theme =
    (await getCookieServer(COOKIE_NAME.COLOR_SCHEME)) || DEFAULT_COLOR_SCHEME;
  const resolvedTheme = (theme || DEFAULT_COLOR_SCHEME) as any;

  if (resolvedTheme == ColorScheme.DARK) return params.darkImage;
  if (resolvedTheme == ColorScheme.LIGHT) return params.lightImage;
};
