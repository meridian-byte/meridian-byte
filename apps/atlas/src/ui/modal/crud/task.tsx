'use client';

import { Group, Modal, Text } from '@mantine/core';
import React from 'react';
import { useViewModal } from '@repo/store';
import { MODAL_VIEW_NAMES } from '@repo/constants';
import FormTask from '@atlas/ui/form/task';
import { extractUuidFromParam } from '@repo/utils';
import { useTaskActions, useStoreTask } from '@repo/store';
import { Alert, TaskGet } from '@repo/types';
import { ButtonConfirmCancel, LayoutModal } from '@repo/ui';

export default function Task({ children }: { children: React.ReactNode }) {
  const { modalViewValue, closeModalView, taskObject } = useGetTaskObject();

  return (
    <>
      <Modal
        opened={!!modalViewValue?.includes(MODAL_VIEW_NAMES.CRUD.STRIDE.TASK.UPDATE)}
        onClose={closeModalView}
        size={'xl'}
        padding={0}
      >
        <FormTask defaultValues={taskObject} options={{ modal: true }} />
      </Modal>

      <Modal
        opened={!!modalViewValue?.includes(MODAL_VIEW_NAMES.CRUD.STRIDE.TASK.DELETE)}
        onClose={closeModalView}
      >
        <TaskDelete task={taskObject} onClose={closeModalView} />
      </Modal>

      <span>{children}</span>
    </>
  );
}

const useGetTaskObject = () => {
  const { modalViewValue, closeModalView } = useViewModal();
  const tasks = useStoreTask((s) => s.tasks);
  const taskId = extractUuidFromParam(modalViewValue || '');
  const taskObject = tasks?.find((c) => c.id === taskId);

  return { modalViewValue, closeModalView, taskObject };
};

function TaskDelete({ task, onClose }: { task?: TaskGet; onClose: () => void }) {
  const { taskDelete } = useTaskActions();

  return (
    <LayoutModal props={{ title: 'Delete Task', close: onClose, variant: Alert.WARNING }}>
      <div>
        <Text inherit>
          The task{' '}
          <Text component="em" inherit fw={500}>
            {task?.title}
          </Text>{' '}
          will be deleted. The events in this task will be preserved.
        </Text>

        <Group justify="end" mt={'md'}>
          <ButtonConfirmCancel
            options={{
              onCancel: onClose,
              onConfirm: () => {
                if (task) taskDelete(task);
              },
            }}
          />
        </Group>
      </div>
    </LayoutModal>
  );
}
