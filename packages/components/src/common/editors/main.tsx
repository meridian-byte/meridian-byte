'use client';

import React, { useEffect } from 'react';
import {
  RichTextEditor,
  Link,
  RichTextEditorControlsGroup,
} from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import Placeholder from '@tiptap/extension-placeholder';
import { BubbleMenu } from '@tiptap/react/menus';
import { ICON_STROKE_WIDTH, ICON_WRAPPER_SIZE } from '@repo/constants/sizes';
import { useNoteActions } from '@repo/hooks/actions/note';
import { NoteGet } from '@repo/types/models/note';
import { useDebouncedCallback } from '@mantine/hooks';
import { Box, ScrollArea } from '@mantine/core';

export default function Main({ item }: { item: NoteGet }) {
  const { noteUpdate } = useNoteActions();

  const handleChange = (parsedContent: string) => {
    noteUpdate({ ...item, content: parsedContent });
  };

  const handleChangeDebounced = useDebouncedCallback(handleChange, 400);

  const editor = useEditor({
    immediatelyRender: false, // ✅ prevents hydration mismatches
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({ link: false }),
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Add content here...' }),
    ],
    content: item.content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (html == item.content) return;
      handleChangeDebounced(html);
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(item.content || '');
  }, [item.id, editor]);

  return (
    <RichTextEditor
      id="rich-text-editor-content"
      editor={editor}
      styles={{
        toolbar: {
          padding: 'var(--mantine-spacing-xs) 0',
          borderRadius: 0,
          border: '0px solid transparent',
        },
        content: {
          paddingTop: 'var(--mantine-spacing-xs)',
          borderRadius: 0,
        },
        root: {
          border: '0px solid transparent',
        },
        control: {
          width: ICON_WRAPPER_SIZE,
          height: ICON_WRAPPER_SIZE,
          backgroundColor:
            'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-8))',
          borderColor: 'var(--mantine-color-body)',
        },
        controlsGroup: {
          backgroundColor: 'transparent',
        },
      }}
    >
      <Box pos={'sticky'} top={48} style={{ zIndex: 1000 }}>
        <ScrollArea
          bg={'transparent'}
          w={'100%'}
          scrollbars={'x'}
          type="auto"
          scrollbarSize={ICON_STROKE_WIDTH}
        >
          <RichTextEditor.Toolbar
            style={{ flexWrap: 'nowrap', backgroundColor: 'transparent' }}
            mb={'xs'}
          >
            <RichTextEditorControlsGroup>
              {controlGroups.basic}
            </RichTextEditorControlsGroup>

            <RichTextEditorControlsGroup>
              {controlGroups.basic2}
            </RichTextEditorControlsGroup>

            <RichTextEditorControlsGroup>
              {controlGroups.alignment}
            </RichTextEditorControlsGroup>

            <RichTextEditorControlsGroup>
              {controlGroups.headings}
            </RichTextEditorControlsGroup>

            <RichTextEditorControlsGroup>
              {controlGroups.lists}
            </RichTextEditorControlsGroup>

            <RichTextEditorControlsGroup>
              {controlGroups.blocks}
            </RichTextEditorControlsGroup>

            <RichTextEditorControlsGroup>
              {controlGroups.links}
            </RichTextEditorControlsGroup>

            <RichTextEditorControlsGroup>
              {controlGroups.actions}
            </RichTextEditorControlsGroup>

            {editor && (
              <BubbleMenu editor={editor}>
                <RichTextEditorControlsGroup>
                  {controlGroups.basic}
                </RichTextEditorControlsGroup>
              </BubbleMenu>
            )}

            <RichTextEditorControlsGroup>
              <RichTextEditor.ClearFormatting />
            </RichTextEditorControlsGroup>
          </RichTextEditor.Toolbar>
        </ScrollArea>
      </Box>

      <RichTextEditor.Content p={0} />
    </RichTextEditor>
  );
}

const controlGroups = {
  basic: (
    <>
      <RichTextEditor.Bold />
      <RichTextEditor.Italic />
      <RichTextEditor.Underline />
      <RichTextEditor.Strikethrough />
    </>
  ),
  basic2: (
    <>
      <RichTextEditor.Highlight />
      <RichTextEditor.Code />
      <RichTextEditor.Subscript />
      <RichTextEditor.Superscript />
    </>
  ),
  alignment: (
    <>
      <RichTextEditor.AlignLeft />
      <RichTextEditor.AlignCenter />
      <RichTextEditor.AlignJustify />
      <RichTextEditor.AlignRight />
    </>
  ),
  headings: (
    <>
      <RichTextEditor.H1 />
      <RichTextEditor.H2 />
      <RichTextEditor.H3 />
      <RichTextEditor.H4 />
      {/* <RichTextEditor.H5 /> */}
      {/* <RichTextEditor.H6 /> */}
    </>
  ),
  lists: (
    <>
      <RichTextEditor.BulletList />
      <RichTextEditor.OrderedList />
    </>
  ),
  blocks: (
    <>
      <RichTextEditor.Blockquote />
      <RichTextEditor.CodeBlock />
    </>
  ),
  links: (
    <>
      <RichTextEditor.Link />
      <RichTextEditor.Unlink />
    </>
  ),
  actions: (
    <>
      <RichTextEditor.Undo />
      <RichTextEditor.Redo />
    </>
  ),
};
