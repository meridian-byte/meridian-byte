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
import React, { memo, useCallback, useMemo } from 'react';
import LayoutPartialNavbar from '@atlas/ui/layout/partial/navbar';
import { useStoreCalendar } from '@repo/store';
import MenuCalendar from '@atlas/ui/menu/calendar';
import { CalendarGet, Order } from '@repo/types';
import PartialEmpty from '../empty';
import AccordionFolder from '@atlas/ui/accordion/folder';
import NavlinkCalendar from '@atlas/ui/navlink/calendar';

import { useBreakpointFlags } from '@repo/hooks';

const EMPTY_ARRAY: any[] = [];

interface PaveNavLinkItem {
  icon: React.ComponentType<any>;
  label: string;
  subViewKey: string;
}

const PaveNavLinkRow = memo(function PaveNavLinkRow({
  item,
  isActive,
  isDesktop,
  onSelect,
}: {
  item: PaveNavLinkItem;
  isActive: boolean;
  isDesktop: boolean;
  onSelect: (subViewKey: string) => void;
}) {
  const IconComponent = item.icon;

  const navLinkStyles = useMemo(
    () => ({
      section: isDesktop ? { marginInlineEnd: 0 } : undefined,
      body: { marginBottom: 4 },
      label: {
        fontSize: isDesktop ? 'var(--mantine-font-size-xs)' : undefined,
        color: isActive ? 'var(--mantine-color-pri-6)' : undefined,
      },
    }),
    [isDesktop, isActive],
  );

  const handleClick = useCallback(() => {
    onSelect(item.subViewKey);
  }, [onSelect, item.subViewKey]);

  return (
    <NavLink
      label={item.label}
      color="gray"
      p={isDesktop ? 0 : undefined}
      fw={600}
      styles={navLinkStyles}
      onClick={handleClick}
      leftSection={
        <ThemeIcon
          size={isDesktop ? 30 : ICON_WRAPPER_SIZE}
          variant="transparent"
          color={isActive ? 'var(--mantine-color-pri-6)' : 'gray'}
        >
          <IconComponent
            size={isDesktop ? ICON_SIZE - 4 : ICON_SIZE}
            stroke={ICON_STROKE_WIDTH}
          />
        </ThemeIcon>
      }
    />
  );
});

const Pave = memo(function Pave() {
  const { ready, isDesktop } = useBreakpointFlags();

  const toggleNavbarChild = useStoreAppShell((s) => s.toggleNavbarChild);

  const { subViewValue, showSubViewPave } = useSubView();

  const folders = useStoreFolder((s) => s.folders);
  const { folderCreate } = useFolderActions();

  const calendars = useStoreCalendar((s) => s.calendars);
  const { calendarCreate } = useCalendarActions();

  const navLinks = useMemo<PaveNavLinkItem[]>(
    () => [
      {
        icon: IconLayoutDistributeHorizontal,
        label: capitalizeWords(SUBVIEW_NAMES.PAVE.DAY),
        subViewKey: SUBVIEW_NAMES.PAVE.DAY,
      },
      {
        icon: IconLayoutList,
        label: capitalizeWords(SUBVIEW_NAMES.PAVE.WEEK),
        subViewKey: SUBVIEW_NAMES.PAVE.WEEK,
      },
      {
        icon: IconLayoutGrid,
        label: capitalizeWords(SUBVIEW_NAMES.PAVE.MONTH),
        subViewKey: SUBVIEW_NAMES.PAVE.MONTH,
      },
      {
        icon: IconLayoutCards,
        label: capitalizeWords(SUBVIEW_NAMES.PAVE.YEAR),
        subViewKey: SUBVIEW_NAMES.PAVE.YEAR,
      },
    ],
    [],
  );

  const sortedRootFolders = useMemo(() => {
    if (!folders) return EMPTY_ARRAY;
    const rootPaveFolders = folders.filter(
      (fi) => fi.location === APP_NAMES_ATLAS.PAVE && !fi.folderId,
    );
    return sortArray(rootPaveFolders, (i) => i.createdAt, Order.DESCENDING);
  }, [folders]);

  const sortedRootCalendars = useMemo(() => {
    if (!calendars) return EMPTY_ARRAY;
    const ungroupedCalendars = calendars.filter((ci) => !ci.folderId);
    return sortArray(ungroupedCalendars, (i) => i.createdAt, Order.DESCENDING);
  }, [calendars]);

  const handleSelectNavLink = useCallback(
    (subViewKey: string) => {
      if (!isDesktop && useStoreAppShell.getState().appshell?.child?.navbar) {
        toggleNavbarChild();
      }
      showSubViewPave(subViewKey);
    },
    [isDesktop, toggleNavbarChild, showSubViewPave],
  );

  const handleCreateCalendar = useCallback(() => {
    calendarCreate();
  }, [calendarCreate]);

  const handleCreateFolder = useCallback(() => {
    folderCreate({ id: generateUUID(), location: APP_NAMES_ATLAS.PAVE });
  }, [folderCreate]);

  if (!ready) {
    return null;
  }

  const isLoading = folders === undefined || calendars === undefined;
  const isEmpty = !isLoading && sortedRootFolders.length === 0 && sortedRootCalendars.length === 0;

  return (
    <div>
      <div>
        {navLinks.map((nl) => {
          const isActive = nl.label.toLocaleLowerCase() === subViewValue;
          return (
            <PaveNavLinkRow
              key={nl.label}
              item={nl}
              isActive={isActive}
              isDesktop={isDesktop}
              onSelect={handleSelectNavLink}
            />
          );
        })}
      </div>

      <div className="group/paveCalendars">
        <Group justify="space-between" align="end" pl={isDesktop ? 5 : 12 + 5} mt={5}>
          <Title order={2} fz={{ base: 'lg', md: '.8rem' }} fw={500} c="dimmed">
            Calendars
          </Title>

          <Group
            justify="end"
            gap={isDesktop ? 0 : 5}
            className={
              isDesktop
                ? 'opacity-0 group-hover/paveCalendars:opacity-100 transition-opacity duration-200 pointer-events-none group-hover/paveCalendars:pointer-events-auto'
                : undefined
            }
            mih={isDesktop ? 30 : ICON_WRAPPER_SIZE * 1.25 + 6}
            pr={5}
          >
            <Tooltip label="Add calendar">
              <ActionIcon
                size={isDesktop ? 30 - 6 : ICON_WRAPPER_SIZE * 1.25}
                color="gray"
                variant={isDesktop ? 'subtle' : 'light'}
                onClick={handleCreateCalendar}
              >
                <IconPlus
                  size={isDesktop ? ICON_SIZE - 4 : ICON_SIZE * 1.25}
                  stroke={ICON_STROKE_WIDTH}
                />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Add calendar folder">
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
          <PartialEmpty loading={calendars === undefined} label="Nothing here." />
        ) : (
          <Box mih={220}>
            <Divider my={5} />

            {sortedRootFolders.map((fi) => (
              <div key={fi.id}>
                <AccordionFolder folderId={fi.id} location={APP_NAMES_ATLAS.PAVE} />
              </div>
            ))}

            {sortedRootCalendars.map((ci) => (
              <div key={ci.id}>
                <NavlinkCalendar props={ci} />
              </div>
            ))}
          </Box>
        )}
      </div>
    </div>
  );
});

export default Pave;
