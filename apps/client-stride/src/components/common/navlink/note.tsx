'use client';

import { useCategoryActions } from '@repo/hooks/actions/category';
import { useStoreCategory } from '@repo/libraries/zustand/stores/category';
import React, { useEffect, useMemo, useRef, useState } from 'react';
// import MenuCategorySide from '@repo/components/common/menus/category/side';
import {
  ActionIcon,
  Box,
  Grid,
  GridCol,
  Group,
  NavLink,
  Text,
  ThemeIcon,
  Tooltip,
} from '@mantine/core';
import Link from 'next/link';
import { extractUuidFromParam, linkify } from '@repo/utilities/url';
import { useStoreAppShell } from '@repo/libraries/zustand/stores/shell';
import { useMediaQuery } from '@mantine/hooks';
import { CategoryGet } from '@repo/types/models/category';
import classes from './category.module.scss';
import {
  IconChevronDown,
  IconChevronRight,
  IconDots,
  IconDotsVertical,
  IconFile,
  IconPlus,
} from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE_WIDTH } from '@repo/constants/sizes';
import { usePathname, useRouter } from 'next/navigation';
import { sortArray } from '@repo/utilities/array';
import { Order } from '@repo/types/enums';

export default function Category({
  props,
}: {
  props: { categoryId?: string };
}) {
  const appshell = useStoreAppShell((s) => s.appshell);
  const setAppShell = useStoreAppShell((s) => s.setAppShell);
  const desktop = useMediaQuery('(min-width: 62em)');
  const categories = useStoreCategory((s) => s.categories);

  const category = categories?.find((n) => n.id === props.categoryId);
  const childCategories = sortArray(
    (categories || []).filter(
      (ni) => ni.parent_category_id == props.categoryId
    ),
    (i) => i.created_at,
    Order.DESCENDING
  );

  const pathname = usePathname();
  const router = useRouter();

  const parentLink = `/app/n/${linkify(category?.title || '')}-${category?.id}`;

  function handleNavigate() {
    router.push(parentLink);

    if (!desktop && appshell) {
      setAppShell({
        ...appshell,
        child: { ...appshell.child, navbar: false },
      });
    }
  }

  const activeId = extractUuidFromParam(pathname);

  const shouldBeOpen =
    !!category?.id &&
    !!activeId &&
    isAncestor(category.id, activeId, categories || []);

  const [opened, setOpened] = useState(shouldBeOpen);

  const prevChildCountRef = useRef(childCategories.length);

  useEffect(() => {
    const prevCount = prevChildCountRef.current;
    const currCount = childCategories.length;

    if (currCount > prevCount) {
      // New children added → auto-expand
      setOpened(true);
    } else if (currCount === 0 && prevCount > 0) {
      // All children removed → auto-collapse
      setOpened(false);
    }

    prevChildCountRef.current = currCount;
  }, [childCategories.length]);

  useEffect(() => {
    if (shouldBeOpen) setOpened(true);
  }, [shouldBeOpen]);

  return (
    // <MenuCategorySide
    //   props={{ categoryId: category?.id, options: { context: true } }}
    // >
    <NavLink
      component={Link}
      href={parentLink}
      onClick={(e) => e.preventDefault()}
      opened={childCategories.length ? opened : undefined}
      active={!category ? false : pathname.includes(category.id)}
      childrenOffset={8}
      mt={2}
      classNames={classes}
      label={
        <CategoryLabel
          item={category}
          link={parentLink}
          hasChildren={!!childCategories.length}
          opened={opened}
          toggle={() => setOpened((o) => !o)}
          onNavigate={handleNavigate}
        />
      }
    >
      {childCategories.map((cni) => (
        // <MenuCategorySide
        //   key={cni.id}
        //   props={{ categoryId: cni.id, options: { context: true } }}
        // >
        <Category props={{ categoryId: cni.id }} />
        // </MenuCategorySide>
      ))}
    </NavLink>
    // </MenuCategorySide>
  );
}

function CategoryActions({ categoryId }: { categoryId?: string }) {
  const { categoryCreate } = useCategoryActions();

  return (
    <Group justify="end" gap={0}>
      {/* <MenuCategorySide props={{ categoryId }}> */}
      <Tooltip label="Category actions">
        <Group>
          <ActionIcon
            size={ICON_SIZE}
            radius="sm"
            color="dark"
            variant="subtle"
          >
            <IconDots size={ICON_SIZE - 4} />
          </ActionIcon>
        </Group>
      </Tooltip>
      {/* </MenuCategorySide> */}

      <Tooltip label="Create category inside">
        <Group>
          <ActionIcon
            size={ICON_SIZE}
            radius="sm"
            color="dark"
            variant="subtle"
            onClick={() => categoryCreate({ parent_category_id: categoryId })}
          >
            <IconPlus size={ICON_SIZE - 4} />
          </ActionIcon>
        </Group>
      </Tooltip>
    </Group>
  );
}

function CategoryLabel({
  item,
  link,
  hasChildren,
  opened,
  toggle,
  onNavigate,
}: {
  item: CategoryGet | undefined;
  link: string;
  hasChildren: boolean;
  opened?: boolean;
  toggle?: () => void;
  onNavigate: () => void;
}) {
  const ChevronIcon = opened ? IconChevronDown : IconChevronRight;

  return (
    <Grid
      gutter={0}
      align="center"
      className={hasChildren ? classes.box : classes.boxChild}
    >
      <GridCol span={1}>
        <Group>
          {hasChildren ? (
            <>
              <ActionIcon
                size={ICON_SIZE}
                radius="sm"
                color="dark"
                variant="subtle"
                className={classes.theme}
              >
                <IconFile size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>

              <ActionIcon
                size={ICON_SIZE}
                radius="sm"
                color="dark"
                variant="subtle"
                onClick={toggle}
                className={classes.action}
              >
                <ChevronIcon size={ICON_SIZE - 4} stroke={ICON_STROKE_WIDTH} />
              </ActionIcon>
            </>
          ) : (
            <ThemeIcon
              size={ICON_SIZE}
              radius="sm"
              color="dark"
              variant="transparent"
            >
              <IconFile size={ICON_SIZE - 4} />
            </ThemeIcon>
          )}
        </Group>
      </GridCol>

      <GridCol span={9} onClick={onNavigate}>
        <Text component="span" inherit lineClamp={1}>
          {item?.title}
        </Text>
      </GridCol>

      <GridCol
        span={2}
        className={hasChildren ? classes.menu : classes.menuChild}
      >
        <CategoryActions categoryId={item?.id} />
      </GridCol>
    </Grid>
  );
}

function isAncestor(
  categoryId: string,
  activeId: string,
  categories: CategoryGet[]
): boolean {
  let current = categories.find((n) => n.id === activeId);

  while (current?.parent_category_id) {
    if (current.parent_category_id === categoryId) return true;
    current = categories.find((n) => n.id === current?.parent_category_id);
  }

  return false;
}
