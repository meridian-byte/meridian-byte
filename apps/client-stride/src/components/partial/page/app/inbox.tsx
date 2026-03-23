'use client';

import React, { useMemo } from 'react';
import AccordionTasks, {
  taskSkeleton,
} from '@repo/components/common/accordions/tasks';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { Button, Container } from '@mantine/core';
import { useStoreTask } from '@repo/libraries/zustand/stores/task';
import PlaceholderEmpty from '@repo/components/common/placeholder/empty';
import ModalTaskCreate from '@repo/components/common/modals/task/create';

export default function Inbox() {
  const tasks = useStoreTask((s) => s.tasks);
  const tasksWithoutCategory = useMemo(
    () => tasks?.filter((task) => !task.category_id),
    [tasks]
  );

  return (
    <div>
      {tasks == null ? (
        taskSkeleton
      ) : !tasksWithoutCategory?.length ? (
        <PlaceholderEmpty
          props={{
            title: 'No Inbox Tasks Found',
            desc: 'Tasks without a category will be listed here. Add some tasks to get started.',
          }}
        >
          <ModalTaskCreate>
            <Button size="xs">Add task</Button>
          </ModalTaskCreate>
        </PlaceholderEmpty>
      ) : (
        <AccordionTasks
          props={{
            tasks: tasksWithoutCategory,
          }}
        />
      )}
    </div>
  );
}
