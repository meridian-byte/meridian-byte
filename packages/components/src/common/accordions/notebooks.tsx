'use client';

import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Center,
  NavLink,
  Stack,
} from '@mantine/core';
import { IconFolder } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { useNoteActions } from '@repo/hooks/actions/note';
import { useNotebookActions } from '@repo/hooks/actions/notebook';
import { NoteGet } from '@repo/types/models/note';
import { NotebookGet } from '@repo/types/models/notebook';
import MenuNotebookSide from '../menus/notebook/side';
import { useStoreNote } from '@repo/libraries/zustand/stores/note';
import { useStoreNotebook } from '@repo/libraries/zustand/stores/notebook';
import { getUrlParam } from '@repo/utilities/url';

export default function Notebooks({
  props,
}: {
  props: {
    editing: boolean;
    inputComponent: (input: NotebookGet) => React.ReactNode;
    noteComponent: (input: NoteGet) => React.ReactNode;
  };
}) {
  const searchParams = useSearchParams();
  const notes = useStoreNote((s) => s.notes);
  const notebooks = useStoreNotebook((s) => s.notebooks);
  const { noteCreate } = useNoteActions();
  const { notebookCopy, notebookDelete, startNotebookRename } =
    useNotebookActions();

  const [value, setValue] = useState<string[]>([]);
  const [paramNoteId, setParamNoteId] = useState('');

  useEffect(() => {
    if (!notebooks || !notes) return;

    const paramNoteId = getUrlParam('noteId');
    if (!paramNoteId) return;

    setParamNoteId(paramNoteId as string);

    const currentNoteNotebook = notebooks.find(
      (c) => c.id == notes.find((n) => n.id == paramNoteId)?.notebook_id
    )?.id;

    if (!currentNoteNotebook) return;
    if (value.includes(currentNoteNotebook)) return;

    setValue((prev) =>
      prev.includes(currentNoteNotebook) ? prev : [...prev, currentNoteNotebook]
    );
  }, [notebooks, notes, searchParams]);

  const notesByNotebook = useMemo(() => {
    const map = new Map<string, NoteGet[]>();

    for (const note of notes ?? []) {
      if (note.notebook_id) {
        if (!map.has(note.notebook_id)) {
          map.set(note.notebook_id, []);
        }
        map.get(note.notebook_id)!.push(note);
      }
    }

    return map;
  }, [notes]);

  return (
    <Accordion
      multiple
      transitionDuration={0.25}
      styles={{
        content: { padding: 0 },
        item: { padding: 0, borderWidth: 0 },
        control: {
          padding: 0,
          paddingRight: 10,
          borderRadius: 'var(--mantine-radius-md)',
        },
        label: { padding: 0 },
        panel: { paddingLeft: 20, paddingTop: 5 },
      }}
      value={value}
      onChange={setValue}
    >
      {notebooks?.map((c, i) => {
        const notebookNotes = notesByNotebook.get(c.id) ?? [];
        const active = !paramNoteId
          ? false
          : notebookNotes?.map((nn) => nn.id).includes(paramNoteId as string);

        return (
          <div key={c.id}>
            <AccordionItem value={c.id} mt={i > 0 ? 5 : undefined}>
              <AccordionControl>
                <MenuNotebookSide
                  item={c}
                  menuProps={{
                    createNote: () => {
                      const newNote = noteCreate({ notebook_id: c.id });

                      const opened = value.find((v) => v == c.id);

                      if (newNote?.id && !opened) {
                        setValue([...value, c.id]);
                      }
                    },
                    deleteNotebook: notebookDelete,
                    copyNotebook: () => {
                      const newNotebook = notebookCopy({ values: c });

                      if (newNotebook?.id) {
                        setValue([...value, newNotebook.id]);
                      }
                    },
                    startRename: () => startNotebookRename(c.id),
                  }}
                >
                  <NavLink
                    label={props.inputComponent(c)}
                    onClick={(e) => {
                      if (props.editing) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                    leftSection={
                      <Center c={active ? 'pri.5' : undefined}>
                        <IconFolder
                          size={ICON_SIZE}
                          stroke={ICON_STROKE_WIDTH}
                        />
                      </Center>
                    }
                    styles={{
                      root: {
                        borderRadius: 'var(--mantine-radius-md)',
                        padding:
                          'calc(var(--mantine-spacing-xs) / 4) var(--mantine-spacing-xs)',
                      },
                      label: {
                        fontSize: 'var(--mantine-font-size-sm)',
                        fontWeight: active ? 500 : 'normal',
                      },
                    }}
                  />
                </MenuNotebookSide>
              </AccordionControl>

              <AccordionPanel>
                <Stack
                  gap={5}
                  pl={'xs'}
                  style={{
                    borderLeft: '1px solid var(--mantine-color-default-border)',
                  }}
                >
                  {notebookNotes?.map((n) => (
                    <div key={n.id}>{props.noteComponent(n)}</div>
                  ))}
                </Stack>
              </AccordionPanel>
            </AccordionItem>
          </div>
        );
      })}
    </Accordion>
  );
}
