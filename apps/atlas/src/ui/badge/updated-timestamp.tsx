'use client';

import { Badge, Skeleton, Text, Tooltip } from '@mantine/core';
import { ICON_WRAPPER_SIZE } from '@repo/constants';
import { getRegionalDate, getRelativeTime } from '@repo/utils';
import React, { memo, useMemo } from 'react';
import { useBreakpointFlags, useMinuteTicker } from '@repo/hooks';
import { usePathname } from 'next/navigation';
import { useStoreNote, useStoreView, useSubView } from '@repo/store';
import { extractUuidFromParam } from '@repo/utils';

const TOOLTIP_STYLES = { tooltip: { textAlign: 'center' as const } };

const UpdatedTimestamp = memo(function UpdatedTimestamp() {
  const { ready, isDesktop } = useBreakpointFlags();

  useMinuteTicker(); // triggers re-render every minute

  const subViewValue = useStoreView((s) => s.view?.subView);
  const noteId = useMemo(
    () => (subViewValue ? extractUuidFromParam(subViewValue) : ''),
    [subViewValue],
  );

  const isNotesLoaded = useStoreNote((s) => s.notes !== undefined);
  const noteUpdatedAt = useStoreNote((s) => s.notes?.find((n) => n.id === noteId)?.updatedAt);

  const formattedRegionalDate = useMemo(
    () => (noteUpdatedAt ? getRegionalDate(noteUpdatedAt) : null),
    [noteUpdatedAt],
  );

  if (!ready) {
    return null;
  }

  if (!isNotesLoaded) {
    return <Skeleton h={isDesktop ? 30 - 6 : ICON_WRAPPER_SIZE * 1.25} w={80} radius={0} />;
  }

  if (!noteUpdatedAt) {
    return null;
  }

  return (
    <Tooltip
      label={
        <span>
          Last edited: {formattedRegionalDate?.date}, {formattedRegionalDate?.time.toUpperCase()}
        </span>
      }
      styles={TOOLTIP_STYLES}
    >
      <Badge
        tt="none"
        variant="light"
        color="gray"
        size="md"
        fz={{ base: 'sm', md: 'xs' }}
        fw="normal"
        h={isDesktop ? 30 - 6 : ICON_WRAPPER_SIZE * 1.25}
        miw={80}
        style={{ cursor: 'pointer' }}
        radius="md"
      >
        <Text component="span" inherit>
          {getRelativeTime(new Date(noteUpdatedAt), 'en-GB', {
            format: 'narrow',
            allowFuture: false,
          })}
        </Text>
      </Badge>
    </Tooltip>
  );
});

export default UpdatedTimestamp;
