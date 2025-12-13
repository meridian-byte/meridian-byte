import * as React from 'react';
import { Hr, Link, Section, Text } from '@react-email/components';
import { appName, emails } from '@repo/constants/app';
import { dimmedText, Email as LayoutEmail, text } from '../layout';

export const Confirm = (props: { link: string; userName: string }) => {
  const message = `We want to make sure it's really you. Please click the following link to confirm the account deletion request. If you didn't request to delete your ${appName} account, you can ignore this message.`;

  return (
    <LayoutEmail props={{ preview: message, title: 'Account Deletion' }}>
      <Section>
        <Text style={{ marginTop: 0 }}>Hi {props.userName || 'John'},</Text>
        <Text style={text}>{message}</Text>
      </Section>

      <Section style={{ marginTop: '2rem' }}>
        <Text style={{ ...text, textAlign: 'center', marginTop: '8px' }}>
          <Link
            href="#"
            style={{
              backgroundColor: '#e4e6ed',
              color: 'black',
              padding: '0.5rem',
              borderRadius: '0.25rem',
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'inline-block',
              width: '100%',
            }}
          >
            Delete Account
          </Link>
        </Text>

        <Text
          style={{ ...dimmedText, textAlign: 'center', marginTop: '0.5rem' }}
        >
          (this link is valid for 60 minutes)
        </Text>
      </Section>

      <Section style={{ marginTop: '2rem' }}>
        <Hr />
      </Section>

      <Section style={{ marginTop: '2rem' }}>
        <Text style={dimmedText}>
          If you didn&apos;t request to delete your {appName} account, you can
          safely ignore this email. If you are concerned about the security of
          your account, please{' '}
          <Link
            href={`mailto:${emails.info}`}
            style={{
              color: 'black',
              textDecorationLine: 'underline',
            }}
          >
            contact support
          </Link>
          .
        </Text>
      </Section>
    </LayoutEmail>
  );
};

export default Confirm;
