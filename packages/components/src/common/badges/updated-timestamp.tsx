'use client';

import { Badge, Text, Tooltip } from '@mantine/core';
import { ICON_WRAPPER_SIZE } from '@repo/constants/sizes';
import { getRegionalDate, getRelativeTime } from '@repo/utilities/date-time';
import React from 'react';
import { useMinuteTicker } from '@repo/hooks/interval';
import { usePathname } from 'next/navigation';
import { useStoreNote } from '@repo/libraries/zustand/stores/note';
import { extractUuidFromParam } from '@repo/utilities/url';

export default function UpdatedTimestamp({
  props,
}: {
  props: { updatedAt: Date | string };
}) {
  useMinuteTicker(); // triggers re-render every minute
  const pathname = usePathname();
  const notes = useStoreNote((s) => s.notes);
  const noteId = extractUuidFromParam(pathname);
  const note = notes?.find((n) => n.id == noteId);

  return (
    <Tooltip
      label={<span>Last edited: {getRegionalDate(props.updatedAt).date}</span>}
      styles={{ tooltip: { textAlign: 'center' } }}
      display={(note?.content || '').length < 8 ? 'none' : undefined}
    >
      <Badge
        tt={'none'}
        variant="light"
        color="dark"
        size="md"
        fz={'xs'}
        fw={'normal'}
        h={ICON_WRAPPER_SIZE}
        radius={'md'}
        style={{ cursor: 'pointer' }}
        display={(note?.content || '').length < 8 ? 'none' : undefined}
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
