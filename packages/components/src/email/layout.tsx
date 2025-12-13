/* eslint-disable @next/next/no-img-element */
import * as React from 'react';

import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Link,
  Heading,
} from '@react-email/components';
import { appName } from '@repo/constants/app';

export const Email = ({
  props,
  options = { withHeader: true, withFooter: true },
  children,
}: {
  props: { preview: string; title?: string };
  options?: { withHeader?: boolean; withFooter?: boolean };
  children: React.ReactNode;
}) => {
  return (
    <>
      <Html lang="en">
        <Head />

        <Preview>{props.preview || 'Preview'}</Preview>

        <Body>
          <Container style={content}>
            {options.withHeader && (
              <Section style={{ textAlign: 'center' }}>
                <a href="https://example.com">
                  <img
                    src={
                      'https://spewyluxhudgxpuhjjam.supabase.co/storage/v1/object/public/avatars/brand/icon/icon-light.png'
                    }
                    width={40}
                    height={'auto'}
                    alt={appName}
                  />
                </a>

                {props.title && (
                  <Heading style={{ marginTop: '2rem' }}>{props.title}</Heading>
                )}
              </Section>
            )}

            <Section style={{ marginTop: '2rem' }}>
              <Container>{children}</Container>
            </Section>

            {options.withFooter && (
              <Section>
                <Container>
                  <Text style={dimmedText}>
                    Copyright © {new Date().getFullYear()},{' '}
                    <Link
                      href="https://example.com"
                      style={{
                        color: 'black',
                        textDecorationLine: 'underline',
                      }}
                    >
                      {appName}
                    </Link>
                    . All rights reserved.
                  </Text>
                </Container>
              </Section>
            )}
          </Container>
        </Body>
      </Html>
    </>
  );
};

export const content = {
  maxWidth: '560px',
  margin: '0 auto',
  border: '1px solid #e4e6ed',
  borderRadius: '0.25rem',
  padding: '3rem',
  fontFamily: "'Calibri', Arial, sans-serif",
};

export const text = {
  margin: 0,
};

export const dimmedText = { ...text, fontSize: 'small', color: 'gray' };

export const link = {
  margin: 0,
  fontWeight: 'bold',
  color: 'black',
};
