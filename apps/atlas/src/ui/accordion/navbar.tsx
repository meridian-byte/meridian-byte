'use client';

import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  ActionIcon,
  Button,
  Divider,
  Group,
  Tooltip,
} from '@mantine/core';
import { APP_NAMES_ATLAS, ASIDE_VIEW_NAMES, ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants';
import { useStoreView } from '@repo/store';
import {
  IconChevronDown,
  IconChevronRight,
  IconCircle,
  IconExternalLink,
  IconEye,
  IconHome,
  IconPlus,
} from '@tabler/icons-react';
import { SHELL_VALUES } from '@atlas/constants';
import { useView, useViewAside, useViewNavbar } from '@atlas/hooks/view';
import { useEffect, useState } from 'react';
import PartialNavbarPave from '../partial/navbar/pave';
import PartialNavbarStride from '../partial/navbar/stride';
import PartialNavbarJot from '../partial/navbar/jot';

export default function Navbar() {
  const { navbarViewValue, setNavbarViewValue } = useViewNavbar();

  const { showAsideViewPave, showAsideViewJot, showAsideViewStride } = useViewAside();
  const { showViewPave, showViewJot, showViewStride, showViewPrime, showViewTally } = useView();

  const data = [
    {
      value: APP_NAMES_ATLAS.PAVE,
      actions: {
        create: () => showAsideViewPave(ASIDE_VIEW_NAMES.NEW.PAVE.ITEM),
        switch: showViewPave,
      },
      content: <PartialNavbarPave />,
    },
    {
      value: APP_NAMES_ATLAS.JOT,
      actions: {
        create: () => showAsideViewJot(ASIDE_VIEW_NAMES.NEW.JOT.ITEM),
        switch: showViewJot,
      },
      content: <PartialNavbarJot />,
    },
    {
      value: APP_NAMES_ATLAS.STRIDE,
      actions: {
        create: () => showAsideViewStride(ASIDE_VIEW_NAMES.NEW.STRIDE.ITEM),
        switch: showViewStride,
      },
      content: <PartialNavbarStride />,
    },
    {
      value: APP_NAMES_ATLAS.PRIME,
      actions: {
        create: () => {},
        switch: showViewPrime,
      },
      content: 'Prime content',
    },
    {
      value: APP_NAMES_ATLAS.TALLY,
      actions: {
        create: () => {},
        switch: showViewTally,
      },
      content: 'Tally content',
    },
  ];

  const items = data.map((item) => {
    const props = {
      icon: (navbarViewValue || []).includes(item.value) ? IconChevronDown : IconChevronRight,
    };

    return (
      <AccordionItem key={item.value} value={item.value}>
        <AccordionControl icon={<props.icon size={ICON_SIZE} />}>
          <Group justify="space-between">
            {item.value}

            <Group component={'span'} justify="end" gap={0}>
              <Tooltip label={`Add item in ${item.value}`}>
                <ActionIcon
                  component="span"
                  size={30}
                  radius={0}
                  color="gray"
                  variant="subtle"
                  onClick={(e) => {
                    e.stopPropagation();
                    item.actions.create();
                  }}
                >
                  <IconPlus size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>

              <Tooltip label={`Go to ${item.value}`}>
                <ActionIcon
                  component="span"
                  size={30}
                  radius={0}
                  color="gray"
                  variant="subtle"
                  onClick={(e) => {
                    e.stopPropagation();
                    item.actions.switch();
                  }}
                >
                  <IconHome size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>

              <Tooltip label={`Open ${item.value} in new tab`}>
                <ActionIcon
                  component="span"
                  size={30}
                  radius={0}
                  color="gray"
                  variant="subtle"
                  onClick={(e) => {
                    e.stopPropagation();
                    // action goes here
                  }}
                >
                  <IconExternalLink size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>
        </AccordionControl>

        <AccordionPanel>
          <Divider />
          {item.content}
        </AccordionPanel>
      </AccordionItem>
    );
  });

  return (
    <Accordion
      order={3}
      value={navbarViewValue || []}
      onChange={(newValues) => setNavbarViewValue(newValues)}
      chevronIconSize={ICON_SIZE}
      chevron={null}
      keepMounted
      multiple
      styles={{
        control: { height: 30, padding: 0, paddingLeft: '5px' },
        label: { fontSize: 'var(--mantine-font-size-xs)', fontWeight: '500', padding: '0' },
        content: { padding: 0 },
      }}
    >
      {items}
    </Accordion>
  );
}
