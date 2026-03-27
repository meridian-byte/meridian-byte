'use client';

import React from 'react';
import { Box, Button, Paper, Stack, Text } from '@mantine/core';
import FormChat from '@/components/form/chat';
import LayoutSection from '@repo/components/layout/section';
import { useTempChat } from '@/hooks/temp-chat';
import { IconArchiveOff } from '@tabler/icons-react';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  SECTION_SPACING,
} from '@repo/constants/sizes';
import { useChatActions } from '@repo/hooks/actions/chat';
import { APP_NAME } from '@repo/constants/app';

export default function Chat() {
  const { chat } = useTempChat();
  const { chatArchive } = useChatActions();

  return (
    <LayoutSection id="chat-content" containerized={'md'}>
      <Box px={{ md: SECTION_SPACING * 1.5 }}>
        <Paper
          shadow={chat?.archived ? undefined : 'sm'}
          px={'lg'}
          py={'xs'}
          radius={'lg'}
          withBorder
          style={{
            borderWidth: 2,
            borderStyle: 'solid',
            transition: '0.5s all ease',
            backgroundColor: chat?.archived
              ? 'transparent'
              : chat
                ? 'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-7))'
                : 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))',
          }}
        >
          {chat?.archived ? (
            <Stack align="center" fz={'sm'} c={'dimmed'}>
              <Text inherit ta={'center'}>
                This conversation is archived. To continue, please unarchive it
                first.
              </Text>

              <Button
                leftSection={
                  <IconArchiveOff
                    size={ICON_SIZE / 1.25}
                    stroke={ICON_STROKE_WIDTH}
                  />
                }
                radius={'xl'}
                color="black"
                size="xs"
                onClick={() => chatArchive(chat)}
              >
                Unarchive
              </Button>
            </Stack>
          ) : (
            <FormChat />
          )}
        </Paper>

        <Text ta={'center'} fz={'xs'} c={'dimmed'} py={'xs'}>
          {APP_NAME.MAI} can make mistakes. Check important info.
        </Text>
      </Box>
    </LayoutSection>
  );
}
