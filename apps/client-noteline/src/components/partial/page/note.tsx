'use client';

import React, { useMemo } from 'react';
import { useStoreNote } from '@repo/libraries/zustand/stores/note';
import {
  Button,
  Center,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  SECTION_SPACING,
} from '@repo/constants/sizes';
import { IconArrowLeft } from '@tabler/icons-react';
import NextLink from '@repo/components/common/anchor/next-link';
import LayoutSection from '@repo/components/layout/section';
import InputTextEditorTitle from '@repo/components/common/inputs/text/editor/title';
import EditorMain from '@repo/components/common/editors/main';
import { useStoreActiveItems } from '@repo/libraries/zustand/stores/active-items';
import {
  saveToLocalStorage,
  saveToSessionStorage,
} from '@repo/utilities/storage';
import { LOCAL_STORAGE_NAME } from '@repo/constants/names';
import { useStoreWorkspace } from '@repo/libraries/zustand/stores/workspace';
import { WorkspaceGet } from '@repo/types/models/workspace';

export default function Note({ props }: { props: { noteId?: string | null } }) {
  const workspaces = useStoreWorkspace((s) => s.workspaces);
  const activeWorkspace = useStoreActiveItems((s) => s.activeItems?.workspace);
  const setActiveItems = useStoreActiveItems((s) => s.setActiveItems);
  const notes = useStoreNote((s) => s.notes);
  const note = useStoreNote((s) => s.notes?.find((n) => n.id == props.noteId));

  // find default workspace
  const oldestWorkspace = useMemo(() => {
    if (!workspaces?.length) return null;
    return workspaces.reduce((oldest, current) =>
      new Date(current.created_at) < new Date(oldest.created_at)
        ? current
        : oldest
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
          <NextLink href="/">
            <Button size="xs" color="dark">
              Back to Home
            </Button>
          </NextLink>
        </Group>
      </Stack>
    </Center>
  ) : (!note.workspace_id && activeWorkspace?.id != oldestWorkspace?.id) ||
    (!!note.workspace_id && activeWorkspace?.id != note.workspace_id) ? (
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
              Switch to {activeWorkspace?.title} to access the note.
            </Text>
          </div>
        </Stack>

        <Group>
          <Button
            size="xs"
            color="dark"
            onClick={() => {
              const noteWorkspace = workspaces?.find(
                (wi) => wi.id == note.workspace_id
              );

              let resolvedWorkspace: WorkspaceGet | null = null;

              if (!noteWorkspace) {
                resolvedWorkspace = oldestWorkspace || null;
              } else {
                resolvedWorkspace = noteWorkspace;
              }

              if (resolvedWorkspace) {
                // save new active workspace to local storage
                saveToLocalStorage(
                  LOCAL_STORAGE_NAME.ACTIVE_WORKSPACE,
                  resolvedWorkspace.id
                );
                // save new active workspace to session storage
                saveToSessionStorage(
                  LOCAL_STORAGE_NAME.ACTIVE_WORKSPACE,
                  resolvedWorkspace.id
                );
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
    <LayoutSection
      id={`note-details`}
      padded={SECTION_SPACING / 2}
      containerized={false}
    >
      <div>
        <InputTextEditorTitle item={note} />

        <EditorMain item={note} />
      </div>
    </LayoutSection>
  );
}
