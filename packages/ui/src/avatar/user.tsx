'use client';

import { initialize } from '@repo/utils';
import { ActionIcon, Avatar, Button, Group, NavLink, Skeleton, ThemeIcon } from '@mantine/core';
import { useEffect, useState } from 'react';
import { AUTH_URLS, ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants';
import { IconLogout, IconUser } from '@tabler/icons-react';
import { WrapperActionSignIn } from '../wrapper/actions';
import { AuthAction } from '@repo/types';
import { useStoreActiveItems, useStoreSession } from '@repo/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function AvatarUser({ size, options }: { size?: number; options?: { minimal?: boolean } }) {
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
          <Skeleton h={size || 30} radius={'md'} />
        </div>
      ) : !activeAccount?.email ? (
        <WrapperActionSignIn options={{ action: AuthAction.SIGN_IN }}>
          <NavLink
            label={'Sign In'}
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
                <IconUser size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
              </ThemeIcon>
            }
          />
        </WrapperActionSignIn>
      ) : !options?.minimal ? (
        <NavLink
          label={fullName || activeAccount.email}
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
            <ThemeIcon size={30} variant="transparent" color="gray">
              <Avatar
                src={profilePicture || null}
                name={fullName || 'User'}
                color={'initials'}
                size={ICON_SIZE}
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
                miw={30}
                pr={4}
              >
                <ActionIcon
                  size={30 - 6}
                  variant="subtle"
                  color="red.6"
                  onClick={() => {
                    router.push(AUTH_URLS.SIGN_OUT);
                  }}
                >
                  <IconLogout size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
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
