'use client';

/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { Flex, Stack, Title, Text, Group, Button } from '@mantine/core';
import { ReactNode, useEffect, useState } from 'react';
import LayoutSection from '@repo/components/layout/section';
import Link from 'next/link';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { SignOut as WrapperSignOut } from '@repo/components/wrappers/auth/actions';
import { getUrlParam } from '@repo/utilities/url';
import { config } from '@repo/libraries/indexed-db/config';
import { AUTH_URLS } from '@repo/constants/paths';

type NotifySectionProps = {
  id: string;
  title: string;
  message?: string;
  subtitle?: string;
  actions?: ReactNode;
  padded?: boolean;
  containerized?: boolean;
  margined?: boolean;
  titleBold?: boolean;
  baseUrl?: string;
};

export const NotifyError = ({ props }: { props?: { baseUrl?: string } }) => {
  const [error, setError] = useState<undefined | null | string>(undefined);
  const [message, setMessage] = useState<undefined | null | string>(undefined);

  useEffect(() => {
    const paramError = getUrlParam('error');
    setError((paramError as string) ?? null);
    const paramErrorMessage = getUrlParam('message');
    setMessage((paramErrorMessage as string) ?? null);
  }, []);

  return (
    <NotifySection
      id="page-notify-error"
      containerized={false}
      margined
      title={(error as string) ?? 'Authentication Error'}
      subtitle="An authentication error has occured."
      message={(message as string) ?? ''}
      baseUrl={props?.baseUrl}
    />
  );
};

export const NotifySignOut = ({ props }: { props: { baseUrl: string } }) => {
  return (
    <NotifySection
      id="page-notify-sign-out"
      containerized={false}
      margined
      title="Sign Out"
      titleBold
      subtitle="Are you sure you want to sign out?"
      actions={
        <>
          <WrapperSignOut
            props={{
              baseUrl: props.baseUrl,
              dbConfig: config,
              options: { clearDB: true },
            }}
          >
            <Button>Sign Out</Button>
          </WrapperSignOut>

          <Button
            component={Link}
            href="/"
            variant="light"
            rightSection={
              <IconArrowRight size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
          >
            Go Home
          </Button>
        </>
      }
    />
  );
};

export const NotifySignedOut = () => {
  return (
    <NotifySection
      id="page-notify-signed-out"
      containerized={false}
      margined
      title="Signed Out"
      titleBold
      subtitle="You’ve been signed out successfully."
      actions={
        <>
          <Button
            component={Link}
            href={AUTH_URLS.SIGN_IN}
            variant="light"
            leftSection={
              <IconArrowLeft size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
          >
            Sign Back In
          </Button>
        </>
      }
    />
  );
};

export function NotifySection({
  id,
  title,
  message,
  subtitle,
  actions,
  padded,
  containerized = false,
  margined,
  titleBold = false,
  baseUrl,
}: NotifySectionProps) {
  return (
    <LayoutSection
      id={id}
      containerized={containerized}
      margined={margined}
      padded={padded}
    >
      <Flex direction="column" align={{ base: 'center', md: 'start' }} gap="xl">
        <Stack gap="xs">
          <Title
            ta={{ base: 'center', md: 'start' }}
            order={1}
            fw={titleBold ? 'bold' : undefined}
          >
            {title}
          </Title>

          <Stack mih={24.8 * 2}>
            {subtitle && (
              <Text ta={{ base: 'center', md: 'start' }}>{subtitle}</Text>
            )}

            {message && (
              <Text ta={{ base: 'center', md: 'start' }}>
                {message?.includes('PKCE')
                  ? 'PKCE code verifier mismatch. Try signing in again.'
                  : message}
              </Text>
            )}

            {message?.includes('PKCE') && baseUrl && (
              <Group mt={'md'}>
                <WrapperSignOut
                  props={{
                    baseUrl: baseUrl,
                    dbConfig: config,
                    options: { redirecUrl: AUTH_URLS.SIGN_IN },
                  }}
                >
                  <Button>Try Again</Button>
                </WrapperSignOut>
              </Group>
            )}
          </Stack>
        </Stack>

        {actions && <Group>{actions}</Group>}
      </Flex>
    </LayoutSection>
  );
}
