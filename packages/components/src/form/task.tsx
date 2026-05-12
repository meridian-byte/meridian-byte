'use client';

import React from 'react';
import { useFormTask } from '@repo/hooks/form/task';
import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Grid,
  GridCol,
  Group,
  NumberInput,
  ScrollAreaAutosize,
  Stack,
  Text,
  Textarea,
  Title,
  Tooltip,
  Transition,
} from '@mantine/core';
import {
  IconAtom,
  IconBarbell,
  IconBone,
  IconCalendar,
  IconDroplet,
  IconDropletHeart,
  IconGauge,
  IconMan,
  IconScaleOutline,
  IconTrash,
} from '@tabler/icons-react';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { TaskGet } from '@repo/types/models/task';
import { useMediaQuery } from '@mantine/hooks';
import { DateInput } from '@mantine/dates';
import { COLOR_CODES } from '@repo/constants/other';
import ModalConfirm from '../common/modals/confirm';
import { useFormReminder } from '@repo/hooks/form/reminder';
import { useFormRecurringRule } from '@repo/hooks/form/recurring-rule';
import { getRegionalDate } from '@repo/utilities/date-time';
import { useTaskActions } from '@repo/hooks/actions/task';
import InputCheckboxTask from '../common/inputs/checkboxes/task';
import { Alert } from '@repo/types/enums';

export default function Task({
  props,
}: {
  props?: {
    defaultValues?: Partial<TaskGet>;
    close?: () => void;
  };
}) {
  const { form, submitted, handleSubmit } = useFormTask({
    defaultValues: props?.defaultValues,
  });
  const { taskDelete } = useTaskActions();
  const { form: formReminder } = useFormReminder({
    // defaultValues: props?.defaultValues,
  });
  const { form: formRecurringRule } = useFormRecurringRule({
    // defaultValues: props?.defaultValues,
  });

  const mobile = useMediaQuery('(max-width: 36em)');

  return (
    <form
      onSubmit={form.onSubmit(() => {
        handleSubmit();
        if (props?.close) props.close();
      })}
      noValidate
    >
      <Grid gutter={0}>
        <GridCol span={{ base: 12, md: 8 }}>
          <ScrollAreaAutosize mah={400} scrollbars={'y'}>
            <Group gap={'xs'} wrap="nowrap" pt={'md'} align="start">
              <Group mt={8} pl={'md'}>
                <InputCheckboxTask props={{ form }} />
              </Group>

              <Box w={'100%'}>
                <Stack>
                  <Box pr={'md'}>
                    <Textarea
                      w={'100%'}
                      minRows={1}
                      autosize
                      placeholder="Task"
                      variant="unstyled"
                      key={form.key('title')}
                      {...form.getInputProps('title')}
                      // classNames={{ input: classes.title }}
                    />

                    <Textarea
                      w={'100%'}
                      minRows={1}
                      autosize
                      placeholder="Add task description"
                      variant="unstyled"
                      key={form.key('description')}
                      {...form.getInputProps('description')}
                      // classNames={{ input: classes.desc }}
                    />
                  </Box>

                  <Box
                    py={'sm'}
                    px={'md'}
                    style={{
                      position: 'sticky',
                      bottom: 0,
                      zIndex: 1,
                      backgroundColor: 'var(--mantine-color-body)',
                    }}
                  >
                    <Transition
                      mounted={
                        form.isDirty('title') || form.isDirty('description')
                      }
                      keepMounted={true}
                      transition="fade"
                      timingFunction="ease"
                    >
                      {(styles) => (
                        <div style={styles}>
                          <Group justify="end" gap={'xs'}>
                            <ModalConfirm
                              props={{
                                title: 'Discard unsaved changes?',
                                desc: 'Your unsaved changes will be discarded.',
                                onConfirm: () => {
                                  form.reset();
                                  // setTimeout(() => setFocused(false), 500);
                                },
                                onCancel: () => {
                                  // setTimeout(() => setFocused(false), 500);
                                },
                              }}
                            >
                              <Button
                                size="xs"
                                color="gray"
                                variant="light"
                                disabled={submitted}
                              >
                                Cancel
                              </Button>
                            </ModalConfirm>

                            <Button
                              size="xs"
                              loading={submitted}
                              onClick={async () => {
                                if (form.isDirty()) {
                                  await handleSubmit();
                                  form.resetDirty();
                                  // setFocused(false);
                                }

                                form.resetTouched();
                              }}
                            >
                              Save
                            </Button>
                          </Group>
                        </div>
                      )}
                    </Transition>
                  </Box>
                </Stack>
              </Box>
            </Group>
          </ScrollAreaAutosize>
        </GridCol>

        <GridCol
          span={{ base: 12, md: 4 }}
          bg={
            'light-dark(var(--mantine-color-gray-0),var(--mantine-color-dark-8))'
          }
        >
          <ScrollAreaAutosize mah={420} scrollbars={'y'}>
            <Stack justify="space-between">
              <Stack gap={'xs'} p={'md'} pos={'relative'} style={{ zIndex: 0 }}>
                <Stack gap={5}>
                  <Title order={3} fz={'xs'} fw={500} pl={'sm'}>
                    Project
                  </Title>
                  {/* <ComboboxTaskProject
                    props={{
                      formTask: form,
                      inputProps: { width: '100%' },
                    }}
                  /> */}
                </Stack>

                <Stack gap={5}>
                  <Title order={3} fz={'xs'} fw={500} pl={'sm'}>
                    Date
                  </Title>
                  {/* <ComboboxTaskDueDate
                    props={{ form: form, inputProps: { width: '100%' } }}
                  /> */}
                </Stack>

                <Stack gap={5}>
                  <Title order={3} fz={'xs'} fw={500} pl={'sm'}>
                    Reminder
                  </Title>
                  {/* <ComboboxTaskTime
                    props={{ form: form, inputProps: { width: '100%' } }}
                  /> */}
                </Stack>

                <Stack gap={5}>
                  <Title order={3} fz={'xs'} fw={500} pl={'sm'}>
                    Recurrence
                  </Title>
                  {/* <ComboboxTaskRepeat
                    props={{
                      form: {
                        task: form,
                        reminder: formReminder,
                        recurringRule: formRecurringRule,
                      },
                      inputProps: { width: '100%' },
                    }}
                  /> */}
                </Stack>

                <Stack gap={5}>
                  <Title order={3} fz={'xs'} fw={500} pl={'sm'}>
                    Priority
                  </Title>
                  {/* <ComboboxTaskPriority
                    props={{
                      formTask: form,
                      inputProps: { width: '100%' },
                    }}
                  /> */}
                </Stack>
              </Stack>

              <Box
                style={{
                  position: 'sticky',
                  bottom: 0,
                  zIndex: 1,
                  backgroundColor:
                    'light-dark(var(--mantine-color-gray-0),var(--mantine-color-dark-8))',
                }}
              >
                <Divider />

                <Box
                  fz={'xs'}
                  px={'md'}
                  py={'sm'}
                  c={'dimmed'}
                  style={{ zIndex: 1 }}
                >
                  <Group justify="space-between">
                    <Text component="span" inherit>
                      Created on{' '}
                      {props?.defaultValues?.created_at
                        ? getRegionalDate(props?.defaultValues?.created_at).date
                        : ''}
                    </Text>

                    <ModalConfirm
                      props={{
                        title: 'Delete Task?',
                        desc: `The '${props?.defaultValues?.title}' task will be permanently deleted.`,
                        variant: Alert.DANGER,
                        onConfirm: () => {
                          if (props?.defaultValues)
                            taskDelete(props.defaultValues as TaskGet);
                        },
                      }}
                    >
                      <ActionIcon
                        size={ICON_WRAPPER_SIZE}
                        color="red.6"
                        variant="subtle"
                      >
                        <IconTrash
                          size={ICON_SIZE}
                          stroke={ICON_STROKE_WIDTH}
                        />
                      </ActionIcon>
                    </ModalConfirm>
                  </Group>
                </Box>
              </Box>
            </Stack>
          </ScrollAreaAutosize>
        </GridCol>
      </Grid>
    </form>
  );
}
