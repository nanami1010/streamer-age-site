import { mkdirSync } from "node:fs";
import { expect, test } from "@playwright/test";

test("使用デバイス一覧に49記録を40製品として表示する", async ({ page }) => {
  const response = await page.goto("/devices/");

  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle("配信者の使用デバイス一覧 | STREAMER AGE");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "配信者の使用デバイス一覧"
  );
  await expect(page.locator("[data-device-card]")).toHaveCount(40);
  await expect(page.locator("[data-device-usage]")).toHaveCount(49);
  await expect(page.locator("body")).not.toContainText("現在使用中");
});

test("同一製品の使用者をまとめ、異なるモデルを分離する", async ({ page }) => {
  await page.goto("/devices/");

  const m10s = page.locator("[data-device-card]").filter({
    has: page.getByRole("heading", {
      name: "INZONE M10S（SDM-27Q10S）",
      exact: true
    })
  });
  const m10sSecondGeneration = page.locator("[data-device-card]").filter({
    has: page.getByRole("heading", {
      name: "INZONE M10S II（SDM-27Q102）",
      exact: true
    })
  });

  await expect(m10s).toHaveCount(1);
  await expect(m10s.locator("[data-device-usage]")).toHaveCount(5);
  await expect(m10s.getByRole("link", { name: /SHAKA/ })).toHaveAttribute(
    "href",
    "/streamers/shaka/"
  );
  await expect(m10s.getByRole("link", { name: /k4sen/ })).toHaveAttribute(
    "href",
    "/streamers/k4sen/"
  );
  await expect(m10sSecondGeneration.locator("[data-device-usage]")).toHaveCount(1);
});

test("使用確認日・サイト確認日・出典を使用者ごとに表示する", async ({ page }) => {
  await page.goto("/devices/");

  const m10s = page.locator("[data-device-card]").filter({
    has: page.getByRole("heading", {
      name: "INZONE M10S（SDM-27Q10S）",
      exact: true
    })
  });
  const shakaUsage = m10s.locator("[data-device-usage]").filter({
    has: page.getByRole("link", { name: /SHAKA/ })
  });

  await expect(shakaUsage).toContainText("2025年11月27日");
  await expect(shakaUsage).toContainText("2026年10月27日");
  await expect(shakaUsage.getByRole("link", { name: /出典を確認/ })).toHaveAttribute(
    "href",
    "https://www.youtube.com/watch?v=gS4lbJ347vM&t=718s"
  );
});

test("Nightbotの更新日時を使用確認日と区別して表示する", async ({ page }) => {
  await page.goto("/devices/");

  const hyperlight = page.locator("[data-device-card]").filter({
    has: page.getByRole("heading", { name: "Hyperlight", exact: true })
  });
  const vodkaUsage = hyperlight.locator("[data-device-usage]").filter({
    has: page.getByRole("link", { name: /ボドカ/ })
  });

  await expect(vodkaUsage).toContainText("配信チャンネルの公開コマンド");
  await expect(vodkaUsage).toContainText("確認コマンド");
  await expect(vodkaUsage).toContainText("!mouse");
  await expect(vodkaUsage).toContainText("コマンド最終更新日");
  await expect(vodkaUsage).toContainText("2026年2月21日");
  await expect(vodkaUsage).toContainText("2026年10月27日");
  await expect(vodkaUsage).not.toContainText("使用確認日");
  await expect(vodkaUsage).toContainText(
    "本人が直接入力・発言した情報とは限りません"
  );
  await expect(vodkaUsage.locator('time[datetime="2026-02-21T03:22:04.370Z"]')).toHaveCount(1);

  const skypad = page.locator("[data-device-card]").filter({
    has: page.getByRole("heading", { name: "2.0", exact: true })
  });
  const tappyUsage = skypad.locator("[data-device-usage]").filter({
    has: page.getByRole("link", { name: /1tappy/ })
  });
  await expect(tappyUsage).toContainText("2026年6月26日");
  await expect(tappyUsage.locator('time[datetime="2026-06-25T18:40:57.774Z"]')).toHaveCount(1);
});

test("提携リンク未登録時は購入ボタンとPR表記を表示しない", async ({ page }) => {
  await page.goto("/devices/");

  await expect(page.locator(".purchase-link")).toHaveCount(0);
  await expect(page.locator(".affiliate-disclosure")).toHaveCount(0);
});

test("既存カテゴリーで絞り込み、全件表示へ戻せる", async ({ page }) => {
  await page.goto("/devices/");

  const filter = page.getByLabel("デバイスの種類");
  await expect(filter.locator("option")).toHaveCount(9);

  await filter.selectOption("モニター");
  await expect(page.locator("[data-device-card]:visible")).toHaveCount(3);
  await expect(page.locator("[data-device-count]")).toHaveText("3");

  await filter.selectOption("");
  await expect(page.locator("[data-device-card]:visible")).toHaveCount(40);
  await expect(page.locator("[data-device-count]")).toHaveText("40");
});

test("トップページから一覧へ移動でき、SEO設定を維持する", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: /使用デバイス一覧を見る/ });
  await expect(link).toHaveAttribute("href", "/devices/");
  await link.click();

  await expect(page).toHaveURL(/\/devices\/$/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://streamerage.jp/devices/"
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, follow"
  );
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
    "content",
    "STREAMER AGE"
  );
});

for (const width of [375, 1280]) {
  test(`${width}pxで使用デバイス一覧が横にはみ出さない`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/devices/");

    const dimensions = await page.evaluate(() => ({
      viewport: window.innerWidth,
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth
    }));
    expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport);
    expect(dimensions.body).toBeLessThanOrEqual(dimensions.viewport);

    const firstCard = await page.locator("[data-device-card]").first().boundingBox();
    expect(firstCard).not.toBeNull();
    expect(firstCard!.x).toBeGreaterThanOrEqual(-0.5);
    expect(firstCard!.x + firstCard!.width).toBeLessThanOrEqual(width + 0.5);

    mkdirSync("test-results/screenshots", { recursive: true });
    await page.screenshot({
      path: `test-results/screenshots/devices-${width}.png`,
      fullPage: true
    });
  });
}
