'use client';

import React, { useEffect, useState } from 'react';
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
import { Box, Divider, ScrollArea } from '@mantine/core';
import WrapperUnderlayGlass from '../../wrappers/underlays/glass';
import classes from './main.module.scss';

export default function Main({ item }: { item: NoteGet }) {
  const { noteUpdate } = useNoteActions();

  const [content, setContent] = useState<string>(item.content || '');

  const handleChangeDebounced = useDebouncedCallback((c: string) => {
    noteUpdate({ ...item, content: c });
  }, 400);

  const handleChange = (c: string) => {
    setContent(c);
    handleChangeDebounced(c);
  };

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
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML().trim();
      if (html == item.content) return;
      handleChange(html);
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(item.content || '');
  }, [item.id, editor]);

  const divider = (
    <Divider
      orientation="vertical"
      color="light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-6))"
    />
  );

  return (
    <RichTextEditor
      id="rich-text-editor-content"
      editor={editor}
      classNames={classes}
    >
      <Box pos={'sticky'} top={49} style={{ zIndex: 1000 }}>
        <WrapperUnderlayGlass props={{ blur: 4, opacity: 0.8 }}>
          <ScrollArea
            bg={'transparent'}
            w={'100%'}
            scrollbars={'x'}
            type="auto"
            scrollbarSize={ICON_STROKE_WIDTH}
          >
            <RichTextEditor.Toolbar
              style={{ flexWrap: 'nowrap', backgroundColor: 'transparent' }}
            >
              {/* <RichTextEditorControlsGroup> */}
              {controlGroups.basic}
              {/* </RichTextEditorControlsGroup> */}

              {divider}

              {/* <RichTextEditorControlsGroup> */}
              {controlGroups.basic2}
              {/* </RichTextEditorControlsGroup> */}

              {divider}

              {/* <RichTextEditorControlsGroup> */}
              {controlGroups.alignment}
              {/* </RichTextEditorControlsGroup> */}

              {divider}

              {/* <RichTextEditorControlsGroup> */}
              {controlGroups.headings}
              {/* </RichTextEditorControlsGroup> */}

              {divider}

              {/* <RichTextEditorControlsGroup> */}
              {controlGroups.lists}
              {/* </RichTextEditorControlsGroup> */}

              {divider}

              {/* <RichTextEditorControlsGroup> */}
              {controlGroups.blocks}
              {/* </RichTextEditorControlsGroup> */}

              {divider}

              {/* <RichTextEditorControlsGroup> */}
              {controlGroups.links}
              {/* </RichTextEditorControlsGroup> */}

              {divider}

              {/* <RichTextEditorControlsGroup> */}
              {controlGroups.actions}
              {/* </RichTextEditorControlsGroup> */}

              {divider}

              {editor && (
                <BubbleMenu editor={editor}>
                  <WrapperUnderlayGlass props={{ blur: 4, opacity: 0.8 }}>
                    <RichTextEditorControlsGroup
                      style={{
                        border:
                          '1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-7))',
                      }}
                    >
                      {controlGroups.basic}
                      {divider}
                      {controlGroups.basic2}
                      {divider}
                      {controlGroups.links}
                    </RichTextEditorControlsGroup>
                  </WrapperUnderlayGlass>
                </BubbleMenu>
              )}

              {/* <RichTextEditorControlsGroup> */}
              <RichTextEditor.ClearFormatting />
              {/* </RichTextEditorControlsGroup> */}
            </RichTextEditor.Toolbar>
          </ScrollArea>
        </WrapperUnderlayGlass>

        <Divider color="light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-7))" />
      </Box>

      <RichTextEditor.Content p={0} mt={'xs'} />
    </RichTextEditor>
  );
}

const controlGroups = {
  basic: (
    <>
      <RichTextEditor.Bold w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
      <RichTextEditor.Italic w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
      <RichTextEditor.Underline w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
      <RichTextEditor.Strikethrough
        w={ICON_WRAPPER_SIZE}
        h={ICON_WRAPPER_SIZE}
      />
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
      <RichTextEditor.AlignJustify
        w={ICON_WRAPPER_SIZE}
        h={ICON_WRAPPER_SIZE}
      />
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
