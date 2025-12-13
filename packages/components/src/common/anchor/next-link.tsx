'use client';

import Link from 'next/link';
import { Anchor, AnchorProps } from '@mantine/core';

export default function NextLink({
  href,
  onClick,
  children,
  ...restProps
}: {
  href: string;
  onClick?: (e: any) => void;
  children: React.ReactNode;
} & AnchorProps) {
  return (
    <Anchor component={Link} href={href} onClick={onClick} {...restProps}>
      {children}
    </Anchor>
  );
}
