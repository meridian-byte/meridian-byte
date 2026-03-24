'use client';

import { useNoteActions } from '@repo/hooks/actions/note';
import { useStoreNote } from '@repo/libraries/zustand/stores/note';
import React, {
  memo,
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import MenuNoteSide from '@repo/components/common/menus/note/side';
import {
  ActionIcon,
  Box,
  Grid,
  GridCol,
  Group,
  NavLink,
  Text,
  ThemeIcon,
  Tooltip,
} from '@mantine/core';
import Link from 'next/link';
import { extractUuidFromParam, linkify } from '@repo/utilities/url';
import { useStoreAppShell } from '@repo/libraries/zustand/stores/shell';
import { useMediaQuery } from '@mantine/hooks';
import { NoteGet } from '@repo/types/models/note';
import classes from './note.module.scss';
import {
  IconChevronDown,
  IconChevronRight,
  IconDots,
  IconDotsVertical,
  IconFile,
  IconPlus,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from '@repo/hooks/utility';

export const Note = memo(NoteComponent, (prev, next) => {
  return (
    prev.noteId === next.noteId &&
    prev.notesMap === next.notesMap &&
    prev.childrenMap === next.childrenMap
  );
});

function NoteComponent({
  noteId,
  notesMap,
  childrenMap,
}: {
  noteId?: string;
  notesMap: Map<string, NoteGet>;
  childrenMap: Map<string, NoteGet[]>;
}) {
  const navbarChild = useStoreAppShell((s) => s.appshell?.child?.navbar);
  const toggleNavbarChild = useStoreAppShell((s) => s.toggleNavbarChild);
  const desktop = useMediaQuery('(min-width: 62em)');

  // 2. Instead of .find(), use the Map (O(1) speed)
  const note = notesMap.get(noteId || '');

  const childNotes = useMemo(() => {
    return childrenMap.get(noteId || '') || [];
  }, [childrenMap, noteId]);

  const pathname = usePathname();
  const router = useRouter();

  const parentLink = useMemo(() => {
    return `/app/n/${linkify(note?.title || '')}-${note?.id}`;
  }, [note?.title, note?.id]);

  function handleNavigate() {
    router.push(parentLink);

    if (!desktop && navbarChild) {
      toggleNavbarChild();
    }
  }

  const activeId = extractUuidFromParam(pathname);
  const active = note?.id === activeId;

  const shouldBeOpen = useMemo(() => {
    if (!note?.id || !activeId) return false;
    return isAncestor(note.id, activeId, notesMap);
  }, [note?.id, activeId, notesMap]);

  const [opened, setOpened] = useState(shouldBeOpen);

  // Debounced toggle to prevent rapid clicking
  const { debouncedCallback: debouncedToggle } = useDebouncedCallback(
    () => {
      startTransition(() => {
        setOpened((o) => !o);
      });
    },
    100 // 100ms debounce
  );

  const prevChildCountRef = useRef(childNotes.length);

  const childCount = childNotes.length;

  useEffect(() => {
    const prevCount = prevChildCountRef.current;
    const currCount = childNotes.length;

    if (currCount > prevCount) {
      // New children added → auto-expand
      setOpened(true);
    } else if (currCount === 0 && prevCount > 0) {
      // All children removed → auto-collapse
      setOpened(false);
    }

    prevChildCountRef.current = currCount;
  }, [childCount]);

  useEffect(() => {
    if (shouldBeOpen) setOpened(true);
  }, [shouldBeOpen]);

  const isRoot = !note?.parent_note_id;

  return (
    <NavLink
      component={Link}
      href={parentLink}
      onClick={(e) => e.preventDefault()}
      opened={childNotes.length ? opened : undefined}
      active={!note ? false : active}
      childrenOffset={16}
      mt={1.5}
      classNames={classes}
      label={
        <NoteLabel
          item={note}
          link={parentLink}
          hasChildren={!!childNotes.length}
          opened={opened}
          toggle={debouncedToggle}
          onNavigate={handleNavigate}
        />
      }
      styles={
        isRoot
          ? undefined
          : {
              root: {
                borderLeft:
                  '1px solid light-dark(var(--mantine-color-gray-4), var(--mantine-color-dark-4))',
              },
            }
      }
    >
      {opened &&
        childNotes.map((cni) => (
          <NoteComponent
            key={cni.id}
            noteId={cni.id}
            notesMap={notesMap}
            childrenMap={childrenMap}
          />
        ))}
    </NavLink>
  );
}

function NoteActions({ noteId }: { noteId?: string }) {
  const { noteCreate } = useNoteActions();

  return (
    <Group justify="end" gap={0}>
      <MenuNoteSide props={{ noteId }}>
        <Tooltip label="Note actions">
          <Group>
            <ActionIcon
              size={ICON_SIZE}
              radius="sm"
              color="dark"
              variant="subtle"
            >
              <IconDots size={ICON_SIZE - 4} />
            </ActionIcon>
          </Group>
        </Tooltip>
      </MenuNoteSide>

      <Tooltip label="Create note inside">
        <Group>
          <ActionIcon
            size={ICON_SIZE}
            radius="sm"
            color="dark"
            variant="subtle"
            onClick={() => noteCreate({ parent_note_id: noteId })}
          >
            <IconPlus size={ICON_SIZE - 4} />
          </ActionIcon>
        </Group>
      </Tooltip>
    </Group>
  );
}

function NoteLabel({
  item,
  link,
  hasChildren,
  opened,
  toggle,
  onNavigate,
}: {
  item: NoteGet | undefined;
  link: string;
  hasChildren: boolean;
  opened?: boolean;
  toggle?: () => void;
  onNavigate: () => void;
}) {
  const ChevronIcon = opened ? IconChevronDown : IconChevronRight;

  return (
    <Grid
      gutter={0}
      align="center"
      className={hasChildren ? classes.box : classes.boxChild}
    >
      <GridCol span={1}>
        <Group>
          {hasChildren ? (
            <>
              <ActionIcon
                size={ICON_SIZE}
                radius="sm"
                color="dark"
                variant="subtle"
                className={classes.theme}
              >
                <IconFile size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>

              <ActionIcon
                size={ICON_SIZE}
                radius="sm"
                color="dark"
                variant="subtle"
                onClick={toggle}
                className={classes.action}
              >
                <ChevronIcon size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            </>
          ) : (
            <ThemeIcon
              size={ICON_SIZE}
              radius="sm"
              color="dark"
              variant="transparent"
            >
              <IconFile size={ICON_SIZE - 4} />
            </ThemeIcon>
          )}
        </Group>
      </GridCol>

      <GridCol span={8} onClick={onNavigate}>
        <Text component="span" inherit lineClamp={1}>
          {item?.title}
        </Text>
      </GridCol>

      <GridCol
        span={3}
        className={hasChildren ? classes.menu : classes.menuChild}
      >
        <NoteActions noteId={item?.id} />
      </GridCol>
    </Grid>
  );
}

function isAncestor(
  noteId: string,
  activeId: string,
  notesMap: Map<string, NoteGet>
): boolean {
  let current = notesMap.get(activeId);
  while (current?.parent_note_id) {
    if (current.parent_note_id === noteId) return true;
    current = notesMap.get(current.parent_note_id); // O(1) lookup
  }
  return false;
}
