import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import {
  createDeviceProductKey,
  getDeviceAffiliateLinks
} from "../src/config/device-affiliate-links.ts";
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

test("30件の使用記録を26製品にまとめる", () => {
  const catalog = createDeviceCatalog(streamers);

  assert.equal(catalog.length, 26);
  assert.equal(
    catalog.reduce((total, device) => total + device.usages.length, 0),
    30
  );
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
    ["1tappy", "Dep", "k4sen", "SHAKA"]
  );
  assert.equal(m10sSecondGeneration?.usages.length, 1);
  assert.equal(m10sSecondGeneration?.usages[0].streamerName, "k4sen");
});

test("同一型番のQuietComfort 20を2人の使用記録としてまとめる", () => {
  const catalog = createDeviceCatalog(streamers);
  const qc20 = catalog.find(
    (device) => device.productName === "QuietComfort 20（QC20）"
  );

  assert.deepEqual(
    qc20?.usages.map((usage) => usage.streamerSlug),
    ["cpt", "francisco"]
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

test("Nightbot由来18件はコマンド更新日時と使用確認日を分離する", () => {
  const catalog = createDeviceCatalog(streamers);
  const channelCommandUsages = catalog.flatMap((device) =>
    device.usages.filter((usage) => usage.sourceType === "channelCommand")
  );

  assert.equal(channelCommandUsages.length, 18);
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

test("商品リンクはカテゴリー・メーカー・製品名が完全一致する製品だけに適用する", () => {
  const device = {
    type: "モニター",
    manufacturer: "Sony",
    productName: "INZONE M10S（SDM-27Q10S）"
  };
  const links = {
    [createDeviceProductKey(device)]: {
      amazon: "https://www.amazon.co.jp/example",
      rakuten: "https://item.rakuten.co.jp/example/product"
    }
  };

  assert.deepEqual(getDeviceAffiliateLinks(device, links), links[createDeviceProductKey(device)]);
  assert.equal(
    getDeviceAffiliateLinks({ ...device, productName: "INZONE M10S II（SDM-27Q102）" }, links),
    null
  );
});

test("商品リンクはHTTPSだけを受け付ける", () => {
  const device = {
    type: "マウス",
    manufacturer: "Example",
    productName: "Example Mouse"
  };

  assert.throws(
    () =>
      getDeviceAffiliateLinks(device, {
        [createDeviceProductKey(device)]: {
          amazon: "http://www.amazon.co.jp/example"
        }
      }),
    /HTTPS URL/
  );
});
