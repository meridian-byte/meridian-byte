type DateGroup<T> = {
  period: string;
  items: T[];
};

export function groupByDate<T>(items: T[], dateKey: keyof T): DateGroup<T>[] {
  const now = new Date();
  const ONE_DAY = 1000 * 60 * 60 * 24;

  const today: T[] = [];
  const last7Days: T[] = [];
  const last30Days: T[] = [];
  const olderMap: Map<string, T[]> = new Map();

  for (const item of items) {
    const dateRaw = item[dateKey];
    if (!dateRaw) continue;

    const date = new Date(dateRaw as string | number | Date);
    const diffDays = (now.getTime() - date.getTime()) / ONE_DAY;

    if (diffDays < 1) {
      today.push(item);
    } else if (diffDays < 7) {
      last7Days.push(item);
    } else if (diffDays < 30) {
      last30Days.push(item);
    } else {
      const formatter = new Intl.DateTimeFormat('en-US', { month: 'long' });
      const month = formatter.format(date);
      const year = date.getFullYear();
      const label = `${month} ${year}`;
      if (!olderMap.has(label)) {
        olderMap.set(label, []);
      }
      olderMap.get(label)!.push(item);
    }
  }

  const result: DateGroup<T>[] = [];

  if (today.length) result.push({ period: 'Today', items: today });
  if (last7Days.length) result.push({ period: '7 days ago', items: last7Days });
  if (last30Days.length)
    result.push({ period: '30 days ago', items: last30Days });

  // Sort older buckets in reverse chronological order
  const sortedOlder = Array.from(olderMap.entries()).sort((a, b) => {
    const [monthA, yearA] = a[0].split(' ');
    const [monthB, yearB] = b[0].split(' ');
    const dateA = new Date(`${monthA} 1, ${yearA}`);
    const dateB = new Date(`${monthB} 1, ${yearB}`);
    return dateB.getTime() - dateA.getTime();
  });

  for (const [label, group] of sortedOlder) {
    result.push({ period: label, items: group });
  }

  return result;
}
