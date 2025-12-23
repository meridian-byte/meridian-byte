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
import { useNoteActions } from '@/hooks/actions/note';
import { NoteGet } from '@repo/types/models/note';
import InputTextSearch from '../inputs/text/search';
import { useStoreNotebook } from '@/libraries/zustand/stores/notebook';

export default function Move({
  item,
  children,
}: {
  item: NoteGet;
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const [search, setSearch] = useState('');
  const { notebooks } = useStoreNotebook();

  const { noteMove } = useNoteActions();

  const notebookList = notebooks?.filter((nb) => {
    const withoutSelected = nb.id != item.notebook_id;
    const inSearch = nb.title
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    return withoutSelected && inSearch;
  });

  return (
    <>
      <Modal opened={opened} onClose={close} withCloseButton={false} centered>
        <LayoutModalMain props={{ close, title: 'Move Note' }}>
          <InputTextSearch props={{ value: search, setValue: setSearch }} />

          <Divider />

          <ScrollArea h={280}>
            <Stack gap={2}>
              {notebooks === undefined ? (
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
              ) : !notebookList ? (
                <>
                  <Stack h={41} justify="center">
                    <Text inherit c={'dimmed'} ta={'center'}>
                      Nothing found...
                    </Text>
                  </Stack>
                </>
              ) : (
                notebookList?.map((nb, i) => (
                  <NavLink
                    key={i}
                    label={nb.title}
                    style={{
                      borderRadius: 'var(--mantine-radius-sm)',
                    }}
                    onClick={() => noteMove({ values: item, notebook: nb })}
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
