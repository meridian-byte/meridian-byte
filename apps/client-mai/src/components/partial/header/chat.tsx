'use client';

import React, { useMemo, useState } from 'react';
import {
  ActionIcon,
  Avatar,
  Button,
  Grid,
  GridCol,
  Group,
  Skeleton,
  Text,
  Tooltip,
} from '@mantine/core';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import {
  IconBubbleText,
  IconDotsVertical,
  IconInfoCircle,
  IconShare,
} from '@tabler/icons-react';
import { useTempChat } from '@/hooks/temp-chat';
import { usePathname } from 'next/navigation';
import { extractUuidFromParam } from '@repo/utilities/url';
import MenuChatNavlink from '@/components/common/menus/chat-navlink';
import { APP_NAME } from '@repo/constants/app';
import { useStoreChat } from '@repo/libraries/zustand/stores/chat';

export default function Chat() {
  const chats = useStoreChat((s) => s.chats);
  const { chat, chatMessages, disable, enable } = useTempChat();
  const pathname = usePathname();
  const chatId = extractUuidFromParam(pathname);
  const [menuOpened, setMenuOpened] = useState(false);

  return (
    <Group p={'xs'} grow>
      <Grid gutter={0} align="center">
        <GridCol span={{ md: 4 }}></GridCol>

        <GridCol span={{ md: 4 }}>
          <Group
            justify="center"
            gap={'xs'}
            style={{
              transition: '0.25s all ease',
              opacity: chat && !!chatMessages?.length ? 1 : 0,
            }}
          >
            <Group>
              <IconBubbleText
                size={ICON_SIZE / 1.25}
                stroke={ICON_STROKE_WIDTH}
              />
            </Group>

            <Text inherit fz={'sm'}>
              Temporary Chat
            </Text>

            <Tooltip
              label={`Temporary chats won't appear in your history, and ${APP_NAME.MAI} won't remember anything you talk about.`}
              multiline
              w={240}
              fz={'xs'}
              position="bottom"
              withArrow
            >
              <Group>
                <IconInfoCircle
                  size={ICON_SIZE / 1.25}
                  stroke={ICON_STROKE_WIDTH}
                />
              </Group>
            </Tooltip>
          </Group>
        </GridCol>

        <GridCol span={{ md: 4 }}>
          <Group gap={'xs'} justify="end">
            {chatId ? (
              <>
                <Button
                  color={'dark'}
                  variant={'light'}
                  radius={'xl'}
                  size="xs"
                  leftSection={
                    <IconShare
                      size={ICON_SIZE / 1.25}
                      stroke={ICON_STROKE_WIDTH}
                    />
                  }
                >
                  Share
                </Button>

                <MenuChatNavlink
                  opened={menuOpened}
                  setOpened={setMenuOpened}
                  chatId={chatId}
                  position="bottom-end"
                >
                  <Group>
                    <ActionIcon
                      size={ICON_WRAPPER_SIZE}
                      color="dark"
                      variant="subtle"
                      radius={'xl'}
                    >
                      <IconDotsVertical
                        size={ICON_SIZE}
                        stroke={ICON_STROKE_WIDTH}
                      />
                    </ActionIcon>
                  </Group>
                </MenuChatNavlink>
              </>
            ) : chats === undefined ? (
              <Skeleton w={112} h={30} />
            ) : (
              (!chat || chatMessages?.length == 0) && (
                <Button
                  color={chat ? 'black' : 'gray'}
                  c={chat ? undefined : 'var(--mantine-color-text)'}
                  variant={chat ? 'filled' : 'outline'}
                  style={{
                    transition: '0.25s all ease',
                  }}
                  radius={'xl'}
                  size="xs"
                  leftSection={
                    <IconBubbleText
                      size={ICON_SIZE / 1.25}
                      stroke={ICON_STROKE_WIDTH}
                    />
                  }
                  onClick={() => {
                    if (chat) {
                      disable();
                    } else {
                      enable();
                    }
                  }}
                >
                  Temporary
                </Button>
              )
            )}
          </Group>
        </GridCol>
      </Grid>
    </Group>
  );
}
