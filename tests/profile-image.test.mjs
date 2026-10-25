import assert from "node:assert/strict";
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
