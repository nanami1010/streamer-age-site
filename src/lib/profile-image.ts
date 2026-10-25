export type ProfileImageUsage =
  | "homeCard"
  | "profilePage"
  | "generationCard"
  | "ogp";

export interface ProfileImageData {
  src: string;
  alt: string;
  sourceUrl: string;
  permissionStatus: "confirmed" | "unconfirmed" | "not-permitted";
  permissionNote: string;
  credit?: string | null;
  lastVerifiedAt: string;
  usageScopes?: ProfileImageUsage[];
}

const LEGACY_USAGE_SCOPES: readonly ProfileImageUsage[] = [
  "homeCard",
  "profilePage",
  "generationCard"
];

export function getDisplayProfileImage(
  image: ProfileImageData | null,
  usage: ProfileImageUsage
): ProfileImageData | null {
  if (!image || image.permissionStatus !== "confirmed") return null;

  const usageScopes = image.usageScopes ?? LEGACY_USAGE_SCOPES;
  return usageScopes.includes(usage) ? image : null;
}
