import React from 'react';
import LayoutBody from '@repo/components/layout/body';
import { typeParams } from '../layout';

export default function LayoutChatDetail({
  children, // will be a page or nested layout
  // params,
}: {
  children: React.ReactNode;
  params: Promise<typeParams>;
}) {
  return <LayoutBody>{children}</LayoutBody>;
}
