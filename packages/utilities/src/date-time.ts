/**
 * @template-source next-template
 * @template-sync auto
 * @description This file originates from the base template repository.
 * Do not modify unless you intend to backport changes to the template.
 */

import { HourSystem } from '@repo/types/enums';
import { FormatOptions, Timer } from '@repo/types/date-time';

/**
 * Format a date into a localized date and time string
 */
export const getRegionalDate = (
  input: Date | string,
  options: FormatOptions = { locale: 'en-GB', format: 'short' }
) => {
  const date = typeof input === 'string' ? new Date(input) : input;

  // Validate date
  if (isNaN(date.getTime())) {
    throw new Error('Utility Error → Invalid date provided');
  }

  const { locale = 'en-GB', format = 'short', timezone, hourSystem } = options;

  // Centralized format definitions
  const formatOptions: Record<typeof format, Intl.DateTimeFormatOptions> = {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    full: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
    numeric: { year: 'numeric', month: '2-digit', day: '2-digit' },
  };

  const dateFormatter = new Intl.DateTimeFormat(locale, formatOptions[format]);
  const timeFormatter = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: hourSystem !== HourSystem.TWENTY_FOUR,
    ...(timezone ? { timeZone: timezone } : {}),
  });

  return {
    date: dateFormatter.format(date),
    time: timeFormatter.format(date),
  };
};

/**
 * Check if a date is in the future
 */
export const isFutureDate = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return !isNaN(d.getTime()) && d.getTime() > Date.now();
};

/**
 * Check if a date is in the past
 */
export const isPastDate = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return !isNaN(d.getTime()) && d.getTime() < Date.now();
};

/**
 * Format a date as a relative time string (e.g. "2 days ago", "in 3 hours")
 */
export const getRelativeTime = (
  input: Date | string,
  locale = 'en-GB'
): string => {
  const date = typeof input === 'string' ? new Date(input) : input;

  // Validate
  if (isNaN(date.getTime())) {
    throw new Error('Utility Error → Invalid date provided');
  }

  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  const divisions = [
    { amount: 60, unit: 'seconds' }, // < 1 min
    { amount: 60, unit: 'minutes' }, // < 1 hr
    { amount: 24, unit: 'hours' }, // < 1 day
    { amount: 7, unit: 'days' }, // < 1 week
    { amount: 4.34524, unit: 'weeks' }, // ~1 month
    { amount: 12, unit: 'months' }, // < 1 year
    { amount: Number.POSITIVE_INFINITY, unit: 'years' },
  ] as const;

  let duration = diffSec;
  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      const unit = division.unit.replace(
        /s$/,
        ''
      ) as Intl.RelativeTimeFormatUnit;
      return rtf.format(Math.round(duration), unit);
    }
    duration /= division.amount;
  }

  // Fallback (shouldn't normally reach here)
  return rtf.format(0, 'second');
};

/**
 * Small wrapper that returns both 'getRegionalDate' and 'getRelativeTime'
 */
export const getDateMetadata = (
  input: Date | string,
  options?: FormatOptions
) => ({
  ...getRegionalDate(input, options),
  relative: getRelativeTime(input, options?.locale),
});

/**
 * Generates a random date between two given dates.
 * Defaults to a random date within the past 10 years.
 * Optionally deterministic if a seed is provided.
 */
export function getRandomDate(from?: Date, to?: Date, seed?: string): Date {
  const now = new Date();

  // Default range: past 10 years up to now
  const defaultStart = new Date(now);
  defaultStart.setFullYear(now.getFullYear() - 10);

  const start = from ?? defaultStart;
  const end = to ?? now;

  const startTime = start.getTime();
  const endTime = end.getTime();

  if (isNaN(startTime) || isNaN(endTime)) {
    throw new Error('Invalid date(s) provided.');
  }
  if (startTime > endTime) {
    throw new Error('Start date must be before end date.');
  }

  // Optional deterministic pseudo-random generator
  const seededRandom = (s: string): (() => number) => {
    let h = 2166136261 >>> 0; // FNV-1a hash base
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return () => {
      h = (Math.imul(h, 1664525) + 1013904223) >>> 0;
      return h / 4294967296;
    };
  };

  const rng = seed ? seededRandom(seed) : Math.random;

  const randomTime = startTime + rng() * (endTime - startTime);
  return new Date(randomTime);
}

/**
 * Returns the time remaining until a target date in months, days, hours, minutes, and seconds.
 * Returns null if the target date has already passed.
 */
export const getTimeRemaining = (targetDate: Date): Timer | null => {
  const now = new Date();
  if (targetDate.getTime() <= now.getTime()) return null;

  let totalSeconds = Math.floor((targetDate.getTime() - now.getTime()) / 1000);

  const months = Math.floor(totalSeconds / (30 * 24 * 60 * 60));
  totalSeconds %= 30 * 24 * 60 * 60;

  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  totalSeconds %= 24 * 60 * 60;

  const hours = Math.floor(totalSeconds / (60 * 60));
  totalSeconds %= 60 * 60;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return { months, days, hours, minutes, seconds };
};

/**
 * Returns the time elapsed since a target date in months, days, hours, minutes, and seconds.
 * Returns null if the target date is in the future.
 */
export const getTimeElapsed = (targetDate: Date | string): Timer | null => {
  const now = new Date();
  if (typeof targetDate === 'string') targetDate = new Date(targetDate);
  if (targetDate.getTime() > now.getTime()) return null;

  let totalSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  const months = Math.floor(totalSeconds / (30 * 24 * 60 * 60));
  totalSeconds %= 30 * 24 * 60 * 60;

  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  totalSeconds %= 24 * 60 * 60;

  const hours = Math.floor(totalSeconds / (60 * 60));
  totalSeconds %= 60 * 60;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return { months, days, hours, minutes, seconds };
};

type TimeUnit = {
  value: number;
  unit:
    | 'month'
    | 'months'
    | 'day'
    | 'days'
    | 'hour'
    | 'hours'
    | 'minute'
    | 'minutes'
    | 'second'
    | 'seconds';
};

/**
 * Returns the most appropriate unit (month/day/hour/minute/second) for elapsed time.
 */
export const getAppropriateDuration = (
  targetDate: Date | string
): TimeUnit | null => {
  const elapsed = getTimeElapsed(targetDate);
  if (!elapsed) return null;

  if (elapsed.months > 0)
    return {
      value: elapsed.months,
      unit: `month${elapsed.months > 1 ? 's' : ''}`,
    };
  if (elapsed.days > 0)
    return { value: elapsed.days, unit: `day${elapsed.days > 1 ? 's' : ''}` };
  if (elapsed.hours > 0)
    return {
      value: elapsed.hours,
      unit: `hour${elapsed.hours > 1 ? 's' : ''}`,
    };
  if (elapsed.minutes > 0)
    return {
      value: elapsed.minutes,
      unit: `minute${elapsed.minutes > 1 ? 's' : ''}`,
    };
  return {
    value: elapsed.seconds,
    unit: `second${elapsed.seconds > 1 ? 's' : ''}`,
  };
};

/**
 * Returns true if a date is before today (overdue)
 */
export const isOverdue = (date: Date | string): boolean => {
  if (typeof date === 'string') date = new Date(date);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);

  return normalizedDate < today;
};

/**
 * Returns true if a date is today
 */
export const isToday = (date: Date | string): boolean => {
  if (typeof date === 'string') date = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date.getTime() === today.getTime();
};

/**
 * Returns true if a date is tomorrow
 */
export const isTomorrow = (date: Date | string): boolean => {
  if (typeof date === 'string') date = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  date.setHours(0, 0, 0, 0);
  return date.getTime() === tomorrow.getTime();
};

/**
 * Groups a list of dates into weeks (Monday–Sunday)
 */
export const groupDatesByWeek = (dates: Date[]): { min: Date; max: Date }[] => {
  dates.sort((a, b) => a.getTime() - b.getTime());

  const ranges: { min: Date; max: Date }[] = [];
  const seen = new Set<string>();

  const getMonday = (d: Date) => {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    const day = date.getDay();
    date.setDate(date.getDate() + (day === 0 ? -6 : 1 - day));
    return date;
  };

  const getSunday = (d: Date) => {
    const monday = getMonday(d);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    return sunday;
  };

  for (const date of dates) {
    const monday = getMonday(date);
    const sunday = getSunday(date);
    const key = `${monday.toISOString()}-${sunday.toISOString()}`;
    if (!seen.has(key)) {
      ranges.push({ min: monday, max: sunday });
      seen.add(key);
    }
  }

  return ranges;
};

/**
 * Checks if a date is within a given range
 */
export const isDateInRange = (
  date: Date,
  range: { min: Date; max: Date }
): boolean => {
  return date >= range.min && date <= range.max;
};

/**
 * Checks if a date is within the next 7 days
 */
export const isWithinNext7Days = (date: Date | null): boolean => {
  if (!date) return false;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setDate(now.getDate() + 7);
  return date >= now && date <= end;
};

/**
 * Deduplicates dates (by UTC day)
 */
export const deduplicateDates = (dates: (Date | string)[]): Date[] => {
  const map = new Map<string, Date>();
  for (const d of dates) {
    const date = typeof d === 'string' ? new Date(d) : d;
    const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
    if (!map.has(key)) map.set(key, new Date(date));
  }
  return Array.from(map.values());
};

/**
 * Checks if two dates are on the same day
 */
export const areSameDay = (
  dateA: Date | string,
  dateB: Date | string
): boolean => {
  const a = new Date(dateA);
  const b = new Date(dateB);
  if (isNaN(a.getTime()) || isNaN(b.getTime())) return false;
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
};

/**
 * Returns the part of the day: morning, afternoon, evening, night
 */
export const getTimeOfDay = ():
  | 'morning'
  | 'afternoon'
  | 'evening'
  | 'night' => {
  const hours = new Date().getHours();
  if (hours >= 6 && hours < 12) return 'morning';
  if (hours >= 12 && hours < 18) return 'afternoon';
  if (hours >= 18 && hours < 21) return 'evening';
  return 'night';
};
