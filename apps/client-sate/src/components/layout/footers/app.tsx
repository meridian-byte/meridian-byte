'use client';

import React from 'react';
import { ActionIcon, Group, Stack, Text, Tooltip } from '@mantine/core';
import NextLink from '@repo/components/common/anchor/next-link';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import {
  IconChartDots,
  IconCoins,
  IconDots,
  IconLayout,
  IconNotebook,
  IconTransfer,
} from '@tabler/icons-react';
import LayoutSection from '@repo/components/layout/section';
import MenuNav from '@/components/common/menus/nav';
import DrawerNav from '@/components/common/drawers/nav';
import { useMediaQuery } from '@mantine/hooks';

export default function App() {
  const mobile = useMediaQuery('(max-width: 36em)');

  const nav = (
    <Stack gap={5} align="center" style={{ cursor: 'pointer' }}>
      <ActionIcon size={ICON_WRAPPER_SIZE + 4} variant="subtle">
        <IconDots size={ICON_SIZE + 4} stroke={ICON_STROKE_WIDTH} />
      </ActionIcon>

      <Text inherit ta={'center'} fz="sm" c={'var(--mantine-color-text)'}>
        More
      </Text>
    </Stack>
  );

  return (
    <LayoutSection id="footer-app" containerized={'xs'} h={'100%'}>
      <Group h={'100%'} justify="center" gap={'xl'}>
        {footerLinks.map((fl, i) => (
          <NextLink key={i} href={fl.link} underline="never">
            <Tooltip label={fl.label}>
              <Stack gap={5} align="center">
                <ActionIcon size={ICON_WRAPPER_SIZE + 4} variant="subtle">
                  <fl.icon size={ICON_SIZE + 4} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>

                <Text
                  inherit
                  ta={'center'}
                  fz="sm"
                  c={'var(--mantine-color-text)'}
                >
                  {fl.labelShort}
                </Text>
              </Stack>
            </Tooltip>
          </NextLink>
        ))}

        {mobile ? <DrawerNav>{nav}</DrawerNav> : <MenuNav>{nav}</MenuNav>}
      </Group>
    </LayoutSection>
  );
}

const footerLinks = [
  {
    icon: IconLayout,
    link: '/app',
    label: 'Overview',
    labelShort: 'Dash.',
  },
  {
    icon: IconNotebook,
    link: '/app/diary',
    label: 'Diary',
    labelShort: 'Hist.',
  },
  {
    icon: IconChartDots,
    link: '/app/statistics',
    label: 'Statistics',
    labelShort: 'Stat.',
  },
];
