'use client';

import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import {
  ActionIcon,
  AppShellSection,
  Box,
  Flex,
  Group,
  Skeleton,
  Tooltip,
} from '@mantine/core';
import {
  IconCalendarEvent,
  IconEdit,
  IconFilePlus,
  IconFileSearch,
  IconHome,
  IconSearch,
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
import IndicatorTheme from '@repo/components/common/indicators/theme';
import DrawerAppNavbar from '@/components/common/drawers/app/navbar';
import NavbarParentFooter from './footer';
import { linkify } from '@repo/utilities/url';
import ButtonsFullscreen from '@repo/components/common/buttons/fullscreen';
import { useStoreWorkspace } from '@repo/libraries/zustand/stores/workspace';
import { useStoreActiveItems } from '@repo/libraries/zustand/stores/active-items';
import {
  saveToLocalStorage,
  saveToSessionStorage,
} from '@repo/utilities/storage';
import { LOCAL_STORAGE_NAME } from '@repo/constants/names';

export default function Main({
  props,
}: {
  props?: { options?: { mobile: boolean } };
}) {
  const router = useRouter();
  const notes = useStoreNote((s) => s.notes);
  const workspaces = useStoreWorkspace((s) => s.workspaces);
  const activeWorkspace = useStoreActiveItems((s) => s.activeItems?.workspace);
  const setActiveItems = useStoreActiveItems((s) => s.setActiveItems);
  const { noteCreate } = useNoteActions();
  const mobile = useMediaQuery('(max-width: 36em)');

  const handleCreate = (params?: { options?: { today?: boolean } }) => {
    if (notes === undefined) return;

    let regionalDate = null;
    let resolvedWorkspaceId: string | undefined = undefined;

    if (params?.options?.today) {
      const now = new Date();

      const currentDate = getRegionalDate(now, {
        locale: 'en-GB',
        format: 'numeric',
      }).date;

      regionalDate = currentDate;

      const exists = notes?.find((n) => n.title == currentDate);

      // find default workspace
      const oldestWorkspace = workspaces?.reduce((oldest, current) => {
        return new Date(current.created_at) < new Date(oldest.created_at)
          ? current
          : oldest;
      });

      if (oldestWorkspace) {
        if (activeWorkspace?.id !== oldestWorkspace.id) {
          // save new active workspace to local storage
          saveToLocalStorage(
            LOCAL_STORAGE_NAME.ACTIVE_WORKSPACE,
            oldestWorkspace.id
          );

          // save new active workspace to session storage
          saveToSessionStorage(
            LOCAL_STORAGE_NAME.ACTIVE_WORKSPACE,
            oldestWorkspace.id
          );

          // set new global active workspace state
          setActiveItems({ workspace: oldestWorkspace });
        }
      }

      if (!exists) {
        if (oldestWorkspace) {
          resolvedWorkspaceId = oldestWorkspace.id;
        }
      } else {
        router.push(`/app/n/${linkify(exists.title)}-${exists.id}`);
        return;
      }
    }

    noteCreate(
      !regionalDate
        ? undefined
        : { title: regionalDate, workspace_id: resolvedWorkspaceId }
    );
  };

  return (
    <>
      <AppShellSection id="navbar-main" grow>
        <Flex
          direction={props?.options?.mobile ? 'row' : 'column'}
          p={props?.options?.mobile ? undefined : `xs`}
          align={'center'}
          gap={5}
        >
          <DrawerAppNavbar>
            <ButtonAppshellNavbar />
          </DrawerAppNavbar>

          <NextLink href="/app">
            <Group>
              <Tooltip label={'Go to home page'} position={'right'}>
                <ActionIcon
                  variant="subtle"
                  size={ICON_WRAPPER_SIZE}
                  color="dark"
                >
                  <IconHome size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </NextLink>

          <ModalSearch>
            <Group>
              <Tooltip label={'Search note'} position={'right'}>
                <ActionIcon
                  variant="subtle"
                  size={ICON_WRAPPER_SIZE}
                  color="dark"
                >
                  <IconSearch size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </ModalSearch>

          <Group>
            <Tooltip
              label={`Create new note in ${activeWorkspace?.title}`}
              position={'right'}
            >
              <ActionIcon
                variant="subtle"
                color="dark"
                size={ICON_WRAPPER_SIZE}
                onClick={() => handleCreate()}
              >
                <IconEdit size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            </Tooltip>
          </Group>

          {notes === undefined ? (
            <Skeleton w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
          ) : (
            <Tooltip label={"Open today's daily note"} position={'right'}>
              <ActionIcon
                variant="subtle"
                color="dark"
                size={ICON_WRAPPER_SIZE}
                onClick={() => handleCreate({ options: { today: true } })}
              >
                <IconCalendarEvent
                  size={ICON_SIZE}
                  stroke={ICON_STROKE_WIDTH}
                />
              </ActionIcon>
            </Tooltip>
          )}

          {/* <ModalCommands>
            <Group>
              <Tooltip label={'Open command palette'} position={'right'}>
                <ActionIcon variant="subtle" size={ICON_WRAPPER_SIZE} color="dark">
                  <IconTerminal size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </ModalCommands> */}

          <IndicatorTheme />

          <Box visibleFrom="xs">
            <ButtonsFullscreen />
          </Box>
        </Flex>
      </AppShellSection>

      {!mobile && (
        <AppShellSection id="navbar-footer">
          <NavbarParentFooter />
        </AppShellSection>
      )}
    </>
  );
}
