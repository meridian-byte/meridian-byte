/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

export enum Hashing {
  SHA1 = 'SHA-1',
  SHA256 = 'SHA-256',
  SHA384 = 'SHA-384',
  SHA512 = 'SHA-512',
}

export enum Jwt {
  HS256 = 'HS256',
}

export enum AuthAction {
  SIGN_UP = 'SIGN-UP',
  SIGN_IN = 'SIGN-IN',
}

export enum TimerDirection {
  UP = 'up',
  DOWN = 'down',
}

export enum HourSystem {
  TWELVE = '12',
  TWENTY_FOUR = '24',
}

export enum Alert {
  INFO = 'INFO',
  WARNING = 'WARNING',
  DANGER = 'DANGER',
  SUCCESS = 'SUCCESS',
}

export enum Variant {
  SUCCESS = 'success',
  WARNING = 'warning',
  FAILED = 'failed',
}

export enum Order {
  ASCENDING = 'ASCENDING',
  DESCENDING = 'DESCENDING',
  DEFAULT = 'DEFAULT',
}

export enum ColorScheme {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto',
}
