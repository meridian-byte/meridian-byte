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
  Popover,
  PopoverDropdown,
  PopoverTarget,
  useCombobox,
} from '@mantine/core';
import { FormTask } from '@repo/hooks/form/task';
import { getRegionalDate } from '@repo/utilities/date-time';
import {
  Icon,
  IconCalendarCog,
  IconCalendarDue,
  IconCalendarEvent,
  IconCalendarMonth,
  IconCalendarPlus,
  IconCalendarWeek,
  IconRepeat,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { TIME_FORMAT } from '@repo/constants/other';
import {
  getNextWeekdays,
  getRepeatButtonLabel,
  sortWeekdaysInOrder,
} from '@repo/services/logic/time';
import { useState } from 'react';
import FormTaskCreateRepeat from '../../../../form/task/create/repeat';
import { Frequency } from '@repo/types/models/enums';
import { Weekdays } from '@repo/types/enums';
import { FormReminder } from '@repo/hooks/form/reminder';
import { FormRecurringRule } from '@repo/hooks/form/recurring-rule';

type Recurrence = {
  frequency: Frequency;
  weekdays: Weekdays[];
  interval: number;
};

export default function Repeat({
  props,
}: {
  props: {
    form: {
      task: FormTask;
      reminder: FormReminder;
      recurringRule: FormRecurringRule;
    };
    inputProps?: { width?: any };
  };
}) {
  const [mounted, setMounted] = useState(false);
  const [popover, setPopover] = useState(false);

  const combobox = useCombobox({
    opened: mounted,
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const options = items.map((item, index) => (
    <ComboboxOption key={index} value={item.value}>
      {item.component}
    </ComboboxOption>
  ));

  const popoverTarget = (
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
      rightSection={
        props.form.task.values.recurring_rule_id ? (
          <CloseButton
            size="sm"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              props.form.recurringRule.setFieldValue(
                'frequency',
                '' as Frequency
              );
              props.form.recurringRule.setFieldValue('interval', 1);
              props.form.recurringRule.setFieldValue('weekdays', []);
              setMounted(false);
            }}
            aria-label="Clear value"
          />
        ) : (
          <ComboboxChevron />
        )
      }
      onClick={() => setMounted(true)}
      rightSectionPointerEvents={
        !props.form.task.values.recurring_rule_id ? 'none' : 'all'
      }
    >
      <Group gap={'xs'} fz={'sm'} pr={'xs'}>
        {props.form.task.values.recurring_rule_id ? (
          <Group gap={'xs'}>
            <IconRepeat size={ICON_SIZE / 1.25} stroke={ICON_STROKE_WIDTH} />
            {/* {getRepeatButtonLabel({
              frequency: props.form.values.frequency as Frequency,
              interval: props.form.values.interval,
              weekdays: sortWeekdaysInOrder(
                props.form.values.weekdays as Weekdays[]
              ) as Weekdays[],
            })} */}
            label
          </Group>
        ) : (
          <InputPlaceholder fz={'sm'}>
            <Group gap={'xs'}>
              <IconRepeat size={ICON_SIZE / 1.25} stroke={ICON_STROKE_WIDTH} />
              Recurrence
            </Group>
          </InputPlaceholder>
        )}
      </Group>
    </InputBase>
  );

  return !popover ? (
    <Combobox
      store={combobox}
      withinPortal={false}
      onDismiss={() => setMounted(false)}
      onOptionSubmit={(val) => {
        const parsedValues: Recurrence = JSON.parse(val);

        if ((parsedValues as any).custom) {
          setPopover(true);
          return;
        }

        if (!props.form.task.values.due_date) {
          props.form.task.setFieldValue('due_date', currentDate);
        }

        props.form.recurringRule.setFieldValue(
          'frequency',
          parsedValues.frequency
        );
        props.form.recurringRule.setFieldValue(
          'interval',
          parsedValues.interval
        );
        props.form.recurringRule.setFieldValue(
          'weekdays',
          sortWeekdaysInOrder(parsedValues.weekdays) as Weekdays[]
        );

        setMounted(false);
      }}
    >
      <ComboboxTarget>{popoverTarget}</ComboboxTarget>

      <ComboboxDropdown miw={200}>
        <ComboboxOptions>
          {options}

          <ComboboxOption
            value={JSON.stringify({ custom: true })}
            onClick={(e) => e.preventDefault()}
          >
            <Option props={{ icon: IconCalendarCog }}>Custom</Option>
          </ComboboxOption>
        </ComboboxOptions>
      </ComboboxDropdown>
    </Combobox>
  ) : (
    <Popover
      position="bottom-end"
      shadow="md"
      opened={true}
      onDismiss={() => {
        setMounted(false);
        // setPopover(false);
      }}
    >
      <PopoverTarget>{popoverTarget}</PopoverTarget>

      <PopoverDropdown p={'xs'}>
        <FormTaskCreateRepeat
          props={{
            form: props.form,
            setMounted: (state) => setMounted(state),
            setPopover: (state) => setPopover(state),
          }}
        />
      </PopoverDropdown>
    </Popover>
  );
}

const currentDate = new Date();

const items = [
  {
    value: JSON.stringify({
      date: currentDate,
      frequency: Frequency.DAILY as Frequency,
      interval: 1 as number,
      weekdays: [] as Weekdays[],
    }),
    component: <Option props={{ icon: IconCalendarDue }}>Daily</Option>,
  },
  {
    value: JSON.stringify({
      date: getNextWeekdays(currentDate)[0],
      frequency: Frequency.WEEKLY as Frequency,
      interval: 1 as number,
      weekdays: getNextWeekdays(currentDate, true).map((day) =>
        getRegionalDate(day, { locale: TIME_FORMAT.LOCALE })
          .date.slice(0, 2)
          .toUpperCase()
      ),
    }),
    component: <Option props={{ icon: IconCalendarEvent }}>Weekdays</Option>,
  },
  {
    value: JSON.stringify({
      date: currentDate,
      frequency: Frequency.WEEKLY as Frequency,
      interval: 1 as number,
      weekdays: [
        getRegionalDate(currentDate, {
          locale: TIME_FORMAT.LOCALE,
        })
          .date.slice(0, 2)
          .toUpperCase(),
      ],
    }),
    component: <Option props={{ icon: IconCalendarWeek }}>Weekly</Option>,
  },
  {
    value: JSON.stringify({
      date: currentDate,
      frequency: Frequency.MONTHLY as Frequency,
      interval: 1 as number,
      weekdays: [] as Weekdays[],
    }),
    component: <Option props={{ icon: IconCalendarMonth }}>Monthly</Option>,
  },
  {
    value: JSON.stringify({
      date: currentDate,
      frequency: Frequency.ANNUALLY as Frequency,
      interval: 1 as number,
      weekdays: [] as Weekdays[],
    }),
    component: <Option props={{ icon: IconCalendarPlus }}>Yearly</Option>,
  },
];

function Option({
  props,
  children,
}: {
  props: { date?: Date; icon: Icon };
  children: React.ReactNode;
}) {
  return (
    <Group gap={'xs'}>
      <props.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
      <span>{children}</span>
    </Group>
  );
}
