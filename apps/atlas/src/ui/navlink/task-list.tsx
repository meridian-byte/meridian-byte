'use client';

import { ActionIcon, Group, NavLink, Text, ThemeIcon, Tooltip } from '@mantine/core';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import { useStoreAppShell, useSubView } from '@repo/store';
import { CalendarGet, NoteGet, TaskListGet } from '@repo/types';
import { extractUuidFromParam } from '@repo/utils';
import { IconCircleFilled, IconDots, IconNote } from '@tabler/icons-react';
import MenuTaskList from '../menu/task-list';
import { useMediaQuery } from '@mantine/hooks';

export default function TaskList({ props }: { props: TaskListGet }) {
  const desktop = useMediaQuery('(min-width: 62em)');

  const navbarActive = useStoreAppShell((s) => s.appshell?.child?.navbar);
  const toggleNavbarChild = useStoreAppShell((s) => s.toggleNavbarChild);

  const { subViewValue, showSubViewStride } = useSubView();

  const taskListActive =
    subViewValue?.includes('list: ') && extractUuidFromParam(subViewValue) == props.id;

  return (
    <div className="group/list" style={{ overflow: 'hidden' }}>
      <MenuTaskList defaultValues={props} options={{ context: true }}>
        <NavLink
          label={
            <Tooltip label={props.title} multiline maw={320} position="top-start" arrowOffset={16}>
              <Text component="span" inherit lineClamp={1} lh={2}>
                {props.title}
              </Text>
            </Tooltip>
          }
          color="gray"
          p={desktop ? 0 : undefined}
          fw={600}
          styles={{
            section: desktop ? { marginInlineEnd: 0 } : undefined,
            label: {
              fontSize: desktop ? 'var(--mantine-font-size-xs)' : undefined,
              color: !taskListActive ? undefined : 'var(--mantine-color-pri-6)',
            },
          }}
          leftSection={
            <ThemeIcon
              size={desktop ? 30 : ICON_WRAPPER_SIZE}
              variant="transparent"
              c={`${props.color}.6` || 'pri'}
            >
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
              mih={30}
              pr={5}
              visibleFrom="md"
            >
              <MenuTaskList defaultValues={props}>
                <ActionIcon size={30 - 6} color="gray" variant="subtle">
                  <IconDots size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </MenuTaskList>
            </Group>
          }
          onClick={() => {
            if (!desktop) {
              if (navbarActive) toggleNavbarChild();
            }

            showSubViewStride(`list: ${props.id}`);
          }}
        />
      </MenuTaskList>

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
