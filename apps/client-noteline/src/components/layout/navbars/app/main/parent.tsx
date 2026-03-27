'use client';

import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { ActionIcon, Flex, Group, Skeleton, Tooltip } from '@mantine/core';
import {
  IconCalendarEvent,
  IconFileSearch,
  IconHome,
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
import NextLink from '@repo/components/common/anchor/next-link';
import { useStoreTheme } from '@repo/libraries/zustand/stores/theme';
import IndicatorTheme from '@repo/components/common/indicators/theme';
import DrawerAppNavbar from '@/components/common/drawers/app/navbar';
import { useStoreAppShell } from '@repo/libraries/zustand/stores/shell';

export default function Main({
  props,
}: {
  props?: { options?: { mobile: boolean } };
}) {
  const router = useRouter();
  const appshell = useStoreAppShell((s) => s.appshell);
  const notes = useStoreNote((s) => s.notes);
  const { noteCreate } = useNoteActions();
  const mobile = useMediaQuery('(max-width: 36em)');
  const theme = useStoreTheme((s) => s.theme);
  const setTheme = useStoreTheme((s) => s.setTheme);

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
      {appshell === undefined ? (
        <Skeleton h={ICON_WRAPPER_SIZE} w={ICON_WRAPPER_SIZE} />
      ) : !appshell ? (
        <></>
      ) : (
        <DrawerAppNavbar options={{ hover: true }}>
          <ButtonAppshellNavbar props={{ options: { mobile: !mobile } }} />
        </DrawerAppNavbar>
      )}

      <NextLink href="/app">
        <Tooltip label={'Go to home page'} position={'right'}>
          <ActionIcon variant="subtle" size={ICON_WRAPPER_SIZE}>
            <IconHome size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          </ActionIcon>
        </Tooltip>
      </NextLink>

      <ModalSearch>
        <Group>
          <Tooltip label={'Open quick switcher'} position={'right'}>
            <ActionIcon variant="subtle" size={ICON_WRAPPER_SIZE}>
              <IconFileSearch size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </ModalSearch>

      {notes === undefined ? (
        <Skeleton w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
      ) : (
        <Tooltip
          label={"Open today's daily note"}
          position={'right'}
          onClick={handleCreate}
        >
          <ActionIcon variant="subtle" size={ICON_WRAPPER_SIZE}>
            <IconCalendarEvent size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          </ActionIcon>
        </Tooltip>
      )}

      <ModalCommands>
        <Group>
          <Tooltip label={'Open command palette'} position={'right'}>
            <ActionIcon variant="subtle" size={ICON_WRAPPER_SIZE}>
              <IconTerminal size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </ModalCommands>

      {theme === undefined ? (
        <Skeleton w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
      ) : !theme ? (
        <></>
      ) : (
        <IndicatorTheme
          props={{ colorScheme: theme, setColorScheme: setTheme }}
        />
      )}
    </Flex>
  );
}
