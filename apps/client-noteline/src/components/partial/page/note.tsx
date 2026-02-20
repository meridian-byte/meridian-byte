'use client';

import React from 'react';
import { SECTION_SPACING } from '@repo/constants/sizes';
import { Box } from '@mantine/core';
import { useStoreUserStates } from '@repo/libraries/zustand/stores/user-states';
import LayoutSection from '@repo/components/layout/section';
import EditorMain from '@repo/components/common/editors/main';
import ParserHtml from '@repo/components/parsers/html';
import { NoteGet } from '@repo/types/models/note';
import InputTextEditorTitle from '@repo/components/common/inputs/text/editor/title';

export default function Note({ props }: { props: { note: NoteGet } }) {
  const userStates = useStoreUserStates((s) => s.userStates);

  return (
    <LayoutSection
      id={`note-details`}
      padded={SECTION_SPACING / 2}
      containerized={'md'}
    >
      <div>
        <InputTextEditorTitle item={props.note} />

        <div>
          {userStates?.editing == true ? (
            <EditorMain item={props.note} />
          ) : (
            <Box p={'1rem'} mt={48 + 20}>
              <ParserHtml
                props={{
                  html: props.note.content || '',
                  item: props.note,
                }}
              />
            </Box>
          )}
        </div>
      </div>
    </LayoutSection>
  );
}
