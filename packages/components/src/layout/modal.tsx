import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { Alert } from '@repo/types/enums';
import { ActionIcon, Group, Stack, ThemeIcon, Title } from '@mantine/core';
import {
  Icon,
  IconAlertCircle,
  IconAlertTriangle,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react';
import React from 'react';

export default function Modal({
  children,
  props,
  variant,
}: {
  children: React.ReactNode;
  props: { title: string; close: () => void };
  variant?: Alert;
  size?: string;
}) {
  let options: {
    icon: Icon | null;
    color: string | null;
  } = {
    icon: null,
    color: null,
  };

  switch (variant) {
    case Alert.INFO:
      options = { icon: IconInfoCircle, color: 'blue.6' };
      break;
    case Alert.WARNING:
      options = { icon: IconAlertTriangle, color: 'yellow.6' };
      break;
    case Alert.DANGER:
      options = { icon: IconAlertCircle, color: 'red.6' };
      break;
    default:
      break;
  }

  return (
    <Stack pos={'relative'} gap={'xl'}>
      <Group justify="space-between" align="start">
        {options.icon && (
          <Group>
            <ThemeIcon
              size={ICON_WRAPPER_SIZE * 2}
              variant="light"
              color={options.color || undefined}
            >
              <options.icon size={ICON_SIZE * 2} stroke={ICON_STROKE_WIDTH} />
            </ThemeIcon>
          </Group>
        )}

        <ActionIcon
          size={ICON_WRAPPER_SIZE}
          onClick={props.close}
          variant="light"
          color="gray"
        >
          <IconX size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
        </ActionIcon>
      </Group>

      <Stack>
        <Title order={1} fz={'xl'} lh={1} ta={{ base: 'center', xs: 'start' }}>
          {props.title}
        </Title>

        {children}
      </Stack>
    </Stack>
  );
}
