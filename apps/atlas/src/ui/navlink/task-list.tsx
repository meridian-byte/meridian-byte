'use client';

import { ActionIcon, Group, NavLink, Text, ThemeIcon, Tooltip } from '@mantine/core';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import { useStoreAppShell, useSubView } from '@repo/store';
import { CalendarGet, NoteGet, TaskListGet } from '@repo/types';
import { extractUuidFromParam } from '@repo/utils';
import { IconCircleFilled, IconDots, IconNote } from '@tabler/icons-react';
import MenuTaskList from '../menu/task-list';

import { useBreakpointFlags } from '@repo/hooks';
import { memo, useCallback, useMemo } from 'react';

const TaskList = memo(function TaskList({ props }: { props: TaskListGet }) {
  const { ready, isDesktop } = useBreakpointFlags();

  const navbarActive = useStoreAppShell.getState().appshell?.child?.navbar;
  const toggleNavbarChild = useStoreAppShell((s) => s.toggleNavbarChild);

  const { subViewValue, showSubViewStride } = useSubView();

  const taskListActive = useMemo(() => {
    if (!subViewValue || !subViewValue.includes('list: ')) return false;
    return extractUuidFromParam(subViewValue) === props.id;
  }, [subViewValue, props.id]);

  const navLinkStyles = useMemo(
    () => ({
      section: isDesktop ? { marginInlineEnd: 0 } : undefined,
      label: {
        fontSize: isDesktop ? 'var(--mantine-font-size-xs)' : undefined,
        color: taskListActive ? 'var(--mantine-color-pri-6)' : undefined,
      },
    }),
    [isDesktop, taskListActive],
  );

  const iconColor = props.color ? `${props.color}.6` : 'pri';

  const handleSelect = useCallback(() => {
    if (!isDesktop && navbarActive) {
      toggleNavbarChild();
    }
    showSubViewStride(`list: ${props.id}`);
  }, [isDesktop, navbarActive, toggleNavbarChild, showSubViewStride, props.id]);

  const handleStopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  if (!ready) {
    return null;
  }

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
          p={isDesktop ? 0 : undefined}
          fw={600}
          styles={navLinkStyles}
          leftSection={
            <ThemeIcon
              size={isDesktop ? 30 : ICON_WRAPPER_SIZE}
              variant="transparent"
              c={iconColor}
            >
              <IconCircleFilled size={6} />
            </ThemeIcon>
          }
          rightSection={
            <Group
              gap={0}
              wrap="nowrap"
              onClick={handleStopPropagation}
              className="opacity-0 group-hover/list:opacity-100 transition-opacity duration-200"
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
          onClick={handleSelect}
        />
      </MenuTaskList>
    </div>
  );
});

export default TaskList;
