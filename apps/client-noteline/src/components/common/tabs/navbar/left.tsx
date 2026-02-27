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
import classes from './left.module.scss';
import { IconFolder, IconSearch } from '@tabler/icons-react';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import PartialTabNavbarNotes from '@/components/partial/tabs/navbar/notes';
import PartialTabNavbarSearch from '@/components/partial/tabs/navbar/search';

export default function Left() {
  return (
    <Tabs defaultValue="folders" variant="pills" classNames={classes}>
      <TabsList
        style={{ gap: 5, zIndex: 1 }}
        pos={'sticky'}
        top={0}
        pl={'xs'}
        mr={'xs'}
        bg={
          'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))'
        }
      >
        <TabsTab value="folders">
          <Tooltip label={'Files & folders'}>
            <Group justify="center">
              <ThemeIcon size={ICON_WRAPPER_SIZE} variant={'transparent'}>
                <IconFolder size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ThemeIcon>
            </Group>
          </Tooltip>
        </TabsTab>

        <TabsTab value="search">
          <Tooltip label={'Search'}>
            <Group justify="center">
              <ThemeIcon size={ICON_WRAPPER_SIZE} variant={'transparent'}>
                <IconSearch size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ThemeIcon>
            </Group>
          </Tooltip>
        </TabsTab>
      </TabsList>

      <TabsPanel value="folders">
        <PartialTabNavbarNotes />
      </TabsPanel>

      <TabsPanel value="search">
        <PartialTabNavbarSearch />
      </TabsPanel>
    </Tabs>
  );
}
