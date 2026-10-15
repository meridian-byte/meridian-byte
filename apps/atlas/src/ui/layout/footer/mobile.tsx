'use client';

import React from 'react';
import { ActionIcon, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import { APP_NAMES_ATLAS, ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import { useStoreAppShell, useView } from '@repo/store';
import {
  IconCalendar,
  IconCheckbox,
  IconCoins,
  IconDots,
  IconHome,
  IconNote,
} from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';

export default function Mobile() {
  const desktop = useMediaQuery('(min-width: 62em)');

  const navbarActive = useStoreAppShell((s) => s.appshell?.child?.navbar);
  const toggleNavbarChild = useStoreAppShell((s) => s.toggleNavbarChild);

  const {
    viewValue,
    showViewHome,
    showViewPave,
    showViewJot,
    showViewStride,
    showViewPrime,
    showViewTally,
  } = useView();

  const data = [
    {
      icon: IconHome,
      value: null,
      actions: {
        switch: showViewHome,
      },
    },
    {
      icon: IconCalendar,
      value: APP_NAMES_ATLAS.PAVE,
      actions: {
        switch: showViewPave,
      },
    },
    {
      icon: IconNote,
      value: APP_NAMES_ATLAS.JOT,
      actions: {
        switch: showViewJot,
      },
    },
    {
      icon: IconCheckbox,
      value: APP_NAMES_ATLAS.STRIDE,
      actions: {
        switch: showViewStride,
      },
    },
    // {
    //   icon: IconCoins,
    //   value: APP_NAMES_ATLAS.PRIME,
    //   actions: {
    //     switch: showViewPrime,
    //   },
    // },
    // {
    //   icon: IconCoins,
    //   value: APP_NAMES_ATLAS.TALLY,
    //   actions: {
    //     switch: showViewTally,
    //   },
    // },
  ];

  const multiplier = 1.5;

  return (
    <Group justify={'space-between'} px={'xs'} h={'100%'} maw={400} mx={'auto'}>
      {data.map((di) => {
        const active = viewValue == di.value;

        return (
          <Stack
            key={di.value}
            gap={0}
            align="center"
            ta={'center'}
            onClick={() => {
              if (!desktop) {
                if (navbarActive) toggleNavbarChild();
              }

              di.actions.switch();
            }}
          >
            <ThemeIcon
              size={ICON_WRAPPER_SIZE * multiplier}
              // variant={active ? 'light' : 'transparent'}
              variant={'transparent'}
              color={active ? 'pri' : 'gray'}
              c={active ? 'pri' : 'gray'}
            >
              <di.icon size={ICON_SIZE * multiplier} stroke={ICON_STROKE_WIDTH} />
            </ThemeIcon>

            <Text component="span" inherit fw={600} fz={'sm'} c={active ? 'pri' : undefined}>
              {di.value || 'Home'}
            </Text>
          </Stack>
        );
      })}

      <Stack gap={0} align="center" ta={'center'}>
        <ThemeIcon size={ICON_WRAPPER_SIZE * multiplier} variant="subtle" color="gray">
          <IconDots size={ICON_SIZE * multiplier} stroke={ICON_STROKE_WIDTH} />
        </ThemeIcon>

        <Text component="span" inherit fw={600} fz={'sm'}>
          {'More'}
        </Text>
      </Stack>
    </Group>
  );
}
