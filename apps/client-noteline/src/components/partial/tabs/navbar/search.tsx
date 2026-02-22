'use client';

import React, { useEffect, useState } from 'react';
import { Box, Divider, NavLink, Skeleton, Stack, Text } from '@mantine/core';
import InputTextSearch from '@repo/components/common/inputs/text/search';
import Link from 'next/link';
import { useStoreNote } from '@repo/libraries/zustand/stores/note';
import { useStoreCategory } from '@repo/libraries/zustand/stores/category';
import { useStoreAppShell } from '@repo/libraries/zustand/stores/shell';
import { useMediaQuery } from '@mantine/hooks';
import { getUrlParam } from '@repo/utilities/url';
import { useSearchParams } from 'next/navigation';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';

export default function Search() {
  const searchParams = useSearchParams();
  const notes = useStoreNote((s) => s.notes);
  const categories = useStoreCategory((s) => s.categories);
  const [value, setValue] = useState('');
  const appshell = useStoreAppShell((s) => s.appshell);
  const setAppShell = useStoreAppShell((s) => s.setAppShell);
  const desktop = useMediaQuery('(min-width: 62em)');

  const [paramNoteId, setParamNoteId] = useState('');

  useEffect(() => {
    if (!notes) return;

    const paramNoteId = getUrlParam('noteId');
    if (!paramNoteId) return;

    setParamNoteId(paramNoteId as string);
  }, [notes, searchParams]);

  const getSearchCriteriaItems = (params: { options: { limit: number } }) => {
    const searchTerm = value.trim().toLowerCase();

    const notesSorted = sortArray(
      notes || [],
      (i) => i.created_at,
      Order.DESCENDING
    );

    const notesLimited = notesSorted
      ?.filter((n) => n.title.toLowerCase().includes(searchTerm))
      .slice(0, params.options.limit);

    return { notesLimited };
  };

  const { notesLimited } = getSearchCriteriaItems({ options: { limit: 20 } });

  return (
    <div>
      <Box
        pos={'sticky'}
        top={48}
        bg={
          'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))'
        }
        style={{ zIndex: 1 }}
      >
        <Divider color="light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-6))" />

        <Box pos={'sticky'} top={48} py={'xs'}>
          <InputTextSearch
            props={{ value, setValue }}
            styles={{
              input: {
                backgroundColor:
                  'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-7))',
                fontWeight: 500,
              },
            }}
          />
        </Box>
      </Box>

      <Stack gap={5} style={{ zIndex: 0 }}>
        {notes === undefined ? (
          <>
            <Skeleton h={35} />
            <Skeleton h={35} />
            <Skeleton h={35} />
          </>
        ) : (
          notesLimited?.map((n, i) => {
            const category = categories?.find((c) => c.id == n.notebook_id);
            const active = paramNoteId == n.id;

            return (
              <NavLink
                key={i}
                component={Link}
                href={`/app?noteId=${n.id}`}
                active={active}
                onClick={() => {
                  if (desktop) return;
                  if (!appshell) return;

                  setAppShell({
                    ...appshell,
                    child: { ...appshell.child, navbar: false },
                  });
                }}
                label={
                  <Stack mih={30} gap={0} justify="center" fw={500}>
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
                      'calc(var(--mantine-spacing-xs) / 4) var(--mantine-spacing-xs)',
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
    </div>
  );
}
