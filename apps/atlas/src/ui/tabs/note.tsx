'use client';

import React, { useEffect, useRef } from 'react';
import {
  ActionIcon,
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

export default function Note() {
  const tabsJotView = useStoreView((s) => s.view?.tabsJotView);
  const setTabsJotViewValue = useStoreView((s) => s.setTabsJotViewValue);

  const { subViewValue, showSubViewJot } = useSubView();
  const notes = useStoreNote((s) => s.notes);
  const noteId = extractUuidFromParam(subViewValue || '');

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
    setTabsJotViewValue(newActiveTabs);

    // 2. Only switch active view if we closed the currently active tab
    if (tabToClose === noteId) {
      if (newActiveTabs.length === 0) {
        // Handle empty state (e.g., clear subview or route back to list)
        showSubViewJot('');
      } else {
        // Focus adjacent tab (previous item, or 0 if index was 0)
        const newIndex = Math.max(0, currentIndex - 1);
        showSubViewJot(`note: ${newActiveTabs[newIndex].tab}`);
      }
    }
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

  return (
    <Tabs
      value={noteId}
      styles={{
        tab: { borderRadius: 0, padding: '6px 10px' },
        tabLabel: { lineHeight: 1.3 },
        panel: {
          paddingTop: SECTION_SPACING / 2,
          paddingBottom: SECTION_SPACING / 2,
        },
      }}
    >
      <TabsList>
        <ScrollArea w={'100%'} scrollbars={'x'} scrollbarSize={0}>
          <Group wrap="nowrap" gap={0}>
            {(tabsJotView || []).map((ati, i) => {
              const note = notes?.find((ni) => ni.id == ati.tab);

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
                      <ActionIcon
                        component="span"
                        size={ICON_SIZE - 4}
                        color="gray"
                        variant="subtle"
                        radius={0}
                        onClick={(e) => handleCloseTab(e, ati.tab)}
                      >
                        <IconX size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
                      </ActionIcon>
                    )
                  }
                  styles={{
                    tab: {
                      // Allows tab to grow up to 240px, but shrink down to 120px
                      flex: `1 1 ${MAX_TAB_WIDTH}px`,
                      maxWidth: MAX_TAB_WIDTH,
                      minWidth: MIN_TAB_WIDTH,
                    },
                    tabLabel: {
                      overflow: 'hidden',
                    },
                  }}
                >
                  <Tooltip label={note?.title} multiline maw={320}>
                    <Text
                      component="span"
                      inherit
                      lineClamp={1}
                      fs={ati.persistent ? 'normal' : 'italic'}
                      pr={'xs'}
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

      {(tabsJotView || []).map((ati) => (
        <TabsPanel key={ati.tab} value={ati.tab} onClick={() => handleMakePersistent(ati.tab)}>
          <InputTextEditorTitle noteId={ati.tab} />
          <EditorMain noteId={ati.tab} />
        </TabsPanel>
      ))}
    </Tabs>
  );
}

const MAX_TAB_WIDTH = 240;
const MIN_TAB_WIDTH = 120;
