import React from 'react';
import { Typography } from '@mantine/core';

export default function Html({ html }: { html: string }) {
  return (
    <Typography>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Typography>
  );
}
