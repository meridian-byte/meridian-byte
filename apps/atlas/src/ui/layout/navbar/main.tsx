'use client';

import React from 'react';
import {
  ActionIcon,
  AppShellSection,
  Box,
  Button,
  ButtonGroup,
  Divider,
  Group,
  NavLink,
  ScrollArea,
  Skeleton,
  Stack,
  ThemeIcon,
} from '@mantine/core';
import { SHELL_VALUES } from '@atlas/constants';
import {
  ASIDE_VIEW_NAMES,
  AUTH_URLS,
  BASE_URL,
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants';
import {
  IconChevronDown,
  IconHome,
  IconLogout,
  IconPlus,
  IconSearch,
  IconUser,
} from '@tabler/icons-react';
import AccordionNavbar from '@atlas/ui/accordion/navbar';
import { config, useStoreAppShell, useStoreSession, useStoreView } from '@repo/store';
import MenuNew from '@atlas/ui/menu/new';
import { AuthAction } from '@repo/types';
import Link from 'next/link';
import { AvatarUser } from '@repo/ui';
import { useViewModal } from '@repo/store';
import ModalUser from '@atlas/ui/modal/user';
import ButtonAppshellNavbar from '@atlas/ui/button/appshell/navbar';

import { useBreakpointFlags } from '@repo/hooks';

export default function Main() {
  return (
    <>
      <AppShellSection>
        {/* <Box style={{ boxShadow: 'var(--mantine-shadow-xs)' }}> */}
        <NavbarHeader />

        <Divider mt={4} />
        {/* </Box> */}
      </AppShellSection>

      <AppShellSection
        grow
        component={ScrollArea}
        scrollbars={'y'}
        // h={`calc(100vh - ${28.4 + 1 + 28.4 + 1 + SHELL_VALUES.FOOTER.HEIGHT.DESKTOP}px)`}
      >
        <NavbarMain />
      </AppShellSection>

      {/* <Divider /> */}

      {/* <AppShellSection>
        <NavbarFooter />
      </AppShellSection> */}
    </>
  );
}

function NavbarHeader() {
  const view = useStoreView((s) => s.view);
  const setView = useStoreView((s) => s.setView);
  const { showModalViewSearch } = useViewModal();

  const { ready, isMobile, isDesktop } = useBreakpointFlags();

  const navbarActive = useStoreAppShell((s) => s.appshell?.child?.navbar);
  const toggleNavbarChild = useStoreAppShell((s) => s.toggleNavbarChild);

  if (!ready) {
    // Must not render wrong layout before client knows viewport
    return null;
  }

  return (
    <Stack gap={0} px={5} pt={5}>
      <Box
        onClick={() => {
          if (!isDesktop) {
            if (navbarActive) toggleNavbarChild();
          }
        }}
      >
        <ModalUser>
          <AvatarUser />
        </ModalUser>
      </Box>

      <Divider my={4} />

      <NavLink
        label={'Home View'}
        color="gray"
        p={isDesktop ? 0 : undefined}
        fw={600}
        styles={{
          section: isDesktop ? { marginInlineEnd: 0 } : undefined,
          body: { marginBottom: 4 },
          label: isDesktop
            ? {
                fontSize: 'var(--mantine-font-size-xs)',
              }
            : undefined,
        }}
        leftSection={
          <ThemeIcon size={isDesktop ? 30 : ICON_WRAPPER_SIZE} variant="transparent" color={'gray'}>
            <IconHome size={isDesktop ? ICON_SIZE - 4 : ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          </ThemeIcon>
        }
        onClick={() => {
          if (view === undefined) return;
          if (view === null) return;

          if (!isDesktop) {
            if (navbarActive) toggleNavbarChild();
          }

          if (!!view.view) {
            setView({ ...view, view: null, subView: null });
          }
        }}
      />

      <NavLink
        label={'Global Search'}
        color="gray"
        p={isDesktop ? 0 : undefined}
        fw={600}
        styles={{
          section: isDesktop ? { marginInlineEnd: 0 } : undefined,
          body: { marginBottom: 4 },
          label: isDesktop
            ? {
                fontSize: 'var(--mantine-font-size-xs)',
              }
            : undefined,
        }}
        leftSection={
          <ThemeIcon size={isDesktop ? 30 : ICON_WRAPPER_SIZE} variant="transparent" color={'gray'}>
            <IconSearch size={isDesktop ? ICON_SIZE - 4 : ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          </ThemeIcon>
        }
        onClick={() => {
          if (!isDesktop) {
            if (navbarActive) toggleNavbarChild();
          }

          showModalViewSearch();
        }}
      />

      <NavLink
        label={'Add Quick Item'}
        color="gray"
        p={isDesktop ? 0 : undefined}
        fw={600}
        styles={{
          section: isDesktop ? { marginInlineEnd: 0 } : undefined,
          body: { marginBottom: 4 },
          label: isDesktop
            ? {
                fontSize: 'var(--mantine-font-size-xs)',
              }
            : undefined,
        }}
        leftSection={
          <ThemeIcon size={isDesktop ? 30 : ICON_WRAPPER_SIZE} variant="transparent" color={'gray'}>
            <IconPlus size={isDesktop ? ICON_SIZE - 4 : ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          </ThemeIcon>
        }
        onClick={() => {
          if (view === undefined) return;
          if (view === null) return;

          if (view.asideView != ASIDE_VIEW_NAMES.NEW.ITEM) {
            setView({ ...view, asideView: ASIDE_VIEW_NAMES.NEW.ITEM });
          }
        }}
        visibleFrom="md"
      />
    </Stack>
  );
}

function NavbarMain() {
  const { ready, isMobile, isDesktop } = useBreakpointFlags();

  if (!ready) {
    // Must not render wrong layout before client knows viewport
    return null;
  }

  return (
    <ScrollArea w={isDesktop ? SHELL_VALUES.NAVBAR.WIDTH : '100%'} scrollbars={'x'} p={5}>
      <AccordionNavbar />
    </ScrollArea>
  );
}

// function NavbarFooter() {
//   return <div>NavFooter</div>;
// }
