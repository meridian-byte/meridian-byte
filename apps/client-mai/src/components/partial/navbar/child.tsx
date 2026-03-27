'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActionIcon,
  Box,
  Divider,
  Group,
  NavLink,
  Skeleton,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from '@mantine/hooks';
import Link from 'next/link';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  WEEK,
} from '@repo/constants/sizes';
import { IconFilePlus } from '@tabler/icons-react';
import InputTextRename from '@repo/components/common/inputs/text/rename';
import { useStoreAppShell } from '@repo/libraries/zustand/stores/shell';
import { useChatActions } from '@repo/hooks/actions/chat';
import { useStoreChat } from '@repo/libraries/zustand/stores/chat';
import { AppShell } from '@repo/types/components';
import { setCookieClient } from '@repo/utilities/cookie-client';
import { COOKIE_NAME } from '@repo/constants/names';
import MenuChatSide from '@repo/components/common/menus/chat/side';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';

export default function Child() {
  const appshell = useStoreAppShell((s) => s.appshell);
  const setAppShell = useStoreAppShell((s) => s.setAppShell);
  const desktop = useMediaQuery('(min-width: 62em)');
  const chats = useStoreChat((s) => s.chats);
  const router = useRouter();

  const {
    chatCreate,
    chatUpdate,
    chatDelete,
    startChatRename,
    chatInputRefs,
    chatEditing,
    chatEditingId,
    setChatEditingState,
  } = useChatActions();

  const [paramChatId, setParamChatId] = useState('');

  const handleAppshellChange = (params: AppShell) => {
    if (!appshell) return;

    setAppShell(params);

    setCookieClient(COOKIE_NAME.APP_SHELL, params, {
      expiryInSeconds: WEEK,
    });
  };

  const ChatComponent = React.memo(function ChatComponent({
    props,
  }: {
    props: { chatId: string };
  }) {
    const item = useStoreChat((s) =>
      s.chats?.find((n) => n.id === props.chatId)
    );

    const menuProps = useMemo(
      () => ({
        deleteChat: chatDelete,
        startRename: startChatRename,
      }),
      [chatDelete, startChatRename]
    );

    const navLinkStyles = {
      root: {
        borderRadius: 'var(--mantine-radius-md)',
        padding:
          'calc(var(--mantine-spacing-xs) / 4) var(--mantine-spacing-xs)',
      },
      label: {
        fontSize: 'var(--mantine-font-size-sm)',
        fontWeight: 'normal',
      },
    };

    const RenameMemo = React.memo(InputTextRename) as typeof InputTextRename;

    const renameProps = useMemo(
      () => ({
        editing: chatEditing,
        editingId: chatEditingId,
        setEditing: setChatEditingState,
        updateItem: chatUpdate,
        placeholder: 'New Chat',
      }),
      [chatEditing, chatUpdate]
    );

    return !item ? null : (
      <MenuChatSide item={item} menuProps={menuProps}>
        <NavLink
          component={Link}
          href={`/app/chat/${item.id}`}
          active={paramChatId === item.id}
          label={
            !renameProps.editing || renameProps.editingId !== item.id ? (
              <Group mih={30}>
                <Text component="span" inherit lineClamp={1}>
                  {item.title}
                </Text>
              </Group>
            ) : (
              <RenameMemo
                ref={(el) => {
                  chatInputRefs.current[item.id] = el;
                }}
                item={item}
                renameProps={renameProps}
              />
            )
          }
          onClick={(e) => {
            if (chatEditing) e.preventDefault();

            if (desktop) return;
            if (!appshell) return;

            setAppShell({
              ...appshell,
              child: { ...appshell.child, navbar: false },
            });
          }}
          styles={navLinkStyles}
        />
      </MenuChatSide>
    );
  });

  const InputTextRenameMemo = React.memo(
    InputTextRename
  ) as typeof InputTextRename;

  return (
    <Stack p={'xs'} gap={5} style={{ zIndex: 0 }} mih={'200vh'}>
      {chats === undefined ? (
        <>
          <Skeleton h={35} />
          <Skeleton h={35} />
          <Skeleton h={35} />
        </>
      ) : (
        <>
          {sortArray(chats || [], (i) => i.created_at, Order.DESCENDING).map(
            (n) => {
              return (
                <div key={n.id}>
                  <ChatComponent props={{ chatId: n.id }} />
                </div>
              );
            }
          )}
        </>
      )}
    </Stack>
  );
}
