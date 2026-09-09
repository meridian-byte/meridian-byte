import resend from './resend';
import { emailSendOnboardNewsletter } from './send';
import { FormValuesInquiry } from '@repo/types';
import { segmentFullName } from '@repo/utils';

export const emailContactAdd = async (formData: Partial<FormValuesInquiry>, notify?: boolean) => {
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
      console.error('---> route service error (add email contact):', 'API Service Error');

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
