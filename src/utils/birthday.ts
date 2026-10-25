export interface BirthdayParts {
  month: number;
  day: number;
}

export function parseBirthMonthDay(value: string): BirthdayParts | null {
  const match = /^(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const month = Number(match[1]);
  const day = Number(match[2]);
  const parsedDate = new Date(Date.UTC(2000, month - 1, day));

  if (
    parsedDate.getUTCMonth() + 1 !== month ||
    parsedDate.getUTCDate() !== day
  ) {
    return null;
  }

  return { month, day };
}

export function isValidBirthMonthDay(value: string): boolean {
  return parseBirthMonthDay(value) !== null;
}

export function formatBirthday(
  birthDate: string | null,
  birthMonthDay?: string
): string {
  if (birthDate) {
    const [year, month, day] = birthDate.split("-").map(Number);
    return `${year}年${month}月${day}日`;
  }

  if (birthMonthDay) {
    const parts = parseBirthMonthDay(birthMonthDay);
    if (parts) return `${parts.month}月${parts.day}日`;
  }

  return "未確認";
}
