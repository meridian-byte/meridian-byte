import React from 'react';
import { alpha } from '@mantine/core';
import classes from './glass.module.scss';

export default function Glass({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={classes.bg}
      style={{ backgroundColor: alpha('var(--mantine-color-body)', 0.9) }}
    >
      {children}
    </div>
  );
}
