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
import { useStoreNotebook } from '@repo/libraries/zustand/stores/notebook';
import { useSearchCriteria } from '@repo/hooks/search';
import { SECTION_SPACING } from '@repo/constants/sizes';

export default function Move({
  item,
  children,
}: {
  item: NoteGet;
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const [searchValue, setSearchValue] = useState('');
  const notebooks = useStoreNotebook((s) => s.notebooks);

  const { noteMove } = useNoteActions();

  const { searchCriteriaItems } = useSearchCriteria({
    list: (notebooks || []).filter((nb) => nb.id != item.notebook_id),
    searchValue: searchValue,
  });

  return (
    <>
      <Modal opened={opened} onClose={close} withCloseButton={false} centered>
        <LayoutModalMain props={{ close, title: 'Move Note' }}>
          <InputTextSearch
            props={{ value: searchValue, setValue: setSearchValue }}
          />

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
              ) : !searchCriteriaItems.length ? (
                <>
                  <Center ta={'center'} py={SECTION_SPACING}>
                    <Text inherit fz={'sm'} c={'dimmed'}>
                      No folders found...
                    </Text>
                  </Center>
                </>
              ) : (
                searchCriteriaItems.map((nb, i) => (
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
