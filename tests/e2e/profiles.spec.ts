import { expect, test } from "@playwright/test";
import { getDisplayProfileImage } from "../../src/lib/profile-image";
import { calculateAge } from "../../src/utils/age";
import { getSchoolYear } from "../../src/utils/generation";
import { formatBirthDate, streamers } from "./streamers";

interface DeviceRecord {
  type: string;
  manufacturer: string;
  productName: string;
  sourceUrl: string;
  usageConfirmedAt?: string;
  lastVerifiedAt: string;
}

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

      const profileImage = getDisplayProfileImage(
        streamer.profileImage,
        "profilePage"
      );
      const avatar = page.locator(".profile-avatar");

      if (profileImage) {
        await expect(avatar.locator("img")).toHaveAttribute("src", profileImage.src);
        await expect(avatar.locator("img")).toHaveAttribute("alt", profileImage.alt);
        await expect(avatar.locator("span")).toHaveCount(0);
      } else {
        await expect(avatar.locator("img")).toHaveCount(0);
        await expect(avatar.locator("span")).toHaveCount(1);
      }

      const ogpImage = getDisplayProfileImage(streamer.profileImage, "ogp");
      if (ogpImage) {
        const expectedOgpUrl = new URL(ogpImage.src, "https://streamerage.jp/").href;
        await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
          "content",
          expectedOgpUrl
        );
        await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
          "content",
          expectedOgpUrl
        );
        await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
          "content",
          "summary_large_image"
        );
      } else {
        await expect(page.locator('meta[property="og:image"]')).toHaveCount(0);
        await expect(page.locator('meta[name="twitter:image"]')).toHaveCount(0);
        await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
          "content",
          "summary"
        );
      }

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

      const schoolYear = getSchoolYear(streamer.birthDate);
      const generationLink = page.locator("[data-profile-generation-link]");

      if (schoolYear === null) {
        await expect(generationLink).toHaveCount(0);
      } else {
        await expect(generationLink).toHaveAttribute(
          "href",
          `/generations/${schoolYear}/`
        );
        await expect(generationLink).toHaveText(/同じ学年の配信者を見る/);
      }

      const actualSocialLinks = await page.locator(".social-links a").evaluateAll(
        (links) => links.map((link) => (link as HTMLAnchorElement).href).sort()
      );
      const expectedSocialLinks = Object.values(streamer.socialLinks)
        .map((url) => new URL(url).href)
        .sort();
      expect(actualSocialLinks).toEqual(expectedSocialLinks);

      const streamerDevices = (streamer.devices ?? []) as DeviceRecord[];

      if (streamerDevices.length === 0) {
        await expect(
          page.getByText("使用デバイスは調査中です。", { exact: true })
        ).toBeVisible();
        await expect(page.locator(".device-card")).toHaveCount(0);
      } else {
        await expect(
          page.getByText("使用デバイスは調査中です。", { exact: true })
        ).toHaveCount(0);
        await expect(page.locator(".device-card")).toHaveCount(streamerDevices.length);

        for (const device of streamerDevices) {
          const group = page.locator(".device-group").filter({
            has: page.getByRole("heading", { level: 3, name: device.type, exact: true })
          });
          const card = group.locator(".device-card").filter({
            has: page.getByRole("heading", {
              level: 4,
              name: device.productName,
              exact: true
            })
          });

          await expect(group).toHaveCount(1);
          await expect(card).toHaveCount(1);
          await expect(card.locator(".manufacturer")).toHaveText(device.manufacturer);
          await expect(card.locator(".device-meta a")).toHaveAttribute(
            "href",
            device.sourceUrl
          );
          await expect(card.locator(".device-meta time")).toHaveAttribute(
            "datetime",
            device.lastVerifiedAt
          );
          await expect(card.locator(".device-meta")).toContainText("サイト確認日");

          const usageConfirmation = card.locator(".usage-confirmation");
          if (device.usageConfirmedAt) {
            const [year, month, day] = device.usageConfirmedAt.split("-").map(Number);
            await expect(usageConfirmation).toContainText(
              `${year}年${month}月${day}日時点の使用情報`
            );
            await expect(usageConfirmation).toContainText(
              "現在も使用しているかは未確認です。"
            );
            await expect(usageConfirmation.locator("time")).toHaveAttribute(
              "datetime",
              device.usageConfirmedAt
            );
          } else {
            await expect(usageConfirmation).toHaveCount(0);
          }

          await expect(card).not.toContainText("現在使用中");
          await expect(card.locator("img")).toHaveCount(0);
          await expect(card.locator(".purchase-link")).toHaveCount(0);
        }
      }

      const birthDateSources = streamer.birthDate
        ? streamer.sources.filter((source) => source.field === "birthDate")
        : [];
      const birthDateSourceSection = page.locator("[data-birth-date-sources]");

      if (birthDateSources.length === 0) {
        await expect(birthDateSourceSection).toHaveCount(0);
      } else {
        await expect(
          birthDateSourceSection.getByRole("heading", {
            level: 2,
            name: "生年月日の出典",
            exact: true
          })
        ).toBeVisible();

        const actualSourceLinks = await birthDateSourceSection
          .locator(".source-list a")
          .evaluateAll((links) =>
            links.map((link) => (link as HTMLAnchorElement).href).sort()
          );
        const expectedSourceLinks = birthDateSources
          .map((source) => new URL(source.url).href)
          .sort();
        expect(actualSourceLinks).toEqual(expectedSourceLinks);
        await expect(birthDateSourceSection.locator(".last-verified time")).toHaveAttribute(
          "datetime",
          streamer.lastVerifiedAt
        );
      }
      expect(pageErrors).toEqual([]);
      expect(consoleErrors).toEqual([]);
    });
  }
});

test("SHAKA・k4sen・Laz以外の37人はデバイス未登録", async () => {
  const expectedCounts = new Map([
    ["shaka", 1],
    ["k4sen", 6],
    ["laz", 5]
  ]);

  for (const streamer of streamers) {
    expect(streamer.devices ?? []).toHaveLength(expectedCounts.get(streamer.slug) ?? 0);
  }
});
