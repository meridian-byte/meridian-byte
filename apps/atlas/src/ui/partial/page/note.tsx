'use client';

import React, { useMemo } from 'react';
import { useStoreNote, useSubView } from '@repo/store';
import { Button, Center, Group, Loader, Stack, Text, Title } from '@mantine/core';
import { ICON_SIZE, ICON_STROKE_WIDTH, SECTION_SPACING, SUBVIEW_NAMES } from '@repo/constants';
import { IconArrowLeft } from '@tabler/icons-react';
import NextLink from '@atlas/ui/anchor/next-link';
import { LayoutSection } from '@repo/ui';
import { useStoreActiveItems } from '@repo/store';
import { extractUuidFromParam, saveToLocalStorage, saveToSessionStorage } from '@repo/utils';
import { LOCAL_STORAGE_NAME } from '@repo/constants';
import { useStoreWorkspace } from '@repo/store';
import { WorkspaceGet } from '@repo/types';
import InputTextEditorTitle from '@atlas/ui/input/text/editor-title';
import EditorMain from '@atlas/ui/editor/main';

export default function Note() {
  const { subViewValue, showSubViewJot } = useSubView();
  const noteId = extractUuidFromParam(subViewValue || '');
  const workspaces = useStoreWorkspace((s) => s.workspaces);
  const activeWorkspace = useStoreActiveItems((s) => s.activeItems?.workspace);
  const setActiveItems = useStoreActiveItems((s) => s.setActiveItems);
  const notes = useStoreNote((s) => s.notes);
  const note = useStoreNote((s) => s.notes?.find((n) => n.id == noteId));

  // find default workspace
  const oldestWorkspace = useMemo(() => {
    if (!workspaces?.length) return null;
    return workspaces.reduce((oldest, current) =>
      new Date(current.createdAt) < new Date(oldest.createdAt) ? current : oldest,
    );
  }, [workspaces]);

  return notes === undefined || activeWorkspace === undefined ? (
    <Center py={SECTION_SPACING * 2} mih={'75vh'}>
      <Stack align="center" ta={'center'}>
        <Loader size={'sm'} />
      </Stack>
    </Center>
  ) : !note ? (
    <Center py={SECTION_SPACING * 2} mih={'75vh'}>
      <Stack align="center" ta={'center'} gap={'xl'}>
        <Stack align="center" gap={'xs'}>
          <Title order={3} fz={'md'} fw={500}>
            Note Not Found
          </Title>

          <div>
            <Text inherit c={'dimmed'} fz={'sm'}>
              The note has been moved or deleted.
            </Text>
          </div>
        </Stack>

        <Group>
          <Button size="xs" color="dark" onClick={() => showSubViewJot(SUBVIEW_NAMES.JOT.HOME)}>
            Back to Home
          </Button>
        </Group>
      </Stack>
    </Center>
  ) : (!note.workspaceId && activeWorkspace?.id != oldestWorkspace?.id) ||
    (!!note.workspaceId && activeWorkspace?.id != note.workspaceId) ? (
    <Center py={SECTION_SPACING * 2} mih={'75vh'}>
      <Stack align="center" ta={'center'} gap={'xl'}>
        <Stack align="center" gap={'xs'}>
          <Title order={3} fz={'md'} fw={500}>
            Note Not Accessible
          </Title>

          <div>
            <Text inherit c={'dimmed'} fz={'sm'}>
              The note is in another workspace.
            </Text>

            <Text inherit c={'dimmed'} fz={'sm'}>
              Switch to {activeWorkspace?.name} to access the note.
            </Text>
          </div>
        </Stack>

        <Group>
          <Button
            size="xs"
            color="dark"
            onClick={() => {
              const noteWorkspace = workspaces?.find((wi) => wi.id == note.workspaceId);

              let resolvedWorkspace: WorkspaceGet | null = null;

              if (!noteWorkspace) {
                resolvedWorkspace = oldestWorkspace || null;
              } else {
                resolvedWorkspace = noteWorkspace;
              }

              if (resolvedWorkspace) {
                // save new active workspace to local storage
                saveToLocalStorage(LOCAL_STORAGE_NAME.ACTIVE_WORKSPACE, resolvedWorkspace.id);
                // save new active workspace to session storage
                saveToSessionStorage(LOCAL_STORAGE_NAME.ACTIVE_WORKSPACE, resolvedWorkspace.id);
                // set new global active workspace state
                setActiveItems({ workspace: resolvedWorkspace });
              }
            }}
          >
            Swich to Workspace
          </Button>
        </Group>
      </Stack>
    </Center>
  ) : (
    <LayoutSection id={`note-details`} padded={SECTION_SPACING / 2} containerized={false}>
      <div>
        <InputTextEditorTitle item={note} />

        <EditorMain item={note} />
      </div>
    </LayoutSection>
  );
}
