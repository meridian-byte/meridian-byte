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

import { useBreakpointFlags } from '@repo/hooks';
import { memo, useCallback, useMemo } from 'react';

const EMPTY_ARRAY: string[] = [];

const Navbar = memo(function Navbar() {
  const { ready, isDesktop } = useBreakpointFlags();

  const { navbarViewValue, setNavbarViewValue } = useViewNavbar();
  const { showAsideViewPave, showAsideViewJot, showAsideViewStride } = useViewAside();
  const { viewValue, showViewPave, showViewJot, showViewStride } = useView();
  const { showModalViewSearch } = useViewModal();

  const sections = useMemo(
    () => [
      {
        value: APP_NAMES_ATLAS.PAVE,
        onCreate: () => showAsideViewPave(ASIDE_VIEW_NAMES.NEW.PAVE.ITEM),
        onSwitch: showViewPave,
        renderContent: () => <PartialNavbarPave />,
      },
      {
        value: APP_NAMES_ATLAS.JOT,
        onCreate: () => showAsideViewJot(ASIDE_VIEW_NAMES.NEW.JOT.ITEM),
        onSwitch: showViewJot,
        renderContent: () => <PartialNavbarJot />,
      },
      {
        value: APP_NAMES_ATLAS.STRIDE,
        onCreate: () => showAsideViewStride(ASIDE_VIEW_NAMES.NEW.STRIDE.ITEM),
        onSwitch: showViewStride,
        renderContent: () => <PartialNavbarStride />,
      },
    ],
    [
      showAsideViewPave,
      showAsideViewJot,
      showAsideViewStride,
      showViewPave,
      showViewJot,
      showViewStride,
    ],
  );

  const activeAccordionValues = useMemo(() => {
    if (isDesktop) {
      return navbarViewValue ?? EMPTY_ARRAY;
    }
    return viewValue ? [viewValue] : EMPTY_ARRAY;
  }, [isDesktop, navbarViewValue, viewValue]);

  const handleAccordionChange = useCallback(
    (newValues: string[]) => {
      if (isDesktop) {
        setNavbarViewValue(newValues);
      }
    },
    [isDesktop, setNavbarViewValue],
  );

  if (!ready) {
    return null;
  }

  return (
    <Accordion
      order={3}
      value={activeAccordionValues}
      onChange={handleAccordionChange}
      chevronIconSize={ICON_SIZE}
      chevron={null}
      multiple
      styles={{
        control: {
          padding: 0,
          paddingLeft: 0,
          borderRadius: 'var(--mantine-radius-md)',
          transition: 'background-color 150ms ease, color 150ms ease',
        },
        label: { fontSize: 'var(--mantine-font-size-xs)', fontWeight: 500, padding: 0 },
        content: { padding: 0 },
        item: { borderBottomWidth: 0 },
        icon: { marginInlineEnd: 0 },
      }}
    >
      {sections.map((item) => {
        const isOpen = activeAccordionValues.includes(item.value);
        const ChevronIcon = isOpen ? IconChevronDown : IconChevronRight;

        // On mobile, only mount the active app's navbar tree instead of keeping all 3 hidden in DOM
        const shouldRenderPanel = isDesktop ? isOpen : item.value === viewValue;

        return (
          <AccordionItem
            key={item.value}
            value={item.value}
            className="group/accordionNavbar"
            display={isDesktop || item.value === viewValue ? undefined : 'none'}
          >
            <AccordionControl
              icon={
                <ThemeIcon size={30} variant="transparent" color="gray">
                  <ChevronIcon size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                </ThemeIcon>
              }
              display={isDesktop ? undefined : 'none'}
            >
              <Group justify="space-between">
                <Text inherit fw={600}>
                  {item.value}
                </Text>

                <Group
                  component="span"
                  justify="end"
                  gap={0}
                  className={
                    isDesktop
                      ? 'opacity-0 group-hover/accordionNavbar:opacity-100 transition-opacity duration-200 pointer-events-none group-hover/accordionNavbar:pointer-events-auto'
                      : undefined
                  }
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
                        item.onCreate();
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
                        item.onSwitch();
                      }}
                    >
                      <IconHome size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Group>
            </AccordionControl>

            <AccordionPanel>
              {shouldRenderPanel && (
                <LayoutPartialNavbar>{item.renderContent()}</LayoutPartialNavbar>
              )}
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
});

export default Navbar;
