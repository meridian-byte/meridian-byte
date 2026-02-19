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

// custom styles
import '../styles/globals.scss';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import ProviderMantine from '@repo/components/provider/mantine';
import ProviderStore from '@/components/provider/store';
import { mantine } from '@/data/styles';
import { DEFAULT_COLOR_SCHEME } from '@repo/constants/other';
import { APP_DESC, COMPANY_NAME } from '@repo/constants/app';

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
  description: APP_DESC.WEB,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      {...mantineHtmlProps}
      data-mantine-color-scheme={DEFAULT_COLOR_SCHEME}
    >
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <ColorSchemeScript defaultColorScheme={DEFAULT_COLOR_SCHEME} />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ProviderMantine
          options={{ withNotifications: true }}
          appThemeProps={{ styleSheets: { ...mantine } }}
          colorScheme={DEFAULT_COLOR_SCHEME}
        >
          <ProviderStore>{children}</ProviderStore>
        </ProviderMantine>
      </body>
    </html>
  );
}
