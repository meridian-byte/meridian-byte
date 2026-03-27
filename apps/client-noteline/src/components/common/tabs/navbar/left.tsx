import React from 'react';
import {
  Box,
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
import ButtonAppshellNavbar from '@repo/components/common/buttons/appshell/navbar';

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
          <Tooltip label={'All notes'}>
            <Group justify="center">
              <ThemeIcon
                size={ICON_WRAPPER_SIZE}
                variant={'transparent'}
                color="dark"
              >
                <IconFolder size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ThemeIcon>
            </Group>
          </Tooltip>
        </TabsTab>

        <TabsTab value="search">
          <Tooltip label={'Search notes'}>
            <Group justify="center">
              <ThemeIcon
                size={ICON_WRAPPER_SIZE}
                variant={'transparent'}
                color="dark"
              >
                <IconSearch size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              </ThemeIcon>
            </Group>
          </Tooltip>
        </TabsTab>

        <Group hiddenFrom="md" ml={'auto'}>
          <ButtonAppshellNavbar />
        </Group>
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
