'use client';

import React from 'react';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { Stack } from '@mantine/core';
import { useStoreUserStates } from '@/libraries/zustand/stores/user-states';
import LayoutSection from '@repo/components/layout/section';
import InputTextEditorTitle from '@/components/common/inputs/text/editor/title';
import EditorMain from '@/components/common/editors/main';
import ParserHtml from '@/components/parsers/html';
import { NoteGet } from '@repo/types/models/note';

export default function Note({ props }: { props: { note: NoteGet } }) {
  const { userStates } = useStoreUserStates();

  return (
    <LayoutSection
      id={`note-details`}
      padded={SECTION_SPACING / 2}
      containerized={'md'}
    >
      <Stack>
        <InputTextEditorTitle item={props.note} />

        {userStates?.editing == true ? (
          <EditorMain item={props.note} />
        ) : (
          <ParserHtml html={props.note.content || ''} />
        )}
      </Stack>
    </LayoutSection>
  );
}
