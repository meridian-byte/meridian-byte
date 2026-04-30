'use client';

import React, { useMemo, useState } from 'react';
import {
  Popover,
  Text,
  PopoverTarget,
  PopoverDropdown,
  Button,
  Group,
  Skeleton,
  ThemeIcon,
  Stack,
  Box,
  Divider,
  NavLink,
  Avatar,
  Center,
  Title,
  ScrollArea,
  ScrollAreaAutosize,
  Tooltip,
  NumberFormatter,
} from '@mantine/core';
import { useStoreActiveItems } from '@repo/libraries/zustand/stores/active-items';
import {
  IconCategory,
  IconCheck,
  IconChevronDown,
  IconCircleFilled,
  IconPlus,
  IconSettings,
  IconUserPlus,
} from '@tabler/icons-react';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { useStoreNote } from '@repo/libraries/zustand/stores/note';
import { useStoreWorkspace } from '@repo/libraries/zustand/stores/workspace';
import ModalWorkspaceCrud from '../modals/workspace/crud';
import { WorkspaceType } from '@repo/types/models/enums';
import { saveToSessionStorage } from '@repo/utilities/storage';
import { LOCAL_STORAGE_NAME } from '@repo/constants/names';
import { usePathname, useRouter } from 'next/navigation';
import { extractUuidFromParam } from '@repo/utilities/url';

export default function Workspace({
  children,
  props,
}: {
  children?: React.ReactNode;
  props: { workspaceType: WorkspaceType };
}) {
  const [opened, setOpened] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const workspaces = useStoreWorkspace((s) => s.workspaces);
  const activeItems = useStoreActiveItems((s) => s.activeItems);
  const setActiveItems = useStoreActiveItems((s) => s.setActiveItems);
  const activeWorkspace = useStoreActiveItems((s) => s.activeItems?.workspace);
  const notes = useStoreNote((s) => s.notes);

  // find default workspace
  const oldestWorkspace = useMemo(() => {
    if (!workspaces?.length) return null;
    return workspaces.reduce((oldest, current) =>
      new Date(current.created_at) < new Date(oldest.created_at)
        ? current
        : oldest
    );
  }, [workspaces]);

  let workspaceNotes = [];

  if (activeWorkspace?.id === oldestWorkspace?.id) {
    workspaceNotes = (notes || []).filter((ni) => {
      return !ni.workspace_id || ni.workspace_id === oldestWorkspace?.id;
    });
  } else {
    workspaceNotes = (notes || []).filter((ni) => {
      return ni.workspace_id === activeWorkspace?.id;
    });
  }

  const defaultChild = (
    <Button
      rightSection={
        <IconChevronDown size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
      }
      fullWidth
      size="compact-md"
      justify="space-between"
      variant="subtle"
      color="dark"
      pl={0}
      pt={0}
      pb={0}
    >
      <Group gap={'xs'} wrap="nowrap">
        <Avatar size={ICON_WRAPPER_SIZE} color="dark">
          {activeWorkspace?.title[0]}
        </Avatar>

        <Text
          component="span"
          inherit
          fz={'sm'}
          fw={500}
          lineClamp={1}
          maw={200}
        >
          {activeWorkspace?.title}
        </Text>
      </Group>
    </Button>
  );

  // 2. Pre-calculate note counts for EVERY workspace in one pass
  const workspaceNoteCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    (notes || []).forEach((note) => {
      // If it has no ID, attribute it to the default workspace
      const targetId = note.workspace_id || oldestWorkspace?.id;
      if (targetId) {
        counts[targetId] = (counts[targetId] || 0) + 1;
      }
    });

    return counts;
  }, [notes, oldestWorkspace?.id]);

  return (
    <Popover
      width={320}
      position="bottom-start"
      shadow="md"
      styles={{ dropdown: { padding: 0 } }}
      keepMounted
      opened={opened}
      onChange={setOpened}
    >
      <PopoverTarget>
        <div onClick={() => setOpened(!opened)}>
          {children ||
            (activeItems === undefined ? <Skeleton h={30} /> : defaultChild)}
        </div>
      </PopoverTarget>

      <PopoverDropdown>
        <Stack
          p={'xs'}
          gap={'xs'}
          bg={
            'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-7))'
          }
        >
          <Group gap={'xs'} wrap="nowrap">
            <Avatar size={ICON_WRAPPER_SIZE * 1.3} color="dark">
              {activeWorkspace?.title[0]}
            </Avatar>

            <Stack gap={0} fz={'sm'}>
              <Text inherit lineClamp={1}>
                {activeWorkspace?.title}
              </Text>

              <Group gap={5} wrap="nowrap">
                <Text inherit fz={'xs'} c={'dimmed'}>
                  {workspaceNotes?.length} Notes
                </Text>

                <Group mt={2}>
                  <IconCircleFilled size={3} />
                </Group>

                <Text inherit fz={'xs'} c={'dimmed'}>
                  {'1'} Members
                </Text>
              </Group>
            </Stack>
          </Group>

          <Group gap={'xs'}>
            <Tooltip label={`${activeWorkspace?.title} settings`}>
              <Button
                color="dark"
                size="xs"
                variant="light"
                leftSection={
                  <IconSettings size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                }
              >
                Settings
              </Button>
            </Tooltip>

            <Tooltip label={`Add people to ${activeWorkspace?.title}`}>
              <Button
                color="dark"
                size="xs"
                variant="light"
                leftSection={
                  <IconUserPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                }
              >
                Invite Members
              </Button>
            </Tooltip>
          </Group>
        </Stack>

        <ScrollAreaAutosize mah={200} scrollbars={'y'} scrollbarSize={6}>
          <Stack px={'xs'} pb={'xs'} gap={0}>
            <Group
              justify="space-between"
              py={'xs'}
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 1,
                backgroundColor:
                  'light-dark(var(--mantine-color-body), var(--mantine-color-dark-8))',
              }}
            >
              <Title order={2} fz={'sm'} fw={500}>
                Workspaces
              </Title>
            </Group>

            <Stack gap={5}>
              {workspaces?.map((wi) => {
                const noteCount = workspaceNoteCounts[wi.id] || 0;
                const isActive = activeWorkspace?.id === wi.id;

                const handleWorkspaceChange = () => {
                  // save new active workspace to session storage
                  saveToSessionStorage(
                    LOCAL_STORAGE_NAME.ACTIVE_WORKSPACE,
                    wi.id
                  );

                  // set new global active workspace state
                  setActiveItems({ workspace: wi });

                  setOpened(false);

                  const noteInViewId = extractUuidFromParam(pathname);

                  if (noteInViewId) {
                    if (pathname != '/') {
                      router.replace('/');
                    }
                  }
                };

                return (
                  <Button
                    key={wi.id}
                    rightSection={
                      activeWorkspace?.id != wi.id ? undefined : (
                        <IconCheck
                          size={ICON_SIZE}
                          stroke={ICON_STROKE_WIDTH}
                        />
                      )
                    }
                    fullWidth
                    size="compact-md"
                    justify="space-between"
                    variant="subtle"
                    color="dark"
                    pl={5}
                    onClick={() => handleWorkspaceChange()} // Move logic to a named function
                  >
                    <Group gap={'xs'} wrap="nowrap">
                      <Avatar size={ICON_SIZE + 4} color="dark">
                        {wi?.title[0]}
                      </Avatar>
                      <Text
                        component="span"
                        inherit
                        fz={'sm'}
                        fw={'normal'}
                        lineClamp={1}
                        maw={200}
                      >
                        {wi?.title}
                      </Text>
                      {!isActive && (
                        <Text
                          component="span"
                          inherit
                          fz={'xs'}
                          c={'dimmed'}
                          lineClamp={1}
                          fw={'normal'}
                        >
                          (
                          <NumberFormatter
                            value={noteCount}
                            thousandSeparator
                          />
                          )
                        </Text>
                      )}
                    </Group>
                  </Button>
                );
              })}

              <ModalWorkspaceCrud workspace={{ type: props.workspaceType }}>
                <Button
                  fullWidth
                  size="compact-md"
                  justify="start"
                  variant="subtle"
                  color="pri.5"
                  pl={5}
                >
                  <Group gap={'xs'} wrap="nowrap">
                    <Center w={ICON_SIZE + 4} h={ICON_SIZE + 4}>
                      <IconPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                    </Center>

                    <Text component="span" inherit fz={'sm'} fw={'normal'}>
                      New Workspace
                    </Text>
                  </Group>
                </Button>
              </ModalWorkspaceCrud>
            </Stack>
          </Stack>
        </ScrollAreaAutosize>
      </PopoverDropdown>
    </Popover>
  );
}
