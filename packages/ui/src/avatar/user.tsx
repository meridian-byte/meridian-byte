'use client';

import { initialize } from '@repo/utils';
import { Avatar, Button, Group, Skeleton } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants';
import { IconUser } from '@tabler/icons-react';
import { WrapperActionSignIn } from '../wrapper/actions';
import { AuthAction } from '@repo/types';
import { useStoreActiveItems, useStoreSession } from '@repo/store';

export function AvatarUser({ size, options }: { size?: number; options?: { minimal?: boolean } }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const session = useStoreSession((s) => s.session);
  const activeAccount = useStoreActiveItems((s) => s.activeItems?.account);

  const fullName = `${session?.profile.firstName || ''} ${session?.profile.lastName || ''}`.trim();
  const profilePicture = session?.profile.avatar;

  return (
    <Group w={size} h={size}>
      {!mounted || session === undefined ? (
        <Skeleton h={size} w={size} radius={999} />
      ) : !activeAccount?.email ? (
        <WrapperActionSignIn options={{ action: AuthAction.SIGN_IN }}>
          <Button
            size="xs"
            fullWidth
            variant="subtle"
            color="gray"
            leftSection={<IconUser size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
            justify="start"
            pl={5}
            radius={0}
          >
            Sign In
          </Button>
        </WrapperActionSignIn>
      ) : !options?.minimal ? (
        <Button
          size="xs"
          fullWidth
          variant="subtle"
          color="gray"
          leftSection={
            <Avatar
              src={profilePicture || null}
              name={fullName || 'User'}
              color={'initials'}
              size={ICON_SIZE}
            >
              {initialize(fullName || 'User')}
            </Avatar>
          }
          justify="start"
          pl={5}
          radius={0}
        >
          {fullName || activeAccount.email}
        </Button>
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
    </Group>
  );
}
