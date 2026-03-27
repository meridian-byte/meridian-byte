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
import ModalAccountGroupList from '../modals/account-group/list';
import ModalCategoryList from '../modals/category/list';
import { navLinks } from '@/data/links';

export default function Nav({ children }: { children: React.ReactNode }) {
  const accountGroupProps = {
    label: navLinks.app[0].label,
    icon: navLinks.app[0].icon,
  };

  const categoryProps = {
    label: navLinks.app[1].label,
    icon: navLinks.app[1].icon,
  };

  return (
    <Menu shadow="md" width={240} keepMounted>
      <MenuTarget>
        <span>{children}</span>
      </MenuTarget>

      <MenuDropdown>
        <ModalAccountGroupList>
          <MenuItem
            leftSection={
              <accountGroupProps.icon
                size={ICON_SIZE}
                stroke={ICON_STROKE_WIDTH}
              />
            }
          >
            {accountGroupProps.label}
          </MenuItem>
        </ModalAccountGroupList>

        <ModalCategoryList>
          <MenuItem
            leftSection={
              <categoryProps.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
          >
            {categoryProps.label}
          </MenuItem>
        </ModalCategoryList>

        <MenuDivider />

        {navLinks.app.slice(2, navLinks.app.length).map((nl) => (
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
