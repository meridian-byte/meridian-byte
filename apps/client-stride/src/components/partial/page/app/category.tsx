'use client';

import React, { useMemo } from 'react';
import AccordionTasks, {
  taskSkeleton,
} from '@repo/components/common/accordions/tasks';
import { Button } from '@mantine/core';
import { useStoreTask } from '@repo/libraries/zustand/stores/task';
import PlaceholderEmpty from '@repo/components/common/placeholder/empty';
import { useStoreCategory } from '@repo/libraries/zustand/stores/category';
import ModalTaskCreate from '@repo/components/common/modals/task/create';
import { capitalizeWords } from '@repo/utilities/string';

export default function Category({
  props,
}: {
  props: { categoryTitle: string | null; categoryId: string | null };
}) {
  const categories = useStoreCategory((s) => s.categories);
  const category = useMemo(
    () => categories?.find((p) => p.id == props.categoryId),
    [categories, props.categoryId]
  );

  const tasks = useStoreTask((s) => s.tasks);
  const tasksOfCategory = useMemo(
    () => tasks?.filter((t) => t.category_id == props.categoryId),
    [tasks, props.categoryId]
  );

  return (
    <div>
      {categories === undefined ? (
        taskSkeleton
      ) : !category ? (
        <PlaceholderEmpty
          props={{
            title: 'Project not found',
            desc: "The category doesn't seem to exist.",
          }}
        />
      ) : !tasksOfCategory?.length ? (
        <PlaceholderEmpty
          props={{
            title: `No ${capitalizeWords(props.categoryTitle || '')} Tasks Found`,
            desc: 'Add some tasks to get started',
          }}
        >
          <ModalTaskCreate props={{ category_id: category.id }}>
            <Button size="xs">Add task</Button>
          </ModalTaskCreate>
        </PlaceholderEmpty>
      ) : (
        <AccordionTasks
          props={{
            defaultValues: { category_id: category.id || '' },
          }}
        />
      )}
    </div>
  );
}
