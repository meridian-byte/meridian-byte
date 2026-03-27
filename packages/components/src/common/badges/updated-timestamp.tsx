'use client';

import { Badge, Text } from '@mantine/core';
import { ICON_WRAPPER_SIZE } from '@repo/constants/sizes';
import { getRelativeTime } from '@repo/utilities/date-time';
import React from 'react';
import { useMinuteTicker } from '@repo/hooks/interval';

export default function UpdatedTimestamp({
  props,
}: {
  props: { updatedAt: Date | string };
}) {
  useMinuteTicker(); // triggers re-render every minute

  return (
    <Badge
      tt={'none'}
      variant="light"
      color="dark"
      size="lg"
      fw={'normal'}
      h={ICON_WRAPPER_SIZE}
      radius={'md'}
    >
      Edited{' '}
      <Text component="span" inherit>
        {getRelativeTime(new Date(props.updatedAt), 'en-GB', {
          hideSeconds: true,
          format: 'narrow',
        })}
      </Text>
    </Badge>
  );
}
