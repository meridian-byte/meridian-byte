'use client';

import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  ActionIcon,
  Box,
  Group,
  NavLink,
  ScrollArea,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  ThemeIcon,
  Tooltip,
} from '@mantine/core';
import { useStoreNote, useStoreView, useSubView } from '@repo/store';
import { extractUuidFromParam } from '@repo/utils';
import { IconNote, IconX } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE, SECTION_SPACING } from '@repo/constants';
import InputTextEditorTitle from '@atlas/ui/input/text/editor-title';
import EditorMain from '@atlas/ui/editor/main';
import { SHELL_VALUES } from '@atlas/constants';
import { ScrollContext, useBreakpointFlags } from '@repo/hooks';
import { useNoteTitle } from '@atlas/hooks/input';
import { LayoutSection } from '@repo/ui';

const MAX_TAB_WIDTH = 240;
const MIN_TAB_WIDTH = 180;

const TABS_STYLES = {
  tab: {
    borderRadius: 'var(--mantine-radius-md)',
    borderBottomColor: 'transparent',
    transition: 'background-color 150ms ease, color 150ms ease',
  },
};

const TITLE_INPUT_STYLES = {
  input: {
    fontSize: 'var(--mantine-h2-font-size)',
    backgroundColor: 'transparent',
  },
};

const MemoEditorMain = memo(EditorMain);

interface JotTabEntry {
  tab: string;
  persistent: boolean;
}

const NoteTabItem = memo(function NoteTabItem({
  entry,
  isActive,
  canClose,
  isDesktop,
  setTabRef,
  onSelect,
  onMakePersistent,
  onClose,
}: {
  entry: JotTabEntry;
  isActive: boolean;
  canClose: boolean;
  isDesktop: boolean;
  setTabRef: (tabId: string, node: HTMLButtonElement | null) => void;
  onSelect: (tabId: string) => void;
  onMakePersistent: (tabId: string) => void;
  onClose: (e: React.MouseEvent, tabId: string) => void;
}) {
  const noteTitle = useStoreNote((s) => s.notes?.find((ni) => ni.id === entry.tab)?.title);

  const tabStyles = useMemo(
    () => ({
      tab: {
        backgroundColor: 'transparent',
        padding: 0,
        display: 'flex',
        flex: `1 1 ${MAX_TAB_WIDTH}px`,
        maxWidth: MAX_TAB_WIDTH,
        minWidth: MIN_TAB_WIDTH,
      },
      tabLabel: {
        overflow: 'hidden',
        textAlign: 'start' as const,
      },
    }),
    [],
  );

  const navLinkStyles = useMemo(
    () => ({
      section: isDesktop ? { marginInlineEnd: 0 } : undefined,
      root: {
        backgroundColor: isActive ? 'var(--mantine-color-pri-light)' : undefined,
      },
      label: {
        fontSize: isDesktop ? 'var(--mantine-font-size-xs)' : undefined,
        color: isActive ? 'var(--mantine-color-pri-6)' : undefined,
      },
    }),
    [isDesktop, isActive],
  );

  const handleRef = useCallback(
    (node: HTMLButtonElement | null) => {
      setTabRef(entry.tab, node);
    },
    [setTabRef, entry.tab],
  );

  const handleClick = useCallback(() => {
    onSelect(entry.tab);
  }, [onSelect, entry.tab]);

  const handleDoubleClick = useCallback(() => {
    onMakePersistent(entry.tab);
  }, [onMakePersistent, entry.tab]);

  const handleCloseClick = useCallback(
    (e: React.MouseEvent) => {
      onClose(e, entry.tab);
    },
    [onClose, entry.tab],
  );

  const actionSize = isDesktop ? 30 - 6 : ICON_WRAPPER_SIZE;
  const actionIconSize = isDesktop ? ICON_SIZE - 4 : ICON_SIZE;

  return (
    <Tabs.Tab
      value={entry.tab}
      ref={handleRef}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      my={5}
      styles={tabStyles}
    >
      <NavLink
        label={
          <Tooltip label={noteTitle} multiline maw={320}>
            <Text
              inherit
              component="span"
              style={{ display: 'inline-block', maxWidth: '100%', marginTop: 4 }}
              lineClamp={1}
              fs={entry.persistent ? 'normal' : 'italic'}
              fw={600}
            >
              {noteTitle}
            </Text>
          </Tooltip>
        }
        color="gray"
        p={isDesktop ? 0 : undefined}
        mih={isDesktop ? 30 : undefined}
        fw={600}
        styles={navLinkStyles}
        leftSection={
          isDesktop ? (
            <ThemeIcon
              size={30}
              variant="transparent"
              color="gray"
              c={isActive ? 'pri' : undefined}
            >
              <IconNote size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
            </ThemeIcon>
          ) : undefined
        }
        rightSection={
          <Group
            gap={0}
            wrap="nowrap"
            mih={isDesktop ? 30 - 6 : ICON_WRAPPER_SIZE}
            pr={isDesktop ? 4 : 0}
          >
            <ActionIcon
              component="span"
              size={actionSize}
              color={isActive ? 'pri' : 'gray'}
              variant={isDesktop ? 'subtle' : 'light'}
              onClick={handleCloseClick}
              display={canClose ? undefined : 'none'}
            >
              <IconX size={actionIconSize} stroke={ICON_STROKE_WIDTH} />
            </ActionIcon>
          </Group>
        }
      />
    </Tabs.Tab>
  );
});

const NoteTabPanel = memo(function NoteTabPanel({
  tabId,
  isActive,
  isDesktop,
  isMobile,
  scrollHeight,
  onMakePersistent,
}: {
  tabId: string;
  isActive: boolean;
  isDesktop: boolean;
  isMobile: boolean;
  scrollHeight: string;
  onMakePersistent: (tabId: string) => void;
}) {
  const { field, inputRef, handleBlur, handleKeyDown } = useNoteTitle(tabId);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const handlePanelClick = useCallback(() => {
    onMakePersistent(tabId);
  }, [onMakePersistent, tabId]);

  const inputProps = useMemo(() => field.getInputProps(), [field]);

  return (
    <Box onClick={handlePanelClick} style={{ display: isActive ? undefined : 'none' }}>
      <ScrollContext.Provider value={viewportRef}>
        <ScrollArea h={scrollHeight} viewportRef={viewportRef}>
          <Box pt={SECTION_SPACING / 2}>
            <LayoutSection id="note-details" containerized={isMobile ? false : 'md'}>
              <Box px={{ base: 'xs', xs: 0 }}>
                <InputTextEditorTitle
                  inputProps={inputProps}
                  inputRef={inputRef}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  styles={TITLE_INPUT_STYLES}
                />
              </Box>
            </LayoutSection>

            <MemoEditorMain noteId={tabId} />
          </Box>
        </ScrollArea>
      </ScrollContext.Provider>
    </Box>
  );
});

export default function Note() {
  const { ready, isMobile, isDesktop } = useBreakpointFlags();

  const tabsJotView = useStoreView((s) => s.view?.tabsJotView) as JotTabEntry[] | undefined;
  const setTabsJotViewValue = useStoreView((s) => s.setTabsJotViewValue);

  const subViewValue = useStoreView((s) => s.view?.subView);
  const { showSubViewJot } = useSubView();

  const noteId = useMemo(
    () => (subViewValue ? extractUuidFromParam(subViewValue) : ''),
    [subViewValue],
  );

  // Sync active note into open tabs list
  useEffect(() => {
    if (tabsJotView === undefined || !subViewValue || !noteId) return;

    if (tabsJotView.some((ati) => ati.tab === noteId)) {
      return;
    }

    const hasTemporary = tabsJotView.some((ati) => !ati.persistent);
    const filteredTabs = hasTemporary ? tabsJotView.filter((ati) => ati.persistent) : tabsJotView;

    setTabsJotViewValue([...filteredTabs, { tab: noteId, persistent: false }]);
  }, [noteId, subViewValue, tabsJotView, setTabsJotViewValue]);

  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const setTabRef = useCallback((tabId: string, node: HTMLButtonElement | null) => {
    tabRefs.current[tabId] = node;
  }, []);

  useEffect(() => {
    if (!noteId) return;

    const frameId = requestAnimationFrame(() => {
      const activeTabEl = tabRefs.current[noteId];
      if (activeTabEl) {
        activeTabEl.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest',
        });
      }
    });

    return () => cancelAnimationFrame(frameId);
  }, [noteId]);

  const handleSelectTab = useCallback(
    (tabId: string) => {
      showSubViewJot(`note: ${tabId}`);
    },
    [showSubViewJot],
  );

  const handleCloseTab = useCallback(
    (e: React.MouseEvent, tabToClose: string) => {
      e.stopPropagation();
      delete tabRefs.current[tabToClose];

      const currentTabs = tabsJotView || [];
      const currentIndex = currentTabs.findIndex((ati) => ati.tab === tabToClose);
      if (currentIndex === -1) return;

      const nextTabs = currentTabs.filter((ati) => ati.tab !== tabToClose);

      if (tabToClose === noteId) {
        if (nextTabs.length === 0) {
          showSubViewJot('');
        } else {
          const nextIndex = Math.max(0, currentIndex - 1);
          showSubViewJot(`note: ${nextTabs[nextIndex].tab}`);
        }
      }

      setTabsJotViewValue(nextTabs);
    },
    [tabsJotView, noteId, showSubViewJot, setTabsJotViewValue],
  );

  const handleMakePersistent = useCallback(
    (targetTab: string) => {
      const currentTabs = tabsJotView || [];
      setTabsJotViewValue(
        currentTabs.map((item) => (item.tab === targetTab ? { ...item, persistent: true } : item)),
      );
    },
    [tabsJotView, setTabsJotViewValue],
  );

  const scrollHeight = useMemo(() => {
    const shellOffsets = isDesktop
      ? SHELL_VALUES.FOOTER.HEIGHT.DESKTOP
      : SHELL_VALUES.FOOTER.HEIGHT.MOBILE + SHELL_VALUES.HEADER.HEIGHT.MOBILE;
    const tabBarAndHeaderOffsets = isDesktop ? 34 : 45;
    const footerBarOffset = isDesktop ? 41.6 : 55.6;
    return `calc(100vh - ${shellOffsets + tabBarAndHeaderOffsets + 1 + footerBarOffset}px)`;
  }, [isDesktop]);

  if (!ready) {
    return null;
  }

  const tabList = tabsJotView || [];
  const canClose = tabList.length > 1;

  return (
    <Tabs value={noteId} keepMounted styles={TABS_STYLES}>
      <Tabs.List>
        <ScrollArea w="100%" scrollbars="x" scrollbarSize={0}>
          <Group wrap="nowrap" gap={4} px={5}>
            {tabList.map((entry) => (
              <NoteTabItem
                key={entry.tab}
                entry={entry}
                isActive={entry.tab === noteId}
                canClose={canClose}
                isDesktop={isDesktop}
                setTabRef={setTabRef}
                onSelect={handleSelectTab}
                onMakePersistent={handleMakePersistent}
                onClose={handleCloseTab}
              />
            ))}
          </Group>
        </ScrollArea>
      </Tabs.List>

      <Box>
        {tabList.map((entry) => (
          <NoteTabPanel
            key={entry.tab}
            tabId={entry.tab}
            isActive={entry.tab === noteId}
            isDesktop={isDesktop}
            isMobile={isMobile}
            scrollHeight={scrollHeight}
            onMakePersistent={handleMakePersistent}
          />
        ))}
      </Box>
    </Tabs>
  );
}
