/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import resend from '@repo/libraries/resend';
import { emailSendOnboardNewsletter } from '@repo/libraries/wrappers/email';
import { FormValuesInquiry } from '@repo/types/form';
import { segmentFullName } from '@repo/utilities/string';

export const emailContactAdd = async (
  formData: Partial<FormValuesInquiry>,
  notify?: boolean
) => {
  try {
    if (!formData.email) {
      throw new Error('Email is required');
    }

    const nameSegments = segmentFullName(formData.name || '');

    const contactCreate = await resend.contacts.create({
      email: formData.email,
      firstName: nameSegments.first,
      lastName: nameSegments.last,
      properties: {
        phone: formData.phone || '',
      },
    });

    if (contactCreate.error) {
      console.error(
        '---> route service error (add email contact):',
        'API Service Error'
      );

      throw new Error('API Service Error');
    }

    if (notify) {
      // send welcome email if new user
      await emailSendOnboardNewsletter({
        to: formData.email,
        appName: formData.appName || '',
      });
    }

    return contactCreate.data;
  } catch (error) {
    console.error('---> api service error (add email contact):', error);
    throw error;
  }
};
