import { expect, test } from "@playwright/test";

test("プライバシーポリシーにCloudflare Workersのログ説明を表示する", async ({ page }) => {
  const response = await page.goto("/privacy/");

  expect(response?.status()).toBe(200);
  await expect(
    page.getByRole("heading", { name: "プライバシーポリシー", exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "サイトの提供とアクセスログ", exact: true })
  ).toBeVisible();
  await expect(page.getByText(/IPアドレス、通信経路/)).toBeVisible();
  await expect(page.getByText(/アクセス日時、リクエスト方法とURL、応答状況/)).toBeVisible();
  await expect(page.getByText(/現在、アクセス解析サービスは利用していません/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Cloudflareのプライバシーポリシー" })).toHaveAttribute(
    "href",
    "https://www.cloudflare.com/privacypolicy/"
  );
});
