const AFFILIATION_SEPARATOR = "／";

const AFFILIATION_ORGANIZATION_ALIASES: Readonly<Record<string, string>> = {
  "DOROKUSA（発起人）": "DOROKUSA",
  "DOROKUSA（特別顧問）": "DOROKUSA",
  "FENNEL（エージェント契約）": "FENNEL",
  "MURASH（業務提携）": "MURASH",
  "MURASH GAMING（Shadowverse部門GM）": "MURASH GAMING",
  "MURASH GAMING（Shadowverse部門マネージャー）": "MURASH GAMING",
  "MURASH GAMING（オーナー）": "MURASH GAMING",
  "プラチナムプロダクション（業務提携）": "プラチナムプロダクション",
  "REJECT（Shadowverse部門担当ヘッド）": "REJECT",
  "RIDDLE（オーナー）": "RIDDLE",
  "SonicBoom Entertainment（マネジメント業務提携）":
    "SonicBoom Entertainment",
  "つばさレコーズ（業務提携）": "つばさレコーズ"
};

function normalizeAffiliationSegment(segment: string): string {
  return AFFILIATION_ORGANIZATION_ALIASES[segment] ?? segment;
}

export function getAffiliationOrganizations(
  affiliation: string | null
): string[] {
  if (affiliation === null) return [];

  return Array.from(
    new Set(
      affiliation
        .split(AFFILIATION_SEPARATOR)
        .map((segment) => segment.trim())
        .filter((segment) => segment !== "")
        .map(normalizeAffiliationSegment)
    )
  );
}

export function getAffiliationOptions(
  affiliations: readonly (string | null)[]
): string[] {
  return Array.from(
    new Set(affiliations.flatMap(getAffiliationOrganizations))
  ).sort((left, right) => left.localeCompare(right, "ja"));
}

export function normalizeAffiliationFilterValue(
  value: string,
  availableOrganizations: readonly string[]
): string {
  if (availableOrganizations.includes(value)) return value;

  const organizations = getAffiliationOrganizations(value);
  return organizations.length === 1 &&
    availableOrganizations.includes(organizations[0])
    ? organizations[0]
    : "";
}
