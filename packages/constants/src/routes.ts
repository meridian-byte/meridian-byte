/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

export const authRoutes = [
  '/auth/sign-in',
  '/auth/error',
  '/api/auth',
  '/auth/signed-out',
  // Add other auth routes
];

export const protectedRoutes = [
  '/',
  // Add other protected routes
];

export const ignoredRoutes = [
  '/manifest.webmanifest',
  // Add other ignored routes
];

export const protectedDeadEndRoutes = [
  '/auth/sign-out',
  // Add other protected dead-end routes
];
