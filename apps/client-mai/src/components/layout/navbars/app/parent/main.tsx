'use client';

import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import {
  ActionIcon,
  AppShellSection,
  Flex,
  Group,
  Skeleton,
  Tooltip,
} from '@mantine/core';
import { IconEdit, IconFileSearch, IconTerminal } from '@tabler/icons-react';
import React from 'react';
import ModalSearch from '@repo/components/common/modals/search';
import ModalCommands from '@repo/components/common/modals/commands';
import ButtonAppshellNavbar from '@repo/components/common/buttons/appshell/navbar';
import { useMediaQuery } from '@mantine/hooks';
import NextLink from '@repo/components/common/anchor/next-link';
import { useStoreTheme } from '@repo/libraries/zustand/stores/theme';
import IndicatorTheme from '@repo/components/common/indicators/theme';
import DrawerAppNavbar from '@/components/common/drawers/app/navbar';
import { useStoreAppShell } from '@repo/libraries/zustand/stores/shell';
import NavbarParentFooter from './footer';

export default function Main({
  props,
}: {
  props?: { options?: { mobile: boolean } };
}) {
  const appshell = useStoreAppShell((s) => s.appshell);
  const mobile = useMediaQuery('(max-width: 36em)');
  const theme = useStoreTheme((s) => s.theme);
  const setTheme = useStoreTheme((s) => s.setTheme);

  return (
    <>
      <AppShellSection id="navbar-main" grow>
        <Flex
          direction={props?.options?.mobile ? 'row' : 'column'}
          p={props?.options?.mobile ? undefined : `xs`}
          align={'center'}
          gap={5}
        >
          {appshell === undefined ? (
            <Skeleton h={ICON_WRAPPER_SIZE} w={ICON_WRAPPER_SIZE} />
          ) : !appshell ? (
            <></>
          ) : (
            <DrawerAppNavbar options={{ hover: true }}>
              <ButtonAppshellNavbar props={{ options: { mobile: !mobile } }} />
            </DrawerAppNavbar>
          )}

          <NextLink href="/app">
            <Tooltip label={'New Chat'} position={'right'}>
              <Group>
                <ActionIcon variant="subtle" size={ICON_WRAPPER_SIZE}>
                  <IconEdit size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Group>
            </Tooltip>
          </NextLink>

          <ModalSearch>
            <Tooltip label={'Search chats'} position={'right'}>
              <Group>
                <ActionIcon variant="subtle" size={ICON_WRAPPER_SIZE}>
                  <IconFileSearch size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Group>
            </Tooltip>
          </ModalSearch>

          <ModalCommands>
            <Tooltip label={'Open command palette'} position={'right'}>
              <Group>
                <ActionIcon variant="subtle" size={ICON_WRAPPER_SIZE}>
                  <IconTerminal size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Group>
            </Tooltip>
          </ModalCommands>

          {theme === undefined ? (
            <Skeleton w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
          ) : !theme ? (
            <></>
          ) : (
            <IndicatorTheme
              props={{ colorScheme: theme, setColorScheme: setTheme }}
            />
          )}
        </Flex>
      </AppShellSection>

      <AppShellSection id="navbar-footer">
        <NavbarParentFooter />
      </AppShellSection>
    </>
  );
}
