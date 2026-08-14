'use client';

import React, { useState } from 'react';
import { useStoreCalendar, useStoreEvent, useStoreView } from '@repo/store';
import { useSubView } from '@repo/store';
import { Schedule, ScheduleEventData, ScheduleViewLevel } from '@mantine/schedule';
import { generateUUID } from '@repo/utils';
import {
  ActionIcon,
  Box,
  Group,
  HoverCard,
  HoverCardDropdown,
  HoverCardTarget,
  Modal,
  UnstyledButton,
} from '@mantine/core';
import EventDetails from './event-details';
import dayjs from 'dayjs';
import { EventGet, SyncStatus } from '@repo/types';
import { useEventCrud } from '@atlas/hooks/schedule';
import { IconPlus } from '@tabler/icons-react';
import FormEvent from '../form/event';
import PartialLoading from '../partial/loading';

export default function Main() {
  // views
  const subViewValue = useStoreView((s) => s.view?.subView);
  const { showSubViewPave } = useSubView();

  const handleChange = (v: string) => {
    showSubViewPave(v);
  };

  // State / Store Events
  const events = useStoreEvent((s) => s.events);
  const setEvents = useStoreEvent((s) => s.setEvents);
  const calendars = useStoreCalendar((s) => s.calendars);

  // Hook instance
  const eventCrud = useEventCrud();

  // Map Prisma Store Events directly to Mantine's expected type safe structure
  const calendarMap = new Map((calendars || []).map((cal) => [cal.id, cal]));

  const eventItems: ScheduleEventData[] = (events || []).map((event) => {
    return {
      id: event.id,
      title: event.title,
      start: new Date(event.start).toISOString(),
      end: new Date(event.end).toISOString(),
      color: event.calendarId ? calendarMap.get(event.calendarId)?.color || 'pri' : 'pri',
      allDay: event.allDay,
      description: event.description ?? undefined,
      location: event.location ?? undefined,
      calendarId: event.calendarId ?? undefined,
    };
  });

  const handleEventUpdate = ({
    eventId,
    newStart,
    newEnd,
  }: {
    eventId: string | number;
    newStart: string;
    newEnd: string;
  }) => {
    if (!events || !events.length) return;

    setEvents(
      events.map((event) => {
        if (event.id !== eventId) return event;

        return {
          ...event,
          start: new Date(newStart).toISOString() as any,
          end: new Date(newEnd).toISOString() as any,

          syncStatus: SyncStatus.PENDING,
          updatedAt: new Date().toDateString() as any,
        };
      }),
    );
  };

  // other

  const [date, setDate] = useState(new Date());

  return (
    <>
      {events === undefined || calendars === undefined ? (
        <PartialLoading />
      ) : (
        subViewValue && (
          <>
            <Schedule
              withAgenda
              layout="responsive"

              events={eventItems}

              view={subViewValue as ScheduleViewLevel}
              onViewChange={(v) => handleChange(v)}

              date={date}
              onDateChange={(newDate) => setDate(new Date(newDate))}

              /* Drag and drop / Resize props */
              withEventsDragAndDrop
              onEventDrop={handleEventUpdate}
              withEventResize
              onEventResize={handleEventUpdate}

              /* Interactive Handlers from Doc / CRUD Hook */
              withDragSlotSelect
              onTimeSlotClick={eventCrud.scheduleHandlers.onTimeSlotClick}
              onAllDaySlotClick={eventCrud.scheduleHandlers.onAllDaySlotClick}
              onDayClick={eventCrud.scheduleHandlers.onDayClick}
              onSlotDragEnd={eventCrud.scheduleHandlers.onSlotDragEnd}
              onEventClick={eventCrud.scheduleHandlers.onEventClick}

              dayViewProps={{
                startTime: '05:00:00',
                endTime: '23:00:00',
                intervalMinutes: 15,
                slotHeight: 80,
                withSubHourGridLines: false,

                renderEvent: (event, props) => (
                  <HoverCard width={280} position="top" closeDelay={0}>
                    <HoverCardTarget>
                      <UnstyledButton {...props} />
                    </HoverCardTarget>

                    <HoverCardDropdown>
                      <EventDetails event={event} />
                    </HoverCardDropdown>
                  </HoverCard>
                ),
              }}

              weekViewProps={{
                startTime: '05:00:00',
                endTime: '23:00:00',
                intervalMinutes: 30,
                weekdayFormat: 'dd',
                highlightToday: true,
                withWeekendDays: true,
                withSubHourGridLines: false,

                renderEvent: (event, props) => (
                  <HoverCard width={280} position="right" closeDelay={0}>
                    <HoverCardTarget>
                      <UnstyledButton {...props} />
                    </HoverCardTarget>

                    <HoverCardDropdown>
                      <EventDetails event={event} />
                    </HoverCardDropdown>
                  </HoverCard>
                ),
              }}

              mobileMonthViewProps={{
                onSelectedDateChange: (date) => {
                  if (date) {
                    eventCrud.mobileSelectedDate.current = date;
                  }
                },

                renderHeader: ({ defaultHeader }) => (
                  <Group justify="space-between" w="100%">
                    <Group justify="space-between" flex="1">
                      {defaultHeader}
                    </Group>

                    <ActionIcon
                      variant="default"
                      mx="sm"
                      size="lg"
                      onClick={eventCrud.handleCreateMobileEvent}
                      aria-label="Create new event"
                    >
                      <IconPlus size={18} />
                    </ActionIcon>
                  </Group>
                ),
              }}

              monthViewProps={
                {
                  withWeekNumbers: false,
                  firstDayOfWeek: 1,

                  renderEvent: (event: any, props: any) => {
                    const { children, className, style, ...others } = props;

                    return (
                      <HoverCard width={280} position="right" closeDelay={0}>
                        <HoverCardTarget>
                          {isAllDayEvent(event) ? (
                            <UnstyledButton {...props} />
                          ) : (
                            <UnstyledButton
                              {...others}
                              style={{
                                ...style,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                fontSize: 12,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                pointerEvents: 'all',
                                cursor: 'pointer',
                                paddingInline: 2,
                                fontWeight: 500,
                              }}
                            >
                              <Box
                                component="span"
                                style={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  backgroundColor: `var(--event-bg)`,
                                  flexShrink: 0,
                                }}
                              />
                              <span style={{ width: 28, flexShrink: 0 }}>
                                {dayjs(event.start).format('h:mm')}
                              </span>
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {event.title}
                              </span>
                            </UnstyledButton>
                          )}
                        </HoverCardTarget>

                        <HoverCardDropdown>
                          <EventDetails event={event} />
                        </HoverCardDropdown>
                      </HoverCard>
                    );
                  },

                  // Explicitly disable/strip top-level props that YearView doesn't support
                  withAgenda: undefined,
                  withEventResize: undefined,
                  onEventResize: undefined,
                } as any
              }

              yearViewProps={
                {
                  firstDayOfWeek: 1,

                  // Explicitly disable/strip top-level props that YearView doesn't support
                  withAgenda: undefined,
                  withEventsDragAndDrop: undefined,
                  onEventDrop: undefined,
                  withEventResize: undefined,
                  onEventResize: undefined,
                } as any
              }
            />

            {/* Render the Event Form inside a Modal */}
            <Modal
              opened={eventCrud.formOpened}
              onClose={eventCrud.closeForm}
              // onExited={eventCrud.handleExitTransitionEnd}
            >
              <FormEvent initialData={eventCrud.selectedEventData} onClose={eventCrud.closeForm} />
            </Modal>
          </>
        )
      )}
    </>
  );
}

function isAllDayEvent(event: ScheduleEventData) {
  const start = dayjs(event.start);
  const end = dayjs(event.end);
  return start.isSame(start.startOf('day')) && end.isSame(end.startOf('day'));
}
