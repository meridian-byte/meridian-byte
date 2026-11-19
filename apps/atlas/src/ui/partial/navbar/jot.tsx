'use client';

import {
  ActionIcon,
  Box,
  Divider,
  Group,
  Loader,
  NavLink,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  APP_NAMES_ATLAS,
  ASIDE_VIEW_NAMES,
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  SUBVIEW_NAMES,
} from '@repo/constants';
import { capitalizeWords, extractUuidFromParam, generateUUID, sortArray } from '@repo/utils';
import {
  IconCalendarCancel,
  IconCalendarDown,
  IconCalendarShare,
  IconCircleCheck,
  IconDots,
  IconFilePlus,
  IconFolder,
  IconFolderPlus,
  IconHome,
  IconInbox,
  IconNote,
  IconPlus,
} from '@tabler/icons-react';
import {
  useFolderActions,
  useNoteActions,
  useStoreAppShell,
  useStoreFolder,
  useStoreNote,
  useSubView,
  useViewAside,
} from '@repo/store';
import React, { memo, useCallback, useMemo } from 'react';
import LayoutPartialNavbar from '@atlas/ui/layout/partial/navbar';
import MenuNote from '@atlas/ui/menu/note';
import { Order } from '@repo/types';
import PartialEmpty from '../empty';
import NavlinkNote from '@atlas/ui/navlink/note';
import AccordionFolder from '@atlas/ui/accordion/folder';

import { useBreakpointFlags } from '@repo/hooks';

const EMPTY_ARRAY: any[] = [];

const Jot = memo(function Jot() {
  const { ready, isDesktop } = useBreakpointFlags();

  const toggleNavbarChild = useStoreAppShell((s) => s.toggleNavbarChild);

  const folders = useStoreFolder((s) => s.folders);
  const { folderCreate } = useFolderActions();

  const notes = useStoreNote((s) => s.notes);
  const { noteCreate } = useNoteActions();

  const sortedRootFolders = useMemo(() => {
    if (!folders) return EMPTY_ARRAY;
    const rootJotFolders = folders.filter(
      (fi) => fi.location === APP_NAMES_ATLAS.JOT && !fi.folderId,
    );
    return sortArray(rootJotFolders, (i) => i.createdAt, Order.DESCENDING);
  }, [folders]);

  const sortedRootNotes = useMemo(() => {
    if (!notes) return EMPTY_ARRAY;
    const ungroupedNotes = notes.filter((ni) => !ni.folderId);
    return sortArray(ungroupedNotes, (i) => i.createdAt, Order.DESCENDING);
  }, [notes]);

  const handleCreateNote = useCallback(() => {
    noteCreate();
  }, [noteCreate]);

  const handleCreateFolder = useCallback(() => {
    folderCreate({ id: generateUUID(), location: APP_NAMES_ATLAS.JOT });
  }, [folderCreate]);

  const handleCloseNavbarOnMobile = useCallback(() => {
    if (!isDesktop && useStoreAppShell.getState().appshell?.child?.navbar) {
      toggleNavbarChild();
    }
  }, [isDesktop, toggleNavbarChild]);

  if (!ready) {
    return null;
  }

  const isLoading = folders === undefined || notes === undefined;
  const isEmpty = !isLoading && sortedRootFolders.length === 0 && sortedRootNotes.length === 0;

  return (
    <div>
      <div className="group/jotNotes">
        <Group justify="space-between" align="end" pl={isDesktop ? 5 : 12 + 5} mt={5}>
          <Title order={2} fz={{ base: 'lg', md: '.8rem' }} fw={500} c="dimmed">
            Notes
          </Title>

          <Group
            justify="end"
            gap={isDesktop ? 0 : 5}
            className={
              isDesktop
                ? 'opacity-0 group-hover/jotNotes:opacity-100 transition-opacity duration-200 pointer-events-none group-hover/jotNotes:pointer-events-auto'
                : undefined
            }
            mih={isDesktop ? 30 : ICON_WRAPPER_SIZE * 1.25 + 6}
            pr={5}
          >
            <Tooltip label="Add note">
              <ActionIcon
                size={isDesktop ? 30 - 6 : ICON_WRAPPER_SIZE * 1.25}
                color="gray"
                variant={isDesktop ? 'subtle' : 'light'}
                onClick={handleCreateNote}
              >
                <IconPlus
                  size={isDesktop ? ICON_SIZE - 4 : ICON_SIZE * 1.25}
                  stroke={ICON_STROKE_WIDTH}
                />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Add note folder">
              <ActionIcon
                size={isDesktop ? 30 - 6 : ICON_WRAPPER_SIZE * 1.25}
                color="gray"
                variant={isDesktop ? 'subtle' : 'light'}
                onClick={handleCreateFolder}
              >
                <IconFolderPlus
                  size={isDesktop ? ICON_SIZE - 4 : ICON_SIZE * 1.25}
                  stroke={ICON_STROKE_WIDTH}
                />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>

        {isLoading || isEmpty ? (
          <PartialEmpty loading={notes === undefined} label="Nothing here." />
        ) : (
          <Box mih={220}>
            <Divider my={5} />

            {sortedRootFolders.map((fi) => (
              <div key={fi.id}>
                <AccordionFolder folderId={fi.id} location={APP_NAMES_ATLAS.JOT} />
              </div>
            ))}

            {sortedRootNotes.map((ni) => (
              <div key={ni.id}>
                <NavlinkNote props={ni} />
              </div>
            ))}
          </Box>
        )}
      </div>
    </div>
  );
});

export default Jot;
