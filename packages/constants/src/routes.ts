/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

export const authRoutes = [
  '/auth/sign-in',
  '/auth/sign-up',
  // Add other auth routes
];

export const protectedRoutes = [
  '/app',
  // Add other protected routes
];

export const protectedDeadEndRoutes = [
  '/auth/sign-out',
  '/auth/confirm/delete-account',
  // Add other protected dead-end routes
];
