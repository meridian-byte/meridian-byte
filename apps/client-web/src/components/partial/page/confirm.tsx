'use client';

/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';
import { Button, Center, Group, Loader, ThemeIcon } from '@mantine/core';
import {
  ICON_SIZE,
  ICON_STROKE_WIDTH,
  ICON_WRAPPER_SIZE,
} from '@repo/constants/sizes';
import { IconCheck, IconX } from '@tabler/icons-react';
import {
  ConfirmStatus,
  useConfirmDeleteAccount,
  useConfirmEmail,
} from '@/hooks/confirm';
import IntroSection from '@repo/components/layout/intros/section';
import { AuthAction } from '@repo/types/enums';
import LayoutSection from '@repo/components/layout/section';

interface ConfirmActionProps {
  status: ConfirmStatus;
  handleConfirm: () => void;
  subTitle: string;
  buttonText: string;
  successText?: string;
}

/**
 * a generic ConfirmAction component that takes these as props
 */
export const ConfirmAction: React.FC<ConfirmActionProps> = ({
  status,
  handleConfirm,
  subTitle,
  buttonText,
  successText,
}) => {
  const renderContent = () => {
    switch (status.state) {
      case 'loading':
        return (
          <Center h={ICON_WRAPPER_SIZE * 2}>
            <Loader type="dots" size={40} />
          </Center>
        );
      case 'error':
        return (
          <ThemeIcon size={ICON_WRAPPER_SIZE * 2} color="red" radius={999}>
            <IconX size={ICON_SIZE * 2} stroke={ICON_STROKE_WIDTH} />
          </ThemeIcon>
        );
      case 'success':
        return (
          <ThemeIcon size={ICON_WRAPPER_SIZE * 2} color="green" radius={999}>
            <IconCheck size={ICON_SIZE * 2} stroke={ICON_STROKE_WIDTH} />
          </ThemeIcon>
        );
      default:
        return (
          <Group h={ICON_WRAPPER_SIZE * 2} justify="center">
            <Button onClick={handleConfirm}>{buttonText}</Button>
          </Group>
        );
    }
  };

  return (
    <LayoutSection id="confirm-action" containerized={false}>
      <IntroSection
        props={{
          subTitle,
          title: !status.state
            ? buttonText
            : status.state === 'loading'
              ? 'Processing Request'
              : `Request ${status.state === 'error' ? 'Failed' : successText || 'Confirmed'}`,
          desc: status.message,
        }}
      />
      <Group justify="center" mt="md">
        {renderContent()}
      </Group>
    </LayoutSection>
  );
};

export const ConfirmSignUp = () => {
  const { status, handleConfirm } = useConfirmEmail(AuthAction.SIGN_UP);

  return (
    <ConfirmAction
      status={status}
      handleConfirm={handleConfirm}
      subTitle="Verify Email"
      buttonText="Confirm Sign Up"
      successText="Confirmed"
    />
  );
};

export const ConfirmSignIn = () => {
  const { status, handleConfirm } = useConfirmEmail(AuthAction.SIGN_IN);

  return (
    <ConfirmAction
      status={status}
      handleConfirm={handleConfirm}
      subTitle="Magic Link"
      buttonText="Confirm Sign In"
      successText="Confirmed"
    />
  );
};

export const ConfirmDeleteAccount = () => {
  const { status, handleConfirm } = useConfirmDeleteAccount();

  return (
    <ConfirmAction
      status={status}
      handleConfirm={handleConfirm}
      subTitle="Account Deletion"
      buttonText="Delete Account"
      successText="Granted"
    />
  );
};
