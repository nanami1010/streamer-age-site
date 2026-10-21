export interface CalendarDate {
  year: number;
  month: number;
  day: number;
}

export function getTodayJST(now = new Date()): CalendarDate {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "numeric",
    day: "numeric"
  }).formatToParts(now);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);

  return {
    year: get("year"),
    month: get("month"),
    day: get("day")
  };
}

export function calculateAge(
  birthDate: string | null,
  today = getTodayJST()
): number | null {
  if (!birthDate) return null;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate);
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

  const age = today.year - year - (
    today.month < month ||
    (today.month === month && today.day < day)
      ? 1
      : 0
  );

  return Number.isFinite(age) && age >= 0 ? age : null;
}
