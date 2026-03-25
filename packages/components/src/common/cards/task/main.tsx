'use client';

import { Box, Group, Stack, Text, Title } from '@mantine/core';
import React, { useMemo } from 'react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import {
  IconBell,
  IconCalendarEvent,
  IconCategory,
  IconCircleFilled,
  IconNote,
  IconRepeat,
} from '@tabler/icons-react';
import { useFormTask } from '@repo/hooks/form/task';
import classes from './main.module.scss';
import {
  isOverdue,
  isToday,
  isTomorrow,
  getRegionalDate,
} from '@repo/utilities/date-time';
import InputCheckboxTask from '../../inputs/checkboxes/task';
import { useStoreTask } from '@repo/libraries/zustand/stores/task';
import { useStoreCategory } from '@repo/libraries/zustand/stores/category';
import { useStoreReminder } from '@repo/libraries/zustand/stores/reminder';
import { useStoreActiveItems } from '@repo/libraries/zustand/stores/active-items';

export default function Main({
  props,
}: {
  props: { id: string; color?: string };
}) {
  const tasks = useStoreTask((s) => s.tasks);
  const task = useMemo(
    () => tasks?.find((t) => t.id === props.id),
    [tasks, props.id]
  );

  const categories = useStoreCategory((s) => s.categories);
  const category = useMemo(
    () => categories?.find((c) => c.id === task?.category_id),
    [categories, task?.category_id]
  );

  const reminders = useStoreReminder((s) => s.reminders);
  const taskReminders = reminders?.filter((ri) => ri.task_id == task?.id);

  const addActiveTask = useStoreActiveItems((s) => s.addActiveTask);

  const { form } = useFormTask({ defaultValues: props });

  return (
    <Box className={classes.card}>
      <Group align="start" gap={'xs'} wrap="nowrap" w={'100%'}>
        <Group
          gap={5}
          wrap="nowrap"
          mt={'sm'}
          pl={'xs'} // comment this out when adding drag handle
        >
          {/* <div className={classes.grip}>
            <ActionIconDragHandle params={{ id: props.id }} />
          </div> */}

          <InputCheckboxTask props={{ form }} />
        </Group>

        <Box
          onClick={() => {
            if (task) addActiveTask(task);
          }}
          w={'100%'}
          py={'xs'}
          style={{ cursor: 'pointer' }}
        >
          <Stack gap={5} mt={2}>
            <Title order={2} fz={'sm'} fw={'normal'}>
              {task?.title}
            </Title>

            <Group gap={'xs'}>
              <>
                <Group gap={5} c={'dimmed'}>
                  <IconCategory
                    size={ICON_SIZE / 1.5}
                    stroke={ICON_STROKE_WIDTH * 1.5}
                  />

                  <Text fz={'xs'} lineClamp={1}>
                    {category?.title || 'Inbox'}
                  </Text>
                </Group>
              </>

              {task?.due_date && (
                <>
                  <IconCircleFilled size={3} color="gray" />

                  <Group
                    gap={5}
                    c={
                      isOverdue(task.due_date) && !task.complete
                        ? 'red'
                        : isToday(task.due_date)
                          ? 'pri'
                          : 'dimmed'
                    }
                  >
                    <IconCalendarEvent
                      size={ICON_SIZE / 1.5}
                      stroke={ICON_STROKE_WIDTH * 1.5}
                    />

                    <Text fz={'xs'} lineClamp={1}>
                      {isToday(task.due_date)
                        ? 'Today'
                        : isTomorrow(task.due_date)
                          ? 'Tomorrow'
                          : `${isOverdue(task.due_date) ? 'Overdue, ' : ''}${getRegionalDate(task.due_date).date}`}
                    </Text>

                    {task?.recurring_rule_id && (
                      <IconRepeat
                        size={ICON_SIZE / 1.5}
                        stroke={ICON_STROKE_WIDTH * 1.5}
                      />
                    )}
                  </Group>
                </>
              )}

              {(taskReminders || [])[0]?.remind_at && (
                <>
                  {task?.due_date && <IconCircleFilled size={3} color="gray" />}

                  <Group
                    gap={5}
                    c={
                      isOverdue((taskReminders || [])[0].remind_at) &&
                      !task?.complete
                        ? 'red'
                        : isToday((taskReminders || [])[0].remind_at)
                          ? 'pri'
                          : 'dimmed'
                    }
                  >
                    <IconBell
                      size={ICON_SIZE / 1.5}
                      stroke={ICON_STROKE_WIDTH * 1.5}
                    />

                    <Text fz={'xs'} lineClamp={1}>
                      {isToday((taskReminders || [])[0].remind_at)
                        ? 'Today'
                        : isTomorrow((taskReminders || [])[0].remind_at)
                          ? 'Tomorrow'
                          : getRegionalDate((taskReminders || [])[0].remind_at)
                              .date}
                    </Text>
                  </Group>
                </>
              )}

              {task?.description && (
                <>
                  {task.due_date || (taskReminders || [])[0]?.remind_at ? (
                    <IconCircleFilled size={3} color="gray" />
                  ) : null}

                  <Group gap={5} c={'dimmed'}>
                    <IconNote
                      size={ICON_SIZE / 1.5}
                      stroke={ICON_STROKE_WIDTH * 1.5}
                    />

                    <Text fz={'xs'} lineClamp={1}>
                      Note
                    </Text>
                  </Group>
                </>
              )}
            </Group>
          </Stack>
        </Box>
      </Group>
    </Box>
  );
}
