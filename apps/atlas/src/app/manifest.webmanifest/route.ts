import { AUTH_URLS } from '@repo/constants';
import { APP_DESC, APP_NAME } from '@repo/constants';
import { getOSTheme, linkify } from '@repo/utils';
import { getCookieServer } from '@repo/utils';
import { COOKIE_NAME } from '@repo/constants';
import { DEFAULT_COLOR_SCHEME } from '@repo/constants';
import { ColorScheme } from '@repo/types';
import { MantineColorScheme } from '@mantine/core';

export const dynamic = 'force-dynamic';

export async function GET() {
  const theme = await getCookieServer(COOKIE_NAME.COLOR_SCHEME);
  const resolvedTheme = (theme ||
    getOSTheme(DEFAULT_COLOR_SCHEME, { inServer: true })) as MantineColorScheme;

  const manifest = {
    id: linkify(APP_NAME.ATLAS),
    name: APP_NAME.ATLAS,
    short_name: APP_NAME.ATLAS,
    description: APP_DESC.WEB,
    lang: 'en',
    dir: 'ltr',
    scope: '/',
    start_url: AUTH_URLS.REDIRECT.DEFAULT,
    display: 'standalone',
    display_override: ['window-controls-overlay', 'standalone'],
    // theme_color: resolvedTheme == ColorScheme.LIGHT ? '#ffffff' : '#000000',
    background_color: resolvedTheme == ColorScheme.LIGHT ? '#ffffff' : '#000000',
    theme_color: '#b08e67',
    // background_color: '#b08e67',
    orientation: 'portrait-primary',
    categories: ['productivity'],
    prefer_related_applications: false,
    launch_handler: {
      client_mode: ['navigate-existing', 'auto'],
    },
    screenshots: [
      {
        src: '/images/screenshots/manifest/desktop/pave-month.png',
        sizes: '1920x1080',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Pave (Month View)',
      },
      {
        src: '/images/screenshots/manifest/mobile/pave-month.png',
        sizes: '391x860',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Pave (Month View)',
      },
    ],
    icons: [
      {
        src: '/images/brand/icon/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/brand/icon/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };

  return new Response(JSON.stringify(manifest), {
    headers: {
      'Content-Type': 'application/manifest+json',
    },
  });
}
