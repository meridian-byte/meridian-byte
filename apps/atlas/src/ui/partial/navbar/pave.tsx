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
  Title,
  Tooltip,
} from '@mantine/core';
import {
  ASIDE_VIEW_NAMES,
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  SECTION_SPACING,
  SUBVIEW_NAMES,
} from '@repo/constants';
import { capitalizeWords } from '@repo/utils';
import {
  IconCalendar,
  IconCalendarCancel,
  IconCalendarDown,
  IconCalendarPlus,
  IconCalendarShare,
  IconCircleCheck,
  IconInbox,
  IconLayoutCards,
  IconLayoutDistributeHorizontal,
  IconLayoutGrid,
  IconLayoutList,
  IconPlus,
} from '@tabler/icons-react';
import { useSubView, useViewAside } from '@atlas/hooks/view';
import React from 'react';
import LayoutPartialNavbar from '@atlas/ui/layout/partial/navbar';
import { useStoreCalendar } from '@repo/store';

export default function Pave() {
  const { subViewValue, showSubViewPave } = useSubView();
  const { showAsideViewPave } = useViewAside();
  const calendars = useStoreCalendar((s) => s.calendars);

  const navLinks = [
    {
      icon: IconLayoutDistributeHorizontal,
      label: capitalizeWords(SUBVIEW_NAMES.PAVE.DAY),
      action: () => showSubViewPave(SUBVIEW_NAMES.PAVE.DAY),
    },
    {
      icon: IconLayoutList,
      label: capitalizeWords(SUBVIEW_NAMES.PAVE.WEEK),
      action: () => showSubViewPave(SUBVIEW_NAMES.PAVE.WEEK),
    },
    {
      icon: IconLayoutGrid,
      label: capitalizeWords(SUBVIEW_NAMES.PAVE.MONTH),
      action: () => showSubViewPave(SUBVIEW_NAMES.PAVE.MONTH),
    },
    {
      icon: IconLayoutCards,
      label: capitalizeWords(SUBVIEW_NAMES.PAVE.YEAR),
      action: () => showSubViewPave(SUBVIEW_NAMES.PAVE.YEAR),
    },
  ];

  return (
    <LayoutPartialNavbar>
      <Stack gap={'xs'}>
        <Box>
          {navLinks.map((nl, i) => {
            const active = nl.label.toLocaleLowerCase() == subViewValue;

            return (
              <React.Fragment key={nl.label}>
                {i > 0 && <Divider />}

                <NavLink
                  label={nl.label}
                  color="gray"
                  px={'xs'}
                  py={3}
                  fw={500}
                  styles={{
                    label: {
                      fontSize: 'var(--mantine-font-size-xs)',
                      color: active ? 'var(--mantine-color-pri-6)' : undefined,
                    },
                  }}
                  onClick={nl.action}
                  leftSection={
                    <div style={{ color: active ? 'var(--mantine-color-pri-6)' : undefined }}>
                      <nl.icon
                        size={ICON_SIZE - 4}
                        stroke={ICON_STROKE_WIDTH}
                        style={{ marginTop: 2 }}
                      />
                    </div>
                  }
                />
              </React.Fragment>
            );
          })}
        </Box>

        <div>
          <Group justify="space-between" pl={'xs'}>
            <Title order={2} fz={'sm'} fw={500} c={'dimmed'}>
              Calendars
            </Title>

            <Group justify="end" gap={0}>
              <Tooltip label={`Add calendar`}>
                <ActionIcon
                  size={30}
                  color="gray"
                  variant="subtle"
                  radius={0}
                  onClick={() => showAsideViewPave(ASIDE_VIEW_NAMES.NEW.PAVE.CALENDAR)}
                >
                  <IconCalendar size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>

          <div>
            {calendars === undefined ? (
              <Stack align="center" py={'xl'} fz={'xs'}>
                <Loader size={'xs'} />
              </Stack>
            ) : !calendars?.length ? (
              <Stack align="center" py={'xl'} fz={'xs'}>
                <Text inherit>No calendars</Text>
              </Stack>
            ) : (
              calendars.map((sc, i) => (
                <React.Fragment key={sc.title}>
                  <Divider />

                  <NavLink
                    label={sc.title}
                    color="gray"
                    px={'xs'}
                    py={3}
                    fw={500}
                    styles={{ label: { fontSize: 'var(--mantine-font-size-xs)' } }}
                    onClick={() => showSubViewPave(`calendar: ${sc.id}`)}
                  />
                </React.Fragment>
              ))
            )}
          </div>
        </div>
      </Stack>
    </LayoutPartialNavbar>
  );
}
