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
    <div className="group/list">
      <NavLink
        label={
          <Tooltip label={props.title} multiline maw={320} position="top-start" arrowOffset={16}>
            <Text component="span" inherit lineClamp={1} lh={2}>
              {props.title}
            </Text>
          </Tooltip>
        }
        color="gray"
        p={0}
        fw={600}
        leftSection={
          <ThemeIcon size={30} variant="transparent" c={`${props.color}.6` || 'pri'}>
            <IconCircleFilled size={6} />
          </ThemeIcon>
        }
        rightSection={
          <Group
            gap={0}
            wrap="nowrap"
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="opacity-0 group-hover/list:opacity-100 transition-opacity duration-250"
            miw={30}
            pr={4}
          >
            <MenuTaskList defaultValues={props}>
              <ActionIcon size={30 - 6} color="gray" variant="subtle">
                <IconDots size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            </MenuTaskList>
          </Group>
        }
        style={{ borderRadius: 'var(--mantine-radius-md)' }}
        styles={{
          section: { marginInlineEnd: 0 },
          label: {
            fontSize: 'var(--mantine-font-size-xs)',
            color: !taskListActive ? undefined : 'var(--mantine-color-pri-6)',
          },
        }}
        onClick={() => showSubViewStride(`list: ${props.id}`)}
      />

      {/* <div className="opacity-0 group-hover/list:opacity-100 transition-opacity duration-250">
        <MenuTaskList defaultValues={props}>
          <ActionIcon size={30} color="gray" variant="subtle" radius={0}>
            <IconDots size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
          </ActionIcon>
        </MenuTaskList>
      </div> */}
    </div>
  );
}
