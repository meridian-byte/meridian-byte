import React from 'react';
import { Center, Container, Grid, GridCol, Stack } from '@mantine/core';
import ImageDefault from '../../image/default';
import { images } from '@repo/constants';
import { SECTION_SPACING } from '@repo/constants';
import { COMPANY_NAME } from '@repo/constants';
import AnchorNextLink from '../../anchor/next-link';
import { getThemeLogo } from '@repo/utils';

export default async function Notify({ children }: { children: React.ReactNode }) {
  const logo = await getThemeLogo({
    darkImage: images.atlas.brand.icon.bg.light,
    lightImage: images.atlas.brand.icon.bg.light,
  });

  return (
    <>
      <Grid gap={0} px={{ base: 'md', xs: 0 }}>
        {logo && (
          <GridCol span={5.5} visibleFrom="md" bg={'var(--mantine-color-pri-light)'}>
            <Container size="xs" pos={'sticky'} top={0}>
              <Center h={'100vh'} px={{ xs: 32 }}>
                <AnchorNextLink href={'/'}>
                  <ImageDefault
                    src={logo}
                    alt={COMPANY_NAME}
                    height={96}
                    width={96}
                    fit="contain"
                  />
                </AnchorNextLink>
              </Center>
            </Container>
          </GridCol>
        )}

        <GridCol span={{ base: 12, md: 6.5 }}>
          <Container size="xs">
            <Stack gap={'xl'} justify="center" mih={'100vh'} px={{ xs: 32 }} py={SECTION_SPACING}>
              {children}
            </Stack>
          </Container>
        </GridCol>
      </Grid>
    </>
  );
}
