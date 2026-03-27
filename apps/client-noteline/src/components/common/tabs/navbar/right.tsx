import React from 'react';
import {
  Group,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  ThemeIcon,
  Tooltip,
} from '@mantine/core';
import classes from './right.module.scss';
import { IconSwipeLeft, IconSwipeRight, IconTags } from '@tabler/icons-react';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';

export default function Right() {
  return (
    <Tabs defaultValue="backlinks" variant="pills" classNames={classes}>
      <TabsList
        style={{ gap: 5 }}
        pos={'sticky'}
        top={0}
        px={'xs'}
        bg={
          'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))'
        }
      >
        <TabsTab value="backlinks">
          <Tooltip label={'Backlinks for x'}>
            <Group justify="center">
              <ThemeIcon size={ICON_WRAPPER_SIZE} variant={'transparent'}>
                <IconSwipeLeft size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ThemeIcon>
            </Group>
          </Tooltip>
        </TabsTab>

        <TabsTab value="links">
          <Tooltip label={'Outgoing Links from x'}>
            <Group justify="center">
              <ThemeIcon size={ICON_WRAPPER_SIZE} variant={'transparent'}>
                <IconSwipeRight size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ThemeIcon>
            </Group>
          </Tooltip>
        </TabsTab>

        <TabsTab value="tags">
          <Tooltip label={'Tags'}>
            <Group justify="center">
              <ThemeIcon size={ICON_WRAPPER_SIZE} variant={'transparent'}>
                <IconTags size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ThemeIcon>
            </Group>
          </Tooltip>
        </TabsTab>
      </TabsList>

      <TabsPanel value="backlinks">backlinks</TabsPanel>

      <TabsPanel value="links">links</TabsPanel>

      <TabsPanel value="tags">Tags</TabsPanel>
    </Tabs>
  );
}
