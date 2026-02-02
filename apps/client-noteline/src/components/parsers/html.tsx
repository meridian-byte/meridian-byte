import React from 'react';
import { Stack, Title, Typography } from '@mantine/core';
import { NoteGet } from '@repo/types/models/note';

export default function Html({
  props,
}: {
  props: { html: string; item: NoteGet };
}) {
  const { html, item } = props;

  return (
    <Stack gap={'xl'}>
      <Title order={2}>{item.title}</Title>

      <Typography>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </Typography>
    </Stack>
  );
}
