import { expect, test } from "@playwright/test";

const pages = [
  { path: "/", title: /^STREAMER AGE/ },
  { path: "/streamers/shaka/", title: /\| STREAMER AGE$/ },
  { path: "/generations/", title: /\| STREAMER AGE$/ },
  { path: "/devices/", title: /\| STREAMER AGE$/ },
  { path: "/contact/", title: /\| STREAMER AGE$/ }
];

for (const pageInfo of pages) {
  test(`${pageInfo.path}で新サイト名を表示する`, async ({ page }) => {
    const response = await page.goto(pageInfo.path);

    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(pageInfo.title);
    await expect(page.locator("meta[property='og:site_name']")).toHaveAttribute(
      "content",
      "STREAMER AGE"
    );
    await expect(page.locator(".brand__name")).toHaveText("STREAMER AGE");
    await expect(page.locator("body")).not.toContainText("STREAMER DB");
    await expect(page.locator("body")).not.toContainText("配信者年齢サイト");
  });
}
