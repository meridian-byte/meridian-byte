import * as React from 'react';
import { Hr, Link, Section, Text } from '@react-email/components';
import { emails } from '@repo/constants/app';
import { dimmedText, Email as LayoutEmail, text } from '../layout';

export const Welcome = (props: { userName: string; appName: string }) => {
  const message = `Thanks for creating an account with ${props.appName}.`;

  return (
    <LayoutEmail
      props={{
        preview: message,
        title: `Welcome To ${props.appName}`,
        appName: props.appName,
      }}
    >
      <Section>
        <Text>Hi {props.userName || 'John'},</Text>

        <Text style={text}>
          Welcome to {props.appName}! We&apos;re thrilled to have you on board.
          With your new account, you&apos;ll have access to key features and
          benefits of our service. We&apos;re committed to helping you every
          step of the way. If you have any questions or need assistance, feel
          free to reach out to us at{' '}
          <Link
            href={`mailto:${emails.info}`}
            style={{
              color: 'gray',
              textDecorationLine: 'underline',
            }}
          >
            {emails.info}
          </Link>
          . Let&apos;s get started on this exciting journey together!
        </Text>
      </Section>

      <Section style={{ marginTop: '2rem' }}>
        <Hr />
      </Section>

      <Section style={{ marginTop: '2rem' }}>
        <Text style={dimmedText}>
          If you didn&apos;t create an account with {props.appName}, you can
          safely ignore this email.
        </Text>
      </Section>
    </LayoutEmail>
  );
};

export default Welcome;
