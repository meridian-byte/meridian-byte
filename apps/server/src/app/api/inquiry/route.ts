/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { NextRequest, NextResponse } from 'next/server';
import { emailSendInquiry } from '@/libraries/wrappers/email';
import { emailContactAdd } from '@/services/api/email/contacts';
import { FormValuesInquiry } from '@repo/types/form';

export async function POST(request: NextRequest) {
  try {
    const formData: FormValuesInquiry = await request.json();

    // send email
    const sendMail = await emailSendInquiry(formData);

    // add email contact to subscriber list
    const addContact = await emailContactAdd(formData);

    return NextResponse.json(
      {
        sendMail,
        addContact,
        message: 'Email sent successfully',
      },
      { status: 200, statusText: 'Email Sent' }
    );
  } catch (error) {
    console.error('---> route handler error (send inquiry):', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
