'use client';

import { Flex, Skeleton, Stack, Text, Title } from '@mantine/core';
import AvatarMain from '@/components/common/avatars/main';
import { useStoreSession } from '@/libraries/zustand/stores/session';

export default function User({
  options,
}: {
  options?: { withoutAvatar?: boolean };
}) {
  const { session } = useStoreSession();

  return (
    <Flex
      direction={{ base: 'column', lg: 'row' }}
      align={'center'}
      justify={'center'}
      gap={'md'}
      w={'100%'}
    >
      {!options?.withoutAvatar && <AvatarMain />}

      <Stack gap={session == undefined ? 5 : 0}>
        {session == undefined ? (
          <Skeleton h={11} w={100} />
        ) : (
          <Title
            order={3}
            fz={'md'}
            ta={{
              base: 'center',
              lg: options?.withoutAvatar ? undefined : 'start',
            }}
          >
            {session.user_metadata.name}
          </Title>
        )}

        {session == undefined ? (
          <Skeleton h={9} w={130} />
        ) : (
          <Text fz={'xs'} c={'dimmed'} ta={{ base: 'center', lg: 'start' }}>
            {session.email}
          </Text>
        )}
      </Stack>
    </Flex>
  );
}
