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
import { ColorScheme } from '@repo/types/enums';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { IconDeviceDesktop, IconMoon, IconSun } from '@tabler/icons-react';
import { capitalizeWord } from '@repo/utilities/string';

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
    return <Skeleton w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />;
  }

  return (
    <Tooltip
      label={
        <Stack ta={'center'} gap={0}>
          <Text inherit>Switch to {capitalizeWord(buttonProps.label)}</Text>
        </Stack>
      }
      position="right"
    >
      <Group>
        <ActionIcon
          variant={'subtle'}
          size={ICON_WRAPPER_SIZE}
          color="dark"
          onClick={() => {
            startTransition(() => {
              setColorScheme(buttonProps.label as MantineColorScheme);
            });
          }}
        >
          <buttonProps.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
        </ActionIcon>
      </Group>
    </Tooltip>
  );
}
