'use client';

import React, { useMemo } from 'react';
import { SECTION_SPACING } from '@repo/constants/sizes';
import {
  Button,
  Container,
  Group,
  Skeleton,
  Stack,
  Title,
} from '@mantine/core';
import AccordionTasks, {
  taskSkeleton,
} from '@repo/components/common/accordions/tasks';
import PlaceholderEmpty from '@repo/components/common/placeholder/empty';
import { getTimeOfDay, isWithinNext7Days } from '@repo/utilities/date-time';
import ModalTaskCreate from '@repo/components/common/modals/task/create';
import { capitalizeWords } from '@repo/utilities/string';
import PartialTaskCreate from '@repo/components/partial/task/create';
import { useFormTask } from '@repo/hooks/form/task';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { useStoreTask } from '@repo/libraries/zustand/stores/task';
import { useStoreReminder } from '@repo/libraries/zustand/stores/reminder';

export default function Home() {
  const now = new Date();
  const tomorrow = new Date(now.setDate(now.getDate() + 1));

  const tasks = useStoreTask((s) => s.tasks);
  const session = useStoreSession((s) => s.session);
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

  const { form, handleSubmit, submitted } = useFormTask({
    defaultValues: { due_date: now },
  });

  const handleClose = () => {
    form.reset();
    close();
  };

  return (
    <div>
      <Stack gap={SECTION_SPACING / 2}>
        {session == null ? (
          <Group justify="center">
            <Skeleton height={26} width={260} />
          </Group>
        ) : (
          <Title order={1} fz={'xl'} fw={500} ta={'center'}>
            Good {getTimeOfDay()},{' '}
            {capitalizeWords(session?.user_metadata.name)}
          </Title>
        )}

        <PartialTaskCreate
          props={{
            form,
            handleClose,
            submitted,
            handleSubmit,
          }}
        />

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
      </Stack>
    </div>
  );
}
