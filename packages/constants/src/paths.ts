/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

export const SHARED_VERCEL_SUBSTRING = 'meridianbyte';
const VERCEL_TEAM_SLUG = SHARED_VERCEL_SUBSTRING + '-team';
const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV;
const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
const gitBranch = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF;

export const isVercelPreview = vercelEnv === 'preview' && !!vercelUrl;
export const isProduction = vercelEnv
  ? vercelEnv === 'production'
  : process.env.NODE_ENV === 'production';

const cleanHost = (host?: string) => host?.replace(/^https?:\/\//, '') || '';

const sanitizeBranch = (branch?: string) =>
  branch ? branch.toLowerCase().replace(/[^a-z0-9-]/g, '-') : '';

const getPreviewUrl = (projectName: string) => {
  if (!gitBranch) return cleanHost(vercelUrl); // Fallback if no git ref exists
  const branchSlug = sanitizeBranch(gitBranch);
  return `${projectName}-git-${branchSlug}-${VERCEL_TEAM_SLUG}.vercel.app`;
};

// API Host
export const HOSTNAME_API = isVercelPreview
  ? getPreviewUrl(`${SHARED_VERCEL_SUBSTRING}-api`)
  : isProduction
    ? cleanHost(process.env.NEXT_PUBLIC_HOST_API_PROD)
    : cleanHost(process.env.NEXT_PUBLIC_HOST_API_DEV);

// WEB Host
export const HOSTNAME_WEB = isVercelPreview
  ? getPreviewUrl(`${SHARED_VERCEL_SUBSTRING}-web`)
  : isProduction
    ? cleanHost(process.env.NEXT_PUBLIC_HOST_WEB_PROD)
    : cleanHost(process.env.NEXT_PUBLIC_HOST_WEB_DEV);

// ATLAS Host
export const HOSTNAME_ATLAS = isVercelPreview
  ? getPreviewUrl(`${SHARED_VERCEL_SUBSTRING}-atlas`)
  : isProduction
    ? cleanHost(process.env.NEXT_PUBLIC_HOST_ATLAS_PROD)
    : cleanHost(process.env.NEXT_PUBLIC_HOST_ATLAS_DEV);

// Protocol & Base URLs
export const getUrlPrefix = (host?: string) => {
  if (!host) return 'http://';
  return host.includes('localhost') || host.includes('127.0.0.1') ? 'http://' : 'https://';
};

export const BASE_URL = {
  API: `${getUrlPrefix(HOSTNAME_API)}${HOSTNAME_API}`,
  WEB: `${getUrlPrefix(HOSTNAME_WEB)}${HOSTNAME_WEB}`,
  ATLAS: `${getUrlPrefix(HOSTNAME_ATLAS)}${HOSTNAME_ATLAS}`,
};

export const API_URL = `${BASE_URL.API}/api`;

export const AUTH_URLS = {
  SIGN_IN: `/auth/sign-in`,
  SIGN_UP: `/auth/sign-up`,
  CHECK_EMAIL: `/auth/check-email`,
  ERROR: `/auth/error`,
  SIGN_OUT: `/auth/sign-out`,
  SIGNED_OUT: `/auth/signed-out`,
  REDIRECT: {
    DEFAULT: '/',
  },
};
