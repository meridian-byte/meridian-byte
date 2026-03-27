import React from 'react';
import LayoutBody from '@repo/components/layout/body';
import { typeParams } from '../layout';
import { Metadata } from 'next';
import { PostRelations } from '@repo/types/models/post';
// import { postsGet } from '@repo/handlers/requests/database/posts';
import { samplePosts as posts } from '@/data/sample/posts';
import { extractUuidFromParam } from '@repo/utilities/url';

export const generateMetadata = async ({
  params,
}: {
  params: typeParams;
}): Promise<Metadata> => {
  const postId = extractUuidFromParam((await params)['postTitle-postId']);

  // const { items: posts }: { items: PostRelations[] } = await postsGet();
  const post = ((posts || []) as PostRelations[]).find((p) => p.id == postId);

  return {
    title: post?.title || '',
    description: post?.excerpt || '',
    category: post?.category?.title || '',
  };
};

export default function LayoutPost({
  children, // will be a page or nested layout
  // params,
}: {
  children: React.ReactNode;
  params: typeParams;
}) {
  return <LayoutBody>{children}</LayoutBody>;
}
