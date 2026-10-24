import { expect, test } from "@playwright/test";
import { calculateAge } from "../../src/utils/age";
import { formatBirthDate, streamers } from "./streamers";

test.describe("全配信者のプロフィール", () => {
  for (const streamer of streamers) {
    test(`${streamer.slug} の登録情報をブラウザで表示する`, async ({ page }) => {
      const pageErrors: string[] = [];
      const consoleErrors: string[] = [];

      page.on("pageerror", (error) => pageErrors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });

      const response = await page.goto(`/streamers/${streamer.slug}/`, {
        waitUntil: "networkidle"
      });
      expect(response?.status()).toBe(200);

      await expect(
        page.getByRole("heading", { level: 1, name: streamer.name, exact: true })
      ).toBeVisible();

      const age = calculateAge(streamer.birthDate);
      const ageValue = page.locator(".fact-card--age [data-birth]");
      await expect(ageValue).toHaveAttribute("data-birth", streamer.birthDate ?? "");
      await expect(ageValue).toHaveText(age === null ? "非公開" : `${age}歳`);

      const birthDateValue = page.locator(".fact-card__value--date");
      await expect(birthDateValue).toHaveText(formatBirthDate(streamer.birthDate));

      if (streamer.birthDate) {
        await expect(birthDateValue.locator("time")).toHaveAttribute(
          "datetime",
          streamer.birthDate
        );
      } else {
        await expect(ageValue).not.toContainText(/\d+歳/);
        await expect(birthDateValue.locator("time")).toHaveCount(0);
      }

      const actualSocialLinks = await page.locator(".social-links a").evaluateAll(
        (links) => links.map((link) => (link as HTMLAnchorElement).href).sort()
      );
      const expectedSocialLinks = Object.values(streamer.socialLinks)
        .map((url) => new URL(url).href)
        .sort();
      expect(actualSocialLinks).toEqual(expectedSocialLinks);

      if ((streamer.devices ?? []).length === 0) {
        await expect(page.getByText("使用デバイスは調査中です。", { exact: true })).toBeVisible();
      }

      await expect(page.locator(".source-list a")).toHaveCount(streamer.sources.length);
      await expect(page.locator(".last-verified time")).toHaveAttribute(
        "datetime",
        streamer.lastVerifiedAt
      );
      expect(pageErrors).toEqual([]);
      expect(consoleErrors).toEqual([]);
    });
  }
});
