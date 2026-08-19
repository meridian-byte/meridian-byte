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
  ASIDE_VIEW_NAMES,
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  SUBVIEW_NAMES,
} from '@repo/constants';
import { capitalizeWords, extractUuidFromParam, sortArray } from '@repo/utils';
import {
  IconCalendarCancel,
  IconCalendarDown,
  IconCalendarShare,
  IconCircleCheck,
  IconDots,
  IconFolder,
  IconHome,
  IconInbox,
  IconNote,
  IconPlus,
} from '@tabler/icons-react';
import { useNoteActions, useStoreNote, useSubView, useViewAside } from '@repo/store';
import React from 'react';
import LayoutPartialNavbar from '@atlas/ui/layout/partial/navbar';
import MenuNote from '@atlas/ui/menu/note';
import { Order } from '@repo/types';
import PartialEmpty from '../empty';

export default function Jot() {
  const { subViewValue, showSubViewJot } = useSubView();
  const { noteCreate } = useNoteActions();
  const { showAsideViewJot } = useViewAside();
  const notes = useStoreNote((s) => s.notes);
  const sortedNotes = sortArray(notes || [], (i) => i.createdAt, Order.DESCENDING);

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
                  <IconNote size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>

              <Tooltip label={`Add note folder`}>
                <ActionIcon
                  size={30}
                  color="gray"
                  variant="subtle"
                  radius={0}
                  onClick={() => showAsideViewJot(ASIDE_VIEW_NAMES.NEW.JOT.FOLDER)}
                  disabled
                >
                  <IconFolder size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>

          <div>
            {notes === undefined || !notes?.length ? (
              <PartialEmpty loading={notes === undefined} label={`No notes.`} />
            ) : (
              sortedNotes.map((ni, i) => {
                const noteActive =
                  subViewValue?.includes('note: ') && extractUuidFromParam(subViewValue) == ni.id;

                return (
                  <React.Fragment key={ni.id}>
                    {<Divider />}

                    <Group gap={0} wrap="nowrap">
                      <NavLink
                        label={ni.title}
                        color="gray"
                        px={'xs'}
                        py={3}
                        fw={500}
                        leftSection={
                          <ThemeIcon size={ICON_SIZE - 4} color="gray" variant="transparent" mt={4}>
                            <IconNote size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                          </ThemeIcon>
                        }
                        styles={{
                          label: {
                            fontSize: 'var(--mantine-font-size-xs)',
                            color: !noteActive ? undefined : 'var(--mantine-color-pri-6)',
                          },
                        }}
                        onClick={() => showSubViewJot(`note: ${ni.id}`)}
                      />

                      <MenuNote defaultValues={ni}>
                        <ActionIcon size={30} color="gray" variant="subtle" radius={0}>
                          <IconDots size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                        </ActionIcon>
                      </MenuNote>
                    </Group>
                  </React.Fragment>
                );
              })
            )}
          </div>
        </div>
      </Stack>
    </LayoutPartialNavbar>
  );
}
