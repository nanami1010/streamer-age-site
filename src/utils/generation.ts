export interface SchoolYearRange {
  startDate: string;
  endDate: string;
  label: string;
}

interface BirthDateRecord {
  birthDate: string | null;
}

function parseIsoDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  if (
    parsedDate.getUTCFullYear() !== year ||
    parsedDate.getUTCMonth() + 1 !== month ||
    parsedDate.getUTCDate() !== day
  ) {
    return null;
  }

  return { year, month, day };
}

export function getSchoolYear(birthDate: string | null): number | null {
  if (!birthDate) return null;

  const date = parseIsoDate(birthDate);
  if (!date) return null;

  const belongsToPreviousYear =
    date.month < 4 || (date.month === 4 && date.day === 1);

  return date.year - (belongsToPreviousYear ? 1 : 0);
}

export function getSchoolYearRange(year: number): SchoolYearRange {
  if (!Number.isInteger(year)) {
    throw new TypeError("年度は整数で指定してください。");
  }

  return {
    startDate: `${year}-04-02`,
    endDate: `${year + 1}-04-01`,
    label: `${year}年4月2日〜${year + 1}年4月1日`
  };
}

export function groupBySchoolYear<T extends BirthDateRecord>(items: T[]) {
  const groups = new Map<number, T[]>();

  for (const item of items) {
    const year = getSchoolYear(item.birthDate);
    if (year === null) continue;

    const group = groups.get(year) ?? [];
    group.push(item);
    groups.set(year, group);
  }

  return Array.from(groups, ([year, members]) => ({ year, members }))
    .sort((left, right) => right.year - left.year);
}
