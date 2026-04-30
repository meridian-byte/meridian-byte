import React from 'react';
import { Metadata } from 'next';
import LayoutMain from '@repo/components/layout/main';
import { COMPANY_NAME } from '@repo/constants/app';

export type typeParams = Promise<{
  'postTitle-postId': string;
}>;

export const metadata: Metadata = {
  title: { default: 'Blog', template: `%s - Blog - ${COMPANY_NAME}` },
};

export default function LayoutBlog({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <LayoutMain>{children}</LayoutMain>;
}
