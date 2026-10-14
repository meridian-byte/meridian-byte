'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import {
  ActionIcon,
  Box,
  Group,
  ScrollArea,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  Tooltip,
} from '@mantine/core';
import { useStoreNote, useStoreView, useSubView } from '@repo/store';
import { extractUuidFromParam } from '@repo/utils';
import { IconX } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH, SECTION_SPACING } from '@repo/constants';
import InputTextEditorTitle from '@atlas/ui/input/text/editor-title';
import EditorMain from '@atlas/ui/editor/main';
import { SHELL_VALUES } from '@atlas/constants';
import { ScrollContext } from '@repo/hooks';
import { useNoteTitle } from '@atlas/hooks/input';
import { useMediaQuery } from '@mantine/hooks';
import { LayoutSection } from '@repo/ui';

export default function Note() {
  const mobile = useMediaQuery('(max-width: 36em)');
  const desktop = useMediaQuery('(min-width: 62em)');

  const tabsJotView = useStoreView((s) => s.view?.tabsJotView);
  const setTabsJotViewValue = useStoreView((s) => s.setTabsJotViewValue);

  const { subViewValue, showSubViewJot } = useSubView();
  const notes = useStoreNote((s) => s.notes);
  const noteId = extractUuidFromParam(subViewValue || '');

  const { field, inputRef, handleBlur, handleKeyDown } = useNoteTitle(noteId || '');

  useEffect(() => {
    if (tabsJotView === undefined) return;
    if (!subViewValue || !noteId) return;

    let resolvedArray = [];

    if (tabsJotView.some((ati) => ati.tab === noteId)) {
      // If already open, do nothing
      resolvedArray = tabsJotView;
    } else {
      // Replace existing temporary tab if present, otherwise append
      const hasTemporary = tabsJotView.some((ati) => !ati.persistent);
      const filteredTabs = hasTemporary ? tabsJotView.filter((ati) => ati.persistent) : tabsJotView;

      resolvedArray = [...filteredTabs, { tab: noteId, persistent: false }];
    }

    setTabsJotViewValue(resolvedArray);
  }, [noteId, subViewValue]);

  const handleCloseTab = (e: React.MouseEvent, tabToClose: string) => {
    // 1. Prevent trigger of TabsTab onClick (which re-activates this tab)
    e.stopPropagation();

    // Clean up ref entry
    delete tabRefs.current[tabToClose];

    const currentIndex = (tabsJotView || []).findIndex((ati) => ati.tab === tabToClose);
    if (currentIndex === -1) return;

    const newActiveTabs = (tabsJotView || []).filter((ati) => ati.tab !== tabToClose);

    // 2. If we are closing the currently active tab, switch views FIRST
    if (tabToClose === noteId) {
      if (newActiveTabs.length === 0) {
        // Handle empty state
        showSubViewJot('');
      } else {
        // Focus adjacent tab index
        const newIndex = Math.max(0, currentIndex - 1);
        showSubViewJot(`note: ${newActiveTabs[newIndex].tab}`);
      }
    }

    // 3. Update the tabs collection after initiating the view change
    setTabsJotViewValue(newActiveTabs);
  };

  const handleMakePersistent = (targetTab: string) => {
    setTabsJotViewValue(
      (tabsJotView || []).map((item) =>
        item.tab === targetTab ? { ...item, persistent: true } : item,
      ),
    );
  };

  // scroll into view
  // 1. Create a dictionary ref to store DOM node references for each tab
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // 2. Scroll active tab into view whenever `noteId` changes
  useEffect(() => {
    if (!noteId) return;

    // Defer execution slightly to allow React to mount the new tab node into the DOM
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
  }, [noteId, tabsJotView]); // Ensure `tabsJotView` is in the dependency array

  // scrollarea
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const contextValue = useMemo(() => viewportRef, []);

  return (
    <Tabs
      value={noteId}
      keepMounted
      styles={{
        tab: {
          borderRadius: 'var(--mantine-radius-md)',
          borderBottomColor: 'transparent',
          transition: '.25s all ease',
        },
        tabLabel: { lineHeight: 1.3 },
      }}
    >
      <TabsList px={5}>
        <ScrollArea w={'100%'} scrollbars={'x'} scrollbarSize={0}>
          <Group wrap="nowrap" gap={4}>
            {(tabsJotView || []).map((ati, i) => {
              const note = notes?.find((ni) => ni.id == ati.tab);
              const active = ati.tab == noteId;

              return (
                <TabsTab
                  key={ati.tab}
                  value={ati.tab}
                  // 3. Attach DOM node reference using tab ID
                  ref={(node) => {
                    tabRefs.current[ati.tab] = node;
                  }}
                  onClick={() => showSubViewJot(`note: ${ati.tab}`)}
                  onDoubleClick={() => handleMakePersistent(ati.tab)}
                  rightSection={
                    (tabsJotView || []).length > 1 && (
                      <Group gap={0} wrap="nowrap" mih={30} pr={4}>
                        <ActionIcon
                          component="span"
                          size={30 - 6}
                          color="gray"
                          variant="subtle"
                          onClick={(e) => handleCloseTab(e, ati.tab)}
                        >
                          <IconX size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                        </ActionIcon>
                      </Group>
                    )
                  }
                  my={5}
                  styles={{
                    tab: {
                      minHeight: 30,
                      backgroundColor: active
                        ? 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))'
                        : undefined,
                      paddingTop: 0,
                      paddingRight: 0,
                      paddingBottom: 0,
                      paddingLeft: 'var(--mantine-spacing-xs)',
                      display: 'flex',

                      // Allows tab to grow up to 240px, but shrink down to 120px
                      flex: `1 1 ${MAX_TAB_WIDTH}px`,
                      maxWidth: MAX_TAB_WIDTH,
                      minWidth: MIN_TAB_WIDTH,
                    },
                    tabLabel: {
                      overflow: 'hidden',
                      textAlign: 'start',
                    },
                  }}
                >
                  <Tooltip label={note?.title} multiline maw={320}>
                    <Text
                      inherit
                      component="span"
                      style={{ display: 'inline-block', maxWidth: '100%', marginTop: 4 }}
                      lineClamp={1}
                      fs={ati.persistent ? 'normal' : 'italic'}
                      fw={600}
                    >
                      {note?.title}
                    </Text>
                  </Tooltip>
                </TabsTab>
              );
            })}
          </Group>
        </ScrollArea>
      </TabsList>

      <Box>
        {(tabsJotView || []).map((ati) => (
          <Box
            key={ati.tab}
            onClick={() => handleMakePersistent(ati.tab)}
            style={{
              display: ati.tab === noteId ? undefined : 'none',
            }}
          >
            <ScrollContext.Provider value={contextValue}>
              <ScrollArea
                h={`calc(100vh - ${(desktop ? SHELL_VALUES.FOOTER.HEIGHT.DESKTOP : SHELL_VALUES.FOOTER.HEIGHT.MOBILE + SHELL_VALUES.HEADER.HEIGHT.MOBILE) + 38 + 1 + 41.6}px)`}
                viewportRef={contextValue}
              >
                <Box pt={SECTION_SPACING / 2}>
                  <LayoutSection id="note-details" containerized={mobile ? false : 'md'}>
                    <Box px={{ base: 'xs', xs: 0 }}>
                      <InputTextEditorTitle
                        inputProps={field.getInputProps()}
                        inputRef={inputRef}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        styles={{
                          input: {
                            fontSize: 'var(--mantine-h2-font-size)',
                            backgroundColor: 'transparent',
                          },
                        }}
                      />
                    </Box>
                  </LayoutSection>

                  <EditorMain noteId={ati.tab} />
                </Box>
              </ScrollArea>
            </ScrollContext.Provider>
          </Box>
        ))}
      </Box>
    </Tabs>
  );
}

const MAX_TAB_WIDTH = 240;
const MIN_TAB_WIDTH = 120;
