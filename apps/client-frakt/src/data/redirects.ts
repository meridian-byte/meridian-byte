/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

export const staticRedirects = {
  '/contact': '/about/contact',
};

export const dynamicRedirects = [
  {
    // Matches "/stories/blog/any-title-123" and preserves the dynamic part
    pattern: /^\/stories\/blog\/([^\/]+)$/,
    replacement: '/resources/blog/$1',
  },
];
