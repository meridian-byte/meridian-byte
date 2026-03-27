'use client';

import React, { startTransition } from 'react';
import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  MantineColorScheme,
  ScrollArea,
  Select,
  Stack,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  TextInput,
  Title,
  Tooltip,
  Transition,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconApps,
  IconDatabaseCog,
  IconLogout2,
  IconSettings,
  IconTrash,
  IconUserEdit,
  IconX,
} from '@tabler/icons-react';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { colors } from '@repo/constants/colors';
import Link from 'next/link';
import { AUTH_URLS } from '@repo/constants/paths';
import { ColorScheme } from '@repo/types/enums';
import { capitalizeWords } from '@repo/utilities/string';
import { useFormUserProfile } from '@repo/hooks/form/account/profile';
import AvatarMain from '../avatars/main';
import { useMediaQuery } from '@mantine/hooks';

export default function User({ props }: { props?: { close?: () => void } }) {
  const mobile = useMediaQuery('(max-width: 36em)');

  return (
    <Tabs
      keepMounted={false}
      defaultValue={tabs[0].value}
      orientation={mobile ? 'horizontal' : 'vertical'}
      variant="pills"
      styles={{
        panel: {
          backgroundColor:
            'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))',
          width: mobile ? undefined : '66%',
        },
        tab: {
          border: !mobile
            ? undefined
            : '1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-6))',
        },
      }}
    >
      <Stack
        gap={8}
        py={'md'}
        px={'xs'}
        bg={
          'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-7))'
        }
      >
        <Group px={8}>
          <ActionIcon
            size={ICON_SIZE}
            radius={'sm'}
            variant="subtle"
            onClick={props?.close}
            color="dark"
          >
            <IconX size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          </ActionIcon>
        </Group>

        <TabsList
          mih={mobile ? undefined : TAB_HEIGHT}
          styles={{ list: { gap: 2 } }}
          w={mobile ? undefined : '33%'}
          // style={{ flexDirection: mobile ? 'column' : 'row' }}
        >
          {tabs.map((tt) => (
            <TabsTab
              key={tt.label}
              value={tt.value}
              leftSection={
                <tt.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              }
              styles={{
                tab: { padding: '8px 8px' },
                tabLabel: { textAlign: 'start' },
              }}
            >
              {tt.label}
            </TabsTab>
          ))}
        </TabsList>
      </Stack>

      {tabs.map((tt) => (
        <TabsPanel key={tt.label} value={tt.value}>
          <ScrollArea h={TAB_HEIGHT}>
            <Stack
              gap={'xs'}
              style={{
                padding: 'var(--mantine-spacing-md) var(--mantine-spacing-lg)',
              }}
            >
              <Box mih={28}>
                <Title order={2} fz={'lg'} fw={500}>
                  {tt.label}
                </Title>
              </Box>

              <Divider />

              <tt.content />
            </Stack>
          </ScrollArea>
        </TabsPanel>
      ))}
    </Tabs>
  );
}

const TAB_HEIGHT = 400;

const tabs = [
  {
    icon: IconApps,
    value: 'app',
    label: 'App Settings',
    content: App,
  },
  {
    icon: IconUserEdit,
    value: 'profile',
    label: 'Edit Profile',
    content: UserEdit,
  },
  {
    icon: IconDatabaseCog,
    value: 'data',
    label: 'My Data',
    content: Data,
  },
  {
    icon: IconSettings,
    value: 'account',
    label: 'Account Settings',
    content: Account,
  },
];

const divider = <Divider variant="dashed" />;

function TooltipDisabled({ children }: { children: React.ReactNode }) {
  return <Tooltip label={'Disabled: Coming soon'}>{children}</Tooltip>;
}

function App() {
  const { colorScheme, setColorScheme } = useMantineColorScheme({
    keepTransitions: false,
  });

  const themes = [
    { label: capitalizeWords(ColorScheme.DARK), value: ColorScheme.DARK },
    { label: capitalizeWords(ColorScheme.LIGHT), value: ColorScheme.LIGHT },
    { label: capitalizeWords(ColorScheme.AUTO), value: ColorScheme.AUTO },
  ];

  return (
    <>
      <Group justify="space-between">
        <Text fz={'sm'}>Appearance</Text>

        <Select
          variant="filled"
          aria-label="theme"
          size="xs"
          checkIconPosition="right"
          allowDeselect={false}
          w={120}
          data={themes}
          value={colorScheme}
          onChange={(value) =>
            startTransition(() => setColorScheme(value as MantineColorScheme))
          }
        />
      </Group>

      {divider}

      <Group justify="space-between">
        <Text fz={'sm'}>Accent</Text>

        <TooltipDisabled>
          <Select
            variant="filled"
            aria-label="theme"
            size="xs"
            checkIconPosition="right"
            allowDeselect={false}
            disabled
            w={120}
            value={colors[0].value}
            data={colors.map((ci) => {
              return { label: ci.label, value: ci.value };
            })}
          />
        </TooltipDisabled>
      </Group>
    </>
  );
}

function UserEdit() {
  const { form, submitted, handleSubmit } = useFormUserProfile();

  return (
    <form
      noValidate
      // onSubmit={form.onSubmit(() => handleSubmit())}
    >
      <Stack gap={'xs'}>
        <Group justify="space-between">
          <Text fz={'sm'}>Name</Text>

          <TextInput
            aria-label="Name"
            size="xs"
            variant="unstyled"
            {...form.getInputProps('name')}
            styles={{
              error: { textAlign: 'end' },
              input: {
                fontSize: 'var(--mantine-font-size-sm)',
                textAlign: 'end',
                fontWeight: 'normal',
              },
            }}
          />
        </Group>

        {divider}

        <Group justify="space-between">
          <Text fz={'sm'}>Username</Text>

          <TextInput
            aria-label="Username"
            size="xs"
            variant="unstyled"
            {...form.getInputProps('user_name')}
            styles={{
              error: { textAlign: 'end' },
              input: {
                fontSize: 'var(--mantine-font-size-sm)',
                textAlign: 'end',
                fontWeight: 'normal',
              },
            }}
          />
        </Group>

        {divider}

        <Group justify="space-between">
          <Text fz={'sm'}>Avatar</Text>

          <Group justify="end" gap={'xs'}>
            <TooltipDisabled>
              <Button size="xs" color="dark" variant="default" disabled>
                Set avatar
              </Button>
            </TooltipDisabled>
            <AvatarMain size={32} />
          </Group>
        </Group>

        <Transition
          mounted={form.isDirty()}
          transition="fade"
          duration={400}
          timingFunction="ease"
        >
          {(styles) => (
            <div style={styles}>
              <Box mt={'md'}>
                <Divider mb={'xs'} />

                <Group justify="end" gap={'xs'}>
                  <Button
                    size="xs"
                    color="dark"
                    variant="light"
                    disabled={submitted}
                    onClick={() => {
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="xs"
                    type="submit"
                    loading={submitted}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmit();
                    }}
                  >
                    Save
                  </Button>
                </Group>
              </Box>
            </div>
          )}
        </Transition>
      </Stack>
    </form>
  );
}

function Data() {
  return (
    <>
      <Group justify="space-between">
        <Text fz={'sm'}>Shared links</Text>

        <TooltipDisabled>
          <Button size="xs" color="dark" variant="default" disabled>
            Manage
          </Button>
        </TooltipDisabled>
      </Group>

      {divider}

      <Group justify="space-between">
        <Text fz={'sm'}>Delete all chats</Text>

        <Button
          size="xs"
          color="red.6"
          variant="light"
          leftSection={
            <IconTrash size={ICON_SIZE - 6} stroke={ICON_STROKE_WIDTH} />
          }
        >
          Delete
        </Button>
      </Group>

      {divider}

      <Group justify="space-between">
        <Text fz={'sm'}>Export data</Text>

        <TooltipDisabled>
          <Button size="xs" color="dark" variant="default" disabled>
            Export
          </Button>
        </TooltipDisabled>
      </Group>
    </>
  );
}

function Account() {
  return (
    <>
      <Group justify="space-between">
        <Text fz={'sm'}>Email</Text>

        <Button
          size="compact-sm"
          color="dark"
          variant="transparent"
          fw={'normal'}
        >
          {'work.kevon@gmail.com'}
        </Button>
      </Group>

      {divider}

      <Group justify="space-between">
        <Text fz={'sm'}>Log out</Text>

        <Button
          size="xs"
          color="red.6"
          variant="light"
          component={Link}
          href={AUTH_URLS.SIGN_OUT}
          leftSection={
            <IconLogout2 size={ICON_SIZE - 6} stroke={ICON_STROKE_WIDTH} />
          }
        >
          Log out
        </Button>
      </Group>

      {divider}

      <Group justify="space-between">
        <Text fz={'sm'}>Delete account</Text>

        <TooltipDisabled>
          <Button
            size="xs"
            color="red.6"
            variant="light"
            disabled
            leftSection={
              <IconAlertTriangle
                size={ICON_SIZE - 6}
                stroke={ICON_STROKE_WIDTH}
              />
            }
          >
            Delete
          </Button>
        </TooltipDisabled>
      </Group>
    </>
  );
}
