import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { getDisplayProfileImage } from "../src/lib/profile-image.ts";

const baseImage = {
  src: "/images/streamers/example.webp",
  alt: "配信者名のプロフィール画像",
  sourceUrl: "https://example.com/official-profile",
  permissionNote: "掲載許可を取得",
  lastVerifiedAt: "2026-10-25"
};

test("確認済みかつ許可範囲に含まれる場合だけ表示対象にする", () => {
  const confirmed = {
    ...baseImage,
    permissionStatus: "confirmed",
    usageScopes: ["homeCard", "profilePage"]
  };

  assert.equal(getDisplayProfileImage(confirmed, "homeCard"), confirmed);
  assert.equal(getDisplayProfileImage(confirmed, "profilePage"), confirmed);
  assert.equal(getDisplayProfileImage(confirmed, "generationCard"), null);
  assert.equal(getDisplayProfileImage(confirmed, "ogp"), null);
  assert.equal(
    getDisplayProfileImage(
      {
        ...baseImage,
        permissionStatus: "unconfirmed",
        usageScopes: ["profilePage", "ogp"]
      },
      "profilePage"
    ),
    null
  );
  assert.equal(
    getDisplayProfileImage(
      {
        ...baseImage,
        permissionStatus: "not-permitted",
        usageScopes: ["profilePage", "ogp"]
      },
      "ogp"
    ),
    null
  );
  assert.equal(getDisplayProfileImage(null, "profilePage"), null);
});

test("利用範囲が未指定の既存データは画面表示を維持しOGPには使わない", () => {
  const legacyImage = { ...baseImage, permissionStatus: "confirmed" };

  assert.equal(getDisplayProfileImage(legacyImage, "homeCard"), legacyImage);
  assert.equal(getDisplayProfileImage(legacyImage, "profilePage"), legacyImage);
  assert.equal(
    getDisplayProfileImage(legacyImage, "generationCard"),
    legacyImage
  );
  assert.equal(getDisplayProfileImage(legacyImage, "ogp"), null);
});

test("OGPは明示的に許可された確認済み画像だけを使用する", () => {
  const ogpImage = {
    ...baseImage,
    permissionStatus: "confirmed",
    usageScopes: ["ogp"]
  };

  assert.equal(getDisplayProfileImage(ogpImage, "ogp"), ogpImage);
  assert.equal(getDisplayProfileImage(ogpImage, "profilePage"), null);
});

test("全141人の許可済みローカル画像が存在し、OGP用途を含まない", () => {
  const dataDirectory = path.resolve("src/data/streamers");
  const streamers = fs.readdirSync(dataDirectory)
    .filter((file) => file.endsWith(".json"))
    .map((file) => JSON.parse(fs.readFileSync(path.join(dataDirectory, file), "utf8")));

  assert.equal(streamers.length, 141);

  for (const streamer of streamers) {
    const image = streamer.profileImage;
    assert.ok(image, `${streamer.slug}: profileImageが未登録です`);
    assert.equal(image.permissionStatus, "confirmed");
    assert.deepEqual(image.usageScopes, [
      "homeCard",
      "profilePage",
      "generationCard"
    ]);
    assert.equal(image.usageScopes.includes("ogp"), false);
    assert.equal(image.src, `/images/streamers/${streamer.slug}.webp`);
    assert.equal(image.lastVerifiedAt, "2026-11-04");
    assert.ok(
      streamer.sources.some(
        (source) => source.field === "profileImage" && source.url === image.sourceUrl
      ),
      `${streamer.slug}: profileImageの出典がありません`
    );

    const imagePath = path.resolve("public", image.src.replace(/^\//, ""));
    assert.equal(fs.existsSync(imagePath), true, `${streamer.slug}: 画像ファイルがありません`);
    const data = fs.readFileSync(imagePath);
    assert.ok(data.length > 0, `${streamer.slug}: 画像ファイルが空です`);
    assert.equal(data.subarray(0, 4).toString("ascii"), "RIFF");
    assert.equal(data.subarray(8, 12).toString("ascii"), "WEBP");
  }
});
