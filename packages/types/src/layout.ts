/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import React from 'react';

export type Sizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Widths = Partial<Record<'md' | 'lg', number>>;

export interface BodyProps {
  bar?: React.ReactNode;
  header?: React.ReactNode;
  nav?: React.ReactNode;
  hero?: React.ReactNode;
  children: React.ReactNode;
  aside?: {
    gap?: string | number;
    left?: {
      component: React.ReactNode;
      width?: Widths;
      withBorder?: boolean;
    };
    right?: {
      component: React.ReactNode;
      width?: Widths;
      withBorder?: boolean;
    };
  };
  footer?: React.ReactNode;
}

export interface PageProps extends React.ComponentPropsWithoutRef<'article'> {
  padded?: boolean | number | Sizes;
  stacked?: boolean | number | Sizes;
  children: React.ReactNode;
}

export interface SectionProps
  extends React.ComponentPropsWithoutRef<'section'> {
  containerized?: boolean | Sizes | 'responsive';
  padded?: boolean | number | Sizes;
  margined?: boolean | number | Sizes;
  className?: string;
  bordered?: boolean;
  shadowed?: boolean;
  withClerk?: boolean;
  bg?: string;
  children: React.ReactNode;
  id: string;
}
