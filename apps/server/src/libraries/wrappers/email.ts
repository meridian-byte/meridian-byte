/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import resend from '@/libraries/resend';
import { isProduction } from '@repo/utilities/misc';
import { FormValuesInquiry } from '@repo/types/form';
import { companyName } from '@repo/constants/app';

type SendEmailOptions = {
  to: string;
  subject?: string;
  replyTo?: string;
  fromName?: string;
  fromType?: 'delivery' | 'noreply';
  template: { id: string; variables?: any };
  appName?: string;
};

const emailSendBase = async (options: SendEmailOptions) => {
  const devEmail = process.env.NEXT_PUBLIC_EMAIL_DEV;
  const deliveryEmail = process.env.NEXT_PUBLIC_EMAIL_DELIVERY;
  const noReplyEmail = process.env.NEXT_PUBLIC_EMAIL_NOREPLY;

  if (!devEmail) throw new Error('Missing dev email');
  if (!deliveryEmail) throw new Error('Missing delivery email');
  if (!noReplyEmail) throw new Error('Missing no-reply email');

  const fromEmail =
    options.fromType === 'delivery' ? deliveryEmail : noReplyEmail;

  const { data, error } = await resend.emails.send({
    from: `${options.fromName ?? options.appName ?? companyName} <${fromEmail}>`,
    to: [isProduction() ? options.to : devEmail],
    subject: options.subject,
    replyTo: options.replyTo ?? noReplyEmail,
    template: {
      ...options.template,
      variables: {
        ...options.template.variables,
        NEWSLETTER_EMAIL: process.env.NEXT_PUBLIC_EMAIL_NEWSLETTER || undefined,
        CONTACT_EMAIL: process.env.NEXT_PUBLIC_EMAIL_INFO || undefined,
        COMPANY_NAME: companyName,
        YEAR: new Date().getFullYear().toString(),
      },
    },
  });

  if (error) {
    console.error('---> wrapper error - (send email):', error);
    throw error;
  }

  return data;
};

export const emailSendInquiry = async (params: FormValuesInquiry) => {
  emailSendBase({
    fromName: params.name,
    to: process.env.NEXT_PUBLIC_EMAIL_INFO || '',
    replyTo: params.email,
    fromType: 'delivery',
    template: {
      id: 'inquiry-1',
      variables: {
        MESSAGE_PREVIEW: params.message,
        SUBJECT: `${params.subject} (From ${params.name})`,
        MESSAGE: params.message,
        NAME: params.name,
        PHONE: params.phone,
        SOURCE_SITE: params.appName,
      },
    },
  });
};

export const emailSendOnboardNewsletter = async (params: {
  to: string;
  appName: string;
}) =>
  emailSendBase({ to: params.to, template: { id: 'onboarding-newsletter' } });

export const emailSendOnboarding = async (params: {
  to: string;
  userName: string;
  appName: string;
}) =>
  emailSendBase({
    to: params.to,
    template: { id: 'onboarding', variables: { NAME: params.userName } },
  });
