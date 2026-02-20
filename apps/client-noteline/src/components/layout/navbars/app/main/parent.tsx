'use client';

import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { ActionIcon, Flex, Group, Tooltip } from '@mantine/core';
import {
  IconCalendarEvent,
  IconFileSearch,
  IconTerminal,
} from '@tabler/icons-react';
import React from 'react';
import ModalSearch from '@repo/components/common/modals/search';
import ModalCommands from '@repo/components/common/modals/commands';
import { useNoteActions } from '@repo/hooks/actions/note';
import { getRegionalDate } from '@repo/utilities/date-time';
import { useRouter } from 'next/navigation';
import { useStoreNote } from '@repo/libraries/zustand/stores/note';
import ButtonAppshellNavbar from '@repo/components/common/buttons/appshell/navbar';
import { useMediaQuery } from '@mantine/hooks';

export default function Main({
  props,
}: {
  props?: { options?: { mobile: boolean } };
}) {
  const router = useRouter();
  const notes = useStoreNote((s) => s.notes);
  const { noteCreate } = useNoteActions();
  const mobile = useMediaQuery('(max-width: 36em)');

  const handleCreate = () => {
    if (!notes) return;

    const now = new Date();
    const regionalDate = getRegionalDate(now, {
      locale: 'en-GB',
      format: 'numeric',
    }).date;

    const exists = notes.find((n) => n.title == regionalDate);

    if (exists) {
      router.push(`/app?noteId=${exists.id}`);
      return;
    }

    noteCreate({ title: regionalDate });
  };

  return (
    <Flex
      direction={props?.options?.mobile ? 'row' : 'column'}
      p={props?.options?.mobile ? undefined : `xs`}
      align={'center'}
      gap={5}
    >
      <ButtonAppshellNavbar props={{ options: { mobile: !mobile } }} />

      <ModalSearch>
        <Group>
          <Tooltip label={'Open quick switcher'} position={'right'}>
            <ActionIcon variant="subtle" size={ICON_WRAPPER_SIZE}>
              <IconFileSearch size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>
          </Tooltip>
        </Group>
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
        <Group>
          <Tooltip label={'Open command palette'} position={'right'}>
            <ActionIcon variant="subtle" size={ICON_WRAPPER_SIZE}>
              <IconTerminal size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </ModalCommands>
    </Flex>
  );
}
