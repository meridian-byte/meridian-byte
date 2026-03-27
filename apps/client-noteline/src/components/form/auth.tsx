'use client';

import React from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  GridCol,
  Group,
  Overlay,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import AuthProviders from '@/components/common/buttons/auth-providers';
import { useFormAuth } from '@/hooks/form/auth/auth';
import { AuthAction } from '@repo/types/enums';
import NextLink from '@repo/components/common/anchor/next-link';
import { AUTH_URLS } from '@/data/constants';
import { IconExclamationCircle, IconInfoCircle } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { setCookieClient } from '@repo/utilities/cookie-client';
import { COOKIE_NAME } from '@repo/constants/names';

export default function Auth({
  action,
  header,
}: {
  action: AuthAction;
  header?: {
    title: string;
    desc: string;
  };
}) {
  const {
    form: formAuth,
    submitted: submittedAuth,
    handleSubmit: handleSubmitAuth,
    message: messageAuth,
    setMessage: setMessageAuth,
    error: errorAuth,
  } = useFormAuth({ action });

  return (
    <Stack>
      <form onSubmit={formAuth.onSubmit(handleSubmitAuth)} noValidate>
        <Stack>
          {header && <AuthHeader title={header.title} desc={header.desc} />}

          <Grid>
            <GridCol span={{ base: 12, sm: 12 }}>
              <TextInput
                required
                aria-label="Email"
                placeholder="john@example.com"
                variant="filled"
                styles={{
                  input: {
                    textAlign: 'center',
                    backgroundColor: 'var(--mantine-color-dark-7)',
                  },
                }}
                disabled={!!messageAuth}
                {...formAuth.getInputProps('email')}
              />
            </GridCol>

            {!messageAuth ? (
              <GridCol span={12}>
                <Button fullWidth type="submit" loading={submittedAuth}>
                  {action === AuthAction.SIGN_IN ? 'Sign In' : 'Sign Up'}
                </Button>
              </GridCol>
            ) : (
              <>
                <GridCol span={{ base: 12, sm: 12 }}>
                  <TextInput
                    required
                    aria-label="Otp"
                    placeholder="********"
                    maxLength={8}
                    variant="filled"
                    styles={{
                      input: {
                        textAlign: 'center',
                        letterSpacing: 5,
                        backgroundColor: 'var(--mantine-color-dark-7)',
                      },
                    }}
                    {...formAuth.getInputProps('otp')}
                  />
                </GridCol>

                <GridCol span={12}>
                  <Group grow>
                    <Button
                      variant="light"
                      disabled={submittedAuth}
                      onClick={() => {
                        formAuth.setFieldValue('otp', '');
                        setMessageAuth(undefined);
                        handleSubmitAuth();
                      }}
                    >
                      {'Resend'}
                    </Button>

                    <Button type="submit" loading={submittedAuth}>
                      {'Confirm'}
                    </Button>
                  </Group>
                </GridCol>
              </>
            )}
          </Grid>

          {/* <Divider label="or" />

          <Box pos={'relative'}>
            {submittedAuth && (
              <Overlay zIndex={1000} radius={'lg'} backgroundOpacity={0.05} />
            )}

            <AuthProviders />
          </Box> */}
        </Stack>
      </form>

      {action == AuthAction.SIGN_IN ? (
        <Text fz={'xs'} ta={'center'}>
          Don&apos;t have an account?{' '}
          <NextLink
            inherit
            fw={500}
            href={AUTH_URLS.SIGN_UP}
            underline="hover"
            onClick={() => {
              setCookieClient(COOKIE_NAME.AUTH.EMAIL, '', {
                expiryInSeconds: 10,
              });
            }}
          >
            Sign Up
          </NextLink>
        </Text>
      ) : (
        <Text fz={'xs'} ta={'center'}>
          Already have an account?{' '}
          <NextLink
            inherit
            fw={500}
            href={AUTH_URLS.SIGN_IN}
            underline="hover"
            onClick={() => {
              setCookieClient(COOKIE_NAME.AUTH.EMAIL, '', {
                expiryInSeconds: 10,
              });
            }}
          >
            Sign In
          </NextLink>
        </Text>
      )}

      <Box
        style={{
          height: submittedAuth || (!errorAuth && !messageAuth) ? 1 : 108,
          overflow: 'hidden',
        }}
      >
        {!submittedAuth && (errorAuth || messageAuth) && (
          <>
            <Alert
              variant="light"
              color={errorAuth ? 'red.6' : 'blue.6'}
              title={errorAuth ? 'Error' : 'OTP Sent'}
              icon={
                errorAuth ? (
                  <IconExclamationCircle
                    size={ICON_SIZE}
                    stroke={ICON_STROKE_WIDTH}
                  />
                ) : (
                  <IconInfoCircle size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                )
              }
            >
              {errorAuth || messageAuth}
            </Alert>
          </>
        )}
      </Box>
    </Stack>
  );
}

const AuthHeader = ({ title, desc }: { title: string; desc: string }) => {
  return (
    <>
      <Container>
        <Stack gap={'xs'}>
          <Title order={1} fz={'lg'} ta={'center'}>
            {title}
          </Title>

          <Text ta={'center'} fz={'sm'}>
            {desc}
          </Text>
        </Stack>
      </Container>
    </>
  );
};
