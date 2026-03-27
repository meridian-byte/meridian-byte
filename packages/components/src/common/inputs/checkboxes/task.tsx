import { ICON_WRAPPER_SIZE } from '@repo/constants/sizes';
import { FormTask } from '@repo/hooks/form/task';
import { getPriorityColor } from '@repo/services/logic/priority-color';
import { Checkbox } from '@mantine/core';
import { Priority } from '@repo/types/models/enums';
import React from 'react';

export default function Task({ props }: { props: { form: FormTask } }) {
  return (
    <Checkbox
      radius="xl"
      key={props.form.key('properties.complete')}
      {...props.form.getInputProps('properties.complete', { type: 'checkbox' })}
      styles={{
        input: {
          width: ICON_WRAPPER_SIZE / 1.5,
          height: ICON_WRAPPER_SIZE / 1.5,
          border: `1.5px solid ${props.form.values.complete ? 'var(--mantine-color-pri-7)' : getPriorityColor(props.form.values.priority as Priority) || 'var(--mantine-color-white)'}`,
        },
        icon: {
          width: ICON_WRAPPER_SIZE / 3,
          height: ICON_WRAPPER_SIZE / 3,
          marginRight: 6,
        },
      }}
    />
  );
}
