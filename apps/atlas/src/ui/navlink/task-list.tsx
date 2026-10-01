'use client';

import { ActionIcon, Group, NavLink, Text, ThemeIcon, Tooltip } from '@mantine/core';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants';
import { useSubView } from '@repo/store';
import { CalendarGet, NoteGet, TaskListGet } from '@repo/types';
import { extractUuidFromParam } from '@repo/utils';
import { IconCircleFilled, IconDots, IconNote } from '@tabler/icons-react';
import MenuTaskList from '../menu/task-list';

export default function TaskList({ props }: { props: TaskListGet }) {
  const { subViewValue, showSubViewStride } = useSubView();

  const taskListActive =
    subViewValue?.includes('list: ') && extractUuidFromParam(subViewValue) == props.id;

  return (
    <Group gap={0} wrap="nowrap">
      <NavLink
        label={
          <Tooltip label={props.title} multiline maw={320} position="top-start" arrowOffset={16}>
            <Text component="span" inherit lineClamp={1} lh={2}>
              {props.title}
            </Text>
          </Tooltip>
        }
        color="gray"
        px={'xs'}
        py={3}
        fw={500}
        leftSection={
          <ThemeIcon
            size={ICON_SIZE - 4}
            variant="transparent"
            mt={4}
            c={`${props.color}.6` || 'pri'}
          >
            <IconCircleFilled size={6} />
          </ThemeIcon>
        }
        styles={{
          label: {
            fontSize: 'var(--mantine-font-size-xs)',
            color: !taskListActive ? undefined : 'var(--mantine-color-pri-6)',
          },
        }}
        onClick={() => showSubViewStride(`list: ${props.id}`)}
      />

      <MenuTaskList defaultValues={props}>
        <ActionIcon size={30} color="gray" variant="subtle" radius={0}>
          <IconDots size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
        </ActionIcon>
      </MenuTaskList>
    </Group>
  );
}
