'use client';

import React, { useMemo } from 'react';
import { useTempChat } from '@/hooks/temp-chat';
import { Group, Paper, Stack, Text, Title } from '@mantine/core';
import { useStoreChat } from '@repo/libraries/zustand/stores/chat';
import { useStoreChatMessage } from '@repo/libraries/zustand/stores/chat-message';
import { ChatMessageRole } from '@repo/types/models/enums';

export default function ChatList({ chatId }: { chatId?: string }) {
  const { chat } = useTempChat();
  const chats = useStoreChat((s) => s.chats);
  const foundChat = useStoreChat((s) => s.chats?.find((c) => c.id == chatId));
  const selectedChat = chatId ? foundChat : chat;
  const chatMessages = useStoreChatMessage((s) => s.chatMessages);
  const currentChatMessages = useMemo(
    () => chatMessages?.filter((cm) => cm.chat_id == selectedChat?.id),
    [chatMessages]
  );

  return (
    <Stack py={'md'} mih={`calc(100vh - ${50 + 155 + 9}px)`}>
      {chats === undefined ? (
        <Text c="dimmed" fz="sm">
          Loading...
        </Text>
      ) : !foundChat ? (
        <Stack gap={0} justify="end" h={'40vh'} align="center">
          <Title order={1} ta={'center'} fz={'1.5rem'}>
            Chat not found
          </Title>

          <Text
            ta={'center'}
            c={'dimmed'}
            fz={'sm'}
            mt={'lg'}
            maw={{ md: '66%' }}
            mb={{ base: 'md', md: 0 }}
          >
            We couldn&apos;t find the chat you&apos;re looking for. It might
            have been deleted or the link may be incorrect.
          </Text>
        </Stack>
      ) : (
        currentChatMessages?.map((m, i) => {
          const user = m.role == ChatMessageRole.USER;

          return (
            <Group key={i} justify={user ? 'end' : undefined}>
              <Paper
                bg={
                  user
                    ? 'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-8))'
                    : undefined
                }
                py={user ? 'xs' : undefined}
                px={user ? 'md' : undefined}
                w={'fit-content'}
                withBorder={false}
                radius={'lg'}
              >
                <Text fz={'sm'}>{m.content}</Text>
              </Paper>
            </Group>
          );
        })
      )}
    </Stack>
  );
}
