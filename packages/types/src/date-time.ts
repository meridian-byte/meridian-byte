/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { HourSystem } from './enums';

export interface FormatOptions {
  locale?: string; // en-US | en-GB
  timezone?: string;
  format?: 'numeric' | 'short' | 'long' | 'full';
  hourSystem?: HourSystem;
}

export interface Timer {
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
