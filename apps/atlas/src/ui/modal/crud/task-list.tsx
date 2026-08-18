'use client';

import { Group, Modal, Text } from '@mantine/core';
import React from 'react';
import { useViewModal } from '@repo/store';
import { MODAL_VIEW_NAMES } from '@repo/constants';
import FormTaskList from '@atlas/ui/form/task-list';
import { extractUuidFromParam } from '@repo/utils';
import { useTaskListActions, useStoreTaskList } from '@repo/store';
import { Alert, TaskListGet } from '@repo/types';
import { ButtonConfirmCancel, LayoutModal } from '@repo/ui';

export default function TaskList({ children }: { children: React.ReactNode }) {
  const { modalViewValue, closeModalView, taskListObject } = useGetTaskListObject();

  return (
    <>
      <Modal
        opened={!!modalViewValue?.includes(MODAL_VIEW_NAMES.CRUD.STRIDE.TASK_LIST.UPDATE)}
        onClose={closeModalView}
      >
        <FormTaskList defaultValues={taskListObject} />
      </Modal>

      <Modal
        opened={!!modalViewValue?.includes(MODAL_VIEW_NAMES.CRUD.STRIDE.TASK_LIST.DELETE)}
        onClose={closeModalView}
      >
        <TaskListDelete taskList={taskListObject} onClose={closeModalView} />
      </Modal>

      <span>{children}</span>
    </>
  );
}

const useGetTaskListObject = () => {
  const { modalViewValue, closeModalView } = useViewModal();
  const taskLists = useStoreTaskList((s) => s.taskLists);
  const taskListId = extractUuidFromParam(modalViewValue || '');
  const taskListObject = taskLists?.find((c) => c.id === taskListId);

  return { modalViewValue, closeModalView, taskListObject };
};

function TaskListDelete({ taskList, onClose }: { taskList?: TaskListGet; onClose: () => void }) {
  const { taskListDelete } = useTaskListActions();

  return (
    <LayoutModal props={{ title: 'Delete TaskList', close: onClose, variant: Alert.WARNING }}>
      <div>
        <Text inherit>
          The taskList{' '}
          <Text component="em" inherit fw={500}>
            {taskList?.title}
          </Text>{' '}
          will be deleted. The events in this taskList will be preserved.
        </Text>

        <Group justify="end" mt={'md'}>
          <ButtonConfirmCancel
            options={{
              onCancel: onClose,
              onConfirm: () => {
                if (taskList) taskListDelete(taskList);
              },
            }}
          />
        </Group>
      </div>
    </LayoutModal>
  );
}
