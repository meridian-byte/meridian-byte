'use client';

import {
  ActionIcon,
  Divider,
  Group,
  Skeleton,
  Stack,
  Title,
  Tooltip,
} from '@mantine/core';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';
import NavlinkCategory from '@/components/common/navlink/note';
import NavlinkAppMain from '@/components/common/navlink/app/main';
import { useStoreCategory } from '@repo/libraries/zustand/stores/category';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import {
  IconCalendarEvent,
  IconCircleCheck,
  IconClearAll,
  IconHome,
  IconInbox,
  IconPlus,
  IconSun,
} from '@tabler/icons-react';
import ModalCategoryCrud from '@repo/components/common/modals/category/crud';
import { APP_NAME } from '@repo/constants/app';
import { useStoreTask } from '@repo/libraries/zustand/stores/task';
import { useMemo } from 'react';
import { isToday, isWithinNext7Days } from '@repo/utilities/date-time';

export default function Links() {
  const tasks = useStoreTask((s) => s.tasks);
  const incompleteTasks = useMemo(
    () => tasks?.filter((ti) => !ti.complete),
    [tasks]
  );
  const completeTasks = useMemo(
    () => tasks?.filter((ti) => !!ti.complete),
    [tasks]
  );
  const categories = useStoreCategory((s) => s.categories);
  const ids = new Set((categories || []).map((n) => n.id));

  const navLinks = [
    {
      icon: IconHome,
      label: 'Home',
      link: '',
    },
    {
      icon: IconInbox,
      label: 'Inbox',
      link: '/inbox',
      count: !incompleteTasks
        ? undefined
        : incompleteTasks.filter((ti) => !ti.category_id).length,
    },
    {
      icon: IconSun,
      label: 'Today',
      link: '/today',
      count: !incompleteTasks
        ? undefined
        : incompleteTasks.filter((ti) => isToday(ti.due_date || '')).length,
    },
    {
      icon: IconCalendarEvent,
      label: 'Upcoming',
      link: '/upcoming',
      count: !incompleteTasks
        ? undefined
        : incompleteTasks.filter((ti) => isWithinNext7Days(ti.due_date)).length,
    },
    {
      icon: IconClearAll,
      label: 'All',
      link: '/all',
      count: tasks?.length,
    },
    {
      icon: IconCircleCheck,
      label: 'Completed',
      link: '/completed',
      count: completeTasks?.length,
    },
  ];

  return (
    <div>
      <Stack gap={2} style={{ zIndex: 0 }} p={'xs'}>
        {navLinks.map((nl) => {
          return (
            <div key={nl.link}>
              <NavlinkAppMain props={nl} />
            </div>
          );
        })}
      </Stack>

      <Divider mb={'xs'} />

      <Group
        justify="space-between"
        px={'calc(var(--mantine-spacing-xs) + 6.67px)'}
      >
        <div>
          <Title order={2} fz={'md'} fw={500}>
            Projects
          </Title>
        </div>

        <Group justify={'end'} align={'end'}>
          <ModalCategoryCrud source={APP_NAME.STRIDE}>
            <Tooltip label={'Create Project'} withArrow>
              <Group>
                <ActionIcon size={ICON_WRAPPER_SIZE} variant="subtle">
                  <IconPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Group>
            </Tooltip>
          </ModalCategoryCrud>
        </Group>
      </Group>

      <Stack gap={2} style={{ zIndex: 0 }} p={'xs'}>
        {categories === undefined ? (
          <Stack gap={2}>
            <Skeleton h={31.7} />
            <Skeleton h={31.7} />
            <Skeleton h={31.7} />
            <Skeleton h={31.7} />
            <Skeleton h={31.7} />
          </Stack>
        ) : (
          <>
            {sortArray(
              (categories || []).filter(
                (n) => !n.parent_category_id || !ids.has(n.parent_category_id)
              ),
              (i) => i.created_at,
              Order.DESCENDING
            ).map((n) => {
              return (
                <div key={n.id}>
                  <NavlinkCategory props={{ categoryId: n.id }} />
                </div>
              );
            })}
          </>
        )}
      </Stack>
    </div>
  );
}
