import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("https://challenges.cloudflare.com/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/javascript",
      body: ""
    });
  });

  const response = await page.goto("/contact/");
  expect(response?.status()).toBe(200);
});

test("問い合わせフォームの項目と入力エラーを表示する", async ({ page }) => {
  await expect(page.getByLabel(/問い合わせの種類/)).toBeEnabled();
  await expect(page.getByLabel(/お名前/)).toBeEnabled();
  await expect(page.getByLabel(/返信先メールアドレス/)).toBeEnabled();
  await expect(page.getByLabel(/対象の配信者名または掲載ページURL/)).toBeEnabled();
  await expect(page.getByLabel(/所属事務所名/)).toBeEnabled();
  await expect(page.getByLabel(/所属事務所の公式サイトURL/)).toBeEnabled();
  await expect(page.getByLabel(/問い合わせ内容/)).toBeEnabled();

  await page.getByRole("button", { name: "送信する" }).click();
  await expect(page.locator("[data-contact-result]")).toHaveText(
    "未入力または形式に誤りがある項目を確認してください。"
  );

  await page.getByLabel(/返信先メールアドレス/).fill("invalid");
  await expect(page.getByLabel(/返信先メールアドレス/)).toHaveJSProperty(
    "validity.valid",
    false
  );
});

test("訂正・削除依頼では対象欄を必須にし、その他では任意にする", async ({ page }) => {
  const type = page.getByLabel(/問い合わせの種類/);
  const target = page.getByLabel(/対象の配信者名または掲載ページURL/);
  const requirement = page.locator("[data-target-requirement]");

  await type.selectOption("correction");
  await expect(target).toHaveAttribute("required", "");
  await expect(requirement).toHaveText("必須");

  await type.selectOption("deletion");
  await expect(target).toHaveAttribute("required", "");

  await type.selectOption("other");
  await expect(target).not.toHaveAttribute("required", "");
  await expect(requirement).toHaveText("任意");
});

test("サーバー設定不足時に送信成功を表示しない", async ({ page }) => {
  await page.getByLabel(/問い合わせの種類/).selectOption("correction");
  await page.getByLabel(/返信先メールアドレス/).fill("visitor@example.com");
  await page.getByLabel(/対象の配信者名または掲載ページURL/).fill("SHAKA");
  await page.getByLabel(/問い合わせ内容/).fill("掲載情報の訂正について確認をお願いします。");

  await page.getByRole("button", { name: "送信する" }).click();

  await expect(page.locator("[data-contact-result]")).toHaveText(
    "現在、問い合わせの送信機能は準備中です。"
  );
  await expect(page.locator("[data-contact-result]")).toHaveAttribute(
    "data-state",
    "error"
  );
});

test("成功応答時に受付メッセージを表示する", async ({ page }) => {
  let submittedBody = "";
  await page.route("**/api/contact", async (route) => {
    submittedBody = route.request().postData() ?? "";
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        message: "お問い合わせを受け付けました。"
      })
    });
  });

  await page.getByLabel(/問い合わせの種類/).selectOption("other");
  await page.getByLabel(/お名前/).fill("テスト利用者");
  await page.getByLabel(/返信先メールアドレス/).fill("visitor@example.com");
  await page.getByLabel(/対象の配信者名または掲載ページURL/).fill("SHAKA");
  await page.getByLabel(/所属事務所名/).fill("サンプル事務所");
  await page.getByLabel(/所属事務所の公式サイトURL/).fill("https://agency.example.com/");
  await page.getByLabel(/問い合わせ内容/).fill("問い合わせフォームの動作確認用メッセージです。");
  await page.getByRole("button", { name: "送信する" }).click();

  await expect(page.locator("[data-contact-result]")).toHaveText(
    "お問い合わせを受け付けました。"
  );
  expect(submittedBody).not.toContain("CONTACT_TO_EMAIL");
  expect(submittedBody).not.toContain("owner@example.com");
  expect(submittedBody).toContain("name=\"targetReference\"");
  expect(submittedBody).toContain("SHAKA");
  expect(submittedBody).toContain("name=\"agencyName\"");
  expect(submittedBody).toContain("name=\"agencyUrl\"");
  await expect(page.getByLabel(/返信先メールアドレス/)).toHaveValue("");
});

for (const width of [320, 375, 768, 1280]) {
  test(`${width}pxで問い合わせフォームが横にはみ出さない`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasHorizontalOverflow).toBe(false);
    await expect(page.getByRole("button", { name: "送信する" })).toBeVisible();
  });
}
