import React from 'react';
import {
  ActionIcon,
  Group,
  Stack,
  Text,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import { useColorSchemeHandler } from '@repo/hooks/color-scheme';
import { ColorScheme } from '@repo/types/enums';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { IconDeviceDesktop, IconMoon, IconSun } from '@tabler/icons-react';
import { capitalizeWord } from '@repo/utilities/string';

export default function Theme({
  props,
}: {
  props: {
    colorScheme: ColorScheme;
    setColorScheme: (colorScheme: ColorScheme) => void;
  };
}) {
  const { setColorScheme } = useMantineColorScheme({ keepTransitions: false });

  const { handleChange } = useColorSchemeHandler({
    schemeState: props.colorScheme,
    setSchemeState: props.setColorScheme,
    setMantineScheme: setColorScheme,
  });

  const iconProps = {
    icon:
      props.colorScheme == ColorScheme.LIGHT
        ? IconSun
        : props.colorScheme == ColorScheme.DARK
          ? IconMoon
          : IconDeviceDesktop,
    label:
      props.colorScheme == ColorScheme.LIGHT
        ? ColorScheme.DARK
        : props.colorScheme == ColorScheme.DARK
          ? ColorScheme.AUTO
          : ColorScheme.LIGHT,
    action:
      props.colorScheme == ColorScheme.LIGHT
        ? ColorScheme.DARK
        : ColorScheme.LIGHT,
  };

  return (
    <Tooltip
      label={
        <Stack ta={'center'} gap={0}>
          <Text inherit>Current: {capitalizeWord(props.colorScheme)}</Text>
          <Text inherit>Switch to {capitalizeWord(iconProps.label)}</Text>
        </Stack>
      }
    >
      <Group>
        <ActionIcon
          variant={'subtle'}
          size={ICON_WRAPPER_SIZE}
          onClick={() => handleChange(iconProps.action)}
        >
          <iconProps.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
        </ActionIcon>
      </Group>
    </Tooltip>
  );
}
