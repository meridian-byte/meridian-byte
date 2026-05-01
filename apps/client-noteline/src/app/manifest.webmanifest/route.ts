import { AUTH_URLS } from '@repo/constants/paths';
import { APP_DESC, APP_NAME } from '@repo/constants/app';
import { linkify } from '@repo/utilities/url';
import { getCookieServer } from '@repo/utilities/cookie-server';
import { COOKIE_NAME } from '@repo/constants/names';
import { DEFAULT_COLOR_SCHEME } from '@repo/constants/other';
import { ColorScheme } from '@repo/types/enums';
import { MantineColorScheme } from '@mantine/core';

export const dynamic = 'force-static';
export const revalidate = false;

export async function GET() {
  const theme =
    (await getCookieServer(COOKIE_NAME.COLOR_SCHEME)) || DEFAULT_COLOR_SCHEME;
  const resolvedTheme = (theme || DEFAULT_COLOR_SCHEME) as MantineColorScheme;

  const manifest = {
    id: linkify(APP_NAME.NOTELINE),
    name: APP_NAME.NOTELINE,
    short_name: APP_NAME.NOTELINE,
    description: APP_DESC.NOTELINE,
    lang: 'en',
    dir: 'ltr',
    scope: '/',
    start_url: AUTH_URLS.REDIRECT.DEFAULT,
    display: 'standalone',
    display_override: ['window-controls-overlay', 'standalone'],
    theme_color: resolvedTheme == ColorScheme.LIGHT ? '#ffffff' : '#000000',
    background_color:
      resolvedTheme == ColorScheme.LIGHT ? '#ffffff' : '#000000',
    orientation: 'portrait-primary',
    categories: ['productivity'],
    prefer_related_applications: false,
    launch_handler: {
      client_mode: ['navigate-existing', 'auto'],
    },
    screenshots: [
      {
        src: '/images/screenshots/manifest/desktop/home.png',
        sizes: '1920x1080',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Home Page',
      },
      {
        src: '/images/screenshots/manifest/desktop/inbox.png',
        sizes: '1920x1080',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Inbox Page',
      },
      {
        src: '/images/screenshots/manifest/mobile/home.jpeg',
        sizes: '540x1110',
        type: 'image/jpeg',
        form_factor: 'narrow',
        label: 'Home Page',
      },
      {
        src: '/images/screenshots/manifest/mobile/inbox.jpeg',
        sizes: '540x1110',
        type: 'image/jpeg',
        form_factor: 'narrow',
        label: 'Inbox Page',
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
