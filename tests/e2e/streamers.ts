import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { formatBirthday } from "../../src/utils/birthday";

export interface StreamerRecord {
  name: string;
  nameKana: string;
  aliases: string[];
  slug: string;
  birthDate: string | null;
  birthMonthDay?: string;
  genres: string[];
  affiliation: string | null;
  socialLinks: {
    youtube?: string;
    twitch?: string;
    x?: string;
  };
  profileImage: {
    src: string;
    alt: string;
    sourceUrl: string;
    permissionStatus: "confirmed" | "unconfirmed" | "not-permitted";
    permissionNote: string;
    credit?: string | null;
    lastVerifiedAt: string;
    usageScopes?: Array<
      "homeCard" | "profilePage" | "generationCard" | "ogp"
    >;
  } | null;
  sources: Array<{ field: string; url: string }>;
  lastVerifiedAt: string;
  devices?: unknown[];
}

const streamerDirectory = fileURLToPath(
  new URL("../../src/data/streamers/", import.meta.url)
);

export const streamers = readdirSync(streamerDirectory)
  .filter((fileName) => fileName.endsWith(".json"))
  .map((fileName) =>
    JSON.parse(
      readFileSync(new URL(`../../src/data/streamers/${fileName}`, import.meta.url), "utf8")
    ) as StreamerRecord
  )
  .sort((left, right) => left.slug.localeCompare(right.slug));

export function formatBirthDate(
  birthDate: string | null,
  birthMonthDay?: string
) {
  return formatBirthday(birthDate, birthMonthDay);
}
