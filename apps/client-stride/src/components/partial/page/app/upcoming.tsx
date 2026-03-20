'use client';

import React, { useMemo } from 'react';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { Button, Container } from '@mantine/core';
import AccordionTasks, {
  taskSkeleton,
} from '@repo/components/common/accordions/tasks';
import PlaceholderEmpty from '@repo/components/common/placeholder/empty';
import { isToday, isWithinNext7Days } from '@repo/utilities/date-time';
import ModalTaskCreate from '@repo/components/common/modals/task/crud';
import { useStoreTask } from '@repo/libraries/zustand/stores/task';
import { useStoreReminder } from '@repo/libraries/zustand/stores/reminder';

export default function Upcoming() {
  const now = new Date();
  const tomorrow = new Date(now.setDate(now.getDate() + 1));

  const tasks = useStoreTask((s) => s.tasks);
  const reminders = useStoreReminder((s) => s.reminders);

  const tasksInSevenDays = useMemo(
    () =>
      tasks?.filter((t) => {
        const taskReminders = reminders?.filter((ri) => ri.task_id == t.id);

        return isWithinNext7Days(
          t.due_date || taskReminders?.length
            ? new Date(
                t.due_date ||
                  (!taskReminders ? now : taskReminders[0].remind_at)
              )
            : null
        );
      }),
    [tasks]
  );

  return (
    <Container p={{ md: SECTION_SPACING }} py={SECTION_SPACING / 2}>
      {tasks == null ? (
        taskSkeleton
      ) : !tasksInSevenDays?.length ? (
        <PlaceholderEmpty
          props={{
            title: 'No Tasks Due In Next 7 Days',
            desc: 'Add some tasks to get done this week.',
          }}
        >
          <ModalTaskCreate
            props={{
              due_date: tomorrow,
            }}
          >
            <Button size="xs">Add task</Button>
          </ModalTaskCreate>
        </PlaceholderEmpty>
      ) : (
        <AccordionTasks
          props={{
            tasks: tasksInSevenDays,
            defaultValues: { due_date: tomorrow },
          }}
        />
      )}
    </Container>
  );
}
