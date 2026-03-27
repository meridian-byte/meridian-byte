'use client';

import React, { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
  Divider,
  Modal,
  NavLink,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import LayoutModalMain from '@repo/components/layout/modal';
import { useNoteActions } from '@repo/hooks/actions/note';
import { NoteGet } from '@repo/types/models/note';
import InputTextSearch from '../inputs/text/search';
import { useStoreNote } from '@repo/libraries/zustand/stores/note';

export default function Merge({
  item,
  children,
}: {
  item: NoteGet;
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const [search, setSearch] = useState('');
  const notes = useStoreNote((s) => s.notes);

  const { noteMerge } = useNoteActions();

  const noteList = notes?.filter((n) => {
    const withoutSelected = n.id != item.id;
    const inSearch = n.title
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    return withoutSelected && inSearch;
  });

  return (
    <>
      <Modal opened={opened} onClose={close} withCloseButton={false} centered>
        <LayoutModalMain props={{ close, title: 'Merge Note' }}>
          <InputTextSearch props={{ value: search, setValue: setSearch }} />

          <Divider />

          <ScrollArea h={280}>
            <Stack gap={2}>
              {notes === undefined ? (
                <>
                  <Stack h={41} justify="center">
                    <Skeleton h={18} />
                  </Stack>
                  <Stack h={41} justify="center">
                    <Skeleton h={18} />
                  </Stack>
                  <Stack h={41} justify="center">
                    <Skeleton h={18} />
                  </Stack>
                </>
              ) : !noteList ? (
                <>
                  <Stack h={41} justify="center">
                    <Text inherit c={'dimmed'} ta={'center'}>
                      Nothing found...
                    </Text>
                  </Stack>
                </>
              ) : (
                noteList?.map((n, i) => (
                  <NavLink
                    key={i}
                    label={n.title}
                    style={{
                      borderRadius: 'var(--mantine-radius-sm)',
                    }}
                    onClick={() => noteMerge({ from: item, to: n })}
                  />
                ))
              )}
            </Stack>
          </ScrollArea>
        </LayoutModalMain>
      </Modal>

      <span onClick={open}>{children}</span>
    </>
  );
}
