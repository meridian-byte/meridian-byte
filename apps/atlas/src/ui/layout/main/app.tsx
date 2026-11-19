'use client';

import React, { memo } from 'react';
import { Box, Center, Container, Loader } from '@mantine/core';
import { useStoreView } from '@repo/store';
import { APP_NAMES_ATLAS, SUBVIEW_NAMES } from '@repo/constants';
import { useSubView } from '@repo/store';
import PartialViewStrideTaskList from '@atlas/ui/partial/view/stride/task-list';
import PartialViewJotNoteList from '@atlas/ui/partial/view/jot/note-list';
import PartialViewPaveCalendarList from '@atlas/ui/partial/view/pave/calendar-list';
import ScheduleMain from '@atlas/ui/schedule/main';
import { SHELL_VALUES } from '@atlas/constants';
import PartialViewPaveHome from '@atlas/ui/partial/view/pave/home';
import PartialViewJotHome from '@atlas/ui/partial/view/jot/home';
import PartialViewStrideHome from '@atlas/ui/partial/view/stride/home';

import { useBreakpointFlags } from '@repo/hooks';

const MemoViewPave = memo(ViewPave);
const MemoViewJot = memo(ViewJot);
const MemoViewStride = memo(ViewStride);
const MemoViewPrime = memo(ViewPrime);
const MemoViewTally = memo(ViewTally);

export default function App() {
  const viewValue = useStoreView((s) => s.view?.view);

  if (viewValue === undefined) return <Loading />;

  switch (viewValue) {
    case APP_NAMES_ATLAS.PAVE:
      return <MemoViewPave />;
    case APP_NAMES_ATLAS.JOT:
      return <MemoViewJot />;
    case APP_NAMES_ATLAS.STRIDE:
      return <MemoViewStride />;
    case APP_NAMES_ATLAS.PRIME:
      return <MemoViewPrime />;
    case APP_NAMES_ATLAS.TALLY:
      return <MemoViewTally />;
    default:
      return (
        <LayoutMain>
          <div>App main</div>
        </LayoutMain>
      );
  }
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

const LayoutMain = memo(function LayoutMain({
  children,
  options,
}: {
  children: React.ReactNode;
  options?: {
    containerized?: boolean;
    withoutPadding?: boolean;
  };
}) {
  const { ready } = useBreakpointFlags();

  if (!ready) {
    return null;
  }

  return (
    <Box p={options?.withoutPadding ? undefined : 'xs'}>
      {options?.containerized ? <Container size="md">{children}</Container> : children}
    </Box>
  );
});

function Loading() {
  return (
    <Center mih={`calc(100vh - ${SHELL_VALUES.FOOTER.HEIGHT.DESKTOP}px)`}>
      <Loader />
    </Center>
  );
}

const MemoScheduleMain = memo(ScheduleMain);
const MemoPartialViewPaveCalendarList = memo(PartialViewPaveCalendarList);
const MemoPartialViewPaveHome = memo(PartialViewPaveHome);

function ViewPave() {
  const subViewValue = useStoreView((s) => s.view?.subView);

  if (subViewValue === undefined) return <Loading />;

  const isScheduleView =
    subViewValue === SUBVIEW_NAMES.PAVE.DAY ||
    subViewValue === SUBVIEW_NAMES.PAVE.WEEK ||
    subViewValue === SUBVIEW_NAMES.PAVE.MONTH ||
    subViewValue === SUBVIEW_NAMES.PAVE.YEAR;

  if (isScheduleView) {
    return (
      <LayoutMain>
        <MemoScheduleMain />
      </LayoutMain>
    );
  }

  if (subViewValue?.includes('calendar: ')) {
    return (
      <LayoutMain>
        <MemoPartialViewPaveCalendarList />
      </LayoutMain>
    );
  }

  return (
    <LayoutMain>
      <MemoPartialViewPaveHome />
    </LayoutMain>
  );
}

const MemoPartialViewJotNoteList = memo(PartialViewJotNoteList);
const MemoPartialViewJotHome = memo(PartialViewJotHome);

function ViewJot() {
  const subViewValue = useStoreView((s) => s.view?.subView);

  if (subViewValue === undefined) return <Loading />;

  if (subViewValue?.includes('note: ')) {
    return (
      <LayoutMain options={{ withoutPadding: true }}>
        <MemoPartialViewJotNoteList />
      </LayoutMain>
    );
  }

  return (
    <LayoutMain>
      <MemoPartialViewJotHome />
    </LayoutMain>
  );
}

const MemoPartialViewStrideTaskList = memo(PartialViewStrideTaskList);
const MemoPartialViewStrideHome = memo(PartialViewStrideHome);

const TASK_LIST_SUBVIEWS = new Set<string>([
  SUBVIEW_NAMES.STRIDE.INBOX,
  SUBVIEW_NAMES.STRIDE.ALL,
  SUBVIEW_NAMES.STRIDE.TODAY,
  SUBVIEW_NAMES.STRIDE.UPCOMING,
  SUBVIEW_NAMES.STRIDE.OVERDUE,
  SUBVIEW_NAMES.STRIDE.COMPLETE,
]);

function isStrideTaskListView(subView: string): boolean {
  return TASK_LIST_SUBVIEWS.has(subView) || subView.includes('list: ');
}

function ViewStride() {
  const subViewValue = useStoreView((s) => s.view?.subView);

  if (subViewValue === undefined) return <Loading />;

  if (subViewValue && isStrideTaskListView(subViewValue)) {
    return (
      <LayoutMain>
        <MemoPartialViewStrideTaskList />
      </LayoutMain>
    );
  }

  return (
    <LayoutMain>
      <MemoPartialViewStrideHome />
    </LayoutMain>
  );
}

function ViewPrime() {
  const { subViewValue } = useSubView();

  if (subViewValue === undefined) return <Loading />;

  return <LayoutMain>prime</LayoutMain>;
}

function ViewTally() {
  const { subViewValue } = useSubView();

  if (subViewValue === undefined) return <Loading />;

  return <LayoutMain>tally</LayoutMain>;
}
