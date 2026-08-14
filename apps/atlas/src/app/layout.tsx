import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { API_URL, APP_DESC, APP_NAME, BASE_URL, DEFAULT_COLOR_SCHEME } from '@repo/constants';
import { createClientcloudbaseServer } from '@repo/cloudbase';
import { getCookieServer } from '@repo/utils';
import { COOKIE_NAME } from '@repo/constants';
import { ProviderMantine, ProviderInitialize, ProviderSync } from '@repo/ui';
import { ColorSchemeScript, MantineColorScheme, mantineHtmlProps } from '@mantine/core';
import { getAppTheme } from '@repo/constants';
import { getAppResolver } from '@atlas/resolver';
import { ColorScheme } from '@repo/types';

import './globals.css';

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
// ‼️ import schedule styles after core and dates package styles
import '@mantine/schedule/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/tiptap/styles.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: APP_NAME.ATLAS,
  description: APP_DESC.ATLAS,
  robots: {
    index: false,
    follow: false,
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClientcloudbaseServer();
  const { data: session } = await supabase.auth.getUser();

  // 1. Get the CALCULATED theme from middleware (not the 'auto' state)
  const theme = (await getCookieServer(COOKIE_NAME.COLOR_SCHEME)) || DEFAULT_COLOR_SCHEME;
  const resolvedTheme = (theme || DEFAULT_COLOR_SCHEME) as MantineColorScheme;

  return (
    <html
      lang="en"
      {...mantineHtmlProps}
      data-mantine-color-scheme={resolvedTheme}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta charSet="UTF-8" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
          viewport-fit="cover"
        />

        {/* General Web App Metadata */}
        <meta name="application-name" content={APP_NAME.ATLAS} />
        <meta name="theme-color" content={'#CBB399'} />
        <meta
          name="background-color"
          content={resolvedTheme == ColorScheme.LIGHT ? '#ffffff' : '#000000'}
        />

        {/* Apple Web App Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content={APP_NAME.ATLAS} />

        {/* Misc. Mobile Enhancements */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Icons */}
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/brand/icon/web-app-manifest-192x192.png"
        />

        <link rel="manifest" href="/manifest.webmanifest" />

        <ColorSchemeScript defaultColorScheme={resolvedTheme} />
      </head>

      <body className="min-h-full flex flex-col">
        <ProviderMantine
          options={{ withNotifications: true }}
          colorScheme={resolvedTheme}
          theme={getAppTheme}
          cssVariablesResolver={getAppResolver}
        >
          <ProviderInitialize props={{ baseUrl: API_URL, sessionUser: session.user }}>
            <ProviderSync>{children}</ProviderSync>
          </ProviderInitialize>
        </ProviderMantine>
      </body>
    </html>
  );
}
