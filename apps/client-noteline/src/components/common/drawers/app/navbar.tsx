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
import { COOKIE_NAME } from '@repo/constants/names';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  WEEK,
} from '@repo/constants/sizes';
import { setCookieClient } from '@repo/utilities/cookie-client';
import TabNavbarLeft from '../../tabs/navbar/left';
import { IconLayoutSidebarLeftCollapse } from '@tabler/icons-react';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import ButtonAppshellNavbar from '@repo/components/common/buttons/appshell/navbar';

export default function Navbar({ children }: { children: React.ReactNode }) {
  const navbarChild = useStoreAppShell((s) => s.appshell?.child?.navbar);

  return (
    <>
      <Drawer
        hiddenFrom={'xs'}
        keepMounted
        opened={navbarChild ?? false}
        padding={0}
        withCloseButton={false}
        onClose={() => {}}
        styles={{
          content: {
            backgroundColor:
              'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))',
            borderTopRightRadius: 'var(--mantine-radius-lg)',
            borderBottomRightRadius: 'var(--mantine-radius-lg)',
            overflow: 'hidden',
          },
        }}
      >
        <ScrollArea h="100vh">
          <Group p={'xs'} justify="end">
            <ButtonAppshellNavbar />
          </Group>

          <TabNavbarLeft />
        </ScrollArea>
      </Drawer>

      <span>{children}</span>
    </>
  );
}
