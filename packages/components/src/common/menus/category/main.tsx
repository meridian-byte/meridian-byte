'use client';

import React from 'react';
import {
  Menu,
  MenuDivider,
  MenuDropdown,
  MenuItem,
  MenuTarget,
} from '@mantine/core';
import {
  IconBook,
  IconCopy,
  IconFileTypePdf,
  IconGitMerge,
  IconListDetails,
  IconPencil,
  IconSortAscendingSmallBig,
  IconSwipeLeft,
  IconTrash,
  IconWriting,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { CategoryGet } from '@repo/types/models/category';
import { useCategoryActions } from '@repo/hooks/actions/category';
import ModalConfirm from '@repo/components/common/modals/confirm';
import { useStoreUserStates } from '@repo/libraries/zustand/stores/user-states';
import ModalMerge from '../../modals/merge';
import ModalMove from '../../modals/move';
import { useStoreCategory } from '@repo/libraries/zustand/stores/category';

export default function Main({
  props,
  children,
}: {
  props?: { categoryId?: string };
  children: React.ReactNode;
}) {
  const categories = useStoreCategory((s) => s.categories);
  const category = useStoreCategory((s) =>
    s.categories?.find((n) => n.id == props?.categoryId)
  );

  // const userStates = useStoreUserStates((s) => s.userStates);
  // const setUserStates = useStoreUserStates((s) => s.setUserStates);

  // const toogleProperties = {
  //   label: userStates?.editing == true ? 'Reading' : 'Editing',
  //   icon: userStates?.editing == true ? IconBook : IconWriting,
  // };

  const { categoryDelete } = useCategoryActions();

  const handleRename = () => {
    const myInput = document.getElementById(
      'category-title-input'
    ) as HTMLInputElement | null;

    if (myInput) {
      myInput.focus();
      myInput.select(); // highlights all text
    }
  };

  return (
    <Menu
      withinPortal
      position="bottom-end"
      keepMounted
      width={220}
      styles={{
        dropdown: {
          padding: 5,
        },
        item: {
          padding: '2.5px 10px',
        },
        itemLabel: {
          fontSize: 'var(--mantine-font-size-sm)',
        },
      }}
    >
      <MenuTarget>
        <span>{children}</span>
      </MenuTarget>

      <MenuDropdown>
        <MenuItem
          leftSection={
            <IconFileTypePdf size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
          }
          onClick={() => {}}
        >
          Export to PDF
        </MenuItem>

        <MenuDivider />

        <ModalConfirm
          props={{
            onConfirm: () => {
              if (category) categoryDelete(category);
            },
          }}
        >
          <MenuItem
            color="red.6"
            leftSection={
              <IconTrash size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
            }
          >
            Delete
          </MenuItem>
        </ModalConfirm>
      </MenuDropdown>
    </Menu>
  );
}
