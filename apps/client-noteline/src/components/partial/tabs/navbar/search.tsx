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

export default function Search() {
  const searchParams = useSearchParams();
  const { notes } = useStoreNote();
  const { categories } = useStoreCategory();
  const [value, setValue] = useState('');
  const { appshell, setAppShell } = useStoreAppShell();
  const desktop = useMediaQuery('(min-width: 62em)');

  const [paramNoteId, setParamNoteId] = useState('');

  useEffect(() => {
    if (!notes) return;

    const paramNoteId = getUrlParam('noteId');
    if (!paramNoteId) return;

    setParamNoteId(paramNoteId as string);
  }, [notes, searchParams]);

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
        <Divider />

        <Box pos={'sticky'} top={48} py={'xs'}>
          <InputTextSearch props={{ value, setValue }} />
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
          notes
            ?.filter((n) =>
              n.title.toLowerCase().includes(value.trim().toLowerCase())
            )
            ?.map((n, i) => {
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
