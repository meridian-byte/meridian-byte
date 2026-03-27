'use client';

import React from 'react';
import { Menu, MenuTarget, MenuDropdown, MenuItem } from '@mantine/core';
import { IconCalendarClock, IconCalendarDown } from '@tabler/icons-react';
import { TransactionGet } from '@repo/types/models/transaction';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';

export default function Copy({
  props,
  children,
}: {
  props: {
    transaction: TransactionGet;
    copyFunction: (params: {
      transaction: TransactionGet;
      currentDate?: boolean;
    }) => void;
    close: () => void;
  };
  children: React.ReactNode;
}) {
  const { transaction, copyFunction, close } = props;

  return (
    <Menu shadow="md" position="bottom-end">
      <MenuTarget>
        <span>{children}</span>
      </MenuTarget>

      <MenuDropdown>
        <MenuItem
          leftSection={
            <IconCalendarDown size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          }
          onClick={() => {
            copyFunction({
              transaction: transaction,
              currentDate: true,
            });
            close();
          }}
        >
          With current date
        </MenuItem>

        <MenuItem
          leftSection={
            <IconCalendarClock size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          }
          onClick={() => {
            copyFunction({
              transaction: transaction,
              currentDate: false,
            });
            close();
          }}
        >
          With date of entry
        </MenuItem>
      </MenuDropdown>
    </Menu>
  );
}
