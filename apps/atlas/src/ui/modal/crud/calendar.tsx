'use client';

import { Group, Modal, Text } from '@mantine/core';
import React from 'react';
import { useViewModal } from '@repo/store';
import { MODAL_VIEW_NAMES } from '@repo/constants';
import FormCalendar from '@atlas/ui/form/calendar';
import { extractUuidFromParam } from '@repo/utils';
import { useCalendarActions, useStoreCalendar } from '@repo/store';
import { Alert, CalendarGet } from '@repo/types';
import { ButtonConfirmCancel, LayoutModal } from '@repo/ui';

export default function Calendar({ children }: { children: React.ReactNode }) {
  const { modalViewValue, closeModalView, calendarObject } = useGetCalendarObject();

  return (
    <>
      <Modal
        opened={!!modalViewValue?.includes(MODAL_VIEW_NAMES.CRUD.PAVE.CALENDAR.UPDATE)}
        onClose={closeModalView}
      >
        <FormCalendar defaultValues={calendarObject} />
      </Modal>

      <Modal
        opened={!!modalViewValue?.includes(MODAL_VIEW_NAMES.CRUD.PAVE.CALENDAR.DELETE)}
        onClose={closeModalView}
      >
        <CalendarDelete calendar={calendarObject} onClose={closeModalView} />
      </Modal>

      <span>{children}</span>
    </>
  );
}

const useGetCalendarObject = () => {
  const { modalViewValue, closeModalView } = useViewModal();
  const calendars = useStoreCalendar((s) => s.calendars);
  const calendarId = extractUuidFromParam(modalViewValue || '');
  const calendarObject = calendars?.find((c) => c.id === calendarId);

  return { modalViewValue, closeModalView, calendarObject };
};

function CalendarDelete({ calendar, onClose }: { calendar?: CalendarGet; onClose: () => void }) {
  const { calendarDelete } = useCalendarActions();

  return (
    <LayoutModal props={{ title: 'Delete Calendar', close: onClose, variant: Alert.WARNING }}>
      <div>
        <Text inherit>
          The calendar{' '}
          <Text component="em" inherit fw={500}>
            {calendar?.title}
          </Text>{' '}
          will be deleted. The events in this calendar will be preserved.
        </Text>

        <Group justify="end" mt={'md'}>
          <ButtonConfirmCancel
            options={{
              onCancel: onClose,
              onConfirm: () => {
                if (calendar) calendarDelete(calendar);
              },
            }}
          />
        </Group>
      </div>
    </LayoutModal>
  );
}
