'use client';

import React, { useMemo, useState } from 'react';
import {
  ActionIcon,
  Box,
  Divider,
  Grid,
  GridCol,
  Group,
  Modal,
  Overlay,
  ScrollArea,
  ScrollAreaAutosize,
  Text,
} from '@mantine/core';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { IconCell, IconCircleCheck, IconX } from '@tabler/icons-react';
import FormTaskView from '@repo/components/form/task';
import { usePathname } from 'next/navigation';
import { useFormTask } from '@repo/hooks/form/task';
import IndicatorNetworkStatus from '../../indicators/network-status';
import InputCheckboxTask from '../../inputs/checkboxes/task';
import { useMediaQuery, useResizeObserver } from '@mantine/hooks';
import { SyncStatus } from '@repo/types/models/enums';
import { useStoreSyncStatus } from '@repo/libraries/zustand/stores/sync-status';
import { useStoreActiveItems } from '@repo/libraries/zustand/stores/active-items';
import { useStoreTask } from '@repo/libraries/zustand/stores/task';
import { useStoreCategory } from '@repo/libraries/zustand/stores/category';
import { useTaskActions } from '@repo/hooks/actions/task';

export default function Crud({ children }: { children: React.ReactNode }) {
  const syncStatus = useStoreSyncStatus((s) => s.syncStatus);
  const activeTask = useStoreActiveItems((s) => s.activeItems?.task);
  const removeActiveTask = useStoreActiveItems((s) => s.removeActiveTask);

  const tasks = useStoreTask((s) => s.tasks);
  const task = useMemo(
    () => tasks?.find((t) => t.id == activeTask?.id),
    [tasks, activeTask?.id]
  );

  const categories = useStoreCategory((s) => s.categories);
  const category = useMemo(
    () => categories?.find((c) => c.id == task?.category_id),
    [categories, task?.category_id]
  );

  const close = () => {
    if (form.isDirty('title') || form.isDirty('description')) {
      const wrapperElement = document.getElementById(wrapperId);
      wrapperElement?.click();
    } else {
      removeActiveTask();
    }
  };

  const { taskDelete, taskUpdate } = useTaskActions();
  const { form, submitted, handleSubmit } = useFormTask();

  const [focused, setFocused] = useState(false);

  const mobile = useMediaQuery('(min-width: 36em)');
  const tablet = useMediaQuery('(min-width: 48em)');

  const [refHeader, header] = useResizeObserver();
  const [refProperties, properties] = useResizeObserver();

  const col1 = (
    <FormTaskView
      props={{
        // form,
        // submitted,
        // handleSubmit,
        // updateState,
        // wrapperId,
        // setFocused,
        close,
        defaultValues: task,
      }}
    />
  );

  // const col2 = (
  //   <FormTaskProperties
  //     props={{
  //       form,
  //       handleDelete,
  //       submitted,
  //       handleSubmit,
  //       id: task?.id,
  //       parentModalstate: {
  //         opened: !!selectedTask,
  //         close,
  //       },
  //     }}
  //   />
  // );

  return (
    <>
      <Modal
        opened={!!activeTask}
        onClose={close}
        withCloseButton={false}
        centered
        fullScreen={!mobile}
        size={'xl'}
        padding={0}
        pos={'relative'}
      >
        <Box
          pos={'sticky'}
          top={0}
          bg={'var(--mantine-color-body)'}
          style={{ zIndex: 10 }}
          ref={refHeader}
        >
          <Group justify="space-between" p={'sm'}>
            <Group gap={5}>
              {/* <IconCircleCheck size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} /> */}

              <Text component="span" inherit fz={'sm'} fw={500} lineClamp={1}>
                {category?.title ||
                  // task?.title||
                  'Task View'}
              </Text>
            </Group>

            <Group gap={'xs'}>
              <IndicatorNetworkStatus
                props={{
                  syncStatus,
                  itemSyncStatus:
                    syncStatus == SyncStatus.SAVED ||
                    syncStatus == SyncStatus.SYNCED
                      ? syncStatus
                      : (task?.sync_status as any),
                }}
              />

              <ActionIcon
                size={ICON_WRAPPER_SIZE}
                color="gray"
                variant="subtle"
                onClick={() => removeActiveTask()}
              >
                <IconX size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            </Group>
          </Group>

          <Divider />
        </Box>

        <div onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
          {tablet ? (
            <ScrollAreaAutosize
              type="auto"
              // scrollbarSize={APPSHELL.SCROLLBAR_WIDTH}
              // h={MODAL_HEIGHT.TASK_VIEW}
              scrollbars={'y'}
            >
              {col1}
            </ScrollAreaAutosize>
          ) : (
            <div
              style={{
                minHeight: `calc(100vh - (${header.height}px + ${properties.height}px))`,
              }}
            >
              {col1}
            </div>
          )}
        </div>
      </Modal>

      <div>{children}</div>
    </>
  );
}

const wrapperId = 'taskViewPrompt';
