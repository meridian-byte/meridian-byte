/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import { Center, Grid, GridCol, Stack } from '@mantine/core';
import LayoutSection from '../../layout/section';
import ImageDefault from '../../common/images/default';
import { images } from '@repo/constants/images';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { COMPANY_NAME } from '@repo/constants/app';
import AnchorNextLink from '../../common/anchor/next-link';
import { getThemeLogo } from '@repo/utilities/theme';

export default async function Notify({
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
      <Grid gutter={0} px={{ base: 'md', xs: 0 }}>
        <GridCol
          span={5.5}
          visibleFrom="md"
          bg={'var(--mantine-color-pri-light)'}
        >
          <LayoutSection
            id={'layout-auth-notify-icon'}
            containerized="xs"
            pos={'sticky'}
            top={0}
          >
            <Center h={'100vh'} px={{ xs: 32 }}>
              <AnchorNextLink href={'/'}>
                {logo && (
                  <ImageDefault
                    src={logo}
                    alt={COMPANY_NAME}
                    height={96}
                    width={96}
                    fit="contain"
                  />
                )}
              </AnchorNextLink>
            </Center>
          </LayoutSection>
        </GridCol>

        <GridCol span={{ base: 12, md: 6.5 }}>
          <LayoutSection id={'layout-auth-notify-text'} containerized="xs">
            <Stack
              gap={'xl'}
              justify="center"
              mih={'100vh'}
              px={{ xs: 32 }}
              py={SECTION_SPACING}
            >
              {children}
            </Stack>
          </LayoutSection>
        </GridCol>
      </Grid>
    </>
  );
}
