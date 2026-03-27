'use client';

import { Badge, Text, Tooltip } from '@mantine/core';
import { ICON_WRAPPER_SIZE } from '@repo/constants/sizes';
import { getRegionalDate, getRelativeTime } from '@repo/utilities/date-time';
import React from 'react';
import { useMinuteTicker } from '@repo/hooks/interval';

export default function UpdatedTimestamp({
  props,
}: {
  props: { updatedAt: Date | string };
}) {
  useMinuteTicker(); // triggers re-render every minute

  return (
    <Tooltip
      label={<span>Last edited: {getRegionalDate(props.updatedAt).date}</span>}
      styles={{ tooltip: { textAlign: 'center' } }}
    >
      <Badge
        tt={'none'}
        variant="light"
        color="dark"
        size="lg"
        fw={'normal'}
        h={ICON_WRAPPER_SIZE}
        radius={'md'}
        style={{ cursor: 'pointer' }}
      >
        <Text component="span" inherit>
          {getRelativeTime(new Date(props.updatedAt), 'en-GB', {
            hideSeconds: true,
            format: 'narrow',
          })}
        </Text>
      </Badge>
    </Tooltip>
  );
}
