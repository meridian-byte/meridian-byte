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
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { navLinkItems } from '@/data/links';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import PartialUser from '@/components/partial/user';
import classes from './user.module.scss';
import { useStoreSession } from '@/libraries/zustand/stores/session';

export default function User({ children }: { children: React.ReactNode }) {
  const { session } = useStoreSession();

  const mobile = useMediaQuery('(max-width: 48em)');
  const desktop = useMediaQuery('(min-width: 62em)');

  return (
    <Menu
      position={'bottom-end'}
      width={mobile ? 200 : 240}
      trigger="click-hover"
      openDelay={50}
      closeDelay={50}
      classNames={classes}
      opened={desktop ? undefined : false}
      transitionProps={{ transition: 'pop-top-right', duration: 100 }}
      withArrow
      arrowOffset={16}
      disabled={!session}
      styles={{ dropdown: { overflow: 'hidden' } }}
    >
      <MenuTarget>
        <div className={classes.target}>{children}</div>
      </MenuTarget>

      <MenuDropdown>
        <Stack p={'md'}>
          <PartialUser options={{ withoutAvatar: true }} />
        </Stack>

        <MenuDivider mb={0} />

        {/* <MenuLabel>Activity</MenuLabel>

        {navLinkItems.activity.map((item) => (
          <MenuItem
            key={item.label}
            leftSection={
              <item.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
            component={Link}
            href={item.link}
            className={
              matchesPath(item.link) ? classes.itemActive : classes.item
            }
          >
            {item.label}
          </MenuItem>
        ))}

        <MenuDivider mb={0} /> */}

        <MenuLabel>Account</MenuLabel>

        {navLinkItems.account.map((item) => (
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

        <MenuDivider mb={0} />

        <MenuLabel>Support</MenuLabel>

        {navLinkItems.support.map((item) => (
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

        <MenuDivider mb={0} />

        {navLinkItems.danger.map((item) => (
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
