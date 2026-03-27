'use client';

import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Divider,
  Grid,
  GridCol,
  Group,
  NumberFormatter,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import classes from './tasks.module.scss';
import CardTaskCreate from '../cards/task/create';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { useEffect, useState } from 'react';
// import { FormTask } from '@/hooks/form/task';
// import { useFormTaskView, useGetOrganizedTasks } from '@/hooks/form/task/view';
// import { GroupSort } from '@generated/prisma';
// import { TaskRelations } from '@/types/models/task';
import { ViewGet } from '@repo/types/models/view';
import { TaskGet } from '@repo/types/models/task';
import { useGetOrganizedTasks } from '@repo/hooks/task/view';
import CardTaskMain from '../cards/task/main';

export default function Tasks({
  props,
}: {
  props: {
    tasks: TaskGet[];
    view?: ViewGet;
    completeTasks?: boolean;
    defaultValues?: Partial<TaskGet>;
  };
}) {
  // const { view } = useFormTaskView();

  const { organizedTasksState } = useGetOrganizedTasks({
    tasks: props.tasks || [],
    completeTasks: props.completeTasks,
  });

  const items = organizedTasksState.map((group, index) => {
    return (
      <AccordionItem
        key={`${index}-${group.title}`}
        value={`${index}-${group.title}`}
      >
        <AccordionControl>
          <Group>
            <Text component="span" fz={'md'} fw={500}>
              {group.title}
            </Text>

            {group.tasks.length && (
              <Text component="span" fz={'sm'} c={'dimmed'} mt={2}>
                (
                <NumberFormatter value={group.tasks.length} thousandSeparator />
                )
              </Text>
            )}
          </Group>
        </AccordionControl>

        <AccordionPanel pt={'xs'}>
          <Stack>
            {group.tasks.map((item, i) => (
              <div
                key={item.id}
                style={{
                  borderTopLeftRadius: i == 0 ? 8 : undefined,
                  borderTopRightRadius: i == 0 ? 8 : undefined,
                  overflow: 'hidden',
                }}
              >
                {group.tasks.indexOf(item) > 0 && <Divider />}
                <CardTaskMain props={item} />
              </div>
            ))}
          </Stack>

          <CardTaskCreate
          // props={{
          //   defaultValues: {
          //     category_id:
          //       view?.group_by == GroupSort.CATEGORY
          //         ? group.id
          //         : props.defaultValues?.category_id,
          //     due_date: (view?.group_by == GroupSort.DATE
          //       ? group.id
          //         ? new Date(group.id)
          //         : undefined
          //       : props.defaultValues?.dueDate) as any,
          //     priority: (view?.group_by == GroupSort.PRIORITY
          //       ? group.id
          //       : props.defaultValues?.priority) as any,
          //   },
          // }}
          />
        </AccordionPanel>
      </AccordionItem>
    );
  });

  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    setValue([
      ...value,
      ...organizedTasksState
        .map((group, index) => `${index}-${group.title}`)
        .filter((g) => {
          // only add group that's not in 'value'
          return !value.includes(g);
        }),
    ]);
  }, [organizedTasksState]);

  const singleGroup = organizedTasksState.length == 1;

  return (
    <Accordion
      multiple
      value={value}
      onChange={setValue}
      classNames={classes}
      chevron={singleGroup ? null : undefined}
      chevronPosition={singleGroup ? undefined : 'left'}
    >
      <Stack gap={SECTION_SPACING / 2}>{items}</Stack>
    </Accordion>
  );
}

const skeletonDetails = (
  <Stack gap={'xs'}>
    <Skeleton h={20} w={'70%'} />

    <Group pb={'md'}>
      <Skeleton h={10} w={'15%'} />
      <Skeleton h={10} w={'10%'} />
    </Group>
  </Stack>
);

const skeletonCard = (
  <Grid>
    <GridCol span={1}>
      <Group justify="end">
        <Skeleton h={20} w={20} radius={'xl'} />
      </Group>
    </GridCol>

    <GridCol span={11}>{skeletonDetails}</GridCol>
  </Grid>
);

const skeletonSection = (
  <Stack gap={'lg'}>
    <Skeleton h={24} w={'40%'} />

    <div>
      <Stack gap={2}>{skeletonCard}</Stack>
      <Stack gap={2}>{skeletonCard}</Stack>
    </div>
  </Stack>
);

export const taskSkeleton = (
  <Stack>
    {skeletonSection}
    {skeletonSection}
    {skeletonSection}
  </Stack>
);
