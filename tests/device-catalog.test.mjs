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
  getDeviceSourceCaution,
  getDeviceSourceLabel
} from "../src/config/device-sources.ts";
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

test("49件の掲載記録を40製品にまとめる", () => {
  const catalog = createDeviceCatalog(streamers);

  assert.equal(catalog.length, 40);
  assert.equal(
    catalog.reduce((total, device) => total + device.usages.length, 0),
    49
  );
});

test("40製品のproductIdと製品情報が一意である", () => {
  assert.equal(DEVICE_PRODUCTS.length, 40);
  assert.equal(
    new Set(DEVICE_PRODUCTS.map((product) => product.productId)).size,
    40
  );
  assert.equal(
    new Set(DEVICE_PRODUCTS.map(createDeviceIdentityKey)).size,
    40
  );
});

test("49件すべてが製品台帳のproductIdと正しく紐づく", () => {
  const devices = streamers.flatMap((streamer) => streamer.devices ?? []);

  assert.equal(devices.length, 49);
  assert.equal(devices.every(deviceMatchesProductDefinition), true);
  assert.equal(new Set(devices.map((device) => device.productId)).size, 40);
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

test("同一型番のQuietComfort 20を4人の掲載記録としてまとめる", () => {
  const catalog = createDeviceCatalog(streamers);
  const qc20 = catalog.find(
    (device) => device.productName === "QuietComfort 20（QC20）"
  );

  assert.deepEqual(
    qc20?.usages.map((usage) => usage.streamerSlug),
    ["cpt", "francisco", "ras", "spygea"]
  );
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
  assert.equal(shakaUsage?.lastVerifiedAt, "2026-10-27");
  assert.equal(
    shakaUsage?.sourceUrl,
    "https://www.youtube.com/watch?v=gS4lbJ347vM&t=718s"
  );
});

test("Nightbot由来37件はコマンド更新日時と使用確認日を分離する", () => {
  const catalog = createDeviceCatalog(streamers);
  const channelCommandUsages = catalog.flatMap((device) =>
    device.usages.filter((usage) => usage.sourceType === "channelCommand")
  );

  assert.equal(channelCommandUsages.length, 37);
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
  assert.match(
    getDeviceSourceCaution("channelCommand") ?? "",
    /本人が直接入力・発言した情報とは限りません/
  );
  assert.equal(
    channelCommandUsages.every((usage) => usage.lastVerifiedAt === "2026-10-27"),
    true
  );
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
  const productId = "sony-inzone-buds-wf-g700n";
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
  assert.equal(
    RAKUTEN_AFFILIATE_IMPLEMENTATION_STATUS,
    "pending-issued-code-review"
  );
});
