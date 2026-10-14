'use client';

import React from 'react';
import { ActionIcon, Group } from '@mantine/core';
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

  const multiplier = 1.25;

  return (
    <Group justify={'space-between'} px={'xs'} h={'100%'} maw={400} mx={'auto'}>
      {data.map((di) => {
        const active = viewValue == di.value;

        return (
          <div key={di.value}>
            <ActionIcon
              size={ICON_WRAPPER_SIZE * multiplier}
              variant={active ? 'light' : 'transparent'}
              color={active ? 'pri' : 'gray'}
              c={active ? 'pri' : 'gray'}
              onClick={() => {
                if (!desktop) {
                  if (navbarActive) toggleNavbarChild();
                }

                di.actions.switch();
              }}
            >
              <di.icon size={ICON_SIZE * multiplier} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>
          </div>
        );
      })}

      <ActionIcon size={ICON_WRAPPER_SIZE * multiplier} variant="subtle" color="gray" disabled>
        <IconDots size={ICON_SIZE * multiplier} stroke={ICON_STROKE_WIDTH} />
      </ActionIcon>
    </Group>
  );
}
