'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
import { TableKit } from '@tiptap/extension-table';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import { BubbleMenu } from '@tiptap/react/menus';
import {
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
  SECTION_SPACING,
} from '@repo/constants/sizes';
import { useNoteActions } from '@repo/hooks/actions/note';
import { NoteGet } from '@repo/types/models/note';
import { useDebouncedCallback, useIdle, useMediaQuery } from '@mantine/hooks';
import {
  Box,
  Button,
  Divider,
  Group,
  ScrollArea,
  Title,
  Typography,
} from '@mantine/core';
import WrapperUnderlayGlass from '../../wrappers/underlays/glass';
import classes from './main.module.scss';
import { useSearchParams } from 'next/navigation';
import { useScroll } from '@repo/hooks/scroll';
import { useStoreUserStates } from '@repo/libraries/zustand/stores/user-states';
import ParserHtml from '../../parsers/html';
import LayoutSection from '../../layout/section';

export default function Main({ item }: { item?: NoteGet }) {
  const userStateEditing = useStoreUserStates((s) => s.userStates?.editing);
  const { styles } = useScroll({
    threshold: 70,
    defaultStyles: useMemo(() => ({ opacity: 0 }), []),
    scrolledStyles: useMemo(() => ({ opacity: 1 }), []),
  });
  const searchParams = useSearchParams();
  const { noteCreate, noteUpdate } = useNoteActions();
  const idle = useIdle(2000);
  const mobile = useMediaQuery('(max-width: 36em)');

  const [content, setContent] = useState<string>(item?.content || '');

  const handleChangeDebounced = useDebouncedCallback((c: string) => {
    if (item) noteUpdate({ ...item, content: c });
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
      TableKit.configure({ table: { resizable: true } }),
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML().trim();
      if (html == item?.content) return;
      handleChange(html);
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(item?.content || '');
  }, [item?.id, editor, searchParams]);

  const divider = (
    <Divider
      orientation="vertical"
      color="light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-6))"
    />
  );

  return (
    <Typography>
      <RichTextEditor
        id="rich-text-editor-content"
        editor={editor}
        classNames={classes}
        withTypographyStyles={false}
        // display={userStateEditing == true ? undefined : 'none'}
      >
        <Box
          pos={'sticky'}
          top={mobile ? 0 : 49}
          style={{
            zIndex: 10,
            opacity: idle ? 0 : 1,
            transition: '.25s all ease',
            // display: !item || userStateEditing != true ? 'none' : undefined,
          }}
        >
          <WrapperUnderlayGlass props={{ blur: 4, opacity: 0.8 }}>
            <LayoutSection id={`note-editor-toolbar`} containerized={'md'}>
              <Box
                style={{ ...styles, transition: '0.25s all ease' }}
                hiddenFrom="xs"
              >
                <Group py={'xs'}>
                  <Title order={2} fz={'sm'} fw={500} lineClamp={1}>
                    {item?.title}
                  </Title>
                </Group>

                <Divider color="light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-7))" />
              </Box>

              <Box display={userStateEditing == true ? undefined : 'none'}>
                <ScrollArea
                  bg={'transparent'}
                  w={'100%'}
                  scrollbars={'x'}
                  type="auto"
                >
                  <RichTextEditor.Toolbar
                    style={{
                      flexWrap: 'nowrap',
                      backgroundColor: 'transparent',
                    }}
                  >
                    {controlGroups.basic}
                    {divider}
                    {controlGroups.basic2}
                    {divider}
                    {controlGroups.alignment}
                    {divider}
                    {controlGroups.headings}
                    {divider}
                    {controlGroups.lists}
                    {divider}
                    {controlGroups.tasks}
                    {divider}
                    {controlGroups.blocks}
                    {divider}
                    {controlGroups.links}
                    {divider}
                    {controlGroups.actions}
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

                    <RichTextEditorControlsGroup>
                      <RichTextEditor.ClearFormatting />
                    </RichTextEditorControlsGroup>
                  </RichTextEditor.Toolbar>
                </ScrollArea>

                <Divider
                  color="light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-7))"
                  style={{ ...styles, transition: '0.25s all ease' }}
                />
              </Box>
            </LayoutSection>
          </WrapperUnderlayGlass>
        </Box>

        <Box
          display={userStateEditing == true ? 'none' : undefined}
          mt={60 - 1}
        >
          <LayoutSection id={`note-editor-parser`} containerized={'md'}>
            <ParserHtml props={{ html: content }} />
          </LayoutSection>
        </Box>

        <LayoutSection
          id={`note-editor-content`}
          containerized={'md'}
          display={userStateEditing == true ? undefined : 'none'}
        >
          <RichTextEditor.Content p={0} mt={'xs'} />
        </LayoutSection>
      </RichTextEditor>

      <Group
        gap={'xs'}
        mt={'md'}
        style={{
          opacity: content.length > 7 ? 1 : 0,
          transition: '.25s all ease',
          display: item ? 'none' : undefined,
        }}
      >
        <Button onClick={() => noteCreate({ content })} size="xs">
          Save
        </Button>
      </Group>
    </Typography>
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
  tasks: (
    <>
      <RichTextEditor.TaskList w={ICON_WRAPPER_SIZE} h={ICON_WRAPPER_SIZE} />
      <RichTextEditor.TaskListLift
        w={ICON_WRAPPER_SIZE}
        h={ICON_WRAPPER_SIZE}
      />
      <RichTextEditor.TaskListSink
        w={ICON_WRAPPER_SIZE}
        h={ICON_WRAPPER_SIZE}
      />
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
