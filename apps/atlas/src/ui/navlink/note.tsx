'use client';

import { ActionIcon, Group, NavLink, Text, ThemeIcon, Tooltip } from '@mantine/core';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants';
import { useSubView } from '@repo/store';
import { CalendarGet, NoteGet } from '@repo/types';
import { extractUuidFromParam } from '@repo/utils';
import { IconCircleFilled, IconDots, IconNote } from '@tabler/icons-react';
import MenuNote from '../menu/note';

export default function Note({ props }: { props: NoteGet }) {
  const { subViewValue, showSubViewJot } = useSubView();

  const noteActive =
    subViewValue?.includes('note: ') && extractUuidFromParam(subViewValue) == props.id;

  return (
    <div className="group/note">
      <NavLink
        label={
          <Tooltip label={props.title} multiline maw={320} position="top-start" arrowOffset={16}>
            <Text component="span" inherit lineClamp={1} lh={2}>
              {props.title}
            </Text>
          </Tooltip>
        }
        color="gray"
        p={0}
        fw={600}
        leftSection={
          <ThemeIcon size={30} color="gray" variant="transparent">
            <IconNote size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
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
            pr={4}
          >
            <MenuNote defaultValues={props}>
              <ActionIcon size={30 - 6} color="gray" variant="subtle">
                <IconDots size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            </MenuNote>
          </Group>
        }
        style={{ borderRadius: 'var(--mantine-radius-md)' }}
        styles={{
          section: { marginInlineEnd: 0 },
          label: {
            fontSize: 'var(--mantine-font-size-xs)',
            color: !noteActive ? undefined : 'var(--mantine-color-pri-6)',
          },
        }}
        onClick={() => showSubViewJot(`note: ${props.id}`)}
      />
    </div>
  );
}
