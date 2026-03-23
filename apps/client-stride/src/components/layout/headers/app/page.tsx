'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import LayoutSection from '@repo/components/layout/section';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import {
  ActionIcon,
  Badge,
  Box,
  Divider,
  Group,
  Skeleton,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconArrowRight,
  IconBook,
  IconDotsVertical,
  IconWriting,
} from '@tabler/icons-react';
import { TaskGet } from '@repo/types/models/task';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStoreUserStates } from '@repo/libraries/zustand/stores/user-states';
import WrapperUnderlayGlass from '@repo/components/wrappers/underlays/glass';
import { useScroll } from '@repo/hooks/scroll';
import { useStoreTask } from '@repo/libraries/zustand/stores/task';
import { getRegionalDate, getRelativeTime } from '@repo/utilities/date-time';
import BreadcrumbAppTask from '@repo/components/common/breadcrumbs/app/task';
import BadgeUpdatedTimestamp from '@repo/components/common/badges/updated-timestamp';
import LayoutHeaderAppPage from '@repo/components/layout/header/app/page';

export default function Page({
  props,
}: {
  props?: { taskId?: string | null };
}) {
  const tasks = useStoreTask((s) => s.tasks);
  const task = useStoreTask((s) => s.tasks?.find((t) => t.id == props?.taskId));

  // const searchParams = useSearchParams();
  // const userStates = useStoreUserStates((s) => s.userStates);
  // const setUserStates = useStoreUserStates((s) => s.setUserStates);

  // const toogleProperties = {
  //   view: userStates?.editing == true ? 'Editing' : 'Reading',
  //   label: userStates?.editing == true ? 'read' : 'edit',
  //   icon: userStates?.editing == true ? IconBook : IconWriting,
  // };

  // useEffect(() => {
  //   if (!userStates) return;
  //   if (!props) return;
  //   if (!props.content) return;

  //   if (!userStates.editing) setUserStates({ ...userStates, editing: true });
  // }, [searchParams]);

  return (
    <LayoutHeaderAppPage>
      <Group p={'xs'} pl={'md'} justify="space-between" wrap="nowrap">
        <Group gap={5} wrap="nowrap">
          <BreadcrumbAppTask />
        </Group>

        <Group gap={5} wrap="nowrap" justify="end">
          <Group gap={5} visibleFrom="xs" justify="end">
            {tasks === undefined ? (
              <Skeleton h={24} w={80} />
            ) : !task ? null : (
              <BadgeUpdatedTimestamp props={{ updatedAt: task.updated_at }} />
            )}
          </Group>
        </Group>
      </Group>
    </LayoutHeaderAppPage>
  );
}
