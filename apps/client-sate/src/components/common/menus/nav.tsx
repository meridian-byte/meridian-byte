'use client';

import React from 'react';
import {
  Menu,
  MenuTarget,
  MenuDropdown,
  MenuItem,
  MenuDivider,
} from '@mantine/core';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
// import ModalAccountGroupList from '../modals/account-group/list';
// import ModalCategoryList from '../modals/category/list';
import { navLinkApp } from '@/data/links';
import NextLink from '@repo/components/common/anchor/next-link';

export default function Nav({ children }: { children: React.ReactNode }) {
  const foodsProps = {
    link: navLinkApp[0].link,
    label: navLinkApp[0].label,
    icon: navLinkApp[0].icon,
  };

  const mealsProps = {
    link: navLinkApp[1].link,
    label: navLinkApp[1].label,
    icon: navLinkApp[1].icon,
  };

  return (
    <Menu shadow="md" width={240} keepMounted>
      <MenuTarget>
        <span>{children}</span>
      </MenuTarget>

      <MenuDropdown>
        <NextLink href={foodsProps.link || ''} underline="never">
          <MenuItem
            leftSection={
              <foodsProps.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
          >
            {foodsProps.label}
          </MenuItem>
        </NextLink>

        <NextLink href={mealsProps.link || ''} underline="never">
          <MenuItem
            leftSection={
              <mealsProps.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
          >
            {mealsProps.label}
          </MenuItem>
        </NextLink>

        <MenuDivider />

        {navLinkApp.slice(2, navLinkApp.length).map((nl) => (
          <MenuItem
            key={nl.label}
            leftSection={
              <nl.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
          >
            {nl.label}
          </MenuItem>
        ))}
      </MenuDropdown>
    </Menu>
  );
}
