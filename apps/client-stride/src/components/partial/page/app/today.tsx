'use client';

import React, { useMemo } from 'react';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { Button, Container } from '@mantine/core';
import AccordionTasks, {
  taskSkeleton,
} from '@repo/components/common/accordions/tasks';
import PlaceholderEmpty from '@repo/components/common/placeholder/empty';
import { isToday } from '@repo/utilities/date-time';
import ModalTaskCreate from '@repo/components/common/modals/task/create';
import { useStoreTask } from '@repo/libraries/zustand/stores/task';
import { useStoreReminder } from '@repo/libraries/zustand/stores/reminder';

export default function Today() {
  const now = new Date();

  const reminders = useStoreReminder((s) => s.reminders);

  const tasks = useStoreTask((s) => s.tasks);
  const dueTasks = useMemo(
    () =>
      tasks?.filter((t) => {
        const taskReminders = reminders?.filter((ri) => ri.task_id == t.id);
        return t.due_date || taskReminders?.length;
      }),
    [tasks]
  );

  const todayTasks = useMemo(
    () =>
      dueTasks?.filter((t) => {
        const taskReminders = reminders?.filter((ri) => ri.task_id == t.id);

        return t.due_date || taskReminders?.length
          ? isToday(
              t.due_date || (!taskReminders ? now : taskReminders[0].remind_at)
            )
          : false;
      }),
    [dueTasks]
  );

  return (
    <div>
      {tasks == null ? (
        taskSkeleton
      ) : !todayTasks?.length ? (
        <PlaceholderEmpty
          props={{
            title: 'No Tasks Due Today',
            desc: 'Add some tasks to get done today.',
          }}
        >
          <ModalTaskCreate
            props={{
              due_date: now,
            }}
          >
            <Button size="xs">Add task</Button>
          </ModalTaskCreate>
        </PlaceholderEmpty>
      ) : (
        <AccordionTasks
          props={{
            tasks: todayTasks,
            defaultValues: { due_date: now },
          }}
        />
      )}
    </div>
  );
}
