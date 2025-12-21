/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { ColorScheme } from '@repo/types/enums';

export const DEFAULT_COLOR_SCHEME: ColorScheme = ColorScheme.DARK;

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
    CARBS: 'blue',
    PROTEINS: 'green',
    FATS: 'yellow',
    KCAL: 'violet',
  },
  MASSES: {
    FAT: 'yellow',
    MUSCLE: 'grape',
    BMI: 'cyan',
  },
};
