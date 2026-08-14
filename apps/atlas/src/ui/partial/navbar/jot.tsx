'use client';

import { ActionIcon, Box, Divider, Group, NavLink, Stack, Title, Tooltip } from '@mantine/core';
import {
  ASIDE_VIEW_NAMES,
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  SUBVIEW_NAMES,
} from '@repo/constants';
import { capitalizeWords } from '@repo/utils';
import {
  IconCalendarCancel,
  IconCalendarDown,
  IconCalendarShare,
  IconCircleCheck,
  IconFolder,
  IconHome,
  IconInbox,
  IconNote,
  IconPlus,
} from '@tabler/icons-react';
import { useSubView, useViewAside } from '@repo/store';
import React from 'react';
import LayoutPartialNavbar from '@atlas/ui/layout/partial/navbar';

export default function Jot() {
  const { showSubViewJot } = useSubView();
  const { showAsideViewJot } = useViewAside();

  const navLinks: any[] = [
    // {
    //   icon: IconHome,
    //   label: capitalizeWords(SUBVIEW_NAMES.JOT.HOME),
    //   action: () => showSubViewJot(SUBVIEW_NAMES.JOT.HOME),
    // },
  ];

  const sampleNoteLists = [
    {
      label: 'note item 1',
      action: () => showSubViewJot(`note: ${'note item 1'}`),
    },
    {
      label: 'brain dump',
      action: () => showSubViewJot(`note: ${'brain dump'}`),
    },
    {
      label: 'Journal entry (19-07-26)',
      action: () => showSubViewJot(`note: ${'Journal entry (19-07-26)'}`),
    },
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
                  onClick={() => showAsideViewJot(ASIDE_VIEW_NAMES.NEW.JOT.NOTE)}
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
                >
                  <IconFolder size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>

          <div>
            {sampleNoteLists.map((nl, i) => (
              <React.Fragment key={nl.label}>
                {<Divider />}

                <NavLink
                  label={nl.label}
                  color="gray"
                  px={'xs'}
                  py={3}
                  fw={500}
                  styles={{ label: { fontSize: 'var(--mantine-font-size-xs)' } }}
                  onClick={nl.action}
                />
              </React.Fragment>
            ))}
          </div>
        </div>
      </Stack>
    </LayoutPartialNavbar>
  );
}
