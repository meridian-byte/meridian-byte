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
import { useStoreNote } from '@repo/libraries/zustand/stores/note';

export default function Navbar({ children }: { children: React.ReactNode }) {
  const notes = useStoreNote((s) => s.notes);
  const navbarChild = useStoreAppShell((s) => s.appshell?.child?.navbar);
  const desktop = useMediaQuery('(min-width: 62em)');
  const toggleNavbarChild = useStoreAppShell((s) => s.toggleNavbarChild);

  return (
    <>
      {notes !== undefined && desktop == false && (
        <Drawer
          keepMounted
          opened={navbarChild ?? false}
          padding={0}
          withCloseButton={false}
          onClose={toggleNavbarChild}
          size={'xs'}
        >
          <ScrollArea h="100vh">
            <TabNavbarLeft />
          </ScrollArea>
        </Drawer>
      )}

      <span>{children}</span>
    </>
  );
}
