import { DEFAULT_COLOR_SCHEME } from '@repo/constants';
import { ColorScheme } from '@repo/types';

/**
 * Make all properties, including nested ones, optional
 */
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

/**
 * Determines if the current environment is production
 */
export const isProduction = (): boolean => process.env.NODE_ENV === 'production';

/**
 * Determines the OS theme ('light' | 'dark') based on user preference
 * or a provided color scheme.
 */

// Define this outside the function scope
let darkQuery: MediaQueryList | null = null;

export const getOSTheme = (colorScheme: ColorScheme): ColorScheme => {
  if (typeof window === 'undefined') return DEFAULT_COLOR_SCHEME;
  if (colorScheme !== 'auto') return colorScheme;

  // Cache the query object
  if (!darkQuery) {
    darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  }

  return darkQuery.matches ? ColorScheme.DARK : ColorScheme.LIGHT;
};

/**
 * Generates a placeholder image URL using placehold.co
 * @param fallback Optional dimensions and text for the placeholder
 */
export const getFallbackSrc = (fallback?: {
  width?: number;
  height?: number;
  text?: string;
}): string | undefined => {
  if (!fallback) return undefined;

  const width = fallback.width || 800;
  const height = fallback.height || 800;
  const text = fallback.text || 'Placeholder';

  return `https://placehold.co/${width}x${height}?text=${encodeURIComponent(text)}`;
};
