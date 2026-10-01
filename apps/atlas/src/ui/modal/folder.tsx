'use client';

import { Divider, Modal, NavLink, ScrollArea, Text, ThemeIcon, Tooltip } from '@mantine/core';
import { APP_NAMES_ATLAS, ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import {
  useCalendarActions,
  useNoteActions,
  useStoreCalendar,
  useStoreFolder,
  useStoreNote,
  useStoreTaskList,
  useTaskListActions,
  useViewModal,
} from '@repo/store';
import { CalendarGet, FolderGet, NoteGet, TaskListGet } from '@repo/types';
import { LayoutModal } from '@repo/ui';
import { extractUuidFromParam } from '@repo/utils';
import { IconFolder } from '@tabler/icons-react';
import React from 'react';

export default function Folder({ children }: { children: React.ReactNode }) {
  const { modalViewValue, closeModalView } = useViewModal();

  return (
    <>
      <Modal
        opened={(modalViewValue || '').includes('-move')}
        onClose={() => {
          closeModalView();
        }}
        centered
        size={'md'}
        padding={0}
      >
        <LayoutModal props={{ close: closeModalView, title: 'Move Item' }}>
          <PartialFolder />
        </LayoutModal>
      </Modal>

      <span>{children}</span>
    </>
  );
}

function PartialFolder() {
  const { modalViewValue } = useViewModal();
  const folders = useStoreFolder((s) => s.folders);
  const folderLocation = (modalViewValue || '').match(/move-(.*?)-[0-9a-f]{8}-/)?.[1];

  const itemId = extractUuidFromParam(modalViewValue || '');

  const calendars = useStoreCalendar((s) => s.calendars);
  const { calendarUpdate } = useCalendarActions();
  const notes = useStoreNote((s) => s.notes);
  const { noteUpdate } = useNoteActions();
  const taskLists = useStoreTaskList((s) => s.taskLists);
  const { taskListUpdate } = useTaskListActions();

  let locationProps: { itemToMove: any | null; onClick: (i: any) => void } = {
    itemToMove: null,
    onClick: () => {},
  };

  switch (folderLocation) {
    case APP_NAMES_ATLAS.PAVE:
      locationProps = {
        itemToMove: (calendars || []).find((ci) => ci.id == itemId),
        onClick: (ci: CalendarGet) => calendarUpdate(ci),
      };
      break;
    case APP_NAMES_ATLAS.JOT:
      locationProps = {
        itemToMove: (notes || []).find((ni) => ni.id == itemId),
        onClick: (ni: NoteGet) => noteUpdate(ni),
      };
      break;
    case APP_NAMES_ATLAS.STRIDE:
      locationProps = {
        itemToMove: (taskLists || []).find((tli) => tli.id == itemId),
        onClick: (tli: TaskListGet) => taskListUpdate(tli),
      };
      break;

    default:
      break;
  }

  const locationFolders = folders?.filter((fi) => {
    const matchesLocation = fi.location == folderLocation;
    if (!locationProps.itemToMove?.folderId) return matchesLocation;

    // filter out the folder the item is already in
    const inFolder = fi.id == locationProps.itemToMove.folderId;
    return matchesLocation && !inFolder;
  });

  return (
    <ScrollArea h={300}>
      {!!locationProps.itemToMove?.folderId && (
        <NavLinkFolderSelect item={locationProps.itemToMove} onClick={locationProps.onClick} />
      )}

      {locationFolders?.map((fi, i) => (
        <div key={fi.id}>
          {i > 0 && <Divider />}
          <NavLinkFolderSelect
            props={fi}
            item={locationProps.itemToMove}
            onClick={locationProps.onClick}
          />
        </div>
      ))}
    </ScrollArea>
  );
}

function NavLinkFolderSelect({
  props,
  item,
  onClick,
}: {
  props?: FolderGet;
  item: any;
  onClick: (i: any) => void;
}) {
  const { closeModalView } = useViewModal();

  return (
    <NavLink
      label={
        <Tooltip
          label={props?.name || 'Root'}
          multiline
          maw={320}
          position="top-start"
          arrowOffset={16}
        >
          <Text component="span" inherit lineClamp={1} lh={2}>
            {props?.name || 'Root'}
          </Text>
        </Tooltip>
      }
      color="gray"
      px={5}
      py={3}
      fw={500}
      leftSection={
        <ThemeIcon size={ICON_WRAPPER_SIZE} variant="transparent">
          <IconFolder size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
        </ThemeIcon>
      }
      // styles={{
      //   label: {
      //     fontSize: 'var(--mantine-font-size-xs)',
      //     color: !calendarActive ? undefined : 'var(--mantine-color-pri-6)',
      //   },
      // }}
      onClick={() => {
        onClick({ ...item, folderId: props?.id || null });
        closeModalView();
      }}
    />
  );
}
