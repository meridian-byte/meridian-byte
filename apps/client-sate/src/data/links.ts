/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import {
  IconCarrot,
  IconScaleOutline,
  IconSettings,
  IconSoup,
} from '@tabler/icons-react';
import { NavLink } from '@repo/types/link';

export const navLinks = {
  app: [
    {
      link: '/app/foods',
      label: 'Foods',
      icon: IconCarrot,
    },
    {
      link: '/app/meals',
      label: 'Meals',
      icon: IconSoup,
    },
    {
      link: '/app/masses',
      label: 'Weight Entries',
      icon: IconScaleOutline,
    },
    {
      link: '#settings',
      label: 'Settings',
      icon: IconSettings,
    },
  ] satisfies NavLink[],
};
