'use client';

import { NavLink } from '@mantine/core';
import Link from 'next/link';
import classes from './category.module.scss';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { usePathname } from 'next/navigation';
import { Link as TypeLink } from '@repo/types/link';

export default function Category({ props }: { props: TypeLink }) {
  const pathname = usePathname();

  return (
    <NavLink
      component={Link}
      href={props.link}
      active={pathname.includes(props.link)}
      // mt={2}
      classNames={classes}
      label={props.label}
      leftSection={
        !props.icon ? undefined : (
          <props.icon size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
        )
      }
    />
  );
}
