'use client';

import React from 'react';
import {
  Menu,
  MenuDivider,
  MenuDropdown,
  MenuItem,
  MenuLabel,
  MenuTarget,
  Text,
} from '@mantine/core';
import {
  IconCopy,
  IconFiles,
  IconGitMerge,
  IconPencil,
  IconSortAscendingSmallBig,
  IconTrash,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { useContextMenu } from '@repo/hooks/ui/context-menu';
import { CategoryGet } from '@repo/types/models/category';
import ModalConfirm from '@repo/components/common/modals/confirm';
import ModalMerge from '../../modals/merge';
import ModalMove from '../../modals/move';
import { useCategoryActions } from '@repo/hooks/actions/category';
import { useStoreCategory } from '@repo/libraries/zustand/stores/category';
import ModalCategoryCrud from '../../modals/category/crud';
import { APP_NAME } from '@repo/constants/app';

export default function Side({
  props,
  children,
}: {
  props: {
    categoryId?: string;
    options?: { context?: boolean; source?: string };
  };
  children: React.ReactNode;
}) {
  const { opened, setOpened, close, menuWidth, targetProps, anchorProps } =
    useContextMenu();

  const { categoryDelete } = useCategoryActions();

  const category = useStoreCategory((s) =>
    s.categories?.find((n) => n.id == props.categoryId)
  );

  const target = (
    <span
      id={`category-menu-target-${props.categoryId}`}
      {...targetProps}
      onContextMenu={(e) => {
        e.stopPropagation();
        targetProps.onContextMenu?.(e);
      }}
    >
      {children}
    </span>
  );

  return (
    <>
      {props.options?.context && target}

      <Menu
        position={props.options?.context ? undefined : 'bottom-start'}
        opened={props.options?.context ? opened : undefined}
        onChange={props.options?.context ? setOpened : undefined}
        onClose={props.options?.context ? close : undefined}
        withinPortal
        width={menuWidth}
        keepMounted
      >
        <MenuTarget>
          {props.options?.context ? <div {...anchorProps} /> : target}
        </MenuTarget>

        <MenuDropdown>
          <MenuLabel>
            <Text component="span" inherit lineClamp={1}>
              {category?.title}
            </Text>
          </MenuLabel>

          <MenuDivider />

          <ModalCategoryCrud
            props={category}
            source={props.options?.source || APP_NAME.WEB}
          >
            <MenuItem
              leftSection={
                <IconPencil size={ICON_SIZE} stroke={ICON_STROKE_WIDTH} />
              }
              onClick={() => {}}
            >
              Rename
            </MenuItem>
          </ModalCategoryCrud>

          <MenuDivider />

          {/* <ModalMove props={{ categoryId: category?.id }}>
          <MenuItem
            leftSection={
              <IconSortAscendingSmallBig
                size={ICON_SIZE}
                stroke={ICON_STROKE_WIDTH}
              />
            }
            onClick={() => {}}
          >
            Move to...
          </MenuItem>
          </ModalMove> */}

          {/* <MenuDivider /> */}

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
    </>
  );
}
