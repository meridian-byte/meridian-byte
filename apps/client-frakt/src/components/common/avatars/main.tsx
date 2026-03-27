'use client';

import { initialize } from '@repo/utilities/string';
import { ActionIcon, Avatar, Group, Skeleton } from '@mantine/core';
import { useEffect, useState } from 'react';
import classes from './main.module.scss';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { IconUser } from '@tabler/icons-react';
import { Auth as WrapperAuth } from '@/components/wrapper/auth';
import { AuthAction } from '@repo/types/enums';
import { useStoreSession } from '@/libraries/zustand/stores/session';

export default function Main({ size }: { size?: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { session } = useStoreSession();

  return (
    <Group w={size} h={size}>
      {!mounted || session === undefined ? (
        <Skeleton h={size} w={size} radius={999} />
      ) : session === null ? (
        <WrapperAuth options={{ action: AuthAction.SIGN_IN }}>
          <ActionIcon
            size={size}
            variant="subtle"
            style={{ overflow: 'visible' }}
          >
            <Group>
              <IconUser size={ICON_SIZE * 1.2} stroke={ICON_STROKE_WIDTH} />
            </Group>
          </ActionIcon>
        </WrapperAuth>
      ) : (
        <Avatar
          className={
            !session.user_metadata.avatar_url
              ? classes.avatarInitials
              : classes.avatarImage
          }
          src={session.user_metadata.avatar_url || null}
          name={session.user_metadata.name || 'User'}
          color={'initials'}
          size={size as any}
        >
          {initialize(session.user_metadata.name || 'User')}
        </Avatar>
      )}
    </Group>
  );
}
