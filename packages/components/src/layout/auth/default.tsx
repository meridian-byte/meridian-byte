/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import LayoutSection from '../../layout/section';
import ImageDefault from '../../common/images/default';
import { Stack, Card, Group } from '@mantine/core';
import { images } from '@repo/constants/images';
import { COMPANY_NAME } from '@repo/constants/app';
import { SECTION_SPACING } from '@repo/constants/sizes';
import AnchorNextLink from '../../common/anchor/next-link';
import { getThemeLogo } from '@repo/utilities/theme';

export default async function Default({
  children,
}: {
  children: React.ReactNode;
}) {
  const logo = await getThemeLogo({
    darkImage: images.brand.icon.meta.dark,
    lightImage: images.brand.icon.meta.light,
  });

  return (
    <>
      <LayoutSection id={'layout-auth-default'} containerized="xs">
        <Stack
          justify="center"
          mih={'100vh'}
          px={{ base: 0, sm: 40 }}
          py={SECTION_SPACING}
        >
          <Card
            shadow="xs"
            bg={
              'light-dark(var(--mantine-color-pri-light), var(--mantine-color-dark-9))'
            }
            p={{ base: 'xl', xs: 40 }}
          >
            <Stack gap={'xl'}>
              <Group justify="center">
                <AnchorNextLink href={'/'}>
                  {logo && (
                    <ImageDefault
                      src={logo}
                      alt={COMPANY_NAME}
                      height={48}
                      width={48}
                      fit="contain"
                    />
                  )}
                </AnchorNextLink>
              </Group>

              {children}
            </Stack>
          </Card>
        </Stack>
      </LayoutSection>
    </>
  );
}
