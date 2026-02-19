/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import {
  IconCategory,
  IconLabel,
  IconLogout,
  IconSettings,
  IconUserEdit,
} from '@tabler/icons-react';
import { AUTH_URLS } from './paths';

export type Link = { link: string; label: string };

export type NavLink = Link & { subLinks: Link[] | null };

export const navLinkItems = {
  user: {
    activity: [
      // {
      //   icon: IconHeart,
      //   link: `/account/wishlist`,
      //   label: 'My Wishlist',
      // },
      // {
      //   icon: IconPackage,
      //   link: `/account/orders`,
      //   label: 'My Orders',
      // },
      // {
      //   icon: IconStar,
      //   link: `/account/reviews`,
      //   label: 'My Reviews',
      // },
    ],

    account: [
      {
        icon: IconUserEdit,
        link: `/account/profile`,
        label: 'Edit Profile',
      },
      {
        icon: IconSettings,
        link: `/account/settings`,
        label: 'Account Settings',
      },
    ],

    danger: [
      {
        icon: IconLogout,
        link: AUTH_URLS.SIGN_OUT,
        label: 'Sign Out',
      },
    ],
  },
};

export const navLinkApp = [
  {
    label: 'Account Groups',
    icon: IconLabel,
  },
  {
    label: 'Categories',
    icon: IconCategory,
  },
  {
    label: 'Settings',
    icon: IconSettings,
  },
];
