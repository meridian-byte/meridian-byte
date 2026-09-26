'use client';

import {
  ActionIcon,
  Box,
  Center,
  Divider,
  Loader,
  Modal,
  NavLink,
  ScrollArea,
  ScrollAreaAutosize,
  Stack,
  Text,
  TextInput,
  TextInputProps,
  Tooltip,
} from '@mantine/core';
import React, { useState } from 'react';
import {
  useStoreCalendar,
  useStoreEvent,
  useStoreNote,
  useStoreTask,
  useStoreTaskList,
  useStoreView,
  useSubView,
  useViewModal,
} from '@repo/store';
import {
  APP_NAMES_ATLAS,
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  MODAL_VIEW_NAMES,
} from '@repo/constants';
import { LayoutModal } from '@repo/ui';
import { IconBackspace, IconSearch } from '@tabler/icons-react';
import { useDebouncedCallback } from '@mantine/hooks';
import { capitalizeWords } from '@repo/utils';

export default function Search({ children }: { children: React.ReactNode }) {
  const { modalViewValue, closeModalView } = useViewModal();

  const [query, setQuery] = useState('');

  return (
    <>
      <Modal
        opened={(modalViewValue || '').includes(MODAL_VIEW_NAMES.SEARCH)}
        onClose={() => {
          setQuery('');
          closeModalView();
        }}
        centered={false}
        size={'lg'}
        padding={0}
      >
        {/* <LayoutModal props={{ close: closeModalView, title: 'Global Search' }}> */}
        <div>
          <Box p={'xs'}>
            <SearchInput
              setQuery={setQuery}
              placeholder={
                !modalViewValue
                  ? 'Search for anything'
                  : capitalizeWords(modalViewValue.replace('-', ' in '))
              }
            />
          </Box>
          <SearchResults query={query} setQuery={setQuery} />
        </div>
        {/* </LayoutModal> */}
      </Modal>

      <span>{children}</span>
    </>
  );
}

function SearchInput({
  setQuery,
  ...restProps
}: { setQuery: React.Dispatch<React.SetStateAction<string>> } & TextInputProps) {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const searchEmpty = search.trim().length < 1;

  const debounceUpdateQuery = useDebouncedCallback((v: string) => {
    setQuery(v);
    setLoading(false);
  }, 500);

  const handleUpdate = (v: string) => {
    setSearch(v);
    setLoading(true);
    debounceUpdateQuery(v);
  };

  const handleClear = () => {
    setSearch('');
    setQuery('');
  };

  return (
    <TextInput
      value={search}
      onChange={(event) => {
        handleUpdate(event.currentTarget.value);
      }}
      required
      aria-label="Global search"
      placeholder="Search for anything"
      styles={{
        input: {
          backgroundColor: 'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-8))',
        },
      }}
      leftSection={<IconSearch size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
      rightSection={
        loading ? (
          <Loader size={'xs'} type="oval" />
        ) : (
          <Tooltip label={'Clear search'} disabled={searchEmpty}>
            <ActionIcon
              color="red.6"
              variant="subtle"
              size={ICON_WRAPPER_SIZE}
              onClick={handleClear}
              style={{
                transition: '.25s all ease',
                opacity: !searchEmpty ? 1 : 0,
              }}
            >
              <IconBackspace size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>
          </Tooltip>
        )
      }
      {...restProps}
    />
  );
}

function SearchResults({
  query,
  setQuery,
}: {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}) {
  const queryEmpty = query.trim().length < 1;

  const { modalViewValue } = useViewModal();

  const getRender = (appName: string) => {
    let hide = false;

    if (modalViewValue) {
      if (modalViewValue !== MODAL_VIEW_NAMES.SEARCH) {
        if (!modalViewValue.includes(appName)) {
          hide = true;
        }
      }
    }

    return hide;
  };

  return (
    <ScrollAreaAutosize mah={400} scrollbars={'y'}>
      <Box mt={queryEmpty ? 0 : 'xs'}>
        {/* <Box display={getRender(APP_NAMES_ATLAS.PAVE) ? 'none' : undefined}>
        <PartialResultsEvents query={query} setQuery={setQuery} />
        </Box> */}

        <Box display={getRender(APP_NAMES_ATLAS.PAVE) ? 'none' : undefined}>
          <PartialResultsCalendars query={query} setQuery={setQuery} />
        </Box>

        <Box display={getRender(APP_NAMES_ATLAS.JOT) ? 'none' : undefined}>
          <PartialResultsNotes query={query} setQuery={setQuery} />
        </Box>

        {/* <Box display={getRender(APP_NAMES_ATLAS.STRIDE) ? 'none' : undefined}>
        <PartialResultsTasks query={query} setQuery={setQuery} />
        </Box> */}

        <Box display={getRender(APP_NAMES_ATLAS.STRIDE) ? 'none' : undefined}>
          <PartialResultsTaskLists query={query} setQuery={setQuery} />
        </Box>
      </Box>
    </ScrollAreaAutosize>
  );
}

function SectionResults({
  query,
  title,
  options,
  children,
}: {
  query: string;
  title: string;
  options?: { hide?: boolean };
  children: React.ReactNode;
}) {
  const queryEmpty = query.trim().length < 1;

  return (
    <Box display={queryEmpty || options?.hide ? 'none' : undefined}>
      <Divider label={title} labelPosition="left" px={'xs'} />

      <Box display={!queryEmpty ? undefined : 'none'} mb={'xs'}>
        {children}
      </Box>
    </Box>
  );
}

function PartialResultsEvents({
  query,
  setQuery,
}: {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}) {
  const events = useStoreEvent((s) => s.events);
  const eventsWithinParameter = events?.filter((item) => {
    const matchesTitle = item.title.toLowerCase().includes(query.trim().toLowerCase());
    const matchesDescription = !item.description
      ? false
      : item.description.toLowerCase().includes(query.trim().toLowerCase());
    return matchesTitle || matchesDescription;
  });

  return (
    <SectionResults
      query={query}
      title={`Events (${APP_NAMES_ATLAS.PAVE})`}
      options={{ hide: !eventsWithinParameter?.length }}
    >
      {eventsWithinParameter?.map((item) => (
        <div key={item.id}>
          <NavLink
            label={item.title}
            styles={{
              root: {
                padding: '3px var(--mantine-spacing-xs)',
              },
            }}
          />
        </div>
      ))}
    </SectionResults>
  );
}

function PartialResultsCalendars({
  query,
  setQuery,
}: {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}) {
  const calendars = useStoreCalendar((s) => s.calendars);
  const calendarsWithinParameter = calendars?.filter((item) => {
    const matchesTitle = item.title.toLowerCase().includes(query.trim().toLowerCase());
    const matchesDescription = !item.description
      ? false
      : item.description.toLowerCase().includes(query.trim().toLowerCase());
    return matchesTitle || matchesDescription;
  });

  const view = useStoreView((s) => s.view);
  const setView = useStoreView((s) => s.setView);

  const handleSelect = (id: string) => {
    if (view === undefined) return;
    if (view === null) return;

    setQuery('');

    setView({
      ...view,
      modalView: null,
      view: APP_NAMES_ATLAS.PAVE,
      subView: `calendar: ${id}`,
    });
  };

  return (
    <SectionResults
      query={query}
      title={`Calendars (${APP_NAMES_ATLAS.PAVE})`}
      options={{ hide: !calendarsWithinParameter?.length }}
    >
      {calendarsWithinParameter?.map((item) => (
        <div key={item.id}>
          <NavLink
            label={item.title}
            onClick={() => handleSelect(item.id)}
            styles={{ root: { padding: '3px var(--mantine-spacing-xs)' } }}
          />
        </div>
      ))}
    </SectionResults>
  );
}

function PartialResultsNotes({
  query,
  setQuery,
}: {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}) {
  const notes = useStoreNote((s) => s.notes);
  const notesWithinParameter = notes?.filter((item) => {
    const matchesTitle = item.title.toLowerCase().includes(query.trim().toLowerCase());
    const matchesDescription = !item.content
      ? false
      : item.content.toLowerCase().includes(query.trim().toLowerCase());
    return matchesTitle || matchesDescription;
  });

  const view = useStoreView((s) => s.view);
  const setView = useStoreView((s) => s.setView);

  const handleSelect = (id: string) => {
    if (view === undefined) return;
    if (view === null) return;

    setQuery('');

    setView({
      ...view,
      modalView: null,
      view: APP_NAMES_ATLAS.JOT,
      subView: `note: ${id}`,
    });
  };

  return (
    <SectionResults
      query={query}
      title={`Notes (${APP_NAMES_ATLAS.JOT})`}
      options={{ hide: !notesWithinParameter?.length }}
    >
      {!notesWithinParameter?.length ? (
        <Center fz={'sm'} c={'dimmed'} py={'md'}>
          <Text inherit>No notes found</Text>
        </Center>
      ) : (
        notesWithinParameter?.map((item) => (
          <div key={item.id}>
            <NavLink
              label={item.title}
              onClick={() => handleSelect(item.id)}
              styles={{
                root: {
                  padding: '3px var(--mantine-spacing-xs)',
                },
              }}
            />
          </div>
        ))
      )}
    </SectionResults>
  );
}

function PartialResultsTasks({
  query,
  setQuery,
}: {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}) {
  const tasks = useStoreTask((s) => s.tasks);
  const tasksWithinParameter = tasks?.filter((item) => {
    const matchesTitle = item.title.toLowerCase().includes(query.trim().toLowerCase());
    const matchesDescription = !item.description
      ? false
      : item.description.toLowerCase().includes(query.trim().toLowerCase());
    return matchesTitle || matchesDescription;
  });

  return (
    <SectionResults
      query={query}
      title={`Tasks (${APP_NAMES_ATLAS.STRIDE})`}
      options={{ hide: !tasksWithinParameter?.length }}
    >
      {!tasksWithinParameter?.length ? (
        <Center fz={'sm'} c={'dimmed'} py={'md'}>
          <Text inherit>No tasks found</Text>
        </Center>
      ) : (
        tasksWithinParameter?.map((item) => (
          <div key={item.id}>
            <NavLink
              label={item.title}
              styles={{
                root: {
                  padding: '3px var(--mantine-spacing-xs)',
                },
              }}
            />
          </div>
        ))
      )}
    </SectionResults>
  );
}

function PartialResultsTaskLists({
  query,
  setQuery,
}: {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}) {
  const taskLists = useStoreTaskList((s) => s.taskLists);
  const taskListsWithinParameter = taskLists?.filter((item) => {
    const matchesTitle = item.title.toLowerCase().includes(query.trim().toLowerCase());
    const matchesDescription = !item.description
      ? false
      : item.description.toLowerCase().includes(query.trim().toLowerCase());
    return matchesTitle || matchesDescription;
  });

  const view = useStoreView((s) => s.view);
  const setView = useStoreView((s) => s.setView);

  const handleSelect = (id: string) => {
    if (view === undefined) return;
    if (view === null) return;

    setQuery('');

    setView({
      ...view,
      modalView: null,
      view: APP_NAMES_ATLAS.STRIDE,
      subView: `list: ${id}`,
    });
  };

  return (
    <SectionResults
      query={query}
      title={`Task Lists (${APP_NAMES_ATLAS.STRIDE})`}
      options={{ hide: !taskListsWithinParameter?.length }}
    >
      {!taskListsWithinParameter?.length ? (
        <Center fz={'sm'} c={'dimmed'} py={'md'}>
          <Text inherit>No task lists found</Text>
        </Center>
      ) : (
        taskListsWithinParameter?.map((item) => (
          <div key={item.id}>
            <NavLink
              label={item.title}
              onClick={() => handleSelect(item.id)}
              styles={{
                root: {
                  padding: '3px var(--mantine-spacing-xs)',
                },
              }}
            />
          </div>
        ))
      )}
    </SectionResults>
  );
}
