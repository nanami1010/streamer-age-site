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

test("利用許可を確認済みのプロフィール画像だけを表示対象にする", () => {
  const confirmed = { ...baseImage, permissionStatus: "confirmed" };

  assert.equal(getDisplayProfileImage(confirmed), confirmed);
  assert.equal(
    getDisplayProfileImage({ ...baseImage, permissionStatus: "unconfirmed" }),
    null
  );
  assert.equal(
    getDisplayProfileImage({ ...baseImage, permissionStatus: "not-permitted" }),
    null
  );
  assert.equal(getDisplayProfileImage(null), null);
});
