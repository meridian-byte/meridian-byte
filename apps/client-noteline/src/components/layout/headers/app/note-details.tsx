'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import LayoutSection from '@repo/components/layout/section';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import {
  ActionIcon,
  Box,
  Divider,
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
import { useRouter, useSearchParams } from 'next/navigation';
import MenuNoteMain from '@repo/components/common/menus/note/main';
import { useStoreUserStates } from '@repo/libraries/zustand/stores/user-states';
import WrapperUnderlayGlass from '@repo/components/wrappers/underlays/glass';
import ButtonsFullscreen from '@repo/components/common/buttons/fullscreen';
import { useScroll } from '@repo/hooks/scroll';

export default function NoteDetails({ props }: { props?: NoteGet }) {
  const { styles } = useScroll({
    threshold: 70,
    defaultStyles: useMemo(() => ({ opacity: 0 }), []),
    scrolledStyles: useMemo(() => ({ opacity: 1 }), []),
  });
  // const searchParams = useSearchParams();
  const router = useRouter();
  // const userStates = useStoreUserStates((s) => s.userStates);
  // const setUserStates = useStoreUserStates((s) => s.setUserStates);

  // const toogleProperties = {
  //   view: userStates?.editing == true ? 'Editing' : 'Reading',
  //   label: userStates?.editing == true ? 'read' : 'edit',
  //   icon: userStates?.editing == true ? IconBook : IconWriting,
  // };

  // useEffect(() => {
  //   if (!userStates) return;
  //   if (!props) return;
  //   if (!props.content) return;

  //   if (!userStates.editing) setUserStates({ ...userStates, editing: true });
  // }, [searchParams]);

  return (
    <Box
      pos={'sticky'}
      top={0}
      style={{ zIndex: 1 }}
      display={!props ? 'none' : undefined}
    >
      <LayoutSection id={`note-details-header`} containerized={false}>
        <WrapperUnderlayGlass props={{ blur: 4, opacity: 0.8 }}>
          <Group p={'xs'} justify="space-between" wrap="nowrap">
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
              <Title
                order={1}
                fz={'sm'}
                fw={'normal'}
                ta={'center'}
                lineClamp={1}
                style={{ ...styles, transition: '0.25s all ease' }}
              >
                {props?.title}
              </Title>
            </Group>

            <Group gap={5} wrap="nowrap">
              <Box visibleFrom="xs">
                <ButtonsFullscreen />
              </Box>

              {/* {userStates === undefined ? (
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
              )} */}

              {props && (
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
              )}
            </Group>
          </Group>
        </WrapperUnderlayGlass>
      </LayoutSection>

      <Box px={'xs'} style={{ ...styles, transition: '0.25s all ease' }}>
        <Divider color="light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-7))" />
      </Box>
    </Box>
  );
}
