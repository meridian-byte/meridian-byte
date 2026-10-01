'use client';

import {
  ActionIcon,
  Box,
  Center,
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
  SECTION_SPACING,
  SUBVIEW_NAMES,
} from '@repo/constants';
import { capitalizeWords, extractUuidFromParam, generateUUID, sortArray } from '@repo/utils';
import {
  IconCalendar,
  IconCalendarCancel,
  IconCalendarDown,
  IconCalendarPlus,
  IconCalendarShare,
  IconCircleCheck,
  IconCircleFilled,
  IconDots,
  IconEdit,
  IconFolderPlus,
  IconInbox,
  IconLayoutCards,
  IconLayoutDistributeHorizontal,
  IconLayoutGrid,
  IconLayoutList,
  IconPlus,
} from '@tabler/icons-react';
import { useFolderActions, useStoreFolder, useSubView, useViewAside } from '@repo/store';
import React from 'react';
import LayoutPartialNavbar from '@atlas/ui/layout/partial/navbar';
import { useStoreCalendar } from '@repo/store';
import MenuCalendar from '@atlas/ui/menu/calendar';
import { CalendarGet, Order } from '@repo/types';
import PartialEmpty from '../empty';
import AccordionFolder from '@atlas/ui/accordion/folder';
import NavlinkCalendar from '@atlas/ui/navlink/calendar';

export default function Pave() {
  const { subViewValue, showSubViewPave } = useSubView();
  const { showAsideViewPave } = useViewAside();

  const { folderCreate } = useFolderActions();
  const folders = useStoreFolder((s) => s.folders);
  const paveFolders = folders?.filter(
    (fi) => fi.location === APP_NAMES_ATLAS.PAVE && !fi.parentFolder,
  );

  const calendars = useStoreCalendar((s) => s.calendars);
  const calendarsWithoutFolder = calendars?.filter((ci) => !ci.folderId);
  const sortedCalendars = sortArray(
    calendarsWithoutFolder || [],
    (i) => i.createdAt,
    Order.DESCENDING,
  );

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
                  <IconCalendarPlus size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>

              <Tooltip label={`Add calendar folder`}>
                <ActionIcon
                  size={30}
                  color="gray"
                  variant="subtle"
                  radius={0}
                  onClick={() => {
                    folderCreate({ id: generateUUID(), location: APP_NAMES_ATLAS.PAVE });
                  }}
                >
                  <IconFolderPlus size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>

          <div>
            {paveFolders === undefined || !paveFolders.length
              ? null
              : paveFolders.map((fi) => (
                  <div key={fi.id}>
                    <Divider />
                    <AccordionFolder folderId={fi.id} location={APP_NAMES_ATLAS.PAVE} />
                  </div>
                ))}

            {calendars === undefined || !calendars?.length ? (
              <PartialEmpty loading={calendars === undefined} label={`No calendars.`} />
            ) : (
              sortedCalendars.map((ci) => (
                <React.Fragment key={ci.id}>
                  <Divider />
                  <NavlinkCalendar props={ci} />
                </React.Fragment>
              ))
            )}
          </div>
        </div>
      </Stack>
    </LayoutPartialNavbar>
  );
}
