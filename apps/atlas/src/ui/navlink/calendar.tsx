'use client';

import { ActionIcon, Group, NavLink, Text, ThemeIcon, Tooltip } from '@mantine/core';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants';
import { useSubView } from '@repo/store';
import { CalendarGet } from '@repo/types';
import { extractUuidFromParam } from '@repo/utils';
import { IconCircleFilled, IconDots } from '@tabler/icons-react';
import MenuCalendar from '../menu/calendar';

export default function Calendar({ props }: { props: CalendarGet }) {
  const { subViewValue, showSubViewPave } = useSubView();

  const calendarActive =
    subViewValue?.includes('calendar: ') && extractUuidFromParam(subViewValue) == props.id;

  return (
    <Group gap={0} wrap="nowrap">
      <NavLink
        label={
          <Tooltip label={props.title} multiline maw={320} position="top-start" arrowOffset={16}>
            <Text component="span" inherit lineClamp={1} lh={2}>
              {props.title}
            </Text>
          </Tooltip>
        }
        color="gray"
        px={'xs'}
        py={3}
        fw={500}
        leftSection={
          <ThemeIcon
            size={ICON_SIZE - 4}
            variant="transparent"
            mt={4}
            c={`${props.color}.6` || 'pri'}
          >
            <IconCircleFilled size={6} />
          </ThemeIcon>
        }
        styles={{
          label: {
            fontSize: 'var(--mantine-font-size-xs)',
            color: !calendarActive ? undefined : 'var(--mantine-color-pri-6)',
          },
        }}
        onClick={() => showSubViewPave(`calendar: ${props.id}`)}
      />

      <MenuCalendar defaultValues={props}>
        <ActionIcon size={30} color="gray" variant="subtle" radius={0}>
          <IconDots size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
        </ActionIcon>
      </MenuCalendar>
    </Group>
  );
}
