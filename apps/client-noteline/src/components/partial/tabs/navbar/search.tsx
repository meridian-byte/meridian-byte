'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Center,
  Divider,
  NavLink,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import InputTextSearch from '@repo/components/common/inputs/text/search';
import Link from 'next/link';
import { useStoreNote } from '@repo/libraries/zustand/stores/note';
import { useStoreCategory } from '@repo/libraries/zustand/stores/category';
import { useStoreAppShell } from '@repo/libraries/zustand/stores/shell';
import { useMediaQuery } from '@mantine/hooks';
import { getUrlParam, linkify } from '@repo/utilities/url';
import { useSearchParams } from 'next/navigation';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  SECTION_SPACING,
} from '@repo/constants/sizes';
import { useSearchCriteria } from '@repo/hooks/search';
import { IconFileSearch } from '@tabler/icons-react';
import { useStoreWorkspace } from '@repo/libraries/zustand/stores/workspace';
import { useStoreActiveItems } from '@repo/libraries/zustand/stores/active-items';

export default function Search() {
  const searchParams = useSearchParams();
  const workspaces = useStoreWorkspace((s) => s.workspaces);
  const activeWorkspace = useStoreActiveItems((s) => s.activeItems?.workspace);
  const notes = useStoreNote((s) => s.notes);
  const categories = useStoreCategory((s) => s.categories);
  const [value, setValue] = useState('');
  const toggleNavbarChild = useStoreAppShell((s) => s.toggleNavbarChild);
  const desktop = useMediaQuery('(min-width: 62em)');

  const [paramNoteId, setParamNoteId] = useState('');

  useEffect(() => {
    if (!notes) return;

    const paramNoteId = getUrlParam('noteId');
    if (!paramNoteId) return;

    setParamNoteId(paramNoteId as string);
  }, [notes, searchParams]);

  // find default workspace
  const oldestWorkspaceId = useMemo(() => {
    if (!workspaces?.length) return null;
    return workspaces.reduce((oldest, current) =>
      new Date(current.created_at) < new Date(oldest.created_at)
        ? current
        : oldest
    ).id;
  }, [workspaces]);

  // 2. Resolve the notes based on active context
  const resolvedNotes = useMemo(() => {
    if (!activeWorkspace || !oldestWorkspaceId) return [];

    const isActiveDefault = activeWorkspace.id === oldestWorkspaceId;

    return (notes || []).filter((note) => {
      if (isActiveDefault) {
        // Show notes belonging to this workspace OR orphaned notes
        return !note.workspace_id || note.workspace_id === oldestWorkspaceId;
      }
      // Show only notes belonging to the specific active workspace
      return note.workspace_id === activeWorkspace.id;
    });
  }, [notes, activeWorkspace?.id, oldestWorkspaceId]);

  const { searchCriteriaItems } = useSearchCriteria({
    list: resolvedNotes,
    searchValue: value,
    options: { showNoneOnEmpty: true },
  });

  return (
    <div>
      <Box>
        <Divider />

        <Box py={'xs'} px={'xs'}>
          <InputTextSearch props={{ value, setValue }} data-autofocus />
        </Box>

        <Divider />
      </Box>

      <ScrollArea
        h={`calc(100vh - ${40 + 48 + 1 + 56 + 1}px)`}
        scrollbars={'y'}
      >
        <Stack gap={0} py={5} pl={5} pr={'xs'} mih={'150vh'}>
          {notes === undefined ? (
            <Stack gap={5}>
              {navlinkSkeleton}
              {navlinkSkeleton}
              {navlinkSkeleton}
              {navlinkSkeleton}
              {navlinkSkeleton}
              {navlinkSkeleton}
              {navlinkSkeleton}
              {navlinkSkeleton}
              {navlinkSkeleton}
            </Stack>
          ) : !searchCriteriaItems.length ? (
            <Stack
              align="center"
              ta={'center'}
              gap={'xs'}
              fz={'sm'}
              c={'dimmed'}
              py={SECTION_SPACING}
            >
              {!value.trim().length ? (
                <ThemeIcon
                  size={ICON_WRAPPER_SIZE * 2}
                  variant="light"
                  color="dark"
                  c={'dimmed'}
                  radius={'xl'}
                >
                  <IconFileSearch
                    size={ICON_SIZE * 1.75}
                    stroke={ICON_STROKE_WIDTH}
                  />
                </ThemeIcon>
              ) : (
                <Stack>
                  <Text inherit>No notes found...</Text>
                  <Text inherit>Try another workspace.</Text>
                </Stack>
              )}
            </Stack>
          ) : (
            searchCriteriaItems?.map((n) => {
              const category = categories?.find((c) => c.id == n.notebook_id);
              const active = paramNoteId == n.id;

              return (
                <NavLink
                  key={n.id}
                  component={Link}
                  href={`/n/${linkify(n.title)}-${n.id}`}
                  active={active}
                  onClick={() => {
                    if (desktop) return;
                    toggleNavbarChild();
                  }}
                  label={
                    <Stack gap={0} justify="center" fw={500}>
                      <Text component="span" inherit lineClamp={1}>
                        {n.title}
                      </Text>

                      {category && n.notebook_id && (
                        <Text
                          component="span"
                          inherit
                          lineClamp={1}
                          fz={'xs'}
                          c={'dimmed'}
                        >
                          {category.title}
                        </Text>
                      )}
                    </Stack>
                  }
                  styles={{
                    root: {
                      borderRadius: 'var(--mantine-radius-md)',
                      padding:
                        'calc(var(--mantine-spacing-xs) / 2) calc(var(--mantine-spacing-xs) / 1.5)',
                    },
                    label: {
                      fontSize: 'var(--mantine-font-size-sm)',
                    },
                  }}
                />
              );
            })
          )}
        </Stack>
      </ScrollArea>
    </div>
  );
}

const navlinkSkeleton = <Skeleton h={26} />;
