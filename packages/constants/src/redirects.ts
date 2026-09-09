export const staticRedirects = {
  '/contact': '/about/contact',
};

export const dynamicRedirects = [
  {
    // Matches "/stories/blog/any-title-123" and preserves the dynamic part
    pattern: /^\/stories\/blog\/([^/]+)$/,
    replacement: '/resources/blog/$1',
  },
];
