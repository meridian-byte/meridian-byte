'use client';

import { initialize } from '@repo/utils';
import { ActionIcon, Avatar, Button, Group, NavLink, Skeleton, ThemeIcon } from '@mantine/core';
import { useEffect, useState } from 'react';
import { AUTH_URLS, ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import { IconLogout, IconUser } from '@tabler/icons-react';
import { WrapperActionSignIn } from '../wrapper/actions';
import { AuthAction } from '@repo/types';
import { useStoreActiveItems, useStoreSession } from '@repo/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from '@mantine/hooks';

export function AvatarUser({ size, options }: { size?: number; options?: { minimal?: boolean } }) {
  const desktop = useMediaQuery('(min-width: 62em)');

  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const session = useStoreSession((s) => s.session);
  const activeAccount = useStoreActiveItems((s) => s.activeItems?.account);

  const fullName = `${session?.profile.firstName || ''} ${session?.profile.lastName || ''}`.trim();
  const profilePicture = session?.profile.avatar;

  return (
    <div>
      {!mounted || session === undefined ? (
        <div>
          <Skeleton h={size || (desktop ? 30 : 44.8)} radius={'md'} />
        </div>
      ) : !activeAccount?.email ? (
        <WrapperActionSignIn options={{ action: AuthAction.SIGN_IN }}>
          <NavLink
            label={'Sign In'}
            color="gray"
            p={desktop ? 0 : undefined}
            fw={600}
            styles={{
              section: desktop ? { marginInlineEnd: 0 } : undefined,
              body: { marginBottom: 4 },
              label: desktop
                ? {
                    fontSize: 'var(--mantine-font-size-xs)',
                  }
                : undefined,
            }}
            leftSection={
              <ThemeIcon
                size={desktop ? 30 : ICON_WRAPPER_SIZE}
                variant="transparent"
                color={'gray'}
              >
                <IconUser size={desktop ? ICON_SIZE - 4 : ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ThemeIcon>
            }
          />
        </WrapperActionSignIn>
      ) : !options?.minimal ? (
        <NavLink
          label={fullName || activeAccount.email}
          color="gray"
          p={desktop ? 0 : 0}
          pl={desktop ? undefined : 12}
          pr={desktop ? undefined : 5}
          fw={600}
          styles={{
            section: desktop ? { marginInlineEnd: 0 } : undefined,
            body: { marginBottom: 4 },
            label: desktop
              ? {
                  fontSize: 'var(--mantine-font-size-xs)',
                }
              : undefined,
          }}
          leftSection={
            <ThemeIcon size={desktop ? 30 : ICON_WRAPPER_SIZE} variant="transparent" color="gray">
              <Avatar
                src={profilePicture || null}
                name={fullName || 'User'}
                color={'initials'}
                size={desktop ? ICON_SIZE : ICON_WRAPPER_SIZE}
              >
                {initialize(fullName || 'User')}
              </Avatar>
            </ThemeIcon>
          }
          rightSection={
            !session?.accounts[0].email ? null : (
              <Group
                gap={0}
                wrap="nowrap"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                miw={desktop ? 30 : ICON_WRAPPER_SIZE * 1.25}
                pr={desktop ? 4 : 0}
                justify="end"
              >
                <ActionIcon
                  size={desktop ? 30 - 6 : ICON_WRAPPER_SIZE * 1.25}
                  variant="light"
                  color="red"
                  onClick={() => {
                    router.push(AUTH_URLS.SIGN_OUT);
                  }}
                >
                  <IconLogout
                    size={desktop ? ICON_SIZE - 4 : ICON_SIZE}
                    stroke={ICON_STROKE_WIDTH}
                  />
                </ActionIcon>
              </Group>
            )
          }
        />
      ) : (
        <Avatar
          src={profilePicture || null}
          name={fullName || 'User'}
          color={'initials'}
          size={size || ICON_SIZE}
        >
          {initialize(fullName || 'User')}
        </Avatar>
      )}
    </div>
  );
}
