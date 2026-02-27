'use client';

import React, { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
  Center,
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
import { useSearchCriteria } from '@repo/hooks/search';
import { SECTION_SPACING } from '@repo/constants/sizes';

export default function Merge({
  props,
  children,
}: {
  props?: { noteId?: string };
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const [searchValue, setSearchValue] = useState('');

  const notes = useStoreNote((s) => s.notes);
  const note = useStoreNote((s) => s.notes?.find((n) => n.id == props?.noteId));

  const { noteMerge } = useNoteActions();

  const { searchCriteriaItems } = useSearchCriteria({
    list: (notes || []).filter((n) => n.id != props?.noteId),
    searchValue: searchValue,
  });

  return (
    <>
      <Modal opened={opened} onClose={close} withCloseButton={false} centered>
        <LayoutModalMain props={{ close, title: 'Merge Note' }}>
          <InputTextSearch
            props={{ value: searchValue, setValue: setSearchValue }}
          />

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
              ) : !searchCriteriaItems.length ? (
                <>
                  <Center ta={'center'} py={SECTION_SPACING}>
                    <Text inherit fz={'sm'} c={'dimmed'}>
                      No notes found...
                    </Text>
                  </Center>
                </>
              ) : (
                searchCriteriaItems.map((mni, i) => (
                  <NavLink
                    key={i}
                    label={mni.title}
                    style={{
                      borderRadius: 'var(--mantine-radius-sm)',
                    }}
                    onClick={() => {
                      if (note) noteMerge({ from: note, to: mni });
                    }}
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
