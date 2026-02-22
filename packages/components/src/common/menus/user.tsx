'use client';

import React from 'react';
import Link from 'next/link';
import {
  Menu,
  MenuDivider,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Group,
  Box,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import PartialUser from '../../partial/user';
import { useStoreSession } from '@repo/libraries/zustand/stores/session';
import { navLinkItems } from '@repo/constants/links';

export default function User({ children }: { children: React.ReactNode }) {
  const session = useStoreSession((s) => s.session);

  const mobile = useMediaQuery('(max-width: 48em)');
  const desktop = useMediaQuery('(min-width: 62em)');

  return (
    <Menu
      position="top-start"
      width={mobile ? 200 : 240}
      trigger="click"
      openDelay={50}
      closeDelay={200}
      opened={desktop ? undefined : false}
      transitionProps={{ transition: 'pop-bottom-left', duration: 100 }}
      withArrow
      arrowOffset={16}
      disabled={!session?.email}
    >
      <MenuTarget>
        <Group component={'span'} style={{ cursor: 'pointer' }}>
          {children}
        </Group>
      </MenuTarget>

      <MenuDropdown>
        <Box pb={5}>
          <PartialUser />
        </Box>

        <MenuDivider />

        {navLinkItems.user.account.map((item) => (
          <MenuItem
            key={item.label}
            leftSection={
              <item.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            component={Link}
            href={item.link}
          >
            {item.label}
          </MenuItem>
        ))}

        <MenuDivider />

        {navLinkItems.user.danger.map((item) => (
          <MenuItem
            key={item.label}
            leftSection={
              <item.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            component={Link}
            href={item.link}
            color="red.6"
          >
            {item.label}
          </MenuItem>
        ))}
      </MenuDropdown>
    </Menu>
  );
}
