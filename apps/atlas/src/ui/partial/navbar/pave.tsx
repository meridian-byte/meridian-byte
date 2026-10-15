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
import {
  useCalendarActions,
  useFolderActions,
  useStoreAppShell,
  useStoreFolder,
  useSubView,
  useViewAside,
} from '@repo/store';
import React from 'react';
import LayoutPartialNavbar from '@atlas/ui/layout/partial/navbar';
import { useStoreCalendar } from '@repo/store';
import MenuCalendar from '@atlas/ui/menu/calendar';
import { CalendarGet, Order } from '@repo/types';
import PartialEmpty from '../empty';
import AccordionFolder from '@atlas/ui/accordion/folder';
import NavlinkCalendar from '@atlas/ui/navlink/calendar';
import { useMediaQuery } from '@mantine/hooks';

export default function Pave() {
  const desktop = useMediaQuery('(min-width: 62em)');

  const navbarActive = useStoreAppShell((s) => s.appshell?.child?.navbar);
  const toggleNavbarChild = useStoreAppShell((s) => s.toggleNavbarChild);

  const { subViewValue, showSubViewPave } = useSubView();
  const { showAsideViewPave } = useViewAside();

  const folders = useStoreFolder((s) => s.folders);
  const { folderCreate } = useFolderActions();
  const paveFolders = folders?.filter((fi) => fi.location === APP_NAMES_ATLAS.PAVE && !fi.folderId);

  const calendars = useStoreCalendar((s) => s.calendars);
  const { calendarCreate } = useCalendarActions();
  const calendarsWithoutFolder = calendars?.filter((ci) => !ci.folderId);

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
    <div>
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

      <div className="group/paveCalendars">
        <Group justify="space-between" align="end" pl={desktop ? 5 : 12 + 5} mt={5}>
          <Title order={2} fz={{ base: 'lg', md: '.8rem' }} fw={500} c={'dimmed'}>
            Calendars
          </Title>

          <Group
            justify="end"
            gap={desktop ? 0 : 5}
            className={
              desktop
                ? 'opacity-0 group-hover/paveCalendars:opacity-100 transition-opacity duration-250 pointer-events-none group-hover/paveCalendars:pointer-events-auto'
                : undefined
            }
            mih={desktop ? 30 : ICON_WRAPPER_SIZE * 1.25 + 6}
            pr={5}
          >
            <Tooltip label={`Add calendar`}>
              <ActionIcon
                size={desktop ? 30 - 6 : ICON_WRAPPER_SIZE * 1.25}
                color="gray"
                variant={desktop ? 'subtle' : 'light'}
                onClick={() => calendarCreate()}
              >
                <IconPlus
                  size={desktop ? ICON_SIZE - 4 : ICON_SIZE * 1.25}
                  stroke={ICON_STROKE_WIDTH}
                />
              </ActionIcon>
            </Tooltip>

            <Tooltip label={`Add calendar folder`}>
              <ActionIcon
                size={desktop ? 30 - 6 : ICON_WRAPPER_SIZE * 1.25}
                color="gray"
                variant={desktop ? 'subtle' : 'light'}
                onClick={() => {
                  folderCreate({ id: generateUUID(), location: APP_NAMES_ATLAS.PAVE });
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

        <Box mih={220}>
          <Divider my={5} />

          {paveFolders === undefined || !paveFolders.length
            ? null
            : sortArray(paveFolders, (i) => i.createdAt, Order.DESCENDING).map((fi) => (
                <div key={fi.id}>
                  <AccordionFolder folderId={fi.id} location={APP_NAMES_ATLAS.PAVE} />
                </div>
              ))}

          {calendars === undefined || !calendars?.length ? (
            <PartialEmpty loading={calendars === undefined} label={`No calendars.`} />
          ) : (
            sortArray(calendarsWithoutFolder || [], (i) => i.createdAt, Order.DESCENDING).map(
              (ci) => (
                <div key={ci.id}>
                  <NavlinkCalendar props={ci} />
                </div>
              ),
            )
          )}
        </Box>
      </div>
    </div>
  );
}
