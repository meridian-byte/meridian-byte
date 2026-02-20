'use client';

import React from 'react';
import Link from 'next/link';
import {
  Menu,
  MenuDivider,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  MenuLabel,
  Stack,
  Group,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import PartialUser from '../../partial/user';
import classes from './user.module.scss';
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
      classNames={classes}
      opened={desktop ? undefined : false}
      transitionProps={{ transition: 'pop-bottom-left', duration: 100 }}
      withArrow
      arrowOffset={16}
      disabled={!session?.email}
      styles={{ dropdown: { overflow: 'hidden' } }}
    >
      <MenuTarget>
        <Group component={'span'} className={classes.target}>
          {children}
        </Group>
      </MenuTarget>

      <MenuDropdown>
        <Stack p={'md'}>
          <PartialUser />
        </Stack>

        <MenuDivider m={0} />

        <MenuLabel>Account</MenuLabel>

        {navLinkItems.user.account.map((item) => (
          <MenuItem
            key={item.label}
            leftSection={
              <item.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            component={Link}
            href={item.link}
            className={classes.item}
          >
            {item.label}
          </MenuItem>
        ))}

        <MenuDivider m={0} />

        {navLinkItems.user.danger.map((item) => (
          <MenuItem
            key={item.label}
            leftSection={
              <item.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            component={Link}
            href={item.link}
            className={classes.itemDanger}
          >
            {item.label}
          </MenuItem>
        ))}
      </MenuDropdown>
    </Menu>
  );
}
