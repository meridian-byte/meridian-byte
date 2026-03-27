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
import { navLinks } from '@/data/links';
import NextLink from '@repo/components/common/anchor/next-link';

export default function Nav({ children }: { children: React.ReactNode }) {
  const foodsProps = {
    link: navLinks.app[0].link,
    label: navLinks.app[0].label,
    icon: navLinks.app[0].icon,
  };

  const mealsProps = {
    link: navLinks.app[1].link,
    label: navLinks.app[1].label,
    icon: navLinks.app[1].icon,
  };

  const weightsProps = {
    link: navLinks.app[2].link,
    label: navLinks.app[2].label,
    icon: navLinks.app[2].icon,
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

        <NextLink href={weightsProps.link || ''} underline="never">
          <MenuItem
            leftSection={
              <weightsProps.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
          >
            {weightsProps.label}
          </MenuItem>
        </NextLink>

        <MenuDivider />

        {navLinks.app
          .slice(navLinks.app.length - 1, navLinks.app.length)
          .map((nl) => (
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
