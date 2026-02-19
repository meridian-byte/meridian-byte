import { AUTH_URLS } from '@repo/constants/paths';
import { APP_DESC, APP_NAME } from '@repo/constants/app';
import { linkify } from '@repo/utilities/url';

export const dynamic = 'force-static';
export const revalidate = false;

export async function GET() {
  const manifest = {
    id: linkify(APP_NAME.FRAKT),
    name: APP_NAME.FRAKT,
    short_name: APP_NAME.FRAKT,
    description: APP_DESC,
    lang: 'en',
    dir: 'ltr',
    scope: '/',
    start_url: AUTH_URLS.REDIRECT.DEFAULT,
    display: 'standalone',
    display_override: ['window-controls-overlay', 'standalone'],
    theme_color: '#ffffff',
    background_color: '#b08e67',
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
