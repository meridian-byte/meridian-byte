'use client';

import React from 'react';
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

export default function Workspace({
  children,
}: {
  children?: React.ReactNode;
}) {
  const workspaces = useStoreWorkspace((s) => s.workspaces);
  const activeItems = useStoreActiveItems((s) => s.activeItems);
  const activeWorkspace = useStoreActiveItems((s) => s.activeItems?.workspace);
  const notes = useStoreNote((s) => s.notes);
  const workspaceNotes = notes?.filter((ni) => {
    const isDefaultWorkspace = activeWorkspace?.title
      .toLocaleLowerCase()
      .includes('default');

    if (!isDefaultWorkspace) {
      return ni.workspace_id == activeWorkspace?.id;
    } else {
      return !ni.workspace_id;
    }
  });

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
    >
      <Group gap={'xs'} wrap="nowrap">
        <IconCategory size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />

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

  return (
    <Popover
      width={320}
      position="bottom-start"
      shadow="md"
      styles={{ dropdown: { padding: 0 } }}
    >
      <PopoverTarget>
        <div>
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
            <ThemeIcon
              size={ICON_WRAPPER_SIZE * 1.3}
              variant="light"
              color="dark"
            >
              <IconCategory size={ICON_SIZE * 1.3} stroke={ICON_STROKE_WIDTH} />
            </ThemeIcon>

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
              {workspaces?.map((wi) => (
                <Button
                  key={wi.id}
                  rightSection={
                    activeWorkspace?.id != wi.id ? undefined : (
                      <IconCheck size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                    )
                  }
                  fullWidth
                  size="compact-md"
                  justify="space-between"
                  variant="subtle"
                  color="dark"
                  pl={5}
                >
                  <Group gap={'xs'} wrap="nowrap">
                    <Avatar size={ICON_SIZE + 4} color="dark">
                      {activeWorkspace?.title[0]}
                    </Avatar>

                    <Text
                      component="span"
                      inherit
                      fz={'sm'}
                      fw={'normal'}
                      lineClamp={1}
                      maw={200}
                    >
                      {activeWorkspace?.title}
                    </Text>
                  </Group>
                </Button>
              ))}

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
            </Stack>
          </Stack>
        </ScrollAreaAutosize>
      </PopoverDropdown>
    </Popover>
  );
}
