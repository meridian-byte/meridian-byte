'use client';

import React from 'react';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { Stack } from '@mantine/core';
import { useStoreUserStates } from '@repo/libraries/zustand/stores/user-states';
import LayoutSection from '@repo/components/layout/section';
import EditorMain from '@repo/components/common/editors/main';
import ParserHtml from '@repo/components/parsers/html';
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
        {userStates?.editing == true ? (
          <EditorMain item={props.note} />
        ) : (
          <ParserHtml
            props={{ html: props.note.content || '', item: props.note }}
          />
        )}
      </Stack>
    </LayoutSection>
  );
}
