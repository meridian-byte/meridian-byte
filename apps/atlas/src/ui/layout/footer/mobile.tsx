'use client';

import React, { memo, useCallback, useMemo } from 'react';
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

import { useBreakpointFlags } from '@repo/hooks';

const MULTIPLIER = 1.5;

interface MobileViewItem {
  icon: React.ComponentType<any>;
  value: string | null;
  label: string;
  onSwitch: () => void;
}

const MobileNavItem = memo(function MobileNavItem({
  item,
  isActive,
  onSelect,
}: {
  item: MobileViewItem;
  isActive: boolean;
  onSelect: (item: MobileViewItem) => void;
}) {
  const IconComponent = item.icon;
  const activeColor = isActive ? 'pri' : 'var(--mantine-color-text)';

  const handleClick = useCallback(() => {
    onSelect(item);
  }, [onSelect, item]);

  return (
    <Stack gap={0} align="center" ta="center" onClick={handleClick}>
      <ThemeIcon
        size={ICON_WRAPPER_SIZE * MULTIPLIER}
        variant="transparent"
        color={activeColor}
        c={activeColor}
      >
        <IconComponent size={ICON_SIZE * MULTIPLIER} stroke={ICON_STROKE_WIDTH} />
      </ThemeIcon>

      <Text
        component="span"
        inherit
        fw={isActive ? 700 : 500}
        fz="sm"
        c={isActive ? 'pri' : undefined}
      >
        {item.label}
      </Text>
    </Stack>
  );
});

const Mobile = memo(function Mobile() {
  const { ready, isDesktop } = useBreakpointFlags();
  const toggleNavbarChild = useStoreAppShell((s) => s.toggleNavbarChild);

  const { viewValue, showViewHome, showViewPave, showViewJot, showViewStride } = useView();

  const items = useMemo<MobileViewItem[]>(
    () => [
      {
        icon: IconHome,
        value: null,
        label: 'Home',
        onSwitch: showViewHome,
      },
      {
        icon: IconCalendar,
        value: APP_NAMES_ATLAS.PAVE,
        label: APP_NAMES_ATLAS.PAVE,
        onSwitch: showViewPave,
      },
      {
        icon: IconNote,
        value: APP_NAMES_ATLAS.JOT,
        label: APP_NAMES_ATLAS.JOT,
        onSwitch: showViewJot,
      },
      {
        icon: IconCheckbox,
        value: APP_NAMES_ATLAS.STRIDE,
        label: APP_NAMES_ATLAS.STRIDE,
        onSwitch: showViewStride,
      },
    ],
    [showViewHome, showViewPave, showViewJot, showViewStride],
  );

  const handleSelect = useCallback(
    (item: MobileViewItem) => {
      if (!isDesktop && useStoreAppShell.getState().appshell?.child?.navbar) {
        toggleNavbarChild();
      }
      item.onSwitch();
    },
    [isDesktop, toggleNavbarChild],
  );

  if (!ready) {
    return null;
  }

  return (
    <Group justify="space-between" px="xs" h="100%" maw={400} mx="auto">
      {items.map((item) => (
        <MobileNavItem
          key={item.label}
          item={item}
          isActive={viewValue === item.value}
          onSelect={handleSelect}
        />
      ))}

      <Stack gap={0} align="center" ta="center">
        <ThemeIcon size={ICON_WRAPPER_SIZE * MULTIPLIER} variant="subtle" color="gray">
          <IconDots size={ICON_SIZE * MULTIPLIER} stroke={ICON_STROKE_WIDTH} />
        </ThemeIcon>

        <Text component="span" inherit fw={600} fz="sm">
          More
        </Text>
      </Stack>
    </Group>
  );
});

export default Mobile;
