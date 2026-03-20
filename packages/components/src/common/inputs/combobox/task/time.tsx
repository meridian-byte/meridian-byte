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
  Text,
  useCombobox,
} from '@mantine/core';
import { FormReminder } from '@repo/hooks/form/reminder';
import { getRegionalDate } from '@repo/utilities/date-time';
import {
  Icon,
  IconBell,
  IconBellCog,
  IconBellDown,
  IconBellShare,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { TIME_FORMAT } from '@repo/constants/other';
import {
  getNextWeek,
  getReminderButtonLabel,
  getRoundedFutureTime,
  getTomorrow,
} from '@repo/services/logic/time';
import { useState } from 'react';
import InputCalendarTime from '../../calendar/time';
import { HourSystem } from '@repo/types/enums';

export default function Time({
  props,
}: {
  props: { form: FormReminder; inputProps?: { width?: any } };
}) {
  const [mounted, setMounted] = useState(false);
  const [popover, setPopover] = useState(false);

  const combobox = useCombobox({
    opened: mounted,
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const options = items.map((item, index) => (
    <ComboboxOption key={index} value={item.value.toISOString()}>
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
        props.form.values.remind_at ? (
          <CloseButton
            size="sm"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              props.form.setFieldValue('remind_at', '' as any);
              setMounted(false);
            }}
            aria-label="Clear value"
          />
        ) : (
          <ComboboxChevron />
        )
      }
      onClick={() => setMounted(true)}
      rightSectionPointerEvents={!props.form.values.remind_at ? 'none' : 'all'}
    >
      <Group gap={'xs'} fz={'sm'} pr={'xs'}>
        {props.form.values.remind_at ? (
          <Group gap={'xs'}>
            <IconBell size={ICON_SIZE / 1.25} stroke={ICON_STROKE_WIDTH} />

            {getReminderButtonLabel({
              date: new Date(props.form.values.remind_at),
            })}
          </Group>
        ) : (
          <InputPlaceholder fz={'sm'}>
            <Group gap={'xs'}>
              <IconBell size={ICON_SIZE / 1.25} stroke={ICON_STROKE_WIDTH} />
              Reminder
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
        if (val === 'custom') {
          setPopover(true);
          return;
        }

        props.form.setFieldValue('remind_at', new Date(val));
        setMounted(false);
      }}
    >
      <ComboboxTarget>{popoverTarget}</ComboboxTarget>

      <ComboboxDropdown miw={220}>
        <ComboboxOptions>
          {options}

          <ComboboxOption value={'custom'} onClick={(e) => e.preventDefault()}>
            <Option props={{ icon: IconBellCog }}>Pick a date & time</Option>
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
        setPopover(false);
      }}
    >
      <PopoverTarget>{popoverTarget}</PopoverTarget>

      <PopoverDropdown p={'xs'}>
        <InputCalendarTime
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

const roundedFutureTime = getRoundedFutureTime();
const tomorrowTime = getTomorrow();
const nextWeekTime = getNextWeek();

const items = [
  {
    value: roundedFutureTime,
    component: (
      <Option
        props={{
          date: roundedFutureTime,
          icon: IconBellDown,
        }}
      >
        Today
      </Option>
    ),
  },
  {
    value: tomorrowTime,
    component: (
      <Option
        props={{
          date: tomorrowTime,
          time: tomorrowTime,
          icon: IconBellShare,
        }}
      >
        Tomorrow
      </Option>
    ),
  },
  {
    value: nextWeekTime,
    component: (
      <Option
        props={{
          date: nextWeekTime,
          time: nextWeekTime,
          icon: IconBellShare,
        }}
      >
        Next Week
      </Option>
    ),
  },
];

function Option({
  props,
  children,
}: {
  props: { date?: Date; time?: Date; icon: Icon };
  children: React.ReactNode;
}) {
  return (
    <Group justify="space-between" gap={'xs'}>
      <Group gap={'xs'}>
        <props.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
        <span>{children}</span>
      </Group>

      {props.date && (
        <Text component="span" inherit c={'dimmed'} fz={'xs'}>
          {!props.time
            ? getReminderButtonLabel({
                date: props.date,
              })
            : `${
                getRegionalDate(props.date, {
                  locale: TIME_FORMAT.LOCALE,
                  hourSystem: HourSystem.TWENTY_FOUR,
                }).date
              }${
                props.time
                  ? `, ${
                      getRegionalDate(props.time, {
                        locale: TIME_FORMAT.LOCALE,
                        hourSystem: HourSystem.TWENTY_FOUR,
                      }).time
                    }`
                  : ''
              }`}
        </Text>
      )}
    </Group>
  );
}
