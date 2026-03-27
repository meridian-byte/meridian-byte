/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import resend from '../resend';
import { isProduction } from '@repo/utilities/misc';
import { FormValuesInquiry } from '@repo/types/form';
import { COMPANY_NAME, EMAILS } from '@repo/constants/app';

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
  if (!EMAILS.DEV) throw new Error('Missing dev email');
  if (!EMAILS.DELIVERY) throw new Error('Missing delivery email');
  if (!EMAILS.NO_REPLY) throw new Error('Missing no-reply email');

  const fromEmail =
    options.fromType === 'delivery' ? EMAILS.DELIVERY : EMAILS.NO_REPLY;

  const { data, error } = await resend.emails.send({
    from: `${options.fromName ?? options.appName ?? COMPANY_NAME} <${fromEmail}>`,
    to: [isProduction() ? options.to : EMAILS.DEV],
    subject: options.subject,
    replyTo: options.replyTo ?? EMAILS.NO_REPLY,
    template: {
      ...options.template,
      variables: {
        ...options.template.variables,
        NEWSLETTER_EMAIL: EMAILS.NEWSLETTER || undefined,
        CONTACT_EMAIL: EMAILS.INFO || undefined,
        COMPANY_NAME: COMPANY_NAME,
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
  if (!EMAILS.INFO) throw new Error('Missing INFO email');

  emailSendBase({
    fromName: params.name,
    to: EMAILS.INFO,
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
