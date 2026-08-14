import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import { Alert } from '@repo/types';
import { ActionIcon, Group, Stack, ThemeIcon, Title } from '@mantine/core';
import {
  Icon,
  IconAlertCircle,
  IconAlertTriangle,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react';
import React from 'react';

export function LayoutModal({
  children,
  props,
}: {
  children: React.ReactNode;
  props?: {
    title?: string;
    close?: () => void;
    variant?: Alert;
    size?: string;
    withoutPadding?: boolean;
  };
}) {
  let options: {
    icon: Icon | null;
    color: string | null;
  } = {
    icon: null,
    color: null,
  };

  switch (props?.variant) {
    case Alert.INFO:
      options = { icon: IconInfoCircle, color: 'blue' };
      break;
    case Alert.WARNING:
      options = { icon: IconAlertTriangle, color: 'yellow' };
      break;
    case Alert.DANGER:
      options = { icon: IconAlertCircle, color: 'red' };
      break;
    default:
      break;
  }

  return (
    <Stack
      pos={'relative'}
      gap={!props?.variant ? 'md' : 'xl'}
      p={props?.withoutPadding ? 0 : 'md'}
    >
      {(options.icon || props?.close) && (
        <Group justify={!options.icon ? 'end' : 'space-between'} align="start">
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

          {props?.close && (
            <ActionIcon size={ICON_WRAPPER_SIZE} onClick={props.close} variant="light" color="gray">
              <IconX size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>
          )}
        </Group>
      )}

      <Stack>
        {props?.title && (
          <Group>
            <Title order={1} fz={'xl'} lh={1} ta={{ base: 'center', xs: 'start' }}>
              {props.title}
            </Title>
          </Group>
        )}

        {children}
      </Stack>
    </Stack>
  );
}
