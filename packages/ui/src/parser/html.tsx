import React from 'react';
import { Typography } from '@mantine/core';

export function ParserHtml({ props }: { props: { html: string } }) {
  const { html } = props;

  return (
    <Typography>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Typography>
  );
}
