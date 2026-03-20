import { TIME_FORMAT } from '@repo/constants/other';
import { HourSystem } from '@repo/types/enums';
import { getRegionalDate } from '@repo/utilities/date-time';
import { capitalizeWord } from '@repo/utilities/string';
import { Frequency } from '@repo/types/models/enums';
import { Weekdays } from '@repo/types/enums';

const hour = 60 * 60 * 1000;
const day = 24 * hour;
// const week = 7 * day;

export const getWeekday = (date: Date): Weekdays => {
  const days: Weekdays[] = [
    Weekdays.SU,
    Weekdays.MO,
    Weekdays.TU,
    Weekdays.WE,
    Weekdays.TH,
    Weekdays.FR,
    Weekdays.SA,
  ];

  return days[date.getDay()];
};

export const getTomorrow = () => {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + day);

  // Ensure the time is set to 09:00 AM UTC, not local time
  return new Date(
    Date.UTC(
      tomorrow.getUTCFullYear(),
      tomorrow.getUTCMonth(),
      tomorrow.getUTCDate(),
      9,
      0,
      0,
      0
    )
  );
};

export const getNextWeek = (params?: { exactWeekAhead?: boolean }) => {
  const now = new Date();

  if (params?.exactWeekAhead) {
    // Ensure the date is exactly 7 days ahead, preserving UTC consistency
    return new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 7,
        9,
        0,
        0,
        0
      )
    );
  }

  // Get the current UTC day of the week (0 = Sunday, ..., 6 = Saturday)
  const currentDay = now.getUTCDay();
  const daysUntilNextMonday = (8 - currentDay) % 7 || 7; // Days until next Monday

  const nextMonday = new Date(now);
  nextMonday.setUTCDate(now.getUTCDate() + daysUntilNextMonday);
  nextMonday.setUTCHours(9, 0, 0, 0);

  return nextMonday;
};

export const getRoundedFutureTime = (props?: { hoursToAdd?: number }) => {
  const now = new Date(); // Current date and time in UTC

  // Add specified hours or default to 2 hours
  now.setUTCHours(now.getUTCHours() + (props?.hoursToAdd || 2));

  // Round up to the next whole UTC hour
  now.setUTCMinutes(0, 0, 0); // Reset minutes, seconds, and milliseconds
  now.setUTCHours(now.getUTCHours() + 1); // Move to the next whole hour

  return now;
};

export const checkDate = (props: {
  date: Date;
  checkFor: 'today' | 'tomorrow';
}) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Normalize current date to midnight

  const providedDate = new Date(props.date);
  providedDate.setHours(0, 0, 0, 0); // Normalize provided date to midnight

  switch (props.checkFor) {
    case 'today':
      if (now.getTime() === providedDate.getTime()) return 'today';
      break;

    case 'tomorrow':
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1); // Move to tomorrow
      if (tomorrow.getTime() === providedDate.getTime()) return 'tomorrow';
      break;
  }

  return '';
};

export const getNextWeekdays = (
  currentDate: Date,
  includePastWeekdays = false
): Date[] => {
  const todayIndex = currentDate.getUTCDay() || 7; // Convert Sunday (0) to 7 (ISO)
  const result: Date[] = [];

  if (includePastWeekdays) {
    // Include all weekdays from the current week (Monday to Friday)
    for (let i = 1; i <= 5; i++) {
      const pastDate = new Date(currentDate); // Clone date
      pastDate.setUTCDate(currentDate.getUTCDate() - (todayIndex - i));
      result.push(pastDate);
    }
    return result;
  }

  if (todayIndex >= 1 && todayIndex <= 5) {
    // If today is a weekday, get today + remaining weekdays
    for (let i = 0; i < 5 - todayIndex + 1; i++) {
      const nextDate = new Date(currentDate); // Clone date
      nextDate.setUTCDate(currentDate.getUTCDate() + i);
      result.push(nextDate);
    }
  } else {
    // If today is Saturday (6) or Sunday (7), move to next Monday
    const daysUntilNextMonday = 8 - todayIndex;
    for (let i = 0; i < 5; i++) {
      const nextDate = new Date(currentDate); // Clone date
      nextDate.setUTCDate(currentDate.getUTCDate() + daysUntilNextMonday + i);
      result.push(nextDate);
    }
  }

  return result;
};

export const getNextWeekdayDate = (
  weekdays: Weekdays[],
  todayIncluded?: boolean,
  fromDate?: Date
): Date => {
  const weekdaysMap: Record<Weekdays, number> = {
    [Weekdays.SU]: 0,
    [Weekdays.MO]: 1,
    [Weekdays.TU]: 2,
    [Weekdays.WE]: 3,
    [Weekdays.TH]: 4,
    [Weekdays.FR]: 5,
    [Weekdays.SA]: 6,
  };

  const today = new Date();

  let from = fromDate || today;

  if (!fromDate) {
    if (!todayIncluded) {
      from = today;
    } else {
      today.setDate(today.getDate() - 1);
    }
  } else {
    from = fromDate;
  }

  const todayIndex = weekdaysMap[getWeekday(from)];

  // Sort weekdays by the nearest occurrence
  const sortedWeekdays = weekdays
    .map((w) => ({ day: w, diff: (weekdaysMap[w] - todayIndex + 7) % 7 || 7 }))
    .sort((a, b) => a.diff - b.diff);

  const nextDate = new Date(from);
  nextDate.setDate(from.getDate() + sortedWeekdays[0].diff);

  return nextDate;
};

export const sortWeekdaysByCurrentDay = (weekdays: Weekdays[]): Weekdays[] => {
  const dayMap: { [key: string]: number } = {
    SU: 0,
    MO: 1,
    TU: 2,
    WE: 3,
    TH: 4,
    FR: 5,
    SA: 6,
  };

  // Get the current day of the week (0 is Sunday, 6 is Saturday)
  const currentDayIndex = new Date().getUTCDay();

  // Sort weekdays by shifting them to start from the current day
  return weekdays
    .slice()
    .sort(
      (a, b) =>
        ((dayMap[a] - currentDayIndex + 7) % 7) -
        ((dayMap[b] - currentDayIndex + 7) % 7)
    )
    .map((wd) => wd.toUpperCase()) as Weekdays[];
};

export const sortWeekdaysInOrder = (weekdays: string[]): string[] => {
  const calendarOrder: string[] = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

  // Convert input to uppercase and extract the first two characters
  const normalizedWeekdays = weekdays.map((day) =>
    day.toUpperCase().slice(0, 2)
  );

  // Validate input
  if (!normalizedWeekdays.every((day) => calendarOrder.includes(day))) {
    throw new Error('One or more invalid weekday names were provided.');
  }

  // Sort the weekdays in calendar order
  return normalizedWeekdays.sort(
    (a, b) => calendarOrder.indexOf(a) - calendarOrder.indexOf(b)
  );
};

export const getDueButtonLabel = (params: { date: Date }) => {
  const isToday = checkDate({ date: params.date, checkFor: 'today' });
  const isTomorrow = checkDate({ date: params.date, checkFor: 'tomorrow' });
  let label;

  if (isToday) {
    label = `Today`;
  } else if (isTomorrow) {
    label = `Tomorrow`;
  } else {
    label = `${getRegionalDate(params.date, { locale: TIME_FORMAT.LOCALE, format: 'short' }).date}`;
  }

  return label;
};

export const getReminderButtonLabel = (params: { date: Date }) => {
  const isToday = checkDate({ date: params.date, checkFor: 'today' });
  const isTomorrow = checkDate({ date: params.date, checkFor: 'tomorrow' });
  let label;

  const reminderTime = getRegionalDate(params.date, {
    hourSystem: HourSystem.TWENTY_FOUR,
  }).time;

  if (isToday) {
    label = `Today, ${reminderTime}`;
  } else if (isTomorrow) {
    label = `Tomorrow, ${reminderTime}`;
  } else {
    label = `${reminderTime}, ${getRegionalDate(params.date, { locale: TIME_FORMAT.LOCALE, format: 'short' }).date}`;
  }

  return label;
};

export const getRepeatButtonLabel = (params: {
  interval: number;
  frequency: Frequency;
  weekdays: Weekdays[];
}) => {
  let label = '';
  const singleInterval = params.interval == 1;
  const intervalLabel = `${singleInterval ? '' : `${params.interval}`}`;
  const frequencyLabel = `${params.frequency.toLocaleLowerCase()}${singleInterval ? '' : 's'}`;

  if (params.frequency == Frequency.WEEKLY) {
    const includesWeekend =
      params.weekdays.includes(Weekdays.SA) ||
      params.weekdays.includes(Weekdays.SU);

    if (params.weekdays.length == 5 && !includesWeekend) {
      label = `Weekdays`;
    } else {
      label = `Every ${intervalLabel} ${frequencyLabel} (${params.weekdays.map(
        (weekday) => {
          const isFirstItem = params.weekdays.indexOf(weekday) == 0;
          return `${isFirstItem ? '' : ' '}${capitalizeWord(weekday)}`;
        }
      )})`;
    }
  } else {
    label = `Every ${intervalLabel} ${frequencyLabel}`;
  }

  return label;
};

export const getNextDate = (params: {
  date: Date;
  frequency: Frequency;
  interval: number;
  weekdays?: Weekdays[];
}): Date => {
  const baseDate = new Date(params.date.getTime()); // Preserve both date and time

  if (params.frequency === Frequency.WEEKLY && params.weekdays?.length) {
    const weekdaysMap: Record<Weekdays, number> = {
      [Weekdays.SU]: 0,
      [Weekdays.MO]: 1,
      [Weekdays.TU]: 2,
      [Weekdays.WE]: 3,
      [Weekdays.TH]: 4,
      [Weekdays.FR]: 5,
      [Weekdays.SA]: 6,
    };

    // Current day of week (0-6)
    const currentDayOfWeek = baseDate.getDay();

    // Find the current week number relative to some fixed point
    // This is to determine when to apply the interval
    const january1st = new Date(baseDate.getFullYear(), 0, 1);
    const daysSinceJan1 = Math.floor(
      (baseDate.getTime() - january1st.getTime()) / (24 * 60 * 60 * 1000)
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const currentWeekNum = Math.floor(daysSinceJan1 / 7);

    // Find the next weekday after the current date
    let nextDate = null;
    let minDiff = Infinity;

    // Check if any of the weekdays occur later in the current week
    for (const weekday of params.weekdays) {
      const weekdayNum = weekdaysMap[weekday];
      const diff = weekdayNum - currentDayOfWeek;

      // If the weekday is today or earlier this week, it should move to next week or later
      if (diff <= 0) {
        continue;
      }

      // Found a weekday later this week
      if (diff < minDiff) {
        minDiff = diff;
        nextDate = new Date(baseDate.getTime());
        nextDate.setDate(baseDate.getDate() + diff);
      }
    }

    // If we didn't find a later weekday in this week, move to the next occurrence

    // based on the interval
    if (nextDate === null) {
      // Find the first weekday in our list
      const sortedWeekdays = [...params.weekdays].sort(
        (a, b) => weekdaysMap[a] - weekdaysMap[b]
      );
      const firstWeekdayNum = weekdaysMap[sortedWeekdays[0]];

      // Calculate days to add:
      // 1. Days to complete this week +
      // 2. Days from interval weeks +
      // 3. Days to reach the first weekday of next valid week
      const daysToEndOfWeek = 7 - currentDayOfWeek;
      const intervalDays = (params.interval - 1) * 7; // Skip weeks based on interval
      const daysToFirstWeekday = firstWeekdayNum;

      nextDate = new Date(baseDate.getTime());
      nextDate.setDate(
        baseDate.getDate() + daysToEndOfWeek + intervalDays + daysToFirstWeekday
      );
    }

    return nextDate;
  }

  // Handle other frequencies normally
  switch (params.frequency) {
    case Frequency.DAILY:
      baseDate.setDate(baseDate.getDate() + params.interval);
      break;
    case Frequency.WEEKLY:
      baseDate.setDate(baseDate.getDate() + params.interval * 7);
      break;
    case Frequency.MONTHLY:
      baseDate.setMonth(baseDate.getMonth() + params.interval);
      break;
    case Frequency.ANNUALLY:
      baseDate.setFullYear(baseDate.getFullYear() + params.interval);
      break;
    default:
      throw new Error('Invalid frequency');
  }

  return baseDate;
};
