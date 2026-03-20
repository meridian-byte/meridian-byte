'use client';

import {
  CloseButton,
  Combobox,
  ComboboxChevron,
  ComboboxDropdown,
  ComboboxOption,
  ComboboxOptions,
  ComboboxTarget,
  Group,
  InputBase,
  InputPlaceholder,
  Text,
  useCombobox,
} from '@mantine/core';
import { FormTask } from '@repo/hooks/form/task';
import { Icon, IconFlag, IconFlagFilled } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { Priority as TaskPriority } from '@repo/types/models/enums';
import { FormTaskView } from '@repo/hooks/form/task/view';

export default function Priority({
  props,
}: {
  props: {
    formTask?: FormTask;
    formTaskView?: FormTaskView;
    inputProps?: { width?: any };
  };
}) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const options = items.map((item, index) => (
    <ComboboxOption key={index} value={item.value}>
      {item.component}
    </ComboboxOption>
  ));

  const priorityLabel = getPriorityLabel(
    (props.formTask?.values.priority as TaskPriority) ||
      (props.formTaskView?.values.filter_by.priority as TaskPriority)
  );

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        if (props.formTask) {
          props.formTask?.setFieldValue(
            'priority',
            val as TaskPriority
          );
        }

        if (props.formTaskView) {
          props.formTaskView?.setFieldValue(
            'filter_by.priority',
            val as TaskPriority
          );
        }

        combobox.closeDropdown();
      }}
    >
      <ComboboxTarget>
        <InputBase
          styles={{
            input: {
              backgroundColor: 'var(--mantine-color-body)',
            },
          }}
          component="button"
          type="button"
          size="xs"
          p={0}
          w={props.inputProps?.width || 'fit-content'}
          pointer
          onClick={() => combobox.toggleDropdown()}
          rightSection={
            props.formTask?.values.priority ||
            props.formTaskView?.values.filter_by.priority ? (
              <CloseButton
                size="sm"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  if (props.formTask) {
                    props.formTask?.setFieldValue(
                      'priority',
                      '' as TaskPriority
                    );
                  }

                  if (props.formTaskView) {
                    props.formTaskView?.setFieldValue(
                      'filter_by.priority',
                      '' as TaskPriority
                    );
                  }

                  combobox.closeDropdown();
                }}
                aria-label="Clear value"
              />
            ) : (
              <ComboboxChevron />
            )
          }
          rightSectionPointerEvents={
            !(
              props.formTask?.values.priority ||
              props.formTaskView?.values.filter_by.priority
            )
              ? 'none'
              : 'all'
          }
        >
          <Group gap={'xs'} fz={'sm'} pr={'xs'}>
            {props.formTask?.values.priority ||
            props.formTaskView?.values.filter_by.priority ? (
              <Group gap={'xs'}>
                <IconFlagFilled
                  size={ICON_SIZE / 1.25}
                  stroke={ICON_STROKE_WIDTH}
                  color={
                    priorityLabel.color
                      ? `var(--mantine-color-${priorityLabel.color}-6)`
                      : undefined
                  }
                />

                <Text component="span" inherit>
                  {priorityLabel.label}
                </Text>
              </Group>
            ) : (
              <InputPlaceholder fz={'sm'}>
                <Group gap={'xs'}>
                  <IconFlagFilled
                    size={ICON_SIZE / 1.25}
                    stroke={ICON_STROKE_WIDTH}
                    color={
                      priorityLabel.color
                        ? `var(--mantine-color-${priorityLabel.color}-6)`
                        : undefined
                    }
                  />
                  Priority
                </Group>
              </InputPlaceholder>
            )}
          </Group>
        </InputBase>
      </ComboboxTarget>

      <ComboboxDropdown miw={240}>
        <ComboboxOptions>{options}</ComboboxOptions>
      </ComboboxDropdown>
    </Combobox>
  );
}

const items = [
  {
    value: TaskPriority.URGENT_IMPORTANT,
    component: (
      <Option
        props={{ icon: IconFlagFilled, color: 'var(--mantine-color-red-6)' }}
      >
        Urgent & Important
      </Option>
    ),
  },
  {
    value: TaskPriority.URGENT_UNIMPORTANT,
    component: (
      <Option
        props={{ icon: IconFlagFilled, color: 'var(--mantine-color-yellow-6)' }}
      >
        Urgent & Unimportant
      </Option>
    ),
  },
  {
    value: TaskPriority.NOT_URGENT_IMPORTANT,
    component: (
      <Option
        props={{ icon: IconFlagFilled, color: 'var(--mantine-color-blue-6)' }}
      >
        Not Urgent & Important
      </Option>
    ),
  },
  {
    value: TaskPriority.NOT_URGENT_UNIMPORTANT,
    component: (
      <Option props={{ icon: IconFlag }}>Not Urgent & Unimportant</Option>
    ),
  },
];

function Option({
  props,
  children,
}: {
  props: { icon: Icon; color?: string };
  children: React.ReactNode;
}) {
  return (
    <Group gap={'xs'}>
      <props.icon
        size={ICON_SIZE}
        stroke={ICON_STROKE_WIDTH}
        color={props.color}
      />
      <span>{children}</span>
    </Group>
  );
}

const getPriorityLabel = (
  priority: TaskPriority
): { label: string; color: string | null } => {
  const priorityMap: Record<
    TaskPriority,
    { label: string; color: string | null }
  > = {
    [TaskPriority.URGENT_IMPORTANT]: { label: 'Priority I', color: 'red' },
    [TaskPriority.URGENT_UNIMPORTANT]: {
      label: 'Priority II',
      color: 'yellow',
    },
    [TaskPriority.NOT_URGENT_IMPORTANT]: {
      label: 'Priority III',
      color: 'blue',
    },
    [TaskPriority.NOT_URGENT_UNIMPORTANT]: {
      label: 'Priority IV',
      color: null,
    },
  };

  return priorityMap[priority] || { label: 'Unknown Priority', color: null };
};
