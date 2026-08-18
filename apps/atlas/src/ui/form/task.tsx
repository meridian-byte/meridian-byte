'use client';

/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  Flex,
  Grid,
  GridCol,
  Group,
  ScrollArea,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useAppshellChild, useFormTask } from '@repo/hooks';
import { Priority, TaskGet } from '@repo/types';
import { useStoreTaskList, useSubView, useViewAside, useViewModal } from '@repo/store';
import { DateInput } from '@mantine/dates';
import { IconCalendarEvent, IconCategory, IconFlag } from '@tabler/icons-react';
import { ASIDE_VIEW_NAMES, ICON_SIZE, ICON_STROKE_WIDTH, SUBVIEW_NAMES } from '@repo/constants';
import { capitalizeWords, getNextWeek, getTomorrow } from '@repo/utils';
import dayjs from 'dayjs';

export default function Task({
  defaultValues,
  onUnmount,
  options,
}: {
  defaultValues?: Partial<TaskGet>;
  onUnmount?: React.Dispatch<React.SetStateAction<boolean>>;
  options?: { modal?: boolean };
}) {
  const [checked, setChecked] = useState(true);

  const { form, submitted, handleSubmit, views, taskListId } = useFormTask({
    options: { closeWhenDone: checked },
    defaultValues,
  });

  const { closeModalView } = useViewModal();
  const { asideViewValue } = useViewAside();
  const { handleToggleChildAside } = useAppshellChild();

  const taskLists = useStoreTaskList((s) => s.taskLists);

  const creatingTask = !defaultValues?.updatedAt;

  const sharedPadding = 'md';
  const sharedHeight = options?.modal ? 400 : undefined;

  function InputTaskList() {
    return (
      <div>
        {taskLists === undefined ? (
          <>loading</>
        ) : (
          <Select
            aria-label={'Task list'}
            placeholder={views.inboxView ? 'Inbox' : 'Task list'}
            size="xs"
            clearable
            searchable
            disabled={creatingTask && (views.inboxView || !!taskListId)}
            {...form.getInputProps('taskListId')}
            leftSection={<IconCategory size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />}
            data={(taskLists || []).map((tli) => {
              return {
                value: tli.id,
                label: tli.title,
              };
            })}
          />
        )}
      </div>
    );
  }

  function TaskProperties() {
    return (
      <Stack h={sharedHeight} gap={0}>
        <ScrollArea flex={1}>
          <Flex
            gap={'xs'}
            align={options?.modal ? undefined : 'center'}
            direction={options?.modal ? 'column' : 'row'}
            p={options?.modal ? sharedPadding : undefined}
            // mih={'100vh'}
          >
            {options?.modal && <InputTaskList />}

            <DateInput
              aria-label={'Due date'}
              placeholder="Due date"
              size="xs"
              clearable
              disabled={creatingTask && views.todayView}
              minDate={
                creatingTask && views.upcomingView
                  ? dayjs(getTomorrow()).format('YYYY-MM-DD')
                  : undefined
              }
              {...form.getInputProps('dueDate')}
              leftSection={<IconCalendarEvent size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />}
            />

            <Select
              aria-label="Priority"
              placeholder="Priority"
              size="xs"
              clearable
              {...form.getInputProps('priority')}
              leftSection={<IconFlag size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />}
              data={[
                {
                  value: Priority.URGENT_IMPORTANT,
                  label: capitalizeWords(Priority.URGENT_IMPORTANT),
                },
                {
                  value: Priority.URGENT_UNIMPORTANT,
                  label: capitalizeWords(Priority.URGENT_UNIMPORTANT),
                },
                {
                  value: Priority.NOT_URGENT_IMPORTANT,
                  label: capitalizeWords(Priority.NOT_URGENT_IMPORTANT),
                },
                {
                  value: Priority.NOT_URGENT_UNIMPORTANT,
                  label: capitalizeWords(Priority.NOT_URGENT_UNIMPORTANT),
                },
              ]}
            />
          </Flex>
        </ScrollArea>

        <Divider my={options?.modal ? undefined : sharedPadding} />

        <Group
          justify={options?.modal ? 'end' : 'space-between'}
          gap="xs"
          p={options?.modal ? sharedPadding : undefined}
        >
          {!options?.modal && <InputTaskList />}

          <Group gap={'xs'}>
            <Button
              disabled={submitted}
              variant="default"
              onClick={() => {
                if (onUnmount) {
                  onUnmount(false);
                } else {
                  if (!defaultValues?.updatedAt) {
                    handleToggleChildAside();
                  } else {
                    closeModalView();
                  }
                }
              }}
            >
              {'Close'}
            </Button>

            <Button type="submit" loading={submitted}>
              {submitted
                ? defaultValues?.updatedAt
                  ? 'Saving'
                  : 'Adding'
                : defaultValues?.updatedAt
                  ? 'Save'
                  : 'Add'}
            </Button>
          </Group>
        </Group>
      </Stack>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={form.onSubmit(() => {
        handleSubmit();
        if (onUnmount) onUnmount(false);
      })}
      noValidate
    >
      <Grid gap={0}>
        <GridCol
          span={{ base: 12, md: options?.modal ? 8 : 12 }}
          bg={
            options?.modal
              ? 'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-8))'
              : undefined
          }
        >
          <ScrollArea h={sharedHeight} p={sharedPadding}>
            <Grid gap={0}>
              <GridCol span={options?.modal ? 1 : 0.5}>
                <Group pl={options?.modal ? 5 : 0}>
                  <Checkbox
                    aria-label={'Complete'}
                    defaultChecked={form.values.complete}
                    {...form.getInputProps('complete')}
                    disabled={creatingTask && views.completeView}
                    size="sm"
                    radius={99}
                    mt={8}
                  />
                </Group>
              </GridCol>

              <GridCol span={options?.modal ? 11 : 11.5}>
                <Stack gap={'xs'}>
                  <div>
                    <TextInput
                      required
                      aria-label={'Title'}
                      placeholder="Title"
                      size="sm"
                      variant="unstyled"
                      styles={{
                        input: {
                          backgroundColor: 'transparent',
                          fontWeight: 'bold',
                        },
                      }}
                      {...form.getInputProps('title')}
                    />

                    <div>
                      <Textarea
                        aria-label={'Description'}
                        placeholder="Description"
                        size="sm"
                        variant="unstyled"
                        styles={{
                          input: {
                            backgroundColor: 'transparent',
                            fontWeight: '500',
                          },
                        }}
                        {...form.getInputProps('description')}
                        autosize
                        minRows={1}
                        maxRows={options?.modal ? undefined : 5}
                      />

                      <Group
                        justify="end"
                        fz={'xs'}
                        c={'dimmed'}
                        opacity={(form.values.description || '').trim().length > 0 ? 1 : 0}
                        style={{ transition: 'opacity ease .25s' }}
                      >
                        <Text inherit>
                          {(form.values.description || '').trim().length}/{2048}
                        </Text>
                      </Group>
                    </div>
                  </div>

                  {!options?.modal && <TaskProperties />}

                  {!defaultValues?.updatedAt &&
                    asideViewValue == ASIDE_VIEW_NAMES.NEW.STRIDE.TASK && (
                      <div>
                        <Checkbox
                          label={'Close when done'}
                          checked={checked}
                          onChange={(event) => setChecked(event.currentTarget.checked)}
                          mt={'xs'}
                        />
                      </div>
                    )}
                </Stack>
              </GridCol>
            </Grid>
          </ScrollArea>
        </GridCol>

        {options?.modal && (
          <GridCol span={{ base: 12, md: 4 }}>
            <TaskProperties />
          </GridCol>
        )}
      </Grid>
    </Box>
  );
}
