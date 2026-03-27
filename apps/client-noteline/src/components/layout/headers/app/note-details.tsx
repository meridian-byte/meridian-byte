'use client';

import React from 'react';
import LayoutSection from '@repo/components/layout/section';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import {
  ActionIcon,
  Group,
  Skeleton,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconArrowRight,
  IconBook,
  IconDotsVertical,
  IconWriting,
} from '@tabler/icons-react';
import { NoteGet } from '@repo/types/models/note';
import { useRouter } from 'next/navigation';
import MenuNoteMain from '@repo/components/common/menus/note/main';
import { useStoreUserStates } from '@repo/libraries/zustand/stores/user-states';

export default function NoteDetails({ props }: { props?: NoteGet }) {
  const { userStates, setUserStates } = useStoreUserStates();
  const router = useRouter();

  const toogleProperties = {
    view: userStates?.editing == true ? 'Editing' : 'Reading',
    label: userStates?.editing == true ? 'read' : 'edit',
    icon: userStates?.editing == true ? IconBook : IconWriting,
  };

  return (
    <LayoutSection
      id={`note-details-header`}
      containerized={false}
      pos={'sticky'}
      top={0}
      style={{ zIndex: 1 }}
    >
      <Group
        p={'xs'}
        justify="space-between"
        bg={
          'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))'
        }
        wrap="nowrap"
      >
        <Group gap={5} wrap="nowrap">
          <Tooltip label={'Navigate Back'}>
            <ActionIcon
              size={ICON_WRAPPER_SIZE}
              variant={'subtle'}
              onClick={() => router.back()}
            >
              <IconArrowLeft size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label={'Navigate Forward'}>
            <ActionIcon
              size={ICON_WRAPPER_SIZE}
              variant={'subtle'}
              onClick={() => router.forward()}
            >
              <IconArrowRight size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>
          </Tooltip>
        </Group>

        <Group gap={5} wrap="nowrap">
          {props && (
            <Title
              order={1}
              fz={'sm'}
              fw={'normal'}
              ta={'center'}
              lineClamp={1}
            >
              {props.title}
            </Title>
          )}
        </Group>

        {props && (
          <Group gap={5} wrap="nowrap">
            {userStates === undefined ? (
              <Skeleton h={ICON_WRAPPER_SIZE} w={ICON_WRAPPER_SIZE} />
            ) : (
              <Tooltip
                label={
                  <Stack ta={'center'} gap={0}>
                    <Text inherit>Current View: {toogleProperties.view}</Text>
                    <Text inherit>Click to {toogleProperties.label}</Text>
                  </Stack>
                }
                multiline
                w={160}
              >
                <ActionIcon
                  size={ICON_WRAPPER_SIZE}
                  variant={'subtle'}
                  onClick={() =>
                    setUserStates({
                      ...userStates,
                      editing: !userStates?.editing,
                    })
                  }
                >
                  <toogleProperties.icon
                    size={ICON_SIZE}
                    stroke={ICON_STROKE_WIDTH}
                  />
                </ActionIcon>
              </Tooltip>
            )}

            <MenuNoteMain item={props}>
              <Group>
                <Tooltip label={'More options'}>
                  <ActionIcon size={ICON_WRAPPER_SIZE} variant={'subtle'}>
                    <IconDotsVertical
                      size={ICON_SIZE}
                      stroke={ICON_STROKE_WIDTH}
                    />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </MenuNoteMain>
          </Group>
        )}
      </Group>
    </LayoutSection>
  );
}
