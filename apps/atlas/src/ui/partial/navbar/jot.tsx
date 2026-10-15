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
import React from 'react';
import LayoutPartialNavbar from '@atlas/ui/layout/partial/navbar';
import MenuNote from '@atlas/ui/menu/note';
import { Order } from '@repo/types';
import PartialEmpty from '../empty';
import NavlinkNote from '@atlas/ui/navlink/note';
import AccordionFolder from '@atlas/ui/accordion/folder';
import { useMediaQuery } from '@mantine/hooks';

export default function Jot() {
  const desktop = useMediaQuery('(min-width: 62em)');

  const navbarActive = useStoreAppShell((s) => s.appshell?.child?.navbar);
  const toggleNavbarChild = useStoreAppShell((s) => s.toggleNavbarChild);

  const { subViewValue, showSubViewJot } = useSubView();
  // const { showAsideViewJot } = useViewAside();

  const folders = useStoreFolder((s) => s.folders);
  const { folderCreate } = useFolderActions();
  const jotFolders = folders?.filter((fi) => fi.location == APP_NAMES_ATLAS.JOT && !fi.folderId);

  const notes = useStoreNote((s) => s.notes);
  const { noteCreate } = useNoteActions();
  const notesWithoutFolder = notes?.filter((ci) => !ci.folderId);

  const navLinks: any[] = [
    // {
    //   icon: IconHome,
    //   label: capitalizeWords(SUBVIEW_NAMES.JOT.HOME),
    //   action: () => showSubViewJot(SUBVIEW_NAMES.JOT.HOME),
    // },
  ];

  return (
    <div>
      {!!navLinks.length && (
        <div>
          {navLinks.map((nl, i) => {
            const active = nl.label.toLocaleLowerCase() == subViewValue;

            return (
              <React.Fragment key={nl.label}>
                {/* {i > 0 && <Divider />} */}

                <NavLink
                  label={nl.label}
                  color="gray"
                  p={desktop ? 0 : undefined}
                  fw={600}
                  styles={{
                    section: desktop ? { marginInlineEnd: 0 } : undefined,
                    body: { marginBottom: 4 },
                    label: {
                      fontSize: desktop ? 'var(--mantine-font-size-xs)' : undefined,
                      color: active ? 'var(--mantine-color-pri-6)' : undefined,
                    },
                  }}
                  onClick={() => {
                    if (!desktop) {
                      if (navbarActive) toggleNavbarChild();
                    }

                    nl.action();
                  }}
                  leftSection={
                    <ThemeIcon
                      size={desktop ? 30 : ICON_WRAPPER_SIZE}
                      variant="transparent"
                      color={active ? 'var(--mantine-color-pri-6)' : 'gray'}
                    >
                      <nl.icon
                        size={desktop ? ICON_SIZE - 4 : ICON_SIZE}
                        stroke={ICON_STROKE_WIDTH}
                      />
                    </ThemeIcon>
                  }
                />
              </React.Fragment>
            );
          })}
        </div>
      )}

      <div className="group/jotNotes">
        <Group justify="space-between" align="end" pl={desktop ? 5 : 12 + 5} mt={5}>
          <Title order={2} fz={{ base: 'lg', md: '.8rem' }} fw={500} c={'dimmed'}>
            Notes
          </Title>

          <Group
            justify="end"
            gap={desktop ? 0 : 5}
            className={
              desktop
                ? 'opacity-0 group-hover/jotNotes:opacity-100 transition-opacity duration-250 pointer-events-none group-hover/jotNotes:pointer-events-auto'
                : undefined
            }
            mih={desktop ? 30 : ICON_WRAPPER_SIZE * 1.25 + 6}
            pr={5}
          >
            <Tooltip label={`Add note`}>
              <ActionIcon
                size={desktop ? 30 - 6 : ICON_WRAPPER_SIZE * 1.25}
                color="gray"
                variant={desktop ? 'subtle' : 'light'}
                onClick={() => noteCreate()}
              >
                <IconPlus
                  size={desktop ? ICON_SIZE - 4 : ICON_SIZE * 1.25}
                  stroke={ICON_STROKE_WIDTH}
                />
              </ActionIcon>
            </Tooltip>

            <Tooltip label={`Add note folder`}>
              <ActionIcon
                size={desktop ? 30 - 6 : ICON_WRAPPER_SIZE * 1.25}
                color="gray"
                variant={desktop ? 'subtle' : 'light'}
                onClick={() => {
                  folderCreate({ id: generateUUID(), location: APP_NAMES_ATLAS.JOT });
                }}
              >
                <IconFolderPlus
                  size={desktop ? ICON_SIZE - 4 : ICON_SIZE * 1.25}
                  stroke={ICON_STROKE_WIDTH}
                />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>

        <Box>
          <Divider my={5} />

          {jotFolders === undefined || !jotFolders.length
            ? null
            : sortArray(jotFolders, (i) => i.createdAt, Order.DESCENDING).map((fi) => (
                <div key={fi.id}>
                  <AccordionFolder folderId={fi.id} location={APP_NAMES_ATLAS.JOT} />
                </div>
              ))}

          {notes === undefined || !notes?.length ? (
            <PartialEmpty loading={notes === undefined} label={`No notes.`} />
          ) : (
            sortArray(notesWithoutFolder || [], (i) => i.createdAt, Order.DESCENDING).map((ni) => (
              <div key={ni.id}>
                <NavlinkNote props={ni} />
              </div>
            ))
          )}
        </Box>
      </div>
    </div>
  );
}
