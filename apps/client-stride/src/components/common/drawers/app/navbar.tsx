'use client';

import React, { useEffect } from 'react';
import {
  Box,
  ActionIcon,
  Drawer,
  Group,
  ScrollArea,
  Tooltip,
} from '@mantine/core';
import { useStoreAppShell } from '@repo/libraries/zustand/stores/shell';
import { AppShell } from '@repo/types/components';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  WEEK,
} from '@repo/constants/sizes';
import PartialNavbarLinks from '@/components/partial/tabs/navbar/left';
import { IconLayoutSidebarLeftCollapse } from '@tabler/icons-react';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';

export default function Navbar({
  options,
  children,
}: {
  options?: { hover?: true };
  children: React.ReactNode;
}) {
  const mobile = useMediaQuery('(max-width: 36em)');
  const navbarChild = useStoreAppShell((s) => s.appshell?.child?.navbar);
  const toggleNavbarChild = useStoreAppShell((s) => s.toggleNavbarChild);
  const [opened, { open, close }] = useDisclosure(false);

  const handleAppshellChange = () => {
    if (!mobile) return;
    toggleNavbarChild();
  };

  const handleClose = () => {
    if (!mobile) return;
    handleAppshellChange();
  };

  useEffect(() => {
    if (options?.hover && navbarChild && opened && !mobile) close();
  }, [navbarChild, opened]);

  return (
    <>
      <Drawer
        size={options?.hover ? 'xs' : undefined}
        hiddenFrom={!options?.hover ? 'xs' : undefined}
        keepMounted
        opened={!mobile ? opened : (navbarChild ?? false)}
        padding={0}
        transitionProps={{ enterDelay: 400, duration: 250 }}
        withCloseButton={false}
        onClose={handleClose}
        styles={{
          content: {
            backgroundColor:
              'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))',
            borderTopRightRadius: 'var(--mantine-radius-lg)',
            borderBottomRightRadius: 'var(--mantine-radius-lg)',
            overflow: 'hidden',
          },
        }}
        display={
          mobile || (options?.hover && !navbarChild) ? undefined : 'none'
        }
      >
        <ScrollArea
          h="100vh"
          onMouseLeave={() => {
            if (mobile) return;
            close();
          }}
          display={
            mobile || (options?.hover && !navbarChild)
              ? !opened && !mobile
                ? 'none'
                : undefined
              : 'none'
          }
        >
          <Group p={'xs'} justify="end">
            <Tooltip
              label={
                (options?.hover ? opened : navbarChild) ? 'Collapse' : 'Expand'
              }
              position="right"
            >
              <ActionIcon
                size={ICON_WRAPPER_SIZE}
                variant={'subtle'}
                onClick={options?.hover && !mobile ? close : handleClose}
              >
                <IconLayoutSidebarLeftCollapse
                  size={ICON_SIZE}
                  stroke={ICON_STROKE_WIDTH}
                />
              </ActionIcon>
            </Tooltip>
          </Group>

          <PartialNavbarLinks />
        </ScrollArea>
      </Drawer>

      <span
        onMouseEnter={() => {
          if (mobile) return;
          if (!navbarChild && !opened) open();
        }}
        onClick={() => {
          if (!mobile) return;
          handleAppshellChange();
        }}
      >
        {children}
      </span>
    </>
  );
}
