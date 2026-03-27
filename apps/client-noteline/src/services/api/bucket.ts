/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { createClient } from '@/libraries/supabase/client';

export const bucketCreate = async (params: { bucketName: string }) => {
  try {
    const supabase = createClient();

    // Check if bucket exists
    const { data: buckets, error: listError } =
      await supabase.storage.listBuckets();

    if (listError) throw listError;

    const bucketExists = buckets.some(
      (bucket) => bucket.name === params.bucketName
    );

    if (bucketExists) {
      return;
    }

    // Create bucket with provided options
    const { error: createError } = await supabase.storage.createBucket(
      params.bucketName,
      { public: true }
    );

    if (createError) throw createError;
  } catch (error) {
    console.error('---> service error (create bucket):', error);
    throw error;
  }
};
