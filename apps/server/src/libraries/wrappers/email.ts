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
import { appName } from '@repo/constants/app';

type SendEmailOptions = {
  to: string;
  subject: string;
  replyTo?: string;
  fromName?: string;
  fromType?: 'delivery' | 'noreply';
  html: string;
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
    from: `${options.fromName ?? appName} <${fromEmail}>`,
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
    html: await render(
      EmailInquiry({
        userName: params.name,
        userMessage: params.message,
        userPhone: params.phone,
      })
    ),
  });
};

export const emailSendOnboardNewsletter = async (params: { to: string }) =>
  emailSendBase({
    to: params.to,
    subject: `Welcome To ${appName} Newsletter`,
    fromType: 'noreply',
    html: await render(EmailOnboardNewsletter()),
  });

export const emailSendOnboardSignUp = async (params: {
  to: string;
  userName: string;
}) =>
  emailSendBase({
    to: params.to,
    subject: `Welcome To ${appName}`,
    fromType: 'noreply',
    html: await render(EmailOnboardWelcome({ userName: params.userName })),
  });
