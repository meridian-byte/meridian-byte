'use client';

import React from 'react';
import { Box, Container } from '@mantine/core';
import { useStoreView } from '@repo/store';
import { APP_NAMES_ATLAS, SUBVIEW_NAMES } from '@repo/constants';
import { useSubView } from '@repo/store';
import PartialViewStrideTaskList from '@atlas/ui/partial/view/stride/task-list';
import PartialViewJotNoteList from '@atlas/ui/partial/view/jot/note-list';
import PartialViewPaveCalendarList from '@atlas/ui/partial/view/pave/calendar-list';
import ScheduleMain from '@atlas/ui/schedule/main';

export default function App() {
  const viewValue = useStoreView((s) => s.view?.view);

  if (viewValue === undefined) return <>loading</>;

  return (
    <>
      <DisplayNoneWrapper visible={viewValue === APP_NAMES_ATLAS.PAVE}>
        <ViewPave />
      </DisplayNoneWrapper>

      <DisplayNoneWrapper visible={viewValue === APP_NAMES_ATLAS.JOT}>
        <ViewJot />
      </DisplayNoneWrapper>

      <DisplayNoneWrapper visible={viewValue === APP_NAMES_ATLAS.STRIDE}>
        <ViewStride />
      </DisplayNoneWrapper>

      <DisplayNoneWrapper visible={viewValue === APP_NAMES_ATLAS.PRIME}>
        <ViewPrime />
      </DisplayNoneWrapper>

      <DisplayNoneWrapper visible={viewValue === APP_NAMES_ATLAS.TALLY}>
        <ViewTally />
      </DisplayNoneWrapper>

      <DisplayNoneWrapper visible={!viewValue}>
        <LayoutMain>App main</LayoutMain>
      </DisplayNoneWrapper>
    </>
  );
}

function DisplayNoneWrapper({
  visible,
  children,
}: {
  visible: boolean;
  children: React.ReactNode;
}) {
  return <div style={{ display: visible ? 'block' : 'none' }}>{children}</div>;
}

function LayoutMain({
  children,
  options,
}: {
  children: React.ReactNode;
  options?: {
    containerized?: boolean;
  };
}) {
  return (
    <Box>{options?.containerized ? <Container size={'md'}>{children}</Container> : children}</Box>
  );
}

function ViewPave() {
  const { subViewValue } = useSubView();

  if (subViewValue === undefined) return <>loading</>;

  const isCalendarList = subViewValue?.includes('calendar: ');

  return (
    <>
      <DisplayNoneWrapper
        visible={
          subViewValue === SUBVIEW_NAMES.PAVE.DAY ||
          subViewValue === SUBVIEW_NAMES.PAVE.WEEK ||
          subViewValue === SUBVIEW_NAMES.PAVE.MONTH ||
          subViewValue === SUBVIEW_NAMES.PAVE.YEAR
        }
      >
        <LayoutMain>
          <ScheduleMain />
        </LayoutMain>
      </DisplayNoneWrapper>

      <DisplayNoneWrapper visible={!!isCalendarList}>
        <LayoutMain>
          <PartialViewPaveCalendarList />
        </LayoutMain>
      </DisplayNoneWrapper>

      <DisplayNoneWrapper visible={!subViewValue}>
        <LayoutMain>Pave Home</LayoutMain>
      </DisplayNoneWrapper>
    </>
  );
}

function ViewJot() {
  const { subViewValue } = useSubView();

  if (subViewValue === undefined) return <>loading</>;

  const isNoteList = subViewValue?.includes('note: ');

  return (
    <>
      <DisplayNoneWrapper visible={!!isNoteList}>
        <LayoutMain>
          <PartialViewJotNoteList />
        </LayoutMain>
      </DisplayNoneWrapper>

      <DisplayNoneWrapper visible={!subViewValue}>
        <LayoutMain>Jot Home</LayoutMain>
      </DisplayNoneWrapper>
    </>
  );
}

function ViewStride() {
  const { subViewValue } = useSubView();

  if (subViewValue === undefined) return <>loading</>;

  const isTaskList = subViewValue?.includes('list: ');

  return (
    <>
      <DisplayNoneWrapper visible={subViewValue === SUBVIEW_NAMES.STRIDE.INBOX}>
        <LayoutMain>inbox</LayoutMain>
      </DisplayNoneWrapper>

      <DisplayNoneWrapper visible={subViewValue === SUBVIEW_NAMES.STRIDE.TODAY}>
        <LayoutMain>today</LayoutMain>
      </DisplayNoneWrapper>

      <DisplayNoneWrapper visible={subViewValue === SUBVIEW_NAMES.STRIDE.UPCOMING}>
        <LayoutMain>upcoming</LayoutMain>
      </DisplayNoneWrapper>

      <DisplayNoneWrapper visible={subViewValue === SUBVIEW_NAMES.STRIDE.OVERDUE}>
        <LayoutMain>overdue</LayoutMain>
      </DisplayNoneWrapper>

      <DisplayNoneWrapper visible={subViewValue === SUBVIEW_NAMES.STRIDE.COMPLETE}>
        <LayoutMain>complete</LayoutMain>
      </DisplayNoneWrapper>

      <DisplayNoneWrapper visible={!!isTaskList}>
        <LayoutMain>
          <PartialViewStrideTaskList />
        </LayoutMain>
      </DisplayNoneWrapper>

      <DisplayNoneWrapper visible={!subViewValue}>
        <LayoutMain>Stride Home</LayoutMain>
      </DisplayNoneWrapper>
    </>
  );
}

function ViewPrime() {
  const { subViewValue } = useSubView();

  if (subViewValue === undefined) return <>loading</>;

  return <LayoutMain>prime</LayoutMain>;
}

function ViewTally() {
  const { subViewValue } = useSubView();

  if (subViewValue === undefined) return <>loading</>;

  return <LayoutMain>tally</LayoutMain>;
}
