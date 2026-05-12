import { Box, Button, Card, Group } from '@mantine/core';
import React from 'react';
import FormTaskCreate from '../../form/task/create';
import ModalConfirm from '../../common/modals/confirm';
import { useFormTask } from '@repo/hooks/form/task';
import { TaskGet } from '@repo/types/models/task';

export default function Create({
  props,
}: {
  props?: {
    defaultValues?: Partial<TaskGet>;
    handleClose?: () => void;
  };
}) {
  const { form, handleSubmit, submitted } = useFormTask({
    defaultValues: props?.defaultValues || { due_date: new Date() },
  });

  const cancelButton = (
    <Button size="xs" color="dark" variant="light" disabled={submitted}>
      Cancel
    </Button>
  );

  return (
    <Card padding={0} style={{ overflow: 'visible' }}>
      <Box
        p={'md'}
        bg={
          'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))'
        }
        style={{
          borderTopLeftRadius: 'var(--mantine-radius-md)',
          borderTopRightRadius: 'var(--mantine-radius-md)',
        }}
      >
        <FormTaskCreate props={{ form }} />
      </Box>

      <Group
        justify="space-between"
        p={'md'}
        bg={
          'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-7))'
        }
        style={{
          borderBottomLeftRadius: 'var(--mantine-radius-md)',
          borderBottomRightRadius: 'var(--mantine-radius-md)',
        }}
      >
        {/* <ComboboxTaskProject props={{ formTask: props.form }} /> */}

        <Group gap={'xs'}>
          {form.isDirty() ? (
            <ModalConfirm
              props={{
                title: 'Discard unsaved changes?',
                desc: 'Your unsaved changes will be discarded.',
                onConfirm: () => {
                  if (props?.handleClose) props.handleClose();
                },
              }}
            >
              {cancelButton}
            </ModalConfirm>
          ) : (
            <div
              onClick={() => {
                if (props?.handleClose) props.handleClose();
              }}
            >
              {cancelButton}
            </div>
          )}

          <Button
            size="xs"
            onClick={async () => {
              await handleSubmit();
              form.reset();
              if (props?.handleClose) props.handleClose();
            }}
            disabled={!form.values.title?.trim()}
            loading={submitted}
          >
            Add Task
          </Button>
        </Group>
      </Group>
    </Card>
  );
}
