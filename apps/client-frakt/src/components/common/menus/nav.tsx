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
import { navLinks } from '@/data/links';
import ModalAccountGroupList from '@repo/components/common/modals/account-group/list';
import ModalCategoryList from '@repo/components/common/modals/category/list';
import HeaderCategories from '@/components/layout/headers/categories';
import PartialCategories from '@/components/partial/page/app/categories';
import HeaderAccountGroups from '@/components/layout/headers/accounts-groups';
import PartialAccountGroups from '@/components/partial/page/app/account-groups';

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
        <ModalAccountGroupList
          props={{
            headerAccountGroups: <HeaderAccountGroups />,
            partialAccountGroups: <PartialAccountGroups />,
          }}
        >
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

        <ModalCategoryList
          props={{
            headerCategories: <HeaderCategories />,
            partialCategories: <PartialCategories />,
          }}
        >
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
