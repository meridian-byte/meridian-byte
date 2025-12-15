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
import { navLinkApp } from '@/data/links';

export default function Nav({ children }: { children: React.ReactNode }) {
  const accountGroupProps = {
    label: navLinkApp[0].label,
    icon: navLinkApp[0].icon,
  };

  const categoryProps = {
    label: navLinkApp[1].label,
    icon: navLinkApp[1].icon,
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
