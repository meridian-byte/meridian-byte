'use client';

import { initialize } from '@repo/utils';
import { Avatar, Button, Group, Skeleton } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants';
import { IconUser } from '@tabler/icons-react';
import { WrapperActionSignIn } from '../wrapper/actions';
import { AuthAction } from '@repo/types';
import { useStoreSession } from '@repo/store';

export function AvatarUser({ size }: { size?: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const session = useStoreSession((s) => s.session);

  return (
    <Group w={size} h={size}>
      {!mounted || session === undefined ? (
        <Skeleton h={size} w={size} radius={999} />
      ) : !session?.email ? (
        <WrapperActionSignIn options={{ action: AuthAction.SIGN_IN }}>
          <Button
            size="xs"
            fullWidth
            variant="subtle"
            color="dark"
            leftSection={<IconUser size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />}
            justify="start"
            pl={5}
            radius={0}
          >
            Sign In
          </Button>
        </WrapperActionSignIn>
      ) : (
        <Button
          size="xs"
          fullWidth
          variant="subtle"
          color="dark"
          leftSection={
            <Avatar
              src={session.user_metadata.avatar_url || null}
              name={session.user_metadata.name || 'User'}
              color={'initials'}
              size={ICON_SIZE}
            >
              {initialize(session.user_metadata.name || 'User')}
            </Avatar>
          }
          justify="start"
          pl={5}
          radius={0}
        >
          {session.user_metadata.name || session.email}
        </Button>
      )}
    </Group>
  );
}
