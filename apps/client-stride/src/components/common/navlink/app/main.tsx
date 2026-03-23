'use client';

import {
  ActionIcon,
  Box,
  NavLink,
  NumberFormatter,
  Text,
  ThemeIcon,
  Tooltip,
} from '@mantine/core';
import Link from 'next/link';
import classes from './main.module.scss';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { usePathname } from 'next/navigation';
import { Link as TypeLink } from '@repo/types/link';

export default function Category({
  props,
}: {
  props: TypeLink & { count?: number };
}) {
  const pathname = usePathname();

  return (
    <NavLink
      component={Link}
      href={props.link}
      active={pathname == props.link}
      classNames={classes}
      label={props.label}
      leftSection={
        !props.icon ? undefined : (
          <props.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
        )
      }
      rightSection={
        <Box display={!props.count ? 'none' : undefined}>
          <Tooltip label={`${props.count} tasks`}>
            <ThemeIcon size={ICON_SIZE} variant="transparent">
              <Text component={'span'} inherit fz={'sm'} c={'dimmed'}>
                <NumberFormatter value={props.count} />
              </Text>
            </ThemeIcon>
          </Tooltip>
        </Box>
      }
    />
  );
}
