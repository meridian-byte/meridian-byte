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

export default function Jot() {
  const { subViewValue, showSubViewJot } = useSubView();
  const { noteCreate } = useNoteActions();
  // const { showAsideViewJot } = useViewAside();

  const { folderCreate } = useFolderActions();
  const folders = useStoreFolder((s) => s.folders);
  const jotFolders = folders?.filter((fi) => fi.location == APP_NAMES_ATLAS.JOT && !fi.folderId);

  const notes = useStoreNote((s) => s.notes);
  const notesWithoutFolder = notes?.filter((ci) => !ci.folderId);
  const sortedNotes = sortArray(notesWithoutFolder || [], (i) => i.createdAt, Order.DESCENDING);

  const navLinks: any[] = [
    // {
    //   icon: IconHome,
    //   label: capitalizeWords(SUBVIEW_NAMES.JOT.HOME),
    //   action: () => showSubViewJot(SUBVIEW_NAMES.JOT.HOME),
    // },
  ];

  return (
    <Stack gap={'xs'}>
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
                  p={0}
                  fw={600}
                  style={{ borderRadius: 'var(--mantine-radius-md)' }}
                  styles={{
                    section: { marginInlineEnd: 0 },
                    body: { marginBottom: 4 },
                    label: { fontSize: 'var(--mantine-font-size-xs)' },
                  }}
                  onClick={nl.action}
                  leftSection={
                    <ThemeIcon
                      size={30}
                      variant="transparent"
                      color={active ? 'var(--mantine-color-pri-6)' : 'gray'}
                    >
                      <nl.icon size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                    </ThemeIcon>
                  }
                />
              </React.Fragment>
            );
          })}
        </div>
      )}

      <div className="group/jotNotes">
        <Group justify="space-between" pl={5}>
          <Title order={2} fz={'.8rem'} fw={500} c={'dimmed'}>
            Notes
          </Title>

          <Group
            justify="end"
            gap={0}
            className="opacity-0 group-hover/jotNotes:opacity-100 transition-opacity duration-250 pointer-events-none group-hover/jotNotes:pointer-events-auto"
            mih={30}
            pr={4}
          >
            <Tooltip label={`Add note`}>
              <ActionIcon
                size={30 - 6}
                color="gray"
                variant="subtle"
                // onClick={() => showAsideViewJot(ASIDE_VIEW_NAMES.NEW.JOT.NOTE)}
                onClick={() => noteCreate()}
              >
                <IconFilePlus size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label={`Add note folder`}>
              <ActionIcon
                size={30 - 6}
                color="gray"
                variant="subtle"
                onClick={() => {
                  folderCreate({ id: generateUUID(), location: APP_NAMES_ATLAS.JOT });
                }}
              >
                <IconFolderPlus size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>

        <div>
          <Divider mb={4} />

          {jotFolders === undefined || !jotFolders.length
            ? null
            : jotFolders.map((fi) => (
                <div key={fi.id}>
                  <AccordionFolder folderId={fi.id} location={APP_NAMES_ATLAS.JOT} />
                </div>
              ))}

          {notes === undefined || !notes?.length ? (
            <PartialEmpty loading={notes === undefined} label={`No notes.`} />
          ) : (
            sortedNotes.map((ni) => (
              <div key={ni.id}>
                <NavlinkNote props={ni} />
              </div>
            ))
          )}
        </div>
      </div>
    </Stack>
  );
}
