'use client';

import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { useAutoFocus } from '@/hooks/elements';
import { useFormChatMessage } from '@repo/hooks/form/chat-message';
import {
  ActionIcon,
  Button,
  Group,
  Stack,
  Textarea,
  Tooltip,
} from '@mantine/core';
import { getHotkeyHandler } from '@mantine/hooks';
import {
  IconArrowUp,
  IconBulb,
  IconMicrophone,
  IconPlus,
  IconWorld,
} from '@tabler/icons-react';
import React from 'react';
import { APP_NAME } from '@repo/constants/app';

export default function Chat() {
  const { form, handleSubmit, submitted } = useFormChatMessage();

  const hasInput = (form.values.content || '').trim().length > 0;

  const hasInputProps = {
    icon: hasInput ? IconArrowUp : IconMicrophone,
  };

  const textareaRef = useAutoFocus<HTMLTextAreaElement>();

  return (
    <form onSubmit={form.onSubmit(() => handleSubmit())}>
      <Stack>
        <Textarea
          ref={textareaRef}
          placeholder={`Ask ${APP_NAME.MAI}`}
          autosize
          minRows={2}
          maxRows={6}
          variant="unstyled"
          radius={0}
          value={form.values.content}
          styles={{ input: { paddingRight: 5 } }}
          onChange={(e) => form.setFieldValue('content', e.currentTarget.value)}
          onKeyDown={getHotkeyHandler([
            [
              'Enter',
              (form.values.content || '').length > 0 ? handleSubmit : () => {},
            ],
            [
              'shift+Enter',
              () => {
                const textarea = textareaRef.current;
                if (!textarea) return;

                const { selectionStart, selectionEnd } = textarea;
                const value = form.values.content || '';

                const newValue =
                  value.slice(0, selectionStart) +
                  '\n' +
                  value.slice(selectionEnd);

                form.setFieldValue('content', newValue);

                // Delay to let autosize trigger and DOM reflow
                setTimeout(() => {
                  // Move caret
                  textarea.selectionStart = textarea.selectionEnd =
                    selectionStart + 1;

                  // Then scroll to bottom
                  textarea.scrollTop = textarea.scrollHeight;
                }, 10); // tweak this if needed (e.g., 0–30ms)
              },
            ],
          ])}
        />

        <Group justify="space-between">
          <Group gap={'xs'}>
            <Tooltip
              label={'Upload files and more'}
              withArrow
              position={'bottom'}
            >
              <ActionIcon
                size={ICON_WRAPPER_SIZE}
                radius={'xl'}
                variant="light"
                color="dark"
                c={'var(--mantine-color-text)'}
              >
                <IconPlus size={ICON_SIZE / 1.5} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label={'Search the web'} withArrow position={'bottom'}>
              <Button
                size="xs"
                radius={'xl'}
                variant={'light'}
                color={form.values.search ? 'blue' : 'dark'}
                c={form.values.search ? 'blue' : 'var(--mantine-color-text)'}
                onClick={() => {
                  // if (form.values.reason) {
                  //   form.setFieldValue('reason', !form.values.reason);
                  // }
                  form.setFieldValue('search', !form.values.search);
                }}
                leftSection={
                  <IconWorld
                    size={ICON_SIZE / 1.2}
                    stroke={ICON_STROKE_WIDTH}
                  />
                }
              >
                Search
              </Button>
            </Tooltip>

            {/* <Tooltip
              label={'Think before responding'}
              withArrow
              position={'bottom'}
            >
              <Button
                size="xs"
                radius={'xl'}
                variant={form.getValues().reason ? 'light' : 'outline'}
                color={form.getValues().reason ? 'blue' : 'gray'}
                c={
                  form.getValues().reason ? 'blue' : 'var(--mantine-color-text)'
                }
                onClick={() => {
                  if (form.getValues().search)
                    form.setFieldValue('search', !form.getValues().search);
                  form.setFieldValue('reason', !form.getValues().reason);
                }}
                leftSection={
                  <IconBulb size={ICON_SIZE / 1.2} stroke={ICON_STROKE_WIDTH} />
                }
              >
                Reason
              </Button>
            </Tooltip> */}
          </Group>

          <Group gap={'xs'}>
            <Tooltip
              label={hasInput ? 'Ask' : 'Dictate'}
              withArrow
              position={'bottom'}
            >
              <ActionIcon
                size={ICON_WRAPPER_SIZE}
                radius={'xl'}
                variant={hasInput ? 'filled' : 'light'}
                color={'dark'}
                type={hasInput ? 'submit' : undefined}
                loading={submitted}
              >
                <hasInputProps.icon size={ICON_SIZE / 1.5} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Stack>
    </form>
  );
}
