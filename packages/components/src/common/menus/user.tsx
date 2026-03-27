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
import ModalUser from '../modals/user';
import { IconSettings } from '@tabler/icons-react';

export default function User({ children }: { children: React.ReactNode }) {
  const session = useStoreSession((s) => s.session);
  const mobile = useMediaQuery('(max-width: 48em)');

  return (
    <Menu
      position="top-start"
      width={mobile ? 200 : 240}
      trigger="click"
      openDelay={50}
      closeDelay={200}
      transitionProps={{ transition: 'pop-bottom-left', duration: 100 }}
      disabled={!session?.email}
      keepMounted
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

        <ModalUser>
          <MenuItem
            leftSection={
              <IconSettings size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
          >
            Settings
          </MenuItem>
        </ModalUser>

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
