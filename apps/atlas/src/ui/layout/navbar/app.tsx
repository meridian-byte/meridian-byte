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
  ScrollArea,
  Skeleton,
  Stack,
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

export default function App() {
  return (
    <>
      <AppShellSection>
        <NavbarHeader />
      </AppShellSection>

      <Divider size={3} />

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
  const session = useStoreSession((s) => s.session);

  const { showModalViewSearch } = useViewModal();

  const sharedSize = 30;

  return (
    <Stack p={0} gap={0}>
      <Group wrap="nowrap" gap={0}>
        <Box style={{ flex: 1 }}>
          {session === undefined ? <Skeleton h={sharedSize} radius={0} /> : <AvatarUser />}
        </Box>

        {session === undefined ? (
          <Skeleton h={sharedSize} w={sharedSize} radius={0} />
        ) : !session?.email ? null : (
          <Link href={AUTH_URLS.SIGN_OUT}>
            <ActionIcon size={sharedSize} variant="subtle" color="red.6" radius={0}>
              <IconLogout size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>
          </Link>
        )}
      </Group>

      <Divider size={3} />

      <Button
        size="xs"
        fullWidth
        variant="subtle"
        color="gray"
        leftSection={<IconHome size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
        justify="start"
        pl={5}
        radius={0}
        onClick={() => {
          if (view === undefined) return;
          if (view === null) return;

          if (!!view.view) {
            setView({ ...view, view: null, subView: null });
          }
        }}
      >
        Home View
      </Button>

      <Button
        size="xs"
        fullWidth
        variant="subtle"
        color="gray"
        leftSection={<IconSearch size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
        justify="start"
        pl={5}
        radius={0}
        onClick={showModalViewSearch}
      >
        Global Search
      </Button>

      <Group wrap="nowrap" gap={0}>
        <Box style={{ flex: 1 }}>
          <Button
            size="xs"
            fullWidth
            variant="subtle"
            color="gray"
            leftSection={<IconPlus size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
            justify="start"
            pl={5}
            radius={0}
            onClick={() => {
              if (view === undefined) return;
              if (view === null) return;

              if (view.asideView != ASIDE_VIEW_NAMES.NEW.ITEM) {
                setView({ ...view, asideView: ASIDE_VIEW_NAMES.NEW.ITEM });
              }
            }}
          >
            Add Quick Item
          </Button>
        </Box>

        {/* <MenuNew>
          <ActionIcon size={30} variant="subtle" color={'gray'} radius={0}>
            <IconChevronDown size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
          </ActionIcon>
        </MenuNew> */}
      </Group>
    </Stack>
  );
}

function NavbarMain() {
  return (
    <ScrollArea w={SHELL_VALUES.NAVBAR.WIDTH} scrollbars={'x'}>
      <AccordionNavbar />
    </ScrollArea>
  );
}

// function NavbarFooter() {
//   return <div>NavFooter</div>;
// }
