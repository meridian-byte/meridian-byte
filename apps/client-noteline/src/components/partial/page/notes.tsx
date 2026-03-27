'use client';

import React from 'react';
import { useStoreNote } from '@repo/libraries/zustand/stores/note';
import { useSearchParams } from 'next/navigation';
import PartialPageHome from './home';
import PartialPageNote from './note';
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

export default function Home() {
  const searchParams = useSearchParams();
  const noteId = searchParams.get('noteId');

  const note = useStoreNote((s) => s.notes?.find((n) => n.id == noteId));

  return (
    <>
      <HeaderAppNoteDetails props={note} />

      {!noteId ? (
        <PartialPageHome />
      ) : note === undefined ? (
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
        <PartialPageNote props={{ note }} />
      )}
    </>
  );
}
