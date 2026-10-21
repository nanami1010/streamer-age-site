import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const nonEmptyString = z.string().trim().min(1);
const httpUrl = z.url({ protocol: /^https?$/ });
const imageReference = z.union([
  httpUrl,
  z.string().regex(/^\/(?!\/)[^\s]+$/, "画像はhttp(s) URLまたは/から始まるパスで指定してください")
]);

function getTodayJST() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${get("year")}-${get("month")}-${get("day")}`;
}

const pastOrTodayDate = z.iso.date().refine(
  (date) => date <= getTodayJST(),
  "未来の日付は指定できません"
);

const uniqueStringArray = z.array(nonEmptyString).refine(
  (values) => new Set(values).size === values.length,
  "同じ値を重複して指定できません"
);

const sourceField = z.enum([
  "name",
  "nameKana",
  "aliases",
  "birthDate",
  "genres",
  "affiliation",
  "socialLinks",
  "profileImage",
  "devices"
]);

const sourceSchema = z.object({
  field: sourceField,
  url: httpUrl
}).strict();

const deviceSchema = z.object({
  type: nonEmptyString,
  manufacturer: nonEmptyString,
  productName: nonEmptyString,
  image: imageReference.nullable().optional(),
  sourceUrl: httpUrl,
  lastVerifiedAt: pastOrTodayDate,
  affiliateUrl: httpUrl.nullable().optional(),
  affiliateLinks: z.object({
    amazon: httpUrl.nullable().optional(),
    rakuten: httpUrl.nullable().optional()
  }).strict().optional()
}).strict();

export const streamerSchema = z.object({
  name: nonEmptyString,
  nameKana: nonEmptyString,
  aliases: uniqueStringArray,
  slug: z.string().regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "slugは半角英小文字・数字・ハイフンだけで指定してください"
  ),
  birthDate: pastOrTodayDate.nullable(),
  genres: uniqueStringArray.min(1),
  affiliation: nonEmptyString.nullable(),
  socialLinks: z.object({
    youtube: httpUrl.optional(),
    twitch: httpUrl.optional(),
    x: httpUrl.optional()
  }).strict(),
  profileImage: imageReference.nullable(),
  sources: z.array(sourceSchema).min(1),
  lastVerifiedAt: pastOrTodayDate,
  devices: z.array(deviceSchema).optional()
}).strict();

const streamers = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: "./src/data/streamers",
    generateId: ({ entry }) => entry.replace(/\.json$/, "")
  }),
  schema: streamerSchema
});

export const collections = { streamers };
