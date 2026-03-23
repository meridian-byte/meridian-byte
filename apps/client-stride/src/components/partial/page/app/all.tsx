'use client';

import React from 'react';
import AccordionTasks, {
  taskSkeleton,
} from '@repo/components/common/accordions/tasks';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { Container } from '@mantine/core';
import { useStoreTask } from '@repo/libraries/zustand/stores/task';
import PlaceholderEmpty from '@repo/components/common/placeholder/empty';

export default function All() {
  const tasks = useStoreTask((s) => s.tasks);

  return (
    <div>
      {tasks == null ? (
        taskSkeleton
      ) : !tasks?.length ? (
        <PlaceholderEmpty
          props={{
            title: 'No Tasks Found',
            desc: 'Add some tasks to get started.',
          }}
        />
      ) : (
        <AccordionTasks props={{ tasks }} />
      )}
    </div>
  );
}
