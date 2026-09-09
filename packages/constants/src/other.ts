/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { ColorScheme } from '@repo/types';
import { colors } from './colors';

export const DEFAULT_COLOR_SCHEME: ColorScheme = ColorScheme.AUTO;

const WITHOUT_BODY: HeadersInit = {
  Accept: 'application/json',
};

const WITH_BODY: HeadersInit = {
  'Content-Type': 'application/json',
  ...WITHOUT_BODY,
};

export const HEADERS = { WITHOUT_BODY, WITH_BODY };

export const COLOR_CODES = {
  FOOD: {
    CARBS: colors[0]?.colorName,
    PROTEINS: colors[1]?.colorName,
    FATS: colors[2]?.colorName,
    KCAL: colors[3]?.colorName,
  },
  MASSES: {
    FAT: colors[4]?.colorName,
    MUSCLE: colors[5]?.colorName,
    BMI: colors[6]?.colorName,
  },
};

export const TIME_FORMAT = {
  LOCALE: 'en-GB',
};
