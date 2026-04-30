/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/tiptap/styles.css';

// custom styles
import '../styles/globals.scss';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import ProviderMantine from '@repo/components/provider/mantine';
import ProviderStore from '@/components/provider/store';
import ProviderSync from '@/components/provider/sync';
import { mantine } from '@/data/styles';
import { DEFAULT_COLOR_SCHEME } from '@repo/constants/other';
import { APP_DESC, COMPANY_NAME } from '@repo/constants/app';
import { APP_NAME } from '@repo/constants/app';
import { createClient } from '@repo/libraries/supabase/server';
import ItemEditProvider from '@repo/components/provider/item-edit';
import AppShellAppMain from '@repo/components/layout/shells/app/main';
import { APPSHELL } from '@/data/constants';
import HeaderAppMain from '@/components/layout/headers/app/main';
import NavbarAppParentMain from '@/components/layout/navbars/app/parent/main';
import PartialTabNavbarLinks from '@/components/partial/tabs/navbar/links';
import ProviderView from '@repo/components/provider/view';
import LayoutSection from '@repo/components/layout/section';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: COMPANY_NAME,
  description: APP_DESC.NOTELINE,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: session } = await supabase.auth.getUser();

  return (
    <html
      lang="en"
      {...mantineHtmlProps}
      data-mantine-color-scheme={DEFAULT_COLOR_SCHEME}
    >
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* General Web App Metadata */}
        <meta name="application-name" content={APP_NAME.NOTELINE} />
        <meta name="theme-color" content="#b08e67" />

        {/* Apple Web App Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={APP_NAME.NOTELINE} />

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

        <ColorSchemeScript defaultColorScheme={DEFAULT_COLOR_SCHEME} />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ProviderMantine
          options={{ withNotifications: true }}
          appThemeProps={{ styleSheets: { ...mantine } }}
          colorScheme={DEFAULT_COLOR_SCHEME}
        >
          <ProviderStore props={{ sessionUser: session.user }}>
            <ProviderSync>
              <ItemEditProvider>
                <AppShellAppMain
                  props={{
                    appShell: {
                      headerHeight: APPSHELL.HEADER_HEIGHT,
                      navbarWidth: APPSHELL.NAVBAR_WIDTH,
                    },
                    header: { component: <HeaderAppMain /> },
                    navbar: { component: <NavbarAppParentMain /> },
                    appShellChild: {
                      appShell: { headerHeight: APPSHELL.HEADER_HEIGHT },
                      leftSection: { component: <PartialTabNavbarLinks /> },
                    },
                  }}
                >
                  <ProviderView>
                    <LayoutSection
                      id={'app-children-content'}
                      padded
                      containerized={'sm'}
                    >
                      {children}
                    </LayoutSection>
                  </ProviderView>
                </AppShellAppMain>
              </ItemEditProvider>
            </ProviderSync>
          </ProviderStore>
        </ProviderMantine>
      </body>
    </html>
  );
}
