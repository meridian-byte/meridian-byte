import React from 'react';
import { Typography } from '@mantine/core';

export default function Html({ props }: { props: { html: string } }) {
  const { html } = props;

  return (
    <Typography>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Typography>
  );
}
