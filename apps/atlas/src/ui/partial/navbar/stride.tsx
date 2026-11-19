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
  IconCircleFilled,
  IconDots,
  IconFolderPlus,
  IconInbox,
  IconListCheck,
  IconPlus,
  IconTextPlus,
} from '@tabler/icons-react';
import {
  useFolderActions,
  useStoreAppShell,
  useStoreFolder,
  useSubView,
  useTaskListActions,
  useViewAside,
} from '@repo/store';
import React, { memo, useCallback, useMemo } from 'react';
import LayoutPartialNavbar from '@atlas/ui/layout/partial/navbar';
import { useStoreTaskList } from '@repo/store';
import MenuTaskList from '@atlas/ui/menu/task-list';
import PartialEmpty from '../empty';
import NavlinkTaskList from '@atlas/ui/navlink/task-list';
import { Order } from '@repo/types';
import AccordionFolder from '@atlas/ui/accordion/folder';

import { useBreakpointFlags } from '@repo/hooks';

const EMPTY_ARRAY: any[] = [];

interface StrideNavLinkItem {
  icon: React.ComponentType<any>;
  label: string;
  subViewKey: string;
}

const StrideNavLinkRow = memo(function StrideNavLinkRow({
  item,
  isActive,
  isDesktop,
  onSelect,
}: {
  item: StrideNavLinkItem;
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
          <IconComponent size={isDesktop ? ICON_SIZE - 4 : ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
        </ThemeIcon>
      }
    />
  );
});

const Stride = memo(function Stride() {
  const { ready, isDesktop } = useBreakpointFlags();

  const toggleNavbarChild = useStoreAppShell((s) => s.toggleNavbarChild);

  const { subViewValue, showSubViewStride } = useSubView();

  const folders = useStoreFolder((s) => s.folders);
  const { folderCreate } = useFolderActions();

  const taskLists = useStoreTaskList((s) => s.taskLists);
  const { taskListCreate } = useTaskListActions();

  const navLinks = useMemo<StrideNavLinkItem[]>(
    () => [
      {
        icon: IconInbox,
        label: capitalizeWords(SUBVIEW_NAMES.STRIDE.INBOX),
        subViewKey: SUBVIEW_NAMES.STRIDE.INBOX,
      },
      {
        icon: IconListCheck,
        label: capitalizeWords(SUBVIEW_NAMES.STRIDE.ALL),
        subViewKey: SUBVIEW_NAMES.STRIDE.ALL,
      },
      {
        icon: IconCalendarDown,
        label: capitalizeWords(SUBVIEW_NAMES.STRIDE.TODAY),
        subViewKey: SUBVIEW_NAMES.STRIDE.TODAY,
      },
      {
        icon: IconCalendarShare,
        label: capitalizeWords(SUBVIEW_NAMES.STRIDE.UPCOMING),
        subViewKey: SUBVIEW_NAMES.STRIDE.UPCOMING,
      },
      {
        icon: IconCalendarCancel,
        label: capitalizeWords(SUBVIEW_NAMES.STRIDE.OVERDUE),
        subViewKey: SUBVIEW_NAMES.STRIDE.OVERDUE,
      },
      {
        icon: IconCircleCheck,
        label: capitalizeWords(SUBVIEW_NAMES.STRIDE.COMPLETE),
        subViewKey: SUBVIEW_NAMES.STRIDE.COMPLETE,
      },
    ],
    [],
  );

  const sortedRootFolders = useMemo(() => {
    if (!folders) return EMPTY_ARRAY;
    const rootStrideFolders = folders.filter(
      (fi) => fi.location === APP_NAMES_ATLAS.STRIDE && !fi.folderId,
    );
    return sortArray(rootStrideFolders, (i) => i.createdAt, Order.DESCENDING);
  }, [folders]);

  const sortedRootTaskLists = useMemo(() => {
    if (!taskLists) return EMPTY_ARRAY;
    const ungroupedTaskLists = taskLists.filter((tli) => !tli.folderId);
    return sortArray(ungroupedTaskLists, (i) => i.createdAt, Order.DESCENDING);
  }, [taskLists]);

  const handleSelectNavLink = useCallback(
    (subViewKey: string) => {
      if (!isDesktop && useStoreAppShell.getState().appshell?.child?.navbar) {
        toggleNavbarChild();
      }
      showSubViewStride(subViewKey);
    },
    [isDesktop, toggleNavbarChild, showSubViewStride],
  );

  const handleCreateTaskList = useCallback(() => {
    taskListCreate();
  }, [taskListCreate]);

  const handleCreateFolder = useCallback(() => {
    folderCreate({ id: generateUUID(), location: APP_NAMES_ATLAS.STRIDE });
  }, [folderCreate]);

  if (!ready) {
    return null;
  }

  const isLoading = folders === undefined || taskLists === undefined;
  const isEmpty = !isLoading && sortedRootFolders.length === 0 && sortedRootTaskLists.length === 0;

  return (
    <div>
      <div>
        {navLinks.map((nl) => {
          const isActive = nl.label.toLocaleLowerCase() === subViewValue;
          return (
            <StrideNavLinkRow
              key={nl.label}
              item={nl}
              isActive={isActive}
              isDesktop={isDesktop}
              onSelect={handleSelectNavLink}
            />
          );
        })}
      </div>

      <div className="group/strideLists">
        <Group justify="space-between" align="end" pl={isDesktop ? 5 : 12 + 5} mt={5}>
          <Title order={2} fz={{ base: 'lg', md: '.8rem' }} fw={500} c="dimmed">
            Task Lists
          </Title>

          <Group
            justify="end"
            gap={isDesktop ? 0 : 5}
            className={
              isDesktop
                ? 'opacity-0 group-hover/strideLists:opacity-100 transition-opacity duration-200 pointer-events-none group-hover/strideLists:pointer-events-auto'
                : undefined
            }
            mih={isDesktop ? 30 : ICON_WRAPPER_SIZE * 1.25 + 6}
            pr={5}
          >
            <Tooltip label="Add task list">
              <ActionIcon
                size={isDesktop ? 30 - 6 : ICON_WRAPPER_SIZE * 1.25}
                color="gray"
                variant={isDesktop ? 'subtle' : 'light'}
                onClick={handleCreateTaskList}
              >
                <IconPlus
                  size={isDesktop ? ICON_SIZE - 4 : ICON_SIZE * 1.25}
                  stroke={ICON_STROKE_WIDTH}
                />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Add task list folder">
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
          <PartialEmpty loading={taskLists === undefined} label="Nothing here." />
        ) : (
          <Box mih={220}>
            <Divider my={5} />

            {sortedRootFolders.map((fi) => (
              <div key={fi.id}>
                <AccordionFolder folderId={fi.id} location={APP_NAMES_ATLAS.STRIDE} />
              </div>
            ))}

            {sortedRootTaskLists.map((tli) => (
              <div key={tli.id}>
                <NavlinkTaskList props={tli} />
              </div>
            ))}
          </Box>
        )}
      </div>
    </div>
  );
});

export default Stride;
