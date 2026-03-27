import React from 'react';
import { Group } from '@mantine/core';
import LayoutSection from '@repo/components/layout/section';
import ImageDefault from '@repo/components/common/images/default';
import { images } from '@/assets/images';
import { APP_NAME } from '@/data/constants';
import NextLink from '@repo/components/common/anchor/next-link';

export default function App() {
  return (
    <LayoutSection id="header-app" containerized={'xs'} h={'100%'}>
      <Group h={'100%'} justify="center" gap={'xl'}>
        <NextLink href="/">
          <ImageDefault
            src={images.brand.icon.default}
            alt={`${APP_NAME} Icon`}
            width={40}
            height={40}
          />
        </NextLink>
      </Group>
    </LayoutSection>
  );
}
