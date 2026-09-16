export const SHARED_VERCEL_SUBSTRING = 'meridianbyte';
const VERCEL_TEAM_SLUG = `${SHARED_VERCEL_SUBSTRING}-team`;

const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV;
const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
const gitBranch = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF;

export const isVercelPreview = vercelEnv === 'preview';
export const isProduction = vercelEnv
  ? vercelEnv === 'production'
  : process.env.NODE_ENV === 'production';

const cleanHost = (host?: string | null) => host?.replace(/^https?:\/\//, '') || '';

const sanitizeBranch = (branch?: string) =>
  branch ? branch.toLowerCase().replace(/[^a-z0-9-]/g, '-') : '';

const getPreviewUrl = (projectName: string) => {
  if (!gitBranch) return cleanHost(vercelUrl);
  const branchSlug = sanitizeBranch(gitBranch);
  return `${projectName}-git-${branchSlug}-${VERCEL_TEAM_SLUG}.vercel.app`;
};

export const resolveHost = (
  prodEnvHost: string | undefined,
  devEnvHost: string | undefined,
  projectName: string,
  requestHostHeader?: string | null,
) => {
  // 1. Determine active host header (Client window OR passed Server header)
  let currentHost: string | null = null;

  if (typeof window !== 'undefined' && window.location?.hostname) {
    currentHost = window.location.hostname;
  } else if (requestHostHeader) {
    currentHost = cleanHost(requestHostHeader);
  }

  // 2. If accessing via *.vercel.app, retain .vercel.app
  if (currentHost && currentHost.endsWith('.vercel.app')) {
    if (currentHost.startsWith(projectName)) {
      return currentHost;
    }
    return currentHost.replace(/^[a-z0-9-]+(?=-git-|-team|\.vercel\.app)/, projectName);
  }

  // 3. Vercel Preview
  if (isVercelPreview) {
    return getPreviewUrl(projectName);
  }

  // 4. Custom Production Domain
  if (isProduction && prodEnvHost) {
    return cleanHost(prodEnvHost);
  }

  // 5. Vercel Production Fallback
  if (vercelUrl) {
    return cleanHost(vercelUrl);
  }

  // 6. Local Dev
  return isProduction ? cleanHost(prodEnvHost) : cleanHost(devEnvHost);
};

export const getUrlPrefix = (host?: string) => {
  if (!host) return 'https://';
  return host.includes('localhost') || host.includes('127.0.0.1') ? 'http://' : 'https://';
};

// Client-safe synchronous static URLs
const hostApi = resolveHost(
  process.env.NEXT_PUBLIC_HOST_API_PROD,
  process.env.NEXT_PUBLIC_HOST_API_DEV,
  `${SHARED_VERCEL_SUBSTRING}-api`,
);
const hostWeb = resolveHost(
  process.env.NEXT_PUBLIC_HOST_WEB_PROD,
  process.env.NEXT_PUBLIC_HOST_WEB_DEV,
  `${SHARED_VERCEL_SUBSTRING}-web`,
);
const hostAtlas = resolveHost(
  process.env.NEXT_PUBLIC_HOST_ATLAS_PROD,
  process.env.NEXT_PUBLIC_HOST_ATLAS_DEV,
  `${SHARED_VERCEL_SUBSTRING}-atlas`,
);

export const BASE_URL = {
  API: `${getUrlPrefix(hostApi)}${hostApi}`,
  WEB: `${getUrlPrefix(hostWeb)}${hostWeb}`,
  ATLAS: `${getUrlPrefix(hostAtlas)}${hostAtlas}`,
};

export const API_URL = `${BASE_URL.API}/api`;
