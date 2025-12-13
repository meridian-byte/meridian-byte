/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

// custom styles
import '../styles/globals.scss';

import type { Metadata } from 'next';
import { Kanit, Tomorrow } from 'next/font/google';
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import ProviderMantine from '@repo/components/provider/mantine';
import { appName } from '@repo/constants/app';
import { DEFAULT_COLOR_SCHEME } from '@repo/constants/other';
import { mantine } from '@/assets/styles';

const kanitSans = Kanit({
  variable: '--font-kanit-sans',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const tomorrowSans = Tomorrow({
  variable: '--font-tomorrow-sans',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: `${appName} - API Engine`,
  // description: '',
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
        {/* <meta name="description" content={''} /> */}

        <title>{appName}</title>

        <ColorSchemeScript defaultColorScheme={DEFAULT_COLOR_SCHEME} />
      </head>

      <body className={`${kanitSans.variable} ${tomorrowSans.variable}`}>
        <ProviderMantine
          appThemeProps={{ styleSheets: { ...mantine } }}
          options={{ withNotifications: true }}
        >
          {children}
        </ProviderMantine>
      </body>
    </html>
  );
}
