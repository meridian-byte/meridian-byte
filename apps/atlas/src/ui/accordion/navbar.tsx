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
  Text,
  ThemeIcon,
  Tooltip,
} from '@mantine/core';
import { APP_NAMES_ATLAS, ASIDE_VIEW_NAMES, ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants';
import {
  IconChevronDown,
  IconChevronRight,
  IconExternalLink,
  IconHome,
  IconPlus,
  IconSearch,
} from '@tabler/icons-react';
import { useView, useViewAside, useViewModal, useViewNavbar } from '@repo/store';
import PartialNavbarPave from '../partial/navbar/pave';
import PartialNavbarStride from '../partial/navbar/stride';
import PartialNavbarJot from '../partial/navbar/jot';
import LayoutPartialNavbar from '../layout/partial/navbar';

export default function Navbar() {
  const { navbarViewValue, setNavbarViewValue } = useViewNavbar();

  const { showAsideViewPave, showAsideViewJot, showAsideViewStride } = useViewAside();
  const { showViewPave, showViewJot, showViewStride, showViewPrime, showViewTally } = useView();
  const { showModalViewSearch } = useViewModal();

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
    // {
    //   value: APP_NAMES_ATLAS.PRIME,
    //   actions: {
    //     create: () => {},
    //     switch: showViewPrime,
    //   },
    //   content: 'Prime content',
    // },
    // {
    //   value: APP_NAMES_ATLAS.TALLY,
    //   actions: {
    //     create: () => {},
    //     switch: showViewTally,
    //   },
    //   content: 'Tally content',
    // },
  ];

  const items = data.map((item, i) => {
    const props = {
      icon: (navbarViewValue || []).includes(item.value) ? IconChevronDown : IconChevronRight,
    };

    return (
      <AccordionItem
        key={item.value}
        value={item.value}
        className="group/accordionNavbar"
        // mb={4}
      >
        {/* {i > 0 && <Divider my={4} />} */}

        <>
          <AccordionControl
            icon={
              <ThemeIcon size={30} variant="transparent" color={'gray'}>
                <props.icon size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
              </ThemeIcon>
            }
            // mb={4}
          >
            <Group justify="space-between">
              <Text inherit fw={600}>
                {item.value}
              </Text>

              <Group
                component={'span'}
                justify="end"
                gap={0}
                className="opacity-0 group-hover/accordionNavbar:opacity-100 transition-opacity duration-250 pointer-events-none group-hover/accordionNavbar:pointer-events-auto"
                mih={30}
                pr={4}
              >
                <Tooltip label={`Search in ${item.value}`}>
                  <ActionIcon
                    component="span"
                    size={30 - 6}
                    color="gray"
                    variant="subtle"
                    onClick={(e) => {
                      e.stopPropagation();
                      showModalViewSearch(item.value);
                    }}
                  >
                    <IconSearch size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                  </ActionIcon>
                </Tooltip>

                <Tooltip label={`Add item in ${item.value}`}>
                  <ActionIcon
                    component="span"
                    size={30 - 6}
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
                    size={30 - 6}
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
              </Group>
            </Group>
          </AccordionControl>

          <AccordionPanel>
            {/* <Divider my={4} /> */}

            <LayoutPartialNavbar>{item.content}</LayoutPartialNavbar>
          </AccordionPanel>
        </>
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
      // keepMounted
      multiple
      styles={{
        control: { padding: 0, paddingLeft: 0, borderRadius: 'var(--mantine-radius-md)' },
        label: { fontSize: 'var(--mantine-font-size-xs)', fontWeight: '500', padding: '0' },
        content: { padding: 0 },
        item: { borderBottomWidth: 0 },
        icon: { marginInlineEnd: 0 },
      }}
    >
      {items}
    </Accordion>
  );
}
