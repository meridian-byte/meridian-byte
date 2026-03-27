import { Button, Card, CardSection, Divider, Group, Text } from '@mantine/core';
import React from 'react';
import FormTaskCreate from '../../form/task/create';
import ComboboxTaskProject from '../../common/inputs/combobox/task/project';
import ModalPrompt from '../../common/modals/prompt';
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
    <Button size="xs" color="gray" variant="light" disabled={props.submitted}>
      Cancel
    </Button>
  );

  return (
    <Card
      bg={'transparent'}
      padding={'lg'}
      style={{ overflow: 'visible' }}
      withBorder
    >
      <div>
        <FormTaskCreate props={{ form: props.form as any }} />
      </div>

      <CardSection>
        <Divider my={'lg'} />
      </CardSection>

      <Group justify="space-between">
        <ComboboxTaskProject props={{ formTask: props.form }} />

        <Group gap={'xs'}>
          {props.form.isDirty() ? (
            <ModalPrompt
              props={{
                title: 'Discard unsaved changes?',
                color: 'red.6',
                modalContent: (
                  <Text>Your unsaved changes will be discarded.</Text>
                ),
                parentModalstate: props.opened
                  ? { opened: props.opened, close }
                  : undefined,
                actions: {
                  confirm: () => props.handleClose(),
                },
                wrapperId,
              }}
            >
              {cancelButton}
            </ModalPrompt>
          ) : (
            <div onClick={props.handleClose}>{cancelButton}</div>
          )}

          <Button
            size="xs"
            onClick={async () => {
              await props.handleSubmit();
              close();
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

const wrapperId = 'taskCreatePrompt';
