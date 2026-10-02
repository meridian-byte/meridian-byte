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
  // const { subViewValue, showSubViewJot } = useSubView();
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
    <LayoutPartialNavbar>
      <Stack gap={0}>
        <Box>
          {navLinks.map((nl, i) => (
            <React.Fragment key={nl.label}>
              {i > 0 && <Divider />}

              <NavLink
                label={nl.label}
                color="gray"
                px={'xs'}
                py={3}
                fw={500}
                styles={{ label: { fontSize: 'var(--mantine-font-size-xs)' } }}
                onClick={nl.action}
                leftSection={
                  <nl.icon
                    size={ICON_SIZE - 4}
                    stroke={ICON_STROKE_WIDTH}
                    style={{ marginTop: 2 }}
                  />
                }
              />
            </React.Fragment>
          ))}
        </Box>

        <div>
          <Group justify="space-between" pl={'xs'}>
            <Title order={2} fz={'sm'} fw={500} c={'dimmed'}>
              Notes
            </Title>

            <Group justify="end" gap={0}>
              <Tooltip label={`Add note`}>
                <ActionIcon
                  size={30}
                  color="gray"
                  variant="subtle"
                  radius={0}
                  // onClick={() => showAsideViewJot(ASIDE_VIEW_NAMES.NEW.JOT.NOTE)}
                  onClick={() => noteCreate()}
                >
                  <IconFilePlus size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>

              <Tooltip label={`Add note folder`}>
                <ActionIcon
                  size={30}
                  color="gray"
                  variant="subtle"
                  radius={0}
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
            {jotFolders?.map((fi) => (
              <div key={fi.id}>
                <Divider />
                <AccordionFolder folderId={fi.id} location={APP_NAMES_ATLAS.JOT} />
              </div>
            ))}

            {notes === undefined || !notes?.length ? (
              <PartialEmpty loading={notes === undefined} label={`No notes.`} />
            ) : (
              sortedNotes.map((ni) => (
                <React.Fragment key={ni.id}>
                  <Divider />
                  <NavlinkNote props={ni} />
                </React.Fragment>
              ))
            )}
          </div>
        </div>
      </Stack>
    </LayoutPartialNavbar>
  );
}
