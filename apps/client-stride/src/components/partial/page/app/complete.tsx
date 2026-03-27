'use client';

import React, { useMemo } from 'react';
import AccordionTasks, {
  taskSkeleton,
} from '@repo/components/common/accordions/tasks';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { Container } from '@mantine/core';
import { useStoreTask } from '@repo/libraries/zustand/stores/task';
import PlaceholderEmpty from '@repo/components/common/placeholder/empty';

export default function Complete() {
  const tasks = useStoreTask((s) => s.tasks);
  const completedTasks = useMemo(
    () => tasks?.filter((t) => t.complete),
    [tasks]
  );

  return (
    <div>
      {tasks == null ? (
        taskSkeleton
      ) : !completedTasks?.length ? (
        <PlaceholderEmpty
          props={{
            title: 'No Completed Tasks',
            desc: 'Your completed tasks will appear here.',
          }}
        />
      ) : (
        <AccordionTasks
          props={{ tasks: completedTasks, completeTasks: true }}
        />
      )}
    </div>
  );
}
