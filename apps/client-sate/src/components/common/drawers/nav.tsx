'use client';

import { useDisclosure } from '@mantine/hooks';
import { Divider, Drawer, NavLink } from '@mantine/core';
import { navLinks } from '@/data/links';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import NextLink from '@repo/components/common/anchor/next-link';
// import ModalAccountGroupList from '../modals/account-group/list';
// import ModalCategoryList from '../modals/category/list';

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
    <div>
      <NextLink href={foodsProps.link || ''} underline="never">
        <NavLink
          component="span"
          label={foodsProps.label}
          onClick={props?.close}
          leftSection={
            <foodsProps.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          }
        />
      </NextLink>

      <NextLink href={mealsProps.link || ''} underline="never">
        <NavLink
          label={mealsProps.label}
          onClick={props?.close}
          leftSection={
            <mealsProps.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          }
        />
      </NextLink>

      <NextLink href={weightsProps.link || ''} underline="never">
        <NavLink
          label={weightsProps.label}
          onClick={props?.close}
          leftSection={
            <weightsProps.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          }
        />
      </NextLink>

      <Divider />

      {navLinks.app
        .slice(navLinks.app.length - 1, navLinks.app.length)
        .map((nl) => (
          <NavLink
            key={nl.label}
            label={nl.label}
            onClick={props?.close}
            leftSection={
              <nl.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
          />
        ))}
    </div>
  );
}
