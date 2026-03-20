'use client';

import { FormTask } from '@repo/hooks/form/task';
import { Group, Textarea } from '@mantine/core';
import React from 'react';
import classes from './create.module.scss';
import ComboboxTaskDue from '@repo/components/common/inputs/combobox/task/due';
import ComboboxTaskTime from '@repo/components/common/inputs/combobox/task/time';
import ComboboxTaskRepeat from '@repo/components/common/inputs/combobox/task/repeat';
import ComboboxTaskPriority from '@repo/components/common/inputs/combobox/task/priority';
import { useFormReminder } from '@repo/hooks/form/reminder';
import { useFormRecurringRule } from '@repo/hooks/form/recurring-rule';

export default function Create({ props }: { props: { form: FormTask } }) {
  const { form: formReminder } = useFormReminder();
  const { form: formRecurringRule } = useFormRecurringRule();

  return (
    <>
      <div>
        <Textarea
          w={'100%'}
          minRows={1}
          maxRows={3}
          autosize
          placeholder="Add task title here"
          variant="unstyled"
          key={props.form.key('title')}
          {...props.form.getInputProps('title')}
          classNames={{ input: classes.title }}
          data-autofocus
        />

        <Textarea
          w={'100%'}
          minRows={2}
          maxRows={5}
          autosize
          placeholder="Add task description here"
          variant="unstyled"
          key={props.form.key('description')}
          {...props.form.getInputProps('description')}
          classNames={{ input: classes.desc }}
        />
      </div>

      <Group gap={'xs'} mt={'xs'}>
        <ComboboxTaskDue props={{ form: props.form }} />
        <ComboboxTaskTime props={{ form: props.form }} />
        <ComboboxTaskRepeat
          props={{
            form: {
              task: props.form,
              reminder: formReminder,
              recurringRule: formRecurringRule,
            },
          }}
        />
        <ComboboxTaskPriority props={{ formTask: props.form }} />
      </Group>
    </>
  );
}
