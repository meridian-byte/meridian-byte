import React from 'react';
import { Metadata } from 'next';
import LayoutBody from '@repo/components/layout/body';
import { APP_NAME } from '@repo/constants/app';

export interface typeParams {
  'noteTitle-noteId': string;
  categoryId: string;
  tagId: string;
}

export const metadata: Metadata = {
  title: { default: 'Notes', template: `%s - ${APP_NAME.NOTELINE}` },
};

export default function LayoutNotes({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <LayoutBody>{children}</LayoutBody>;
}
