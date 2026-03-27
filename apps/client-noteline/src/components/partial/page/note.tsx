'use client';

import React from 'react';
import { useStoreNote } from '@repo/libraries/zustand/stores/note';
import HeaderAppNoteDetails from '@/components/layout/headers/app/note-details';
import {
  Button,
  Center,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  SECTION_SPACING,
} from '@repo/constants/sizes';
import { IconArrowLeft } from '@tabler/icons-react';
import NextLink from '@repo/components/common/anchor/next-link';
import LayoutSection from '@repo/components/layout/section';
import InputTextEditorTitle from '@repo/components/common/inputs/text/editor/title';
import EditorMain from '@repo/components/common/editors/main';

export default function Note({ props }: { props: { noteId?: string | null } }) {
  const notes = useStoreNote((s) => s.notes);
  const note = useStoreNote((s) => s.notes?.find((n) => n.id == props.noteId));

  return (
    <>
      <HeaderAppNoteDetails props={note} />

      {notes === undefined ? (
        <Center py={SECTION_SPACING * 2} mih={'75vh'}>
          <Stack align="center" ta={'center'}>
            <Loader size={'sm'} />
          </Stack>
        </Center>
      ) : !note ? (
        <Center py={SECTION_SPACING * 2} mih={'75vh'}>
          <Stack align="center" ta={'center'}>
            <div>
              <Title order={3} fz={'md'} fw={500}>
                Note Not Found
              </Title>

              <Text inherit c={'dimmed'} fz={'sm'}>
                The note has been moved or deleted.
              </Text>
            </div>

            <Group>
              <NextLink href="/app">
                <Button
                  size="xs"
                  color="dark"
                  variant="light"
                  leftSection={
                    <IconArrowLeft
                      size={ICON_SIZE - 4}
                      stroke={ICON_STROKE_WIDTH}
                    />
                  }
                >
                  Back to Home
                </Button>
              </NextLink>
            </Group>
          </Stack>
        </Center>
      ) : (
        <LayoutSection
          id={`note-details`}
          padded={SECTION_SPACING / 2}
          containerized={'md'}
        >
          <div>
            <InputTextEditorTitle item={note} />

            <EditorMain item={note} />
          </div>
        </LayoutSection>
      )}
    </>
  );
}
