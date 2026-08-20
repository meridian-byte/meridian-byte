'use client';

import { Badge, Skeleton, Text, Tooltip } from '@mantine/core';
import { ICON_WRAPPER_SIZE } from '@repo/constants';
import { getRegionalDate, getRelativeTime } from '@repo/utils';
import React from 'react';
import { useMinuteTicker } from '@repo/hooks';
import { usePathname } from 'next/navigation';
import { useStoreNote, useSubView } from '@repo/store';
import { extractUuidFromParam } from '@repo/utils';

export default function UpdatedTimestamp() {
  useMinuteTicker(); // triggers re-render every minute
  const { subViewValue } = useSubView();
  const notes = useStoreNote((s) => s.notes);
  const noteId = extractUuidFromParam(subViewValue || '');
  const note = notes?.find((n) => n.id == noteId);

  const updatedAt = note?.updatedAt && getRegionalDate(note.updatedAt);

  return notes === undefined ? (
    <Skeleton h={30} w={80} radius={0} />
  ) : !note ? null : (
    <Tooltip
      label={
        <span>
          Last edited: {updatedAt?.date}, {updatedAt?.time.toUpperCase()}
        </span>
      }
      styles={{ tooltip: { textAlign: 'center' } }}
    >
      <Badge
        tt={'none'}
        variant="light"
        color="gray"
        size="md"
        fz={'xs'}
        fw={'normal'}
        h={30}
        radius={0}
        style={{ cursor: 'pointer' }}
      >
        <Text component="span" inherit>
          {getRelativeTime(new Date(note.updatedAt), 'en-GB', {
            // hideSeconds: true,
            format: 'narrow',
            allowFuture: false,
          })}
        </Text>
      </Badge>
    </Tooltip>
  );
}
