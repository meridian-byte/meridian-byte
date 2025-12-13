/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { API_URL } from '@repo/constants/paths';
import { HEADERS } from '@repo/constants/other';
import { FormValuesInquiry } from '@repo/types/form';

const baseRequestUrl = `${API_URL}/inquiry`;

export const handleInquiry = async (formData: FormValuesInquiry) => {
  try {
    const request = new Request(baseRequestUrl, {
      method: 'POST',
      headers: HEADERS.WITH_BODY,
      body: JSON.stringify(formData),
    });

    const response = await fetch(request);

    return response;
  } catch (error) {
    console.error('---> handler error - (send inquiry):', error);
    throw error;
  }
};
