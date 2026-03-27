'use client';

import { useDisclosure } from '@mantine/hooks';
import { Divider, Drawer, NavLink } from '@mantine/core';
import { navLinkApp } from '@/data/links';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import ModalAccountGroupList from '../modals/account-group/list';
import ModalCategoryList from '../modals/category/list';

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
    label: navLinkApp[0].label,
    icon: navLinkApp[0].icon,
  };

  const categoryProps = {
    label: navLinkApp[1].label,
    icon: navLinkApp[1].icon,
  };

  return (
    <div>
      <ModalAccountGroupList>
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

      <ModalCategoryList>
        <NavLink
          label={categoryProps.label}
          onClick={props?.close}
          leftSection={
            <categoryProps.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          }
        />
      </ModalCategoryList>

      <Divider />

      {navLinkApp.slice(2, navLinkApp.length).map((nl, i) => (
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
