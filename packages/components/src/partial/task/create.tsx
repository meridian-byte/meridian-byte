import {
  Box,
  Button,
  Card,
  CardSection,
  Divider,
  Group,
  Text,
} from '@mantine/core';
import React from 'react';
import FormTaskCreate from '../../form/task/create';
import ComboboxTaskProject from '../../common/inputs/combobox/task/project';
import ModalConfirm from '../../common/modals/confirm';
import { FormTask } from '@repo/hooks/form/task';

export default function Create({
  props,
}: {
  props: {
    form: FormTask;
    opened?: boolean;
    handleClose: () => void;
    submitted: boolean;
    handleSubmit: () => Promise<void>;
  };
}) {
  const cancelButton = (
    <Button size="xs" color="dark" variant="light" disabled={props.submitted}>
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
        <FormTaskCreate props={{ form: props.form as any }} />
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
        <ComboboxTaskProject props={{ formTask: props.form }} />

        <Group gap={'xs'}>
          {props.form.isDirty() ? (
            <ModalConfirm
              props={{
                title: 'Discard unsaved changes?',
                desc: 'Your unsaved changes will be discarded.',
                onConfirm: () => props.handleClose(),
              }}
            >
              {cancelButton}
            </ModalConfirm>
          ) : (
            <div onClick={props.handleClose}>{cancelButton}</div>
          )}

          <Button
            size="xs"
            onClick={async () => {
              await props.handleSubmit();
              props.handleClose();
            }}
            disabled={!props.form.values.title?.trim()}
            loading={props.submitted}
          >
            Add Task
          </Button>
        </Group>
      </Group>
    </Card>
  );
}
