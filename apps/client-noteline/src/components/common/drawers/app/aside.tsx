'use client';

import React from 'react';
import { ActionIcon, Drawer, Group } from '@mantine/core';
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
import TabNavbarRight from '../../tabs/navbar/right';
import { IconX } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';

export default function Aside({ children }: { children: React.ReactNode }) {
  const mobile = useMediaQuery('(max-width: 36em)');
  const { appshell, setAppShell } = useStoreAppShell();

  const handleAppshellChange = (params: AppShell) => {
    if (!appshell) return;

    setAppShell(params);

    setCookieClient(COOKIE_NAME.APP_SHELL, params, {
      expiryInSeconds: WEEK,
    });
  };

  const handleClose = () => {
    if (!appshell) return;

    handleAppshellChange({
      ...appshell,
      child: {
        ...appshell.child,
        aside: false,
      },
    });
  };

  return (
    <>
      {mobile && (
        <Drawer
          hiddenFrom="xs"
          keepMounted
          opened={appshell?.child.aside ?? false}
          padding={0}
          position="right"
          withCloseButton={false}
          onClose={handleClose}
          styles={{
            content: {
              backgroundColor:
                'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))',
            },
          }}
        >
          <Group justify="end" p={'xs'}>
            <ActionIcon
              size={ICON_WRAPPER_SIZE}
              variant={'transparent'}
              onClick={handleClose}
            >
              <IconX size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>
          </Group>

          <TabNavbarRight />
        </Drawer>
      )}

      <span
        onClick={() => {
          if (!appshell) return;

          handleAppshellChange({
            ...appshell,
            child: {
              ...appshell.child,
              aside: !appshell?.child.aside,
            },
          });
        }}
      >
        {children}
      </span>
    </>
  );
}
