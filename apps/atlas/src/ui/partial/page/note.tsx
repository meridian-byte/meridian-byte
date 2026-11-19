'use client';

import React, { memo, useCallback, useMemo } from 'react';
import { useStoreNote, useStoreView, useSubView } from '@repo/store';
import { Button, Center, Group, Loader, Stack, Text, Title } from '@mantine/core';
import { ICON_SIZE, ICON_STROKE_WIDTH, SECTION_SPACING, SUBVIEW_NAMES } from '@repo/constants';
import { IconArrowLeft } from '@tabler/icons-react';
import NextLink from '@atlas/ui/anchor/next-link';
import { LayoutSection } from '@repo/ui';
import { useStoreActiveItems } from '@repo/store';
import { extractUuidFromParam, saveToLocalStorage, saveToSessionStorage } from '@repo/utils';
import { STORAGE_NAME } from '@repo/constants';
import { useStoreWorkspace } from '@repo/store';
import { WorkspaceGet } from '@repo/types';
import TabsNote from '@atlas/ui/tabs/note';

const MemoTabsNote = memo(TabsNote);

const Note = memo(function Note() {
  const subViewValue = useStoreView((s) => s.view?.subView);
  const { showSubViewJot } = useSubView();

  const noteId = useMemo(
    () => (subViewValue ? extractUuidFromParam(subViewValue) : ''),
    [subViewValue],
  );

  const workspaces = useStoreWorkspace((s) => s.workspaces);
  const activeWorkspace = useStoreActiveItems((s) => s.activeItems?.workspace);
  const setActiveItems = useStoreActiveItems((s) => s.setActiveItems);

  const isNotesLoaded = useStoreNote((s) => s.notes !== undefined);
  const note = useStoreNote((s) => s.notes?.find((n) => n.id === noteId));

  // Find default (oldest) workspace
  const oldestWorkspace = useMemo(() => {
    if (!workspaces?.length) return null;
    return workspaces.reduce((oldest, current) =>
      new Date(current.createdAt) < new Date(oldest.createdAt) ? current : oldest,
    );
  }, [workspaces]);

  const targetWorkspace = useMemo(() => {
    if (!note) return null;
    return workspaces?.find((wi) => wi.id === note.workspaceId) ?? oldestWorkspace ?? null;
  }, [note, workspaces, oldestWorkspace]);

  const handleBackHome = useCallback(() => {
    showSubViewJot(SUBVIEW_NAMES.JOT.HOME);
  }, [showSubViewJot]);

  const handleSwitchWorkspace = useCallback(() => {
    if (!targetWorkspace) return;
    saveToSessionStorage(STORAGE_NAME.ACTIVE.WORKSPACE, targetWorkspace.id);
    setActiveItems({ workspace: targetWorkspace });
  }, [targetWorkspace, setActiveItems]);

  if (!isNotesLoaded || activeWorkspace === undefined) {
    return (
      <Center py={SECTION_SPACING * 2} mih="75vh">
        <Stack align="center" ta="center">
          <Loader size="sm" />
        </Stack>
      </Center>
    );
  }

  if (!note) {
    return (
      <Center py={SECTION_SPACING * 2} mih="75vh">
        <Stack align="center" ta="center" gap="xl">
          <Stack align="center" gap="xs">
            <Title order={3} fz="md" fw={500}>
              Note Not Found
            </Title>

            <div>
              <Text inherit c="dimmed" fz="sm">
                The note has been moved or deleted.
              </Text>
            </div>
          </Stack>

          <Group>
            <Button size="xs" color="dark" onClick={handleBackHome}>
              Back to Home
            </Button>
          </Group>
        </Stack>
      </Center>
    );
  }

  const isWrongWorkspace =
    (!note.workspaceId && activeWorkspace?.id !== oldestWorkspace?.id) ||
    (!!note.workspaceId && activeWorkspace?.id !== note.workspaceId);

  if (isWrongWorkspace) {
    return (
      <Center py={SECTION_SPACING * 2} mih="75vh">
        <Stack align="center" ta="center" gap="xl">
          <Stack align="center" gap="xs">
            <Title order={3} fz="md" fw={500}>
              Note Not Accessible
            </Title>

            <div>
              <Text inherit c="dimmed" fz="sm">
                The note is in another workspace.
              </Text>

              {targetWorkspace && (
                <Text inherit c="dimmed" fz="sm">
                  Switch to {targetWorkspace.name} to access the note.
                </Text>
              )}
            </div>
          </Stack>

          <Group>
            <Button size="xs" color="dark" onClick={handleSwitchWorkspace}>
              Switch to Workspace
            </Button>
          </Group>
        </Stack>
      </Center>
    );
  }

  return (
    <LayoutSection id="note-details" containerized={false}>
      <MemoTabsNote />
    </LayoutSection>
  );
});

export default Note;
