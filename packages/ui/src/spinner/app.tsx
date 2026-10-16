'use client';

import { Box } from '@mantine/core';
import classes from './app.module.css';

export function SpinnerApp({ props }: { props?: { size?: number } }) {
  return <Box w={props?.size || 24} h={props?.size || 24} className={classes.spinner}></Box>;
}
