import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import {
  DEVICE_AFFILIATE_LINKS,
  RAKUTEN_AFFILIATE_IMPLEMENTATION_STATUS,
  getDeviceAffiliateLinks
} from "../src/config/device-affiliate-links.ts";
import {
  DEVICE_PRODUCTS,
  createDeviceIdentityKey,
  deviceMatchesProductDefinition
} from "../src/config/device-products.ts";
import {
  getDeviceSourceBadgeLabel,
  getDeviceSourceLabel
} from "../src/config/device-sources.ts";
import {
  formatDeviceDate,
  formatDeviceDateTime,
  getVisibleDeviceDateItems
} from "../src/utils/device-date.ts";
import { createDeviceCatalog } from "../src/lib/device-catalog.ts";

const streamers = readdirSync(new URL("../src/data/streamers/", import.meta.url))
  .filter((fileName) => fileName.endsWith(".json"))
  .map((fileName) =>
    JSON.parse(
      readFileSync(
        new URL(`../src/data/streamers/${fileName}`, import.meta.url),
        "utf8"
      )
    )
  );

test("66件の掲載記録を57製品にまとめる", () => {
  const catalog = createDeviceCatalog(streamers);

  assert.equal(catalog.length, 57);
  assert.equal(
    catalog.reduce((total, device) => total + device.usages.length, 0),
    66
  );
});

test("57製品のproductIdと製品情報が一意である", () => {
  assert.equal(DEVICE_PRODUCTS.length, 57);
  assert.equal(
    new Set(DEVICE_PRODUCTS.map((product) => product.productId)).size,
    57
  );
  assert.equal(
    new Set(DEVICE_PRODUCTS.map(createDeviceIdentityKey)).size,
    57
  );
});

test("66件すべてが製品台帳のproductIdと正しく紐づく", () => {
  const devices = streamers.flatMap((streamer) => streamer.devices ?? []);

  assert.equal(devices.length, 66);
  assert.equal(devices.every(deviceMatchesProductDefinition), true);
  assert.equal(new Set(devices.map((device) => device.productId)).size, 57);
});

test("同一型番だけをまとめ、異なる世代を分離する", () => {
  const catalog = createDeviceCatalog(streamers);
  const m10s = catalog.find(
    (device) => device.productName === "INZONE M10S（SDM-27Q10S）"
  );
  const m10sSecondGeneration = catalog.find(
    (device) => device.productName === "INZONE M10S II（SDM-27Q102）"
  );

  assert.deepEqual(
    m10s?.usages.map((usage) => usage.streamerName),
    ["1tappy", "Dep", "k4sen", "SHAKA", "ta1yo"]
  );
  assert.equal(m10s?.productId, "sony-inzone-m10s-sdm-27q10s");
  assert.equal(
    m10sSecondGeneration?.productId,
    "sony-inzone-m10s-ii-sdm-27q102"
  );
  assert.notEqual(m10s?.productId, m10sSecondGeneration?.productId);
  assert.equal(m10sSecondGeneration?.usages.length, 1);
  assert.equal(m10sSecondGeneration?.usages[0].streamerName, "k4sen");
});

test("QuietComfort 20の接続先別バリエーションを誤統合しない", () => {
  const catalog = createDeviceCatalog(streamers);
  const qc20 = catalog.find(
    (device) => device.productName === "QuietComfort 20（QC20）"
  );
  const qc20Apple = catalog.find(
    (device) => device.productName === "QuietComfort 20（Appleデバイス向け）"
  );

  assert.deepEqual(
    qc20?.usages.map((usage) => usage.streamerSlug),
    ["cpt", "francisco", "ras"]
  );
  assert.deepEqual(
    qc20Apple?.usages.map((usage) => usage.streamerSlug),
    ["spygea"]
  );
  assert.notEqual(qc20?.productId, qc20Apple?.productId);
});

test("同一製品のAT2035を2人の掲載記録としてまとめる", () => {
  const catalog = createDeviceCatalog(streamers);
  const at2035 = catalog.find(
    (device) => device.productName === "AT2035"
  );

  assert.deepEqual(
    at2035?.usages.map((usage) => usage.streamerSlug),
    ["shomaru7", "spygea"]
  );
});

test("配信者ごとの使用確認日・検証日・出典を保持する", () => {
  const catalog = createDeviceCatalog(streamers);
  const m10s = catalog.find(
    (device) => device.productName === "INZONE M10S（SDM-27Q10S）"
  );
  const shakaUsage = m10s?.usages.find(
    (usage) => usage.streamerSlug === "shaka"
  );

  assert.equal(shakaUsage?.usageConfirmedAt, "2025-11-27");
  assert.equal(shakaUsage?.sourceType, "directStatement");
  assert.equal(shakaUsage?.sourceUpdatedAt, undefined);
  assert.equal(shakaUsage?.lastVerifiedAt, "2026-11-12");
  assert.equal(
    shakaUsage?.sourceUrl,
    "https://www.youtube.com/watch?v=gS4lbJ347vM&t=718s"
  );
});

test("Nightbot由来54件はコマンド更新日時と使用確認日を分離する", () => {
  const catalog = createDeviceCatalog(streamers);
  const channelCommandUsages = catalog.flatMap((device) =>
    device.usages.filter((usage) => usage.sourceType === "channelCommand")
  );

  assert.equal(channelCommandUsages.length, 54);
  assert.equal(
    channelCommandUsages.every((usage) => usage.sourceUpdatedAt !== undefined),
    true
  );
  assert.equal(
    channelCommandUsages.every((usage) => usage.sourceCommand?.startsWith("!")),
    true
  );
  assert.equal(
    channelCommandUsages.every((usage) => usage.usageConfirmedAt === undefined),
    true
  );
  assert.equal(
    getDeviceSourceLabel("channelCommand"),
    "配信チャンネルの公開コマンド"
  );
  assert.equal(
    getDeviceSourceBadgeLabel("channelCommand"),
    "公開コマンド"
  );
  assert.equal(
    channelCommandUsages.every((usage) => /^\d{4}-\d{2}-\d{2}$/.test(usage.lastVerifiedAt)),
    true
  );
  assert.equal(
    catalog
      .find((device) => device.productId === "bose-quietcomfort-20-apple")
      ?.usages.find((usage) => usage.streamerSlug === "spygea")
      ?.lastVerifiedAt,
    "2026-11-12"
  );
});

test("本人発言・本人管理サイト由来12件は使用確認日だけを保持する", () => {
  const catalog = createDeviceCatalog(streamers);
  const usageConfirmedRecords = catalog.flatMap((device) =>
    device.usages.filter((usage) => usage.sourceType !== "channelCommand")
  );

  assert.equal(usageConfirmedRecords.length, 12);
  assert.equal(
    usageConfirmedRecords.every(
      (usage) =>
        usage.usageConfirmedAt !== undefined &&
        usage.sourceUpdatedAt === undefined
    ),
    true
  );
});

test("同一配信者・同一製品の掲載記録は重複しない", () => {
  const records = streamers.flatMap((streamer) =>
    (streamer.devices ?? []).map((device) =>
      `${streamer.slug}\u0000${device.productId}`
    )
  );

  assert.equal(new Set(records).size, records.length);
});

test("カード表面の日付種別とJST変換を区別する", () => {
  assert.equal(formatDeviceDate("2026-01-01"), "2026年1月1日");
  assert.equal(
    formatDeviceDateTime("2026-03-23T19:29:50.152Z"),
    "2026年3月24日"
  );
  assert.deepEqual(
    getVisibleDeviceDateItems({
      sourceType: "channelCommand",
      sourceUpdatedAt: "2026-03-23T19:29:50.152Z",
      lastVerifiedAt: "2026-11-10"
    }),
    [
      {
        kind: "sourceUpdatedAt",
        label: "公開コマンド更新日",
        dateTime: "2026-03-23T19:29:50.152Z",
        formattedDate: "2026年3月24日"
      }
    ]
  );
});

test("複数の日付と日付未登録時の出典確認日を正しく返す", () => {
  assert.deepEqual(
    getVisibleDeviceDateItems({
      sourceType: "officialMaterial",
      usageConfirmedAt: "2026-10-09",
      sourceUpdatedAt: "2026-10-10T16:00:00.000Z",
      lastVerifiedAt: "2026-11-10"
    }).map(({ kind, label, formattedDate }) => ({
      kind,
      label,
      formattedDate
    })),
    [
      {
        kind: "usageConfirmedAt",
        label: "使用確認日",
        formattedDate: "2026年10月9日"
      },
      {
        kind: "sourceUpdatedAt",
        label: "出典更新日",
        formattedDate: "2026年10月11日"
      }
    ]
  );
  assert.deepEqual(
    getVisibleDeviceDateItems({
      sourceType: "officialMaterial",
      lastVerifiedAt: "2026-11-10"
    }),
    [
      {
        kind: "lastVerifiedAt",
        label: "出典確認日",
        dateTime: "2026-11-10",
        formattedDate: "2026年11月10日"
      }
    ]
  );
});

test("新規公開コマンド記録は配信者ごとのコマンドと更新日時を保持する", () => {
  const catalog = createDeviceCatalog(streamers);
  const shakaController = catalog
    .find((device) => device.productId === "grapht-command-trigger-for-pc")
    ?.usages.find((usage) => usage.streamerSlug === "shaka");
  const rionMouse = catalog
    .find(
      (device) =>
        device.productId === "razer-viper-v3-pro-sentinels-edition"
    )
    ?.usages.find((usage) => usage.streamerSlug === "rion");

  assert.equal(shakaController?.sourceCommand, "!controller");
  assert.equal(
    shakaController?.sourceUpdatedAt,
    "2026-09-21T18:11:19.609Z"
  );
  assert.equal(shakaController?.usageConfirmedAt, undefined);
  assert.equal(rionMouse?.sourceCommand, "!mouse");
  assert.equal(rionMouse?.sourceUpdatedAt, "2025-12-22T06:20:50.507Z");
  assert.equal(
    DEVICE_PRODUCTS.find(
      (product) => product.productId === "grapht-command-trigger-for-pc"
    )?.identityStatus,
    "needs-review"
  );
  assert.match(shakaController?.verificationNote ?? "", /型番.*確定できません/);
});

test("Amazon商品リンクは表示名ではなくproductIdで解決する", () => {
  const productId = "sony-inzone-m10s-ii-sdm-27q102";
  const links = {
    [productId]: {
      amazon: {
        url: "https://www.amazon.co.jp/dp/TESTASIN?tag=test-22",
        issuedBy: "associates-toolbar"
      }
    }
  };

  assert.deepEqual(getDeviceAffiliateLinks(productId, links), {
    amazon: links[productId].amazon.url
  });
  assert.equal(getDeviceAffiliateLinks("sony-inzone-m10s-sdm-27q10s", links), null);
});

test("Amazon商品リンクはHTTPS・許可ホスト・タグを検証する", () => {
  const productId = "razer-deathadder-v3-pro";
  const createLinks = (url) => ({
    [productId]: {
      amazon: { url, issuedBy: "associates-toolbar" }
    }
  });

  assert.throws(
    () => getDeviceAffiliateLinks(productId, createLinks("http://www.amazon.co.jp/dp/TEST?tag=test-22")),
    /HTTPS URL/
  );
  assert.throws(
    () => getDeviceAffiliateLinks(productId, createLinks("https://example.com/product?tag=test-22")),
    /許可されていないホスト/
  );
  assert.throws(
    () => getDeviceAffiliateLinks(productId, createLinks("https://www.amazon.co.jp/dp/TEST")),
    /アソシエイトタグ/
  );
  assert.deepEqual(
    getDeviceAffiliateLinks(
      productId,
      createLinks("https://amzn.asia/d/example")
    ),
    { amazon: "https://amzn.asia/d/example" }
  );
});

test("商品同一性が未確認の製品にはAmazonリンクを設定できない", () => {
  const productId = "sony-inzone-m10s-sdm-27q10s";
  const links = {
    [productId]: {
      amazon: {
        url: "https://www.amazon.co.jp/dp/TESTASIN?tag=test-22",
        issuedBy: "associates-toolbar"
      }
    }
  };

  assert.throws(
    () => getDeviceAffiliateLinks(productId, links),
    /商品同一性の確認が完了していない製品/
  );
});

test("本番商品リンクは0件で、楽天表示は発行コード確認まで無効である", () => {
  assert.deepEqual(DEVICE_AFFILIATE_LINKS, {});
  const se846 = DEVICE_PRODUCTS.find(
    (product) => product.productId === "shure-se846-clear"
  );
  const shomaru7Se846 = streamers
    .find((streamer) => streamer.slug === "shomaru7")
    ?.devices?.find((device) => device.productId === "shure-se846-clear");

  assert.equal(se846?.identityStatus, "needs-review");
  assert.equal(se846?.commerceIdentifiers, undefined);
  assert.equal(getDeviceAffiliateLinks("shure-se846-clear"), null);
  assert.equal(
    shomaru7Se846?.sourceUrl,
    "https://nightbot.tv/t/shomaru7/commands"
  );
  assert.equal(shomaru7Se846?.sourceCommand, "!earphone");
  assert.equal(shomaru7Se846?.usageConfirmedAt, undefined);
  assert.equal(shomaru7Se846?.lastVerifiedAt, "2026-11-13");
  assert.match(shomaru7Se846?.verificationNote ?? "", /SE535.*要確認/);
  assert.equal(
    RAKUTEN_AFFILIATE_IMPLEMENTATION_STATUS,
    "pending-issued-code-review"
  );
});
