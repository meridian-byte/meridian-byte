/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import resend from '@/libraries/resend';
import EmailInquiry from '@repo/components/email/inquiry';
import EmailOnboardNewsletter from '@repo/components/email/onboard/newsletter';
import EmailOnboardWelcome from '@repo/components/email/onboard/welcome';
import { isProduction } from '@repo/utilities/misc';
import { render } from '@react-email/render';
import { FormValuesInquiry } from '@repo/types/form';

type SendEmailOptions = {
  to: string;
  subject: string;
  replyTo?: string;
  fromName?: string;
  fromType?: 'delivery' | 'noreply';
  html: string;
  appName: string;
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
    from: `${options.fromName ?? options.appName} <${fromEmail}>`,
    to: [isProduction() ? options.to : devEmail],
    subject: options.subject,
    replyTo: options.replyTo ?? noReplyEmail,
    html: options.html,
  });

  if (error) {
    console.error('---> wrapper error - (send email):', error);
    throw error;
  }

  return data;
};

export const emailSendInquiry = async (params: FormValuesInquiry) => {
  const recipientEmail = process.env.NEXT_PUBLIC_EMAIL_INFO || '';

  emailSendBase({
    to: recipientEmail,
    subject: `${params.subject} (From ${params.name})`,
    replyTo: params.email,
    fromName: params.name,
    fromType: 'delivery',
    appName: params.appName,
    html: await render(
      EmailInquiry({
        userName: params.name,
        userMessage: params.message,
        userPhone: params.phone,
        appName: params.appName,
      })
    ),
  });
};

export const emailSendOnboardNewsletter = async (params: {
  to: string;
  appName: string;
}) =>
  emailSendBase({
    to: params.to,
    subject: `Welcome To ${params.appName} Newsletter`,
    fromType: 'noreply',
    html: await render(EmailOnboardNewsletter({ appName: params.appName })),
    appName: params.appName,
  });

export const emailSendOnboardSignUp = async (params: {
  to: string;
  userName: string;
  appName: string;
}) =>
  emailSendBase({
    to: params.to,
    subject: `Welcome To ${params.appName}`,
    fromType: 'noreply',
    html: await render(
      EmailOnboardWelcome({
        userName: params.userName,
        appName: params.appName,
      })
    ),
    appName: params.appName,
  });
