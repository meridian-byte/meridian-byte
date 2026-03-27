'use client';

import { Divider, Skeleton, Stack } from '@mantine/core';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';
import NavlinkCategory from '@/components/common/navlink/note';
import NavlinkAppMain from '@/components/common/navlink/app/main';
import {
  IconCalendarEvent,
  IconCircleCheck,
  IconClearAll,
  IconHome,
  IconInbox,
  IconSun,
} from '@tabler/icons-react';
import { useStoreCategory } from '@repo/libraries/zustand/stores/category';

export default function Links() {
  const categories = useStoreCategory((s) => s.categories);
  const ids = new Set((categories || []).map((n) => n.id));

  return (
    <div>
      <Stack gap={0} style={{ zIndex: 0 }}>
        {navLinks.map((nl) => {
          return (
            <div key={nl.link}>
              <NavlinkAppMain props={nl} />
            </div>
          );
        })}

        <Divider py={'md'} />

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

export const navLinks = [
  {
    icon: IconHome,
    label: 'Home',
    link: '/app/home',
  },
  {
    icon: IconInbox,
    label: 'Inbox',
    link: '/app/inbox',
  },
  {
    icon: IconSun,
    label: 'Today',
    link: '/app/today',
  },
  {
    icon: IconCalendarEvent,
    label: 'Upcoming',
    link: '/app/upcoming',
  },
  {
    icon: IconClearAll,
    label: 'All',
    link: '/app/all',
  },
  {
    icon: IconCircleCheck,
    label: 'Completed',
    link: '/app/completed',
  },
];
