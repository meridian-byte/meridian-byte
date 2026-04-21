'use client';

import React, { useState } from 'react';
import {
  ActionIcon,
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
  ThemeIcon,
  Title,
  Tooltip,
} from '@mantine/core';
import AuthProviders from '../common/buttons/auth-providers';
import { useFormAuth } from '@repo/hooks/form/auth';
import { AuthAction } from '@repo/types/enums';
import NextLink from '@repo/components/common/anchor/next-link';
import { AUTH_URLS } from '@repo/constants/paths';
import {
  IconBackspace,
  IconExclamationCircle,
  IconInfoCircle,
  IconMail,
  IconPassword,
  IconX,
} from '@tabler/icons-react';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { setCookieClient } from '@repo/utilities/cookie-client';
import { COOKIE_NAME, PARAM_NAME } from '@repo/constants/names';
import { getUrlParam } from '@repo/utilities/url';

export default function Auth({
  action,
  baseUrl,
  header,
}: {
  action: AuthAction;
  baseUrl: string;
  header?: {
    title: string;
    desc: string;
  };
}) {
  const [redirecting, setRedirecting] = useState(false);

  const {
    form: formAuth,
    submitted: submittedAuth,
    handleSubmit: handleSubmitAuth,
    message: messageAuth,
    setMessage: setMessageAuth,
    error: errorAuth,
    setError: setErrorAuth,
    resent: resentAuth,
    setResent: setResentAuth,
  } = useFormAuth({ action, baseUrl });

  return (
    <Stack>
      <form onSubmit={formAuth.onSubmit(() => handleSubmitAuth())} noValidate>
        <Stack>
          {header && <AuthHeader title={header.title} desc={header.desc} />}

          <Box pos={'relative'}>
            {redirecting && (
              <Overlay zIndex={1000} radius={8} backgroundOpacity={0.3} />
            )}

            <AuthProviders props={{ baseUrl }} />
          </Box>

          <Divider label="or" />

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
                    backgroundColor:
                      'light-dark(var(--mantine-color-body), var(--mantine-color-dark-8))',
                  },
                  error: { textAlign: 'center' },
                }}
                disabled={!!messageAuth}
                leftSection={
                  <ThemeIcon
                    color="dark"
                    variant="transparent"
                    size={ICON_WRAPPER_SIZE}
                  >
                    <IconMail size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
                  </ThemeIcon>
                }
                rightSection={
                  <Tooltip
                    label={'Clear email'}
                    disabled={!formAuth.values.email?.trim().length}
                  >
                    <ActionIcon
                      color="red.6"
                      variant="subtle"
                      size={ICON_WRAPPER_SIZE}
                      onClick={() => {
                        setCookieClient(COOKIE_NAME.AUTH.EMAIL, '', {
                          expiryInSeconds: 10,
                        });
                        setMessageAuth(undefined);
                        setErrorAuth(undefined);
                        formAuth.reset();
                      }}
                      style={{
                        transition: '.25s all ease',
                        opacity: formAuth.values.email?.trim().length ? 1 : 0,
                      }}
                    >
                      <IconBackspace
                        size={ICON_SIZE}
                        stroke={ICON_STROKE_WIDTH}
                      />
                    </ActionIcon>
                  </Tooltip>
                }
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
                        backgroundColor:
                          'light-dark(var(--mantine-color-body), var(--mantine-color-dark-7))',
                      },
                      error: { textAlign: 'center' },
                    }}
                    leftSection={
                      <ThemeIcon
                        color="dark"
                        variant="transparent"
                        size={ICON_WRAPPER_SIZE}
                      >
                        <IconPassword
                          size={ICON_SIZE}
                          stroke={ICON_STROKE_WIDTH}
                        />
                      </ThemeIcon>
                    }
                    rightSection={
                      <Tooltip
                        label={'Clear OTP'}
                        disabled={!formAuth.values.otp?.trim().length}
                      >
                        <ActionIcon
                          color="red.6"
                          variant="subtle"
                          size={ICON_WRAPPER_SIZE}
                          onClick={() => {
                            formAuth.setFieldValue('otp', '');
                          }}
                          style={{
                            transition: '.25s all ease',
                            opacity: formAuth.values.otp?.trim().length ? 1 : 0,
                          }}
                        >
                          <IconBackspace
                            size={ICON_SIZE}
                            stroke={ICON_STROKE_WIDTH}
                          />
                        </ActionIcon>
                      </Tooltip>
                    }
                    {...formAuth.getInputProps('otp')}
                  />
                </GridCol>

                <GridCol span={12}>
                  <Group grow>
                    <Button
                      variant="light"
                      loading={resentAuth}
                      disabled={redirecting}
                      onClick={() => {
                        setResentAuth(true);
                        setMessageAuth('OTP resent successfully');
                        formAuth.setFieldValue('otp', '');
                        handleSubmitAuth({ options: { resent: true } });
                      }}
                    >
                      {'Resend'}
                    </Button>

                    {!resentAuth && (
                      <Button
                        loading={redirecting}
                        onClick={() => {
                          const formValues = formAuth.values;

                          if (formValues.otp?.length != 8) {
                            formAuth.setErrors({ otp: 'Invalid OTP' });
                          } else {
                            setRedirecting(true);

                            const redirect =
                              (getUrlParam(PARAM_NAME.REDIRECT) as string) ||
                              AUTH_URLS.REDIRECT.DEFAULT;
                            const redirectUrl = encodeURIComponent(redirect);
                            const callbackUrl = `${baseUrl}/api/auth/callback/email?email=${formValues.email}&otp=${formValues.otp}&redirectUrl=${redirectUrl}&baseUrl=${baseUrl}`;
                            window.location.href = callbackUrl;
                          }
                        }}
                      >
                        {'Confirm'}
                      </Button>
                    )}
                  </Group>
                </GridCol>
              </>
            )}
          </Grid>
        </Stack>
      </form>

      {/* {action == AuthAction.SIGN_IN ? (
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
      )} */}

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
