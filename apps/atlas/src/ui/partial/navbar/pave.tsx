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
  const paveFolders = folders?.filter((fi) => fi.location === APP_NAMES_ATLAS.PAVE && !fi.folderId);

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
    <Stack gap={'xs'}>
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
                  label: {
                    fontSize: 'var(--mantine-font-size-xs)',
                    color: active ? 'var(--mantine-color-pri-6)' : undefined,
                  },
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

      <div className="group/paveCalendars">
        <Group justify="space-between" pl={5}>
          <Title order={2} fz={'.8rem'} fw={500} c={'dimmed'}>
            Calendars
          </Title>

          <Group
            justify="end"
            gap={0}
            className="opacity-0 group-hover/paveCalendars:opacity-100 transition-opacity duration-250 pointer-events-none group-hover/paveCalendars:pointer-events-auto"
            mih={30}
            pr={4}
          >
            <Tooltip label={`Add calendar`}>
              <ActionIcon
                size={30 - 6}
                color="gray"
                variant="subtle"
                onClick={() => showAsideViewPave(ASIDE_VIEW_NAMES.NEW.PAVE.CALENDAR)}
              >
                <IconCalendarPlus size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label={`Add calendar folder`}>
              <ActionIcon
                size={30 - 6}
                color="gray"
                variant="subtle"
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
          <Divider mb={4} />

          {paveFolders === undefined || !paveFolders.length
            ? null
            : paveFolders.map((fi) => (
                <div key={fi.id}>
                  <AccordionFolder folderId={fi.id} location={APP_NAMES_ATLAS.PAVE} />
                </div>
              ))}

          {calendars === undefined || !calendars?.length ? (
            <PartialEmpty loading={calendars === undefined} label={`No calendars.`} />
          ) : (
            sortedCalendars.map((ci) => (
              <div key={ci.id}>
                <NavlinkCalendar props={ci} />
              </div>
            ))
          )}
        </div>
      </div>
    </Stack>
  );
}
