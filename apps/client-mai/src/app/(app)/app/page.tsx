'use client';

import React from 'react';
import { Stack, Text, Title } from '@mantine/core';
import LayoutPage from '@repo/components/layout/page';
import LayoutSection from '@repo/components/layout/section';
import ChatList from '@/components/partial/chat-list';
import { useTempChat } from '@/hooks/temp-chat';
import { APP_NAME } from '@repo/constants/app';
import PartialHeaderChat from '@/components/partial/header/chat';
import PartialFooterChat from '@/components/partial/footer/chat';

export default function App() {
  const { chat, chatMessages } = useTempChat();

  return (
    <LayoutPage>
      <PartialHeaderChat />

      <LayoutSection id="chat-content" containerized={'sm'} pb={'xl'}>
        {chatMessages?.length ? (
          <ChatList />
        ) : (
          <Stack gap={0} justify="end" h={'40vh'} align="center">
            <Title
              order={1}
              ta={'center'}
              fz={'1.5rem'}
              style={{
                transition: '0.25s all ease',
                opacity: chat ? 0 : 1,
                height: chat ? 0 : 31.2,
              }}
            >
              What can I help with?
            </Title>

            <Title
              order={1}
              ta={'center'}
              fz={'1.5rem'}
              style={{
                transition: '0.25s all ease',
                opacity: chat ? 1 : 0,
                height: chat ? 31.2 : 0,
              }}
            >
              Temporary Chat
            </Title>

            <Text
              ta={'center'}
              c={'dimmed'}
              fz={'sm'}
              mt={'lg'}
              maw={{ md: '66%' }}
              mb={{ base: 'md', md: 0 }}
              style={{
                transition: '0.25s all ease',
                opacity: chat ? 1 : 0,
              }}
            >
              This chat won&apos;t appear in history, use or update{' '}
              {APP_NAME.MAI}&apos;s memory, or be used to train our models.
            </Text>
          </Stack>
        )}
      </LayoutSection>

      <PartialFooterChat />
    </LayoutPage>
  );
}
