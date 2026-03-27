'use client';

import React, { useState } from 'react';
import { Box, Divider, NavLink, Skeleton, Stack, Text } from '@mantine/core';
import InputTextSearch from '@/components/common/inputs/text/search';
import Link from 'next/link';
import { useStoreNote } from '@/libraries/zustand/stores/note';
import { useStoreCategory } from '@/libraries/zustand/stores/category';

export default function Search() {
  const { notes } = useStoreNote();
  const { categories } = useStoreCategory();
  const [value, setValue] = useState('');

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

      <Stack mt={`xs`} gap={5} style={{ zIndex: 0 }}>
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

              return (
                <NavLink
                  key={i}
                  component={Link}
                  href={`/app/${n.id}`}
                  label={
                    <Stack mih={30} gap={0} justify="center">
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
