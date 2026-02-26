'use client';

import React, { useState } from 'react';
import classes from './navbar.module.scss';
import { ActionIcon, Box, Group, NavLink, NavLinkProps } from '@mantine/core';
import { IconDots } from '@tabler/icons-react';
import { ICON_SIZE } from '@repo/constants/sizes';
import Link from 'next/link';
import MenuChatNavlink from '../menus/chat-navlink';

export default function Navbar({
  chatId,
  href,
  ...restProps
}: { chatId: string; href?: string } & NavLinkProps) {
  const [opened, setOpened] = useState(false);

  return (
    <Group pos={'relative'} className={classes.group}>
      <NavLink
        classNames={classes}
        component={Link}
        href={href || ''}
        {...restProps}
      />

      <Box className={classes.overlay}>
        <MenuChatNavlink opened={opened} setOpened={setOpened} chatId={chatId}>
          <ActionIcon
            size={'md'}
            color="gray"
            variant="subtle"
            className={classes.icon}
            style={{ opacity: opened ? 1 : undefined }}
          >
            <IconDots size={ICON_SIZE / 1.2} />
          </ActionIcon>
        </MenuChatNavlink>
      </Box>
    </Group>
  );
}
