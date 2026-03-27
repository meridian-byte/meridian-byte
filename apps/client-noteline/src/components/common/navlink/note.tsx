'use client';

import { useNoteActions } from '@repo/hooks/actions/note';
import { useStoreNote } from '@repo/libraries/zustand/stores/note';
import React, { useMemo, useState } from 'react';
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
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';

export default function Note({ props }: { props: { noteId?: string } }) {
  const appshell = useStoreAppShell((s) => s.appshell);
  const setAppShell = useStoreAppShell((s) => s.setAppShell);
  const desktop = useMediaQuery('(min-width: 62em)');
  const notes = useStoreNote((s) => s.notes);

  const note = notes?.find((n) => n.id === props.noteId);
  const childNotes = sortArray(
    (notes || []).filter((ni) => ni.parent_note_id == props.noteId),
    (i) => i.created_at,
    Order.DESCENDING
  );

  const pathname = usePathname();
  const router = useRouter();

  const parentLink = `/app/n/${linkify(note?.title || '')}-${note?.id}`;

  function handleNavigate() {
    router.push(parentLink);

    if (!desktop && appshell) {
      setAppShell({
        ...appshell,
        child: { ...appshell.child, navbar: false },
      });
    }
  }

  const activeId = extractUuidFromParam(pathname);

  const shouldBeOpen =
    !!note?.id && !!activeId && isAncestor(note.id, activeId, notes || []);

  const [opened, setOpened] = useState(shouldBeOpen);

  return (
    <MenuNoteSide props={{ noteId: note?.id, options: { context: true } }}>
      <NavLink
        component={Link}
        href={parentLink}
        onClick={(e) => e.preventDefault()}
        opened={childNotes.length ? opened : undefined}
        active={!note ? false : pathname.includes(note.id)}
        childrenOffset={8}
        mt={2}
        classNames={classes}
        label={
          <NoteLabel
            item={note}
            link={parentLink}
            hasChildren={!!childNotes.length}
            opened={opened}
            toggle={() => setOpened((o) => !o)}
            onNavigate={handleNavigate}
          />
        }
      >
        {childNotes.map((cni) => (
          <Note key={cni.id} props={{ noteId: cni.id }} />
        ))}
      </NavLink>
    </MenuNoteSide>
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

      <GridCol span={9} onClick={onNavigate}>
        <Text component="span" inherit lineClamp={1}>
          {item?.title}
        </Text>
      </GridCol>

      <GridCol
        span={2}
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
  notes: NoteGet[]
): boolean {
  let current = notes.find((n) => n.id === activeId);

  while (current?.parent_note_id) {
    if (current.parent_note_id === noteId) return true;
    current = notes.find((n) => n.id === current?.parent_note_id);
  }

  return false;
}
