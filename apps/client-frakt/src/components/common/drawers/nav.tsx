'use client';

import { useDisclosure } from '@mantine/hooks';
import { Divider, Drawer, NavLink } from '@mantine/core';
import { navLinks } from '@/data/links';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import ModalAccountGroupList from '@repo/components/common/modals/account-group/list';
import ModalCategoryList from '@repo/components/common/modals/category/list';
import HeaderCategories from '@/components/layout/headers/categories';
import PartialCategories from '@/components/partial/page/app/categories';
import HeaderAccountGroups from '@/components/layout/headers/accounts-groups';
import PartialAccountGroups from '@/components/partial/page/app/account-groups';

export default function Nav({ children }: { children: React.ReactNode }) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer opened={opened} onClose={close} position="right" keepMounted>
        <NavComponent props={{ close }} />
      </Drawer>

      <span onClick={open}>{children}</span>
    </>
  );
}

export function NavComponent({ props }: { props?: { close?: () => void } }) {
  const accountGroupProps = {
    label: navLinks.app[0].label,
    icon: navLinks.app[0].icon,
  };

  const categoryProps = {
    label: navLinks.app[1].label,
    icon: navLinks.app[1].icon,
  };

  return (
    <div>
      <ModalAccountGroupList
        props={{
          headerAccountGroups: <HeaderAccountGroups />,
          partialAccountGroups: <PartialAccountGroups />,
        }}
      >
        <NavLink
          label={accountGroupProps.label}
          onClick={props?.close}
          leftSection={
            <accountGroupProps.icon
              size={ICON_SIZE}
              stroke={ICON_STROKE_WIDTH}
            />
          }
        />
      </ModalAccountGroupList>

      <ModalCategoryList
        props={{
          headerCategories: <HeaderCategories />,
          partialCategories: <PartialCategories />,
        }}
      >
        <NavLink
          label={categoryProps.label}
          onClick={props?.close}
          leftSection={
            <categoryProps.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          }
        />
      </ModalCategoryList>

      <Divider />

      {navLinks.app.slice(2, navLinks.app.length).map((nl, i) => (
        <NavLink
          key={i}
          label={nl.label}
          onClick={props?.close}
          leftSection={<nl.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
        />
      ))}
    </div>
  );
}
