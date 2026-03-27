/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import LayoutBody from '@repo/components/layout/body';
import LayoutSection from '@repo/components/layout/section';
import ImageDefault from '@repo/components/common/images/default';
import { Stack, Card, Group } from '@mantine/core';
import { images } from '@repo/constants/images';
import { APP_NAME } from '@repo/constants/app';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { Metadata } from 'next';
import AnchorNextLink from '@repo/components/common/anchor/next-link';

export const metadata: Metadata = {
  title: {
    default: 'Authentication',
    template: `%s - Authentication - ${APP_NAME}`,
  },
};

export default function LayoutDefault({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutBody>
      <LayoutSection id={'layout-auth-default'} containerized="xs">
        <Stack
          justify="center"
          mih={'100vh'}
          px={{ base: 0, sm: 40 }}
          py={SECTION_SPACING}
        >
          <Card
            shadow="xs"
            withBorder
            bg={'transparent'}
            p={{ base: 'xl', xs: 40 }}
          >
            <Stack gap={'xl'}>
              <Group justify="center">
                <AnchorNextLink href={'/'}>
                  <ImageDefault
                    src={images.brand.icon.default}
                    alt={APP_NAME.FRAKT}
                    height={64}
                    width={64}
                    fit="contain"
                  />
                </AnchorNextLink>
              </Group>

              {children}
            </Stack>
          </Card>
        </Stack>
      </LayoutSection>
    </LayoutBody>
  );
}
