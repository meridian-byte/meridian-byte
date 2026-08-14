'use client';

import React from 'react';
import { useSubView } from '@repo/store';
import { extractUuidFromParam } from '@repo/utils';
import { AgendaView, ScheduleEventData } from '@mantine/schedule';
import dayjs from 'dayjs';
import { useStoreCalendar, useStoreEvent } from '@repo/store';
import PartialLoading from '../../loading';
import PartialEmpty from '../../empty';
import { Button, Divider, Group, Modal, Stack } from '@mantine/core';
import { useEventCrud } from '@atlas/hooks/schedule';
import FormEvent from '@atlas/ui/form/event';

export default function CalendarList() {
  const { subViewValue, showSubViewPave } = useSubView();
  const calendarId = extractUuidFromParam(subViewValue || '');
  const calendar = useStoreCalendar((s) => s.calendars?.find((ci) => ci.id == calendarId));
  const events = useStoreEvent((s) => s.events);

  const scheduleEvents: ScheduleEventData[] = (events || [])
    .filter((ei) => ei.calendarId == calendarId)
    .map((ei2) => ({
      ...ei2,
      recurringEventId: '',
      recurrenceId: '',
      color: calendar?.color || 'pri',
    }));

  const eventCrud = useEventCrud();

  return (
    <>
      <Group>
        <Button
          size={'xs'}
          onClick={() => eventCrud.handleCreateEvent({ calendarId: calendar?.id })}
        >
          Add Event
        </Button>
      </Group>

      <Divider mt={'xs'} />

      {events === undefined ? (
        <PartialLoading />
      ) : !scheduleEvents?.length ? (
        <PartialEmpty label={`No events for '${calendar?.title}' calendar.`} />
      ) : (
        <>
          <AgendaView
            rangeStart={dayjs().startOf('month').format('YYYY-MM-DD')}
            rangeEnd={dayjs().endOf('month').format('YYYY-MM-DD')}
            events={scheduleEvents}

            /* Interactive Handlers from Doc / CRUD Hook */
            onEventClick={eventCrud.scheduleHandlers.onEventClick}
          />
        </>
      )}

      <Modal opened={eventCrud.formOpened} onClose={eventCrud.closeForm}>
        <FormEvent initialData={eventCrud.selectedEventData} onClose={eventCrud.closeForm} />
      </Modal>
    </>
  );
}
