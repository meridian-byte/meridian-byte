/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { IconCategory, IconLabel, IconSettings } from '@tabler/icons-react';
import { NavLink } from '@repo/types/link';
import { linkify } from '@repo/utilities/url';

export const navLinks = {
  app: [
    {
      link: linkify('Account Groups'),
      label: 'Account Groups',
      icon: IconLabel,
    },
    {
      link: linkify('Categories'),
      label: 'Categories',
      icon: IconCategory,
    },
    {
      link: linkify('Settings'),
      label: 'Settings',
      icon: IconSettings,
    },
  ] satisfies NavLink[],
};
