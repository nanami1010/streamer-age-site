import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { DEVICE_SOURCE_TYPES } from "./config/device-sources";
import {
  DEVICE_PRODUCT_ID_PATTERN,
  deviceMatchesProductDefinition,
  isDeviceProductId
} from "./config/device-products";
import { isValidBirthMonthDay } from "./utils/birthday";

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

const pastOrCurrentDateTime = z.iso.datetime({ offset: true }).refine(
  (dateTime) => new Date(dateTime).getTime() <= Date.now(),
  "未来の日時は指定できません"
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
  "birthMonthDay",
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

const profileImageUsage = z.enum([
  "homeCard",
  "profilePage",
  "generationCard",
  "ogp"
]);

const profileImageSchema = z.object({
  src: imageReference,
  alt: nonEmptyString,
  sourceUrl: httpUrl,
  permissionStatus: z.enum(["confirmed", "unconfirmed", "not-permitted"]),
  permissionNote: nonEmptyString,
  credit: nonEmptyString.nullable().optional(),
  lastVerifiedAt: pastOrTodayDate,
  usageScopes: z.array(profileImageUsage).refine(
    (values) => new Set(values).size === values.length,
    "同じ画像利用範囲を重複して指定できません"
  ).optional()
}).strict();

const deviceSchema = z.object({
  productId: z.string()
    .regex(
      DEVICE_PRODUCT_ID_PATTERN,
      "productIdは半角英小文字・数字・ハイフンで指定してください"
    )
    .refine(isDeviceProductId, "製品台帳に登録されていないproductIdです"),
  type: nonEmptyString,
  manufacturer: nonEmptyString,
  productName: nonEmptyString,
  image: imageReference.nullable().optional(),
  sourceUrl: httpUrl,
  sourceType: z.enum(DEVICE_SOURCE_TYPES),
  sourceCommand: nonEmptyString.optional(),
  usageConfirmedAt: pastOrTodayDate.optional(),
  sourceUpdatedAt: pastOrCurrentDateTime.optional(),
  verificationNote: nonEmptyString.optional(),
  lastVerifiedAt: pastOrTodayDate
}).strict().superRefine((device, context) => {
  if (isDeviceProductId(device.productId) && !deviceMatchesProductDefinition(device)) {
    context.addIssue({
      code: "custom",
      path: ["productId"],
      message: "productIdとカテゴリー・メーカー・製品名が一致しません"
    });
  }

  if (device.sourceType === "channelCommand") {
    if (device.sourceCommand === undefined) {
      context.addIssue({
        code: "custom",
        path: ["sourceCommand"],
        message: "公開コマンドには確認したコマンド名が必要です"
      });
    }

    if (device.sourceUpdatedAt === undefined) {
      context.addIssue({
        code: "custom",
        path: ["sourceUpdatedAt"],
        message: "公開コマンドには出典の最終更新日時が必要です"
      });
    }

    if (device.usageConfirmedAt !== undefined) {
      context.addIssue({
        code: "custom",
        path: ["usageConfirmedAt"],
        message: "公開コマンドの更新日時を使用確認日として登録できません"
      });
    }
  } else if (device.sourceCommand !== undefined) {
    context.addIssue({
      code: "custom",
      path: ["sourceCommand"],
      message: "確認コマンドは公開コマンドの出典だけに指定できます"
    });
  }
});

export const streamerSchema = z.object({
  name: nonEmptyString,
  nameKana: nonEmptyString,
  aliases: uniqueStringArray,
  slug: z.string().regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "slugは半角英小文字・数字・ハイフンだけで指定してください"
  ),
  birthDate: pastOrTodayDate.nullable(),
  birthMonthDay: z.string()
    .regex(/^\d{2}-\d{2}$/, "誕生日の月日はMM-DD形式で指定してください")
    .refine(isValidBirthMonthDay, "存在する月日を指定してください")
    .optional(),
  genres: uniqueStringArray.min(1),
  affiliation: nonEmptyString.nullable(),
  socialLinks: z.object({
    youtube: httpUrl.optional(),
    twitch: httpUrl.optional(),
    x: httpUrl.optional()
  }).strict(),
  profileImage: profileImageSchema.nullable(),
  sources: z.array(sourceSchema).min(1),
  lastVerifiedAt: pastOrTodayDate,
  devices: z.array(deviceSchema).optional()
}).strict().superRefine((streamer, context) => {
  if (streamer.birthDate !== null && streamer.birthMonthDay !== undefined) {
    context.addIssue({
      code: "custom",
      path: ["birthMonthDay"],
      message: "生年月日が登録済みの場合、誕生日の月日を重複登録できません"
    });
  }
});

const streamers = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: "./src/data/streamers",
    generateId: ({ entry }) => entry.replace(/\.json$/, "")
  }),
  schema: streamerSchema
});

export const collections = { streamers };
