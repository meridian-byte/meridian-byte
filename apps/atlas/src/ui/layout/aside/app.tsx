'use client';

import React from 'react';
import { APP_NAMES_ATLAS, ASIDE_VIEW_NAMES, ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants';
import { Box, Divider, NavLink, Title } from '@mantine/core';
import {
  IconCalendar,
  IconCalendarEvent,
  IconCheckbox,
  IconFolder,
  IconListCheck,
  IconNote,
  IconPlus,
} from '@tabler/icons-react';
import { useNoteActions, useViewAside } from '@repo/store';
import FormCalendar from '@atlas/ui/form/calendar';
import FormEvent from '@atlas/ui/form/event';
import FormTaskList from '@atlas/ui/form/task-list';
import { useAppshellChild } from '@repo/hooks';

export default function App() {
  const { asideViewValue, showAsideViewPave, showAsideViewJot, showAsideViewStride } =
    useViewAside();

  const { handleToggleChildAside } = useAppshellChild();

  const { noteCreate } = useNoteActions();

  const createItems = [
    {
      title: APP_NAMES_ATLAS.PAVE,
      items: [
        {
          icon: IconCalendarEvent,
          label: 'Event',
          action: () => showAsideViewPave(ASIDE_VIEW_NAMES.NEW.PAVE.EVENT),
        },
        {
          icon: IconCalendar,
          label: 'Calendar',
          action: () => showAsideViewPave(ASIDE_VIEW_NAMES.NEW.PAVE.CALENDAR),
        },
      ],
    },
    {
      title: APP_NAMES_ATLAS.JOT,
      items: [
        {
          icon: IconNote,
          label: 'Note',
          action: () => {
            noteCreate();
            handleToggleChildAside();
          },
        },
        {
          icon: IconFolder,
          label: 'Note Folder',
          action: () => showAsideViewJot(ASIDE_VIEW_NAMES.NEW.JOT.FOLDER),
        },
      ],
    },
    {
      title: APP_NAMES_ATLAS.STRIDE,
      items: [
        {
          icon: IconCheckbox,
          label: 'Task',
          action: () => showAsideViewStride(ASIDE_VIEW_NAMES.NEW.STRIDE.TASK),
        },
        {
          icon: IconListCheck,
          label: 'Task List',
          action: () => showAsideViewStride(ASIDE_VIEW_NAMES.NEW.STRIDE.TASK_LIST),
        },
      ],
    },
  ];

  let resolvedItems = createItems;

  if (asideViewValue === ASIDE_VIEW_NAMES.NEW.PAVE.ITEM) {
    resolvedItems = [createItems[0]];
  } else if (asideViewValue === ASIDE_VIEW_NAMES.NEW.JOT.ITEM) {
    resolvedItems = [createItems[1]];
  } else if (asideViewValue === ASIDE_VIEW_NAMES.NEW.STRIDE.ITEM) {
    resolvedItems = [createItems[2]];
  }

  const getAsideTitle = (view: string) => {
    switch (view) {
      case ASIDE_VIEW_NAMES.NEW.PAVE.EVENT:
        return 'Add Event';
      case ASIDE_VIEW_NAMES.NEW.PAVE.CALENDAR:
        return 'Add Calendar';
      case ASIDE_VIEW_NAMES.NEW.JOT.NOTE:
        return 'Add Note';
      case ASIDE_VIEW_NAMES.NEW.JOT.FOLDER:
        return 'Add Note Folder';
      case ASIDE_VIEW_NAMES.NEW.STRIDE.TASK:
        return 'Add Task';
      case ASIDE_VIEW_NAMES.NEW.STRIDE.TASK_LIST:
        return 'Add Task List';
      default:
        return 'Add Quick Item';
    }
  };

  function LayoutAsideSection({
    viewKey,
    children,
  }: {
    viewKey: string;
    children: React.ReactNode;
  }) {
    if (asideViewValue === undefined) return <>loading</>;
    if (!asideViewValue) return null;

    // If the active state matches this viewKey (or falls back to default panel)
    const isVisible =
      asideViewValue === viewKey ||
      (viewKey === 'DEFAULT' &&
        ![
          ASIDE_VIEW_NAMES.NEW.PAVE.EVENT,
          ASIDE_VIEW_NAMES.NEW.PAVE.CALENDAR,
          ASIDE_VIEW_NAMES.NEW.JOT.NOTE,
          ASIDE_VIEW_NAMES.NEW.JOT.FOLDER,
          ASIDE_VIEW_NAMES.NEW.STRIDE.TASK,
          ASIDE_VIEW_NAMES.NEW.STRIDE.TASK_LIST,
        ].includes(asideViewValue));

    return (
      <div style={{ display: isVisible ? 'block' : 'none' }}>
        <Box p={'xs'}>
          <Title order={1} fz={'md'} fw={500}>
            {getAsideTitle(asideViewValue)}
          </Title>
        </Box>

        <Divider size={3} />

        <div>{children}</div>
      </div>
    );
  }

  return (
    <>
      {/* Pave Views */}
      <LayoutAsideSection viewKey={ASIDE_VIEW_NAMES.NEW.PAVE.EVENT}>
        <div>
          <FormEvent />
        </div>
      </LayoutAsideSection>

      <LayoutAsideSection viewKey={ASIDE_VIEW_NAMES.NEW.PAVE.CALENDAR}>
        <div>
          <FormCalendar />
        </div>
      </LayoutAsideSection>

      {/* Jot Views */}
      <LayoutAsideSection viewKey={ASIDE_VIEW_NAMES.NEW.JOT.NOTE}>
        <div>add note</div>
      </LayoutAsideSection>

      <LayoutAsideSection viewKey={ASIDE_VIEW_NAMES.NEW.JOT.FOLDER}>
        <div>add note folder</div>
      </LayoutAsideSection>

      {/* Stride Views */}
      <LayoutAsideSection viewKey={ASIDE_VIEW_NAMES.NEW.STRIDE.TASK}>
        <div>add task</div>
      </LayoutAsideSection>

      <LayoutAsideSection viewKey={ASIDE_VIEW_NAMES.NEW.STRIDE.TASK_LIST}>
        <FormTaskList />
      </LayoutAsideSection>

      {/* Fallback / Default Navigation Views */}
      <LayoutAsideSection viewKey="DEFAULT">
        <div>
          {resolvedItems.map((gi, i) => (
            <React.Fragment key={gi.title}>
              {i > 0 && <Divider />}

              <div>
                <Box px={'xs'} py={5}>
                  <Title order={2} fz={'sm'} fw={500}>
                    {gi.title}
                  </Title>
                </Box>

                <Divider />

                {gi.items.map((ci, i) => (
                  <React.Fragment key={ci.label}>
                    {i > 0 && <Divider />}

                    <NavLink
                      label={`Add ${ci.label}`}
                      leftSection={
                        <ci.icon
                          size={ICON_SIZE - 4}
                          stroke={ICON_STROKE_WIDTH}
                          style={{ marginTop: 2 }}
                        />
                      }
                      rightSection={<IconPlus size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />}
                      onClick={ci.action}
                      color="gray"
                      px={'xs'}
                      py={3}
                      fw={500}
                      styles={{ label: { fontSize: 'var(--mantine-font-size-xs)' } }}
                    />
                  </React.Fragment>
                ))}
              </div>
            </React.Fragment>
          ))}
        </div>
        <Divider />
      </LayoutAsideSection>
    </>
  );
}
