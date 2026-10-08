'use client';

import React, { startTransition, useEffect, useState } from 'react';
import {
  ActionIcon,
  Group,
  MantineColorScheme,
  Skeleton,
  Stack,
  Text,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import { ColorScheme } from '@repo/types';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import { IconDeviceDesktop, IconMoon, IconSun } from '@tabler/icons-react';
import { capitalizeWord, capitalizeWords } from '@repo/utils';
import { SHELL_VALUES } from '@atlas/constants';

export default function Theme() {
  const [mounted, setMounted] = useState(false);

  // Ensure this only runs on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  const { colorScheme, setColorScheme } = useMantineColorScheme({
    keepTransitions: false,
  });

  const buttonProps = {
    icon:
      colorScheme == ColorScheme.LIGHT
        ? IconSun
        : colorScheme == ColorScheme.DARK
          ? IconMoon
          : IconDeviceDesktop,
    label:
      colorScheme == ColorScheme.LIGHT
        ? ColorScheme.DARK
        : colorScheme == ColorScheme.DARK
          ? ColorScheme.AUTO
          : ColorScheme.LIGHT,
  };

  if (!mounted) {
    return <Skeleton maw={`${100 / 6}%`} h={SHELL_VALUES.FOOTER.HEIGHT} radius={0} />;
  }

  return (
    <Tooltip
      label={
        <Stack gap={0} component="span" ta={'center'}>
          <span>Current: {capitalizeWords(colorScheme)}</span>
          <span>Switch to {capitalizeWords(buttonProps.label)}</span>
        </Stack>
      }
    >
      <ActionIcon
        radius={0}
        variant={'subtle'}
        size={SHELL_VALUES.FOOTER.HEIGHT}
        color="gray"
        onClick={() => {
          startTransition(() => {
            setColorScheme(buttonProps.label as MantineColorScheme);
          });
        }}
      >
        <buttonProps.icon size={SHELL_VALUES.FOOTER.HEIGHT - 8} stroke={ICON_STROKE_WIDTH} />
      </ActionIcon>
    </Tooltip>
  );
}
