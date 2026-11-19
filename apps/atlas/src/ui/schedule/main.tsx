'use client';

import React, { memo, useCallback, useMemo, useState } from 'react';
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
import { SHELL_VALUES } from '@atlas/constants';

const EMPTY_EVENTS: any[] = [];
const EMPTY_CALENDARS: any[] = [];

function isAllDayEvent(event: ScheduleEventData) {
  const start = dayjs(event.start);
  const end = dayjs(event.end);
  return start.isSame(start.startOf('day')) && end.isSame(end.startOf('day'));
}

const MemoSchedule = memo(Schedule);

export default function Main() {
  const subViewValue = useStoreView((s) => s.view?.subView);
  const { showSubViewPave } = useSubView();

  const events = useStoreEvent((s) => s.events);
  const setEvents = useStoreEvent((s) => s.setEvents);
  const calendars = useStoreCalendar((s) => s.calendars);

  const eventCrud = useEventCrud();
  const [date, setDate] = useState<string>(() => new Date().toISOString());

  const calendarMap = useMemo(() => {
    const map = new Map<string, any>();
    for (const cal of calendars ?? EMPTY_CALENDARS) {
      map.set(cal.id, cal);
    }
    return map;
  }, [calendars]);

  const eventItems = useMemo<ScheduleEventData[]>(() => {
    const list = events ?? EMPTY_EVENTS;
    return list.map((event) => ({
      id: event.id,
      title: event.title,
      start: new Date(event.start).toISOString(),
      end: new Date(event.end).toISOString(),
      color: event.calendarId ? calendarMap.get(event.calendarId)?.color || 'pri' : 'pri',
      allDay: event.allDay,
      description: event.description ?? undefined,
      location: event.location ?? undefined,
      calendarId: event.calendarId ?? undefined,
    }));
  }, [events, calendarMap]);

  const handleViewChange = useCallback(
    (v: string) => {
      showSubViewPave(v);
    },
    [showSubViewPave],
  );

  const handleDateChange = useCallback((newDate: string) => {
    setDate(newDate);
  }, []);

  const handleEventUpdate = useCallback(
    ({
      eventId,
      newStart,
      newEnd,
    }: {
      eventId: string | number;
      newStart: string;
      newEnd: string;
    }) => {
      const currentEvents = useStoreEvent.getState().events;
      if (!currentEvents || !currentEvents.length) return;

      const startIso = new Date(newStart).toISOString();
      const endIso = new Date(newEnd).toISOString();
      const updatedAtStr = new Date().toDateString();

      setEvents(
        currentEvents.map((event) => {
          if (event.id !== eventId) return event;
          return {
            ...event,
            start: startIso as any,
            end: endIso as any,
            syncStatus: SyncStatus.PENDING,
            updatedAt: updatedAtStr as any,
          };
        }),
      );
    },
    [setEvents],
  );

  const dayViewProps = useMemo(
    () => ({
      intervalMinutes: 15,
      startScrollTime: '09:00:00',
      scrollAreaProps: {
        mah: `calc(100vh - ${SHELL_VALUES.FOOTER.HEIGHT.DESKTOP + 60}px)`,
      },
      withSubHourGridLines: false,
      renderEvent: (event: any, props: any) => (
        <HoverCard width={280} position="top" closeDelay={0}>
          <HoverCard.Target>
            <UnstyledButton {...props} />
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <EventDetails event={event} />
          </HoverCard.Dropdown>
        </HoverCard>
      ),
    }),
    [],
  );

  const weekViewProps = useMemo(
    () => ({
      intervalMinutes: 30,
      startScrollTime: '09:00:00',
      scrollAreaProps: {
        mah: `calc(100vh - ${SHELL_VALUES.FOOTER.HEIGHT.DESKTOP + 62}px)`,
      },
      weekdayFormat: 'dd',
      highlightToday: true,
      withWeekendDays: true,
      withSubHourGridLines: false,
      renderEvent: (event: any, props: any) => (
        <HoverCard width={280} position="right" closeDelay={0}>
          <HoverCard.Target>
            <UnstyledButton {...props} />
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <EventDetails event={event} />
          </HoverCard.Dropdown>
        </HoverCard>
      ),
    }),
    [],
  );

  const mobileMonthViewProps = useMemo(
    () => ({
      onSelectedDateChange: (value: string | null) => {
        if (value) {
          eventCrud.mobileSelectedDate.current = value; // or new Date(value) if your ref expects Date
        }
      },
      renderHeader: ({ defaultHeader }: { defaultHeader: React.ReactNode }) => (
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
      styles: {
        mobileMonthViewHeader: { paddingLeft: 0, paddingRight: 0 },
        mobileMonthViewCalendar: { paddingLeft: 0, paddingRight: 0 },
        mobileMonthViewEventsList: { paddingLeft: 0, paddingRight: 0 },
      },
    }),
    [eventCrud.mobileSelectedDate, eventCrud.handleCreateMobileEvent],
  );

  const monthViewProps = useMemo(
    () =>
      ({
        withWeekNumbers: false,
        firstDayOfWeek: 1,
        renderEvent: (event: any, props: any) => {
          const { children, className, style, ...others } = props;
          return (
            <HoverCard width={280} position="right" closeDelay={0}>
              <HoverCard.Target>
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
                        backgroundColor: 'var(--event-bg)',
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
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <EventDetails event={event} />
              </HoverCard.Dropdown>
            </HoverCard>
          );
        },
        withAgenda: undefined,
        withEventResize: undefined,
        onEventResize: undefined,
      }) as any,
    [],
  );

  const yearViewProps = useMemo(
    () =>
      ({
        firstDayOfWeek: 1,
        withAgenda: undefined,
        withEventsDragAndDrop: undefined,
        onEventDrop: undefined,
        withEventResize: undefined,
        onEventResize: undefined,
      }) as any,
    [],
  );

  if (events === undefined || calendars === undefined) {
    return <PartialLoading />;
  }

  if (!subViewValue) {
    return null;
  }

  return (
    <>
      <MemoSchedule
        withAgenda
        layout="responsive"
        events={eventItems}
        view={subViewValue as ScheduleViewLevel}
        onViewChange={handleViewChange}
        date={date}
        onDateChange={handleDateChange}
        withEventsDragAndDrop
        onEventDrop={handleEventUpdate}
        withEventResize
        onEventResize={handleEventUpdate}
        withDragSlotSelect
        onTimeSlotClick={eventCrud.scheduleHandlers.onTimeSlotClick}
        onAllDaySlotClick={eventCrud.scheduleHandlers.onAllDaySlotClick}
        onDayClick={eventCrud.scheduleHandlers.onDayClick}
        onSlotDragEnd={eventCrud.scheduleHandlers.onSlotDragEnd}
        onEventClick={eventCrud.scheduleHandlers.onEventClick}
        dayViewProps={dayViewProps}
        weekViewProps={weekViewProps}
        mobileMonthViewProps={mobileMonthViewProps}
        monthViewProps={monthViewProps}
        yearViewProps={yearViewProps}
      />

      <Modal opened={eventCrud.formOpened} onClose={eventCrud.closeForm} size="xl" padding={0}>
        <FormEvent
          modal={true}
          initialData={eventCrud.selectedEventData}
          onClose={eventCrud.closeForm}
        />
      </Modal>
    </>
  );
}
