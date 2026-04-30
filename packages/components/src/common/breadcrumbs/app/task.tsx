'use client';

import React, { useMemo } from 'react';
import { Breadcrumbs, Group, Skeleton, Button } from '@mantine/core';
import { useStoreTask } from '@repo/libraries/zustand/stores/task';
import { TaskGet } from '@repo/types/models/task';
import { crumbify, extractUuidFromParam, linkify } from '@repo/utilities/url';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStoreCategory } from '@repo/libraries/zustand/stores/category';

export default function Task() {
  const pathname = usePathname();

  const tasks = useStoreTask((s) => s.tasks);
  const categories = useStoreCategory((s) => s.categories);

  if (tasks === undefined) {
    return (
      <Group gap={'xs'}>
        <Skeleton h={18} w={60} />
        <span>/</span>
        <Skeleton h={18} w={60} />
        <span>/</span>
        <Skeleton h={18} w={60} />
      </Group>
    );
  }

  if (!tasks) return null;

  const path = crumbify(pathname);

  if (path[path.length - 1].label.toLocaleLowerCase() == 'p') {
    const paramId = extractUuidFromParam(pathname);
    const category = categories?.find((ci) => ci.id == paramId);
    if (category) {
      path.push({
        link: `/p/${linkify(category.title)}-${category.id}`,
        label: category.title,
      });
    }
  }

  return (
    <Breadcrumbs>
      <Breadcrumbs separatorMargin={5}>
        {path.map((li, i) => {
          const isLast = i === path.length - 1;

          const sharedProps = {
            size: 'compact-sm',
            color: 'dark',
            fw: 'normal',
            variant: 'subtle',
          };

          if (i == 0) return null;

          const finalLabel =
            li.label.toLocaleLowerCase() == 'p' ? 'Projects' : li.label;

          return isLast ? (
            <Button key={li.link} {...sharedProps} variant="transparent">
              {finalLabel}
            </Button>
          ) : (
            <Button
              key={li.link}
              {...sharedProps}
              component={Link}
              href={li.link}
            >
              {finalLabel}
            </Button>
          );
        })}
      </Breadcrumbs>
    </Breadcrumbs>
  );
}
