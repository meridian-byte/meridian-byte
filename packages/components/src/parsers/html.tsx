import React from 'react';
import { Stack, Title, Typography } from '@mantine/core';
import { NoteGet } from '@repo/types/models/note';

export default function Html({
  props,
}: {
  props: { html: string; item: NoteGet; options?: { withTitle?: boolean } };
}) {
  const { html, item } = props;

  const parser = (
    <Typography>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Typography>
  );

  return props.options?.withTitle ? (
    <Stack gap={'xl'}>
      <Title order={2}>{item.title}</Title>
      {parser}
    </Stack>
  ) : (
    parser
  );
}
