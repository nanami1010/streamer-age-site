const GENERATION_NICKNAMES: Readonly<Partial<Record<number, string>>> =
  Object.freeze({});

export function getGenerationLabel(year: number) {
  const nickname = GENERATION_NICKNAMES[year];
  return nickname
    ? `${year}年度生まれ（${nickname}）`
    : `${year}年度生まれ`;
}
