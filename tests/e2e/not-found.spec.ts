import { expect, test, type Page } from "@playwright/test";

const viewports = [
  { width: 320, height: 900 },
  { width: 375, height: 900 },
  { width: 768, height: 1024 },
  { width: 1280, height: 900 }
];

async function expectNoHorizontalScroll(page: Page) {
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth
  }));

  expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport);
  expect(dimensions.body).toBeLessThanOrEqual(dimensions.viewport);
}

test("存在しないURLで日本語404ページと検索導線を表示する", async ({ page }) => {
  const response = await page.goto("/存在しないページ/");

  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle("ページが見つかりません | STREAMER AGE");
  await expect(page.getByRole("heading", { name: "ページが見つかりません" })).toBeVisible();
  await expect(page.getByRole("link", { name: "トップページへ戻る" })).toHaveAttribute("href", "/");
  await expect(page.getByRole("link", { name: "配信者を検索する" })).toHaveAttribute(
    "href",
    "/#streamer-search-input"
  );
  await expect(page.locator("meta[name='robots']")).toHaveAttribute(
    "content",
    "noindex, follow"
  );
});

for (const viewport of viewports) {
  test(`${viewport.width}pxで404ページが横にはみ出さない`, async ({ page }) => {
    await page.setViewportSize(viewport);

    const response = await page.goto("/missing-for-responsive-check/");

    expect(response?.status()).toBe(404);
    await expectNoHorizontalScroll(page);
    await expect(page.locator(".not-found-card")).toBeVisible();
    await expect(page.getByRole("link", { name: "トップページへ戻る" })).toBeEnabled();
    await expect(page.getByRole("link", { name: "配信者を検索する" })).toBeEnabled();
  });
}
