'use client';

import { ActionIcon, Group, NavLink, Text, ThemeIcon, Tooltip } from '@mantine/core';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants';
import { useStoreAppShell, useSubView } from '@repo/store';
import { CalendarGet, NoteGet } from '@repo/types';
import { extractUuidFromParam } from '@repo/utils';
import { IconCircleFilled, IconDots, IconNote } from '@tabler/icons-react';
import MenuNote from '../menu/note';
import { useMediaQuery } from '@mantine/hooks';

export default function Note({ props }: { props: NoteGet }) {
  const desktop = useMediaQuery('(min-width: 62em)');

  const navbarActive = useStoreAppShell((s) => s.appshell?.child?.navbar);
  const toggleNavbarChild = useStoreAppShell((s) => s.toggleNavbarChild);

  const { subViewValue, showSubViewJot } = useSubView();

  const noteActive =
    subViewValue?.includes('note: ') && extractUuidFromParam(subViewValue) == props.id;

  return (
    <div className="group/note" style={{ overflow: 'hidden' }}>
      <MenuNote defaultValues={props} options={{ context: true }}>
        <NavLink
          label={
            <Tooltip label={props.title} multiline maw={320} position="top-start" arrowOffset={16}>
              <Text component="span" inherit lineClamp={1} lh={2}>
                {props.title}
              </Text>
            </Tooltip>
          }
          color="gray"
          p={desktop ? 0 : undefined}
          fw={600}
          styles={{
            section: desktop ? { marginInlineEnd: 0 } : undefined,
            label: {
              fontSize: desktop ? 'var(--mantine-font-size-xs)' : undefined,
              color: !noteActive ? undefined : 'var(--mantine-color-pri-6)',
            },
          }}
          leftSection={
            <ThemeIcon
              size={desktop ? 30 : ICON_WRAPPER_SIZE}
              color="gray"
              c={noteActive ? 'pri' : 'gray'}
              variant="transparent"
            >
              <IconNote size={desktop ? ICON_SIZE - 4 : ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            </ThemeIcon>
          }
          rightSection={
            <Group
              gap={0}
              wrap="nowrap"
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="opacity-0 group-hover/note:opacity-100 transition-opacity duration-250"
              mih={30}
              pr={5}
              visibleFrom="md"
            >
              <MenuNote defaultValues={props}>
                <ActionIcon size={30 - 6} color="gray" variant="subtle">
                  <IconDots size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </MenuNote>
            </Group>
          }
          onClick={() => {
            if (!desktop) {
              if (navbarActive) toggleNavbarChild();
            }

            showSubViewJot(`note: ${props.id}`);
          }}
        />
      </MenuNote>
    </div>
  );
}
