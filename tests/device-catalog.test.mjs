import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
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

test("既存12件の使用記録を11製品にまとめる", () => {
  const catalog = createDeviceCatalog(streamers);

  assert.equal(catalog.length, 11);
  assert.equal(
    catalog.reduce((total, device) => total + device.usages.length, 0),
    12
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
    ["k4sen", "SHAKA"]
  );
  assert.equal(m10sSecondGeneration?.usages.length, 1);
  assert.equal(m10sSecondGeneration?.usages[0].streamerName, "k4sen");
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
  assert.equal(shakaUsage?.lastVerifiedAt, "2026-10-25");
  assert.equal(
    shakaUsage?.sourceUrl,
    "https://www.youtube.com/watch?v=gS4lbJ347vM&t=718s"
  );
});
