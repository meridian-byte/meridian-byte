'use client';

import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { ActionIcon, Stack, Tooltip } from '@mantine/core';
import {
  IconCalendarEvent,
  IconFileSearch,
  IconTerminal,
} from '@tabler/icons-react';
import React from 'react';
import ModalSearch from '@/components/common/modals/search';
import ModalCommands from '@/components/common/modals/commands';
import { useNoteActions } from '@/hooks/actions/note';
import { getRegionalDate } from '@repo/utilities/date-time';
import { useRouter } from 'next/navigation';
import { useStoreNote } from '@/libraries/zustand/stores/note';

export default function Main() {
  const router = useRouter();
  const { notes } = useStoreNote();
  const { noteCreate } = useNoteActions();

  const handleCreate = () => {
    if (!notes) return;

    const now = new Date();
    const regionalDate = getRegionalDate(now, {
      locale: 'en-GB',
      format: 'numeric',
    }).date;

    const exists = notes.find((n) => n.title == regionalDate);

    console.log('exists');

    if (exists) {
      router.push(`/app?noteId=${exists.id}`);
      return;
    }

    noteCreate({ title: regionalDate });
  };

  return (
    <Stack p={`xs`} gap={5}>
      <ModalSearch>
        <Tooltip label={'Open quick switcher'} position={'right'}>
          <ActionIcon variant="subtle" size={ICON_WRAPPER_SIZE}>
            <IconFileSearch size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          </ActionIcon>
        </Tooltip>
      </ModalSearch>

      <Tooltip
        label={"Open today's daily note"}
        position={'right'}
        onClick={handleCreate}
      >
        <ActionIcon variant="subtle" size={ICON_WRAPPER_SIZE}>
          <IconCalendarEvent size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
        </ActionIcon>
      </Tooltip>

      <ModalCommands>
        <Tooltip label={'Open command palette'} position={'right'}>
          <ActionIcon variant="subtle" size={ICON_WRAPPER_SIZE}>
            <IconTerminal size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          </ActionIcon>
        </Tooltip>
      </ModalCommands>
    </Stack>
  );
}
