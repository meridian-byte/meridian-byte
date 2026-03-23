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
import {
  IconCalendarEvent,
  IconCirclePlus,
  IconEdit,
  IconFilePlus,
  IconFileSearch,
  IconHome,
  IconSearch,
  IconTerminal,
} from '@tabler/icons-react';
import React from 'react';
import ModalSearch from '@repo/components/common/modals/search';
import ModalCommands from '@repo/components/common/modals/commands';
import { useTaskActions } from '@repo/hooks/actions/task';
import { getRegionalDate } from '@repo/utilities/date-time';
import { useRouter } from 'next/navigation';
import { useStoreTask } from '@repo/libraries/zustand/stores/task';
import ButtonAppshellNavbar from '@repo/components/common/buttons/appshell/navbar';
import { useMediaQuery } from '@mantine/hooks';
import NextLink from '@repo/components/common/anchor/next-link';
import { useStoreTheme } from '@repo/libraries/zustand/stores/theme';
import IndicatorTheme from '@repo/components/common/indicators/theme';
import DrawerAppNavbar from '@/components/common/drawers/app/navbar';
import { useStoreAppShell } from '@repo/libraries/zustand/stores/shell';
import NavbarParentFooter from './footer';
import { linkify } from '@repo/utilities/url';
import ButtonsFullscreen from '@repo/components/common/buttons/fullscreen';
import ModalTaskCreate from '@repo/components/common/modals/task/create';

export default function Main({
  props,
}: {
  props?: { options?: { mobile: boolean } };
}) {
  const appshell = useStoreAppShell((s) => s.appshell);
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
              <ButtonAppshellNavbar />
            </DrawerAppNavbar>
          )}

          <NextLink href="/app">
            <Group>
              <Tooltip label={'Go to home page'} position={'right'}>
                <ActionIcon
                  variant="subtle"
                  size={ICON_WRAPPER_SIZE}
                  color="dark"
                >
                  <IconHome size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </NextLink>

          {/* <ModalSearch>
              <Group>
              <Tooltip label={'Search task'} position={'right'}>
                <ActionIcon variant="subtle" size={ICON_WRAPPER_SIZE}>
                  <IconSearch size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
                </Tooltip>
                </Group>
          </ModalSearch> */}

          <Group>
            <ModalTaskCreate>
              <Group>
                <Tooltip label={'Create new task'} position={'right'}>
                  <ActionIcon
                    variant="subtle"
                    size={ICON_WRAPPER_SIZE}
                    color="dark"
                  >
                    <IconCirclePlus
                      size={ICON_SIZE}
                      stroke={ICON_STROKE_WIDTH}
                    />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </ModalTaskCreate>
          </Group>

          {/* <ModalCommands>
            <Group>
              <Tooltip label={'Open command palette'} position={'right'}>
                <ActionIcon variant="subtle" size={ICON_WRAPPER_SIZE}>
                  <IconTerminal size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </ModalCommands> */}

          {theme === undefined ? (
            <Skeleton w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
          ) : !theme ? (
            <></>
          ) : (
            <IndicatorTheme
              props={{ colorScheme: theme, setColorScheme: setTheme }}
            />
          )}

          <ButtonsFullscreen />
        </Flex>
      </AppShellSection>

      <AppShellSection id="navbar-footer">
        <NavbarParentFooter />
      </AppShellSection>
    </>
  );
}
