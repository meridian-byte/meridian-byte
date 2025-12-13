import { notifications } from '@mantine/notifications';
import { Variant } from '@repo/types/enums';
import { capitalizeWord } from '@repo/utilities/string';
import { linkify } from '@repo/utilities/url';
import React from 'react';

export const useNotification = () => {
  const showNotification = (
    {
      variant,
      title,
      desc,
      icon,
    }: {
      variant: Variant;
      title?: string;
      desc?: string;
      icon?: React.ReactNode;
    },
    response?: Response,
    result?: any
  ) => {
    try {
      const notificationTitle =
        title || response?.statusText || capitalizeWord(variant);
      const notificationMessage =
        desc ||
        (variant === Variant.SUCCESS ? result?.message : result?.error) ||
        null;

      notifications.show({
        id: linkify(
          `${variant}-${response?.status || '500'}-${notificationMessage}`
        ),
        icon: icon,
        title: notificationTitle,
        message: notificationMessage,
        variant,
        autoClose: 5000,
        withBorder: false,
      });
    } catch (error) {
      console.error('---> notification error (show notification)', error);
      throw error;
    }
  };

  return {
    showNotification,
  };
};
