'use client';

/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { Flex, Stack, Title, Text, Group, Button } from '@mantine/core';
import { ReactNode } from 'react';
import LayoutSection from '@repo/components/layout/section';
import Link from 'next/link';
import { IconArrowRight } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { SignOut as WrapperSignOut } from '@repo/components/wrappers/auth/actions';
import { getUrlParam } from '@repo/utilities/url';
import { BASE_URL_CLIENT } from '@/data/constants';
import { config } from '@/libraries/indexed-db';

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
};

export const NotifyError = () => {
  const error = getUrlParam('error');
  const errorMessage = getUrlParam('message');

  return (
    <NotifySection
      id="page-notify-error"
      containerized={false}
      margined
      title={(error as string) ?? 'Authentication Error'}
      subtitle="An authentication error has occured."
      message={
        (errorMessage as string) ??
        'Perhaps it’s a temporary issue... Try again later.'
      }
    />
  );
};

export const NotifySignOut = () => {
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
            props={{ baseUrl: BASE_URL_CLIENT, dbConfig: config }}
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

          <Stack gap={0}>
            {subtitle && (
              <Text ta={{ base: 'center', md: 'start' }}>{subtitle}</Text>
            )}
            {message && (
              <Text ta={{ base: 'center', md: 'start' }}>{message}</Text>
            )}
          </Stack>
        </Stack>

        {actions && <Group>{actions}</Group>}
      </Flex>
    </LayoutSection>
  );
}
