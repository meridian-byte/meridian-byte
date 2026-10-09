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
import { config, useStoreSession, useStoreView } from '@repo/store';
import MenuNew from '@atlas/ui/menu/new';
import { AuthAction } from '@repo/types';
import Link from 'next/link';
import { AvatarUser } from '@repo/ui';
import { useViewModal } from '@repo/store';
import ModalUser from '@atlas/ui/modal/user';

export default function App() {
  return (
    <>
      <AppShellSection>
        {/* <Box style={{ boxShadow: 'var(--mantine-shadow-xs)' }}> */}
        <NavbarHeader />
        <Divider my={4} />
        {/* </Box> */}
      </AppShellSection>

      <AppShellSection
        grow
        component={ScrollArea}
        scrollbars={'y'}
        // h={`calc(100vh - ${28.4 + 1 + 28.4 + 1 + SHELL_VALUES.FOOTER.HEIGHT}px)`}
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

  return (
    <Stack gap={0} px={5} pt={5}>
      <ModalUser>
        <AvatarUser />
      </ModalUser>

      <Divider my={4} />

      <NavLink
        label={'Home View'}
        color="gray"
        p={0}
        fw={600}
        style={{ borderRadius: 'var(--mantine-radius-md)' }}
        styles={{
          section: { marginInlineEnd: 0 },
          body: { marginBottom: 4 },
          label: {
            fontSize: 'var(--mantine-font-size-xs)',
          },
        }}
        leftSection={
          <ThemeIcon size={30} variant="transparent" color={'gray'}>
            <IconHome size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
          </ThemeIcon>
        }
        onClick={() => {
          if (view === undefined) return;
          if (view === null) return;

          if (!!view.view) {
            setView({ ...view, view: null, subView: null });
          }
        }}
      />

      <NavLink
        label={'Global Search'}
        color="gray"
        p={0}
        fw={600}
        style={{ borderRadius: 'var(--mantine-radius-md)' }}
        styles={{
          section: { marginInlineEnd: 0 },
          body: { marginBottom: 4 },
          label: {
            fontSize: 'var(--mantine-font-size-xs)',
          },
        }}
        leftSection={
          <ThemeIcon size={30} variant="transparent" color={'gray'}>
            <IconSearch size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
          </ThemeIcon>
        }
        onClick={() => showModalViewSearch()}
      />

      <NavLink
        label={'Add Quick Item'}
        color="gray"
        p={0}
        fw={600}
        style={{ borderRadius: 'var(--mantine-radius-md)' }}
        styles={{
          section: { marginInlineEnd: 0 },
          body: { marginBottom: 4 },
          label: {
            fontSize: 'var(--mantine-font-size-xs)',
          },
        }}
        leftSection={
          <ThemeIcon size={30} variant="transparent" color={'gray'}>
            <IconPlus size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
          </ThemeIcon>
        }
        onClick={() => {
          if (view === undefined) return;
          if (view === null) return;

          if (view.asideView != ASIDE_VIEW_NAMES.NEW.ITEM) {
            setView({ ...view, asideView: ASIDE_VIEW_NAMES.NEW.ITEM });
          }
        }}
      />
    </Stack>
  );
}

function NavbarMain() {
  return (
    <ScrollArea w={SHELL_VALUES.NAVBAR.WIDTH} scrollbars={'x'} px={5}>
      <AccordionNavbar />
    </ScrollArea>
  );
}

// function NavbarFooter() {
//   return <div>NavFooter</div>;
// }
