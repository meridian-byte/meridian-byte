'use client';

import React, { useState } from 'react';
import { useSubView } from '@repo/store';
import { extractUuidFromParam } from '@repo/utils';
import { AgendaView, ScheduleEventData } from '@mantine/schedule';
import dayjs from 'dayjs';
import { useStoreCalendar, useStoreEvent } from '@repo/store';
import PartialLoading from '../../loading';
import PartialEmpty from '../../empty';
import { ActionIcon, Button, Divider, Group, Modal, Stack, Text } from '@mantine/core';
import { useEventCrud } from '@atlas/hooks/schedule';
import FormEvent from '@atlas/ui/form/event';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants';

export default function CalendarList() {
  const { subViewValue } = useSubView();
  const calendarId = extractUuidFromParam(subViewValue || '');

  const calendar = useStoreCalendar((s) => s.calendars?.find((ci) => ci.id == calendarId));

  const events = useStoreEvent((s) => s.events);
  const eventCrud = useEventCrud();

  // Month currently being displayed
  const [currentDate, setCurrentDate] = useState(dayjs());

  const rangeStart = currentDate.startOf('month');
  const rangeEnd = currentDate.endOf('month');

  const scheduleEvents: ScheduleEventData[] = (events || [])
    .filter((ei) => {
      if (ei.calendarId != calendarId) return false;

      const eventStart = dayjs(ei.start);
      const eventEnd = dayjs(ei.end);

      // Event overlaps the currently displayed month
      return eventStart.isBefore(rangeEnd) && eventEnd.isAfter(rangeStart);
    })
    .map((ei) => ({
      ...ei,
      recurringEventId: '',
      recurrenceId: '',
      color: calendar?.color || 'pri',
    }));

  const goToPreviousMonth = () => {
    setCurrentDate((date) => date.subtract(1, 'month'));
  };

  const goToNextMonth = () => {
    setCurrentDate((date) => date.add(1, 'month'));
  };

  const goToToday = () => {
    setCurrentDate(dayjs());
  };

  return (
    <>
      <Group justify="space-between">
        <Group gap="xs">
          <ActionIcon size={32} variant="default" onClick={goToPreviousMonth}>
            <IconChevronLeft size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          </ActionIcon>

          <Button size="sm" h={32} variant="default">
            {currentDate.format('MMMM YYYY')}
          </Button>

          <ActionIcon size={32} variant="default" onClick={goToNextMonth}>
            <IconChevronRight size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          </ActionIcon>

          <Button size="sm" h={32} variant="default" onClick={goToToday}>
            Today
          </Button>

          <Button
            size="sm"
            h={32}
            onClick={() => eventCrud.handleCreateEvent({ calendarId: calendar?.id })}
          >
            Add Event
          </Button>
        </Group>

        <div></div>
      </Group>

      <Divider mt="xs" />

      {events === undefined || !scheduleEvents?.length ? (
        <PartialEmpty
          loading={events === undefined}
          label={`No events for '${calendar?.title}' calendar in ${currentDate.format('MMMM YYYY')}`}
        />
      ) : (
        <>
          <AgendaView
            rangeStart={rangeStart.format('YYYY-MM-DD')}
            rangeEnd={rangeEnd.format('YYYY-MM-DD')}
            events={scheduleEvents}
            onEventClick={eventCrud.scheduleHandlers.onEventClick}
          />
        </>
      )}

      <Modal opened={eventCrud.formOpened} onClose={eventCrud.closeForm}>
        <FormEvent
          modal={true}
          initialData={eventCrud.selectedEventData}
          onClose={eventCrud.closeForm}
        />
      </Modal>
    </>
  );
}
