/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import { PostCreate, PostRelations, PostUpdate } from '@repo/types/models/post';

const baseRequestUrl = `${API_URL}/posts`;

export const postsGet = async () => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get posts):', error);
    throw error;
  }
};

let currentController: AbortController | null = null;

export const postsUpdate = async (
  posts: PostRelations[],
  deletedIds?: string[]
) => {
  // Cancel previous request if still in-flight
  if (currentController) currentController.abort();

  // New controller for this request
  currentController = new AbortController();

  try {
    const request = new Request(baseRequestUrl, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify({ posts, deletedIds }),
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (update posts):', error);
    throw error;
  } finally {
    // Clear controller once done (important for GC)
    currentController = null;
  }
};

export const postGet = async (params: { postId: string }) => {
  try {
    const request = new Request(`${baseRequestUrl}/${params.postId}`, {
      method: 'GET',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('---> handler error - (get post):', error);
    throw error;
  }
};

export const postCreate = async (post: PostCreate) => {
  try {
    const request = new Request(`${baseRequestUrl}/create`, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(post),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (create post):', error);
    throw error;
  }
};

export const postUpdate = async (post: PostUpdate) => {
  try {
    const request = new Request(`${baseRequestUrl}/${post.id}`, {
      method: 'PUT',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(post),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (update post):', error);
    throw error;
  }
};

export const postDelete = async (postId: string) => {
  try {
    const request = new Request(`${baseRequestUrl}/${postId}`, {
      method: 'DELETE',
      headers: HEADERS.WITHOUT_BODY,
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (delete post):', error);
    throw error;
  }
};
