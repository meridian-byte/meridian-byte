'use client';

import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { RichTextEditor, Link, RichTextEditorControlsGroup } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import Placeholder from '@tiptap/extension-placeholder';
import { TableKit } from '@tiptap/extension-table';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import { BubbleMenu } from '@tiptap/react/menus';
import { ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE, SECTION_SPACING } from '@repo/constants';
import { useNoteActions, useStoreNote } from '@repo/store';
import { NoteGet } from '@repo/types';
import { useDebouncedCallback, useIdle, useMediaQuery } from '@mantine/hooks';
import {
  Box,
  Button,
  Divider,
  Group,
  ScrollArea,
  Title,
  Transition,
  Typography,
} from '@mantine/core';
import { WrapperUnderlayGlass } from '@repo/ui';
import classes from './main.module.css';
import { useSearchParams } from 'next/navigation';
import { useBreakpointFlags, useScroll } from '@repo/hooks';
import { useStoreUserStates } from '@repo/store';
import { ParserHtml } from '@repo/ui';
import { LayoutSection } from '@repo/ui';

const TOOLBAR_DIVIDER = (
  <Divider
    orientation="vertical"
    color="light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-6))"
    style={{ margin: '0 5px' }}
  />
);

const BUBBLE_GROUP_STYLES = {
  border: '1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-7))',
};

const TOOLBAR_STYLE = {
  flexWrap: 'nowrap' as const,
  backgroundColor: 'transparent',
};

function createEditorExtensions() {
  return [
    StarterKit.configure({ link: false }),
    Link,
    Superscript,
    SubScript,
    Highlight,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Placeholder.configure({ placeholder: 'Write something…' }),
    TableKit.configure({ table: { resizable: true } }),
    TaskList,
    TaskItem.configure({ nested: true }),
  ];
}

export default memo(function Main({ noteId }: { noteId: string }) {
  const { ready, isMobile } = useBreakpointFlags();

  // Select only the target note instead of subscribing to all notes
  const note = useStoreNote((s) => s.notes?.find((ni) => ni.id === noteId));
  const isEditing = useStoreUserStates((s) => s.userStates?.editing === true);
  const { noteCreate, noteUpdate } = useNoteActions();
  const idle = useIdle(2000);

  // Track HTML without calling editor.getHTML() on every render
  const [htmlContent, setHtmlContent] = useState<string>(() => note?.content || '');

  // Keep latest note reference in a ref so callbacks don't recreate on every content save
  const noteContentRef = useMemo(() => ({ current: note?.content || '' }), []);
  noteContentRef.current = note?.content || '';

  const extensions = useMemo(() => createEditorExtensions(), []);

  const handleChangeDebounced = useDebouncedCallback((nextHtml: string) => {
    if (!note) return;
    noteUpdate({ ...note, content: nextHtml });
  }, 400);

  const editor = useEditor(
    {
      immediatelyRender: false,
      shouldRerenderOnTransaction: true,
      extensions,
      content: note?.content || '',
      onUpdate: ({ editor: instance }) => {
        const html = instance.getHTML().trim();
        setHtmlContent(html);
        if (html === noteContentRef.current) return;
        handleChangeDebounced(html);
      },
    },
    [extensions],
  );

  // Sync editor when switching notes or when note content loads asynchronously
  useEffect(() => {
    if (!editor) return;
    const incoming = note?.content || '';
    setHtmlContent(incoming);

    const current = editor.getHTML().trim();
    if (incoming !== current) {
      editor.commands.setContent(incoming, { emitUpdate: false });
    }
  }, [editor, noteId, note?.content]);

  const handleSaveNewNote = useCallback(() => {
    noteCreate({ content: htmlContent });
  }, [noteCreate, htmlContent]);

  if (!ready) {
    return null;
  }

  const containerMode = isMobile ? false : !note ? false : 'md';
  const showToolbar = !idle && isEditing;
  const canShowDraftSave = !note && htmlContent.length > 7;

  return (
    <Typography>
      <RichTextEditor
        id={`rich-text-editor-${noteId}`}
        editor={editor}
        classNames={classes}
        withTypographyStyles={false}
      >
        <Box
          pos="sticky"
          top={0}
          style={{
            zIndex: 10,
            opacity: showToolbar ? 1 : 0,
            pointerEvents: showToolbar ? 'auto' : 'none',
            transition: 'opacity 150ms ease',
          }}
        >
          <WrapperUnderlayGlass props={{ blur: 4, opacity: 0.8 }}>
            <LayoutSection id={`note-editor-toolbar-${noteId}`} containerized={containerMode}>
              <ScrollArea bg="transparent" w="100%" scrollbars="x" type="hover">
                <Box px={{ base: 5, xs: 0 }}>
                  <RichTextEditor.Toolbar style={TOOLBAR_STYLE}>
                    {controlGroups.basic}
                    {TOOLBAR_DIVIDER}
                    {controlGroups.basic2}
                    {TOOLBAR_DIVIDER}
                    {controlGroups.alignment}
                    {TOOLBAR_DIVIDER}
                    {controlGroups.headings}
                    {TOOLBAR_DIVIDER}
                    {controlGroups.lists}
                    {TOOLBAR_DIVIDER}
                    {controlGroups.tasks}
                    {TOOLBAR_DIVIDER}
                    {controlGroups.blocks}
                    {TOOLBAR_DIVIDER}
                    {controlGroups.links}
                    {TOOLBAR_DIVIDER}
                    {controlGroups.actions}
                    {TOOLBAR_DIVIDER}

                    {editor && (
                      <BubbleMenu editor={editor}>
                        <WrapperUnderlayGlass props={{ blur: 4, opacity: 0.8 }}>
                          <RichTextEditorControlsGroup style={BUBBLE_GROUP_STYLES}>
                            {controlGroups.basic}
                            {TOOLBAR_DIVIDER}
                            {controlGroups.basic2}
                            {TOOLBAR_DIVIDER}
                            {controlGroups.links}
                          </RichTextEditorControlsGroup>
                        </WrapperUnderlayGlass>
                      </BubbleMenu>
                    )}

                    <RichTextEditorControlsGroup>
                      <RichTextEditor.ClearFormatting />
                    </RichTextEditorControlsGroup>
                  </RichTextEditor.Toolbar>
                </Box>
              </ScrollArea>
            </LayoutSection>
          </WrapperUnderlayGlass>
        </Box>

        {/* Preview mode: only parse when not editing */}
        {!isEditing && (
          <Box mt="xs">
            <LayoutSection id={`note-editor-parser-${noteId}`} containerized={containerMode}>
              <Box px={{ base: 'xs', xs: 0 }}>
                <ParserHtml props={{ html: htmlContent }} />
              </Box>
            </LayoutSection>
          </Box>
        )}

        {/* Editor mode */}
        <LayoutSection
          id={`note-editor-content-${noteId}`}
          containerized={containerMode}
          display={isEditing ? undefined : 'none'}
        >
          <Box px={{ base: 'xs', xs: 0 }}>
            <RichTextEditor.Content p={0} mt="xs" data-autofocus={true} />
          </Box>
        </LayoutSection>
      </RichTextEditor>

      <Box mih={30} mt="md">
        <Transition mounted={canShowDraftSave}>
          {(transitionStyle) => (
            <div style={transitionStyle}>
              <Group gap="xs">
                <Button onClick={handleSaveNewNote} size="xs">
                  Save
                </Button>
              </Group>
            </div>
          )}
        </Transition>
      </Box>
    </Typography>
  );
});

const controlGroups = {
  basic: (
    <>
      <RichTextEditor.Bold w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
      <RichTextEditor.Italic w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
      <RichTextEditor.Underline w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
      <RichTextEditor.Strikethrough w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
    </>
  ),
  basic2: (
    <>
      <RichTextEditor.Highlight w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
      <RichTextEditor.Code w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
      <RichTextEditor.Subscript w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
      <RichTextEditor.Superscript w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
    </>
  ),
  alignment: (
    <>
      <RichTextEditor.AlignLeft w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
      <RichTextEditor.AlignCenter w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
      <RichTextEditor.AlignJustify w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
      <RichTextEditor.AlignRight w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
    </>
  ),
  headings: (
    <>
      <RichTextEditor.H1 w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
      <RichTextEditor.H2 w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
      <RichTextEditor.H3 w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
      <RichTextEditor.H4 w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
      {/* <RichTextEditor.H5 w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} /> */}
      {/* <RichTextEditor.H6 w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} /> */}
    </>
  ),
  lists: (
    <>
      <RichTextEditor.BulletList w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
      <RichTextEditor.OrderedList w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
    </>
  ),
  tasks: (
    <>
      <RichTextEditor.TaskList w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
      <RichTextEditor.TaskListLift w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
      <RichTextEditor.TaskListSink w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
    </>
  ),
  blocks: (
    <>
      <RichTextEditor.Blockquote w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
      <RichTextEditor.CodeBlock w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
    </>
  ),
  links: (
    <>
      <RichTextEditor.Link w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
      <RichTextEditor.Unlink w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
    </>
  ),
  actions: (
    <>
      <RichTextEditor.Undo w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
      <RichTextEditor.Redo w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
    </>
  ),
};
