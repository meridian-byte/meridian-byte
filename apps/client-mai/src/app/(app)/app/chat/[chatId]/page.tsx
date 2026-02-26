import React from 'react';
import LayoutPage from '@repo/components/layout/page';
import LayoutSection from '@repo/components/layout/section';
import { typeParams } from '../layout';
import ChatList from '@/components/partial/chat-list';
import PartialHeaderChat from '@/components/partial/header/chat';
import PartialFooterChat from '@/components/partial/footer/chat';
import { Box } from '@mantine/core';

export default async function Chat({
  params,
}: {
  params: Promise<typeParams>;
}) {
  const { chatId } = await params;

  return (
    <LayoutPage>
      <Box
        style={{
          display: !chatId ? 'none' : undefined,
          position: 'sticky',
          top: 0,
          zIndex: 1,
          backgroundColor: 'var(--mantine-color-body)',
        }}
      >
        <PartialHeaderChat />
      </Box>

      <Box pos={'relative'}>
        <LayoutSection id="chat-content" containerized={'sm'}>
          <ChatList chatId={chatId} />
        </LayoutSection>

        <Box
          style={{
            display: !chatId ? 'none' : undefined,
            position: 'sticky',
            bottom: 0,
            zIndex: 1,
            backgroundColor: 'var(--mantine-color-body)',
          }}
        >
          <PartialFooterChat />
        </Box>
      </Box>
    </LayoutPage>
  );
}
