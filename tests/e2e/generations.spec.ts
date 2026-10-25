import { expect, test, type Page } from "@playwright/test";
import { calculateAge } from "../../src/utils/age";
import {
  getSchoolYear,
  getSchoolYearRange,
  groupBySchoolYear
} from "../../src/utils/generation";
import { formatBirthDate, streamers, type StreamerRecord } from "./streamers";

const knownBirthDateStreamers = streamers.filter(
  (streamer): streamer is StreamerRecord & { birthDate: string } =>
    streamer.birthDate !== null
);
const generations = groupBySchoolYear(knownBirthDateStreamers);
const unknownBirthDateStreamers = streamers.filter(
  (streamer) => streamer.birthDate === null
);

function generationCardFor(page: Page, name: string) {
  return page.locator("[data-generation-streamer]").filter({
    has: page.getByRole("heading", { name, exact: true })
  });
}

test("共通ヘッダーから年度一覧へ移動できる", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "同学年で探す" });
  await expect(link).toHaveAttribute("href", "/generations/");
  await link.click();
  await expect(page).toHaveURL(/\/generations\/$/);
});

test("年度一覧を登録データから生成し、年度不明を除外する", async ({ page }) => {
  const response = await page.goto("/generations/");
  expect(response?.status()).toBe(200);
  await expect(
    page.getByRole("heading", { level: 1, name: "同学年で探す" })
  ).toBeVisible();
  await expect(page.locator("[data-generation-link]")).toHaveCount(generations.length);

  let listedStreamerCount = 0;

  for (const { year, members } of generations) {
    const link = page.locator(`[data-generation-year="${year}"]`);
    await expect(link).toHaveAttribute("href", `/generations/${year}/`);
    await expect(link).toContainText(`${year}年度生まれ`);
    await expect(link).toContainText(`${members.length}人`);
    listedStreamerCount += members.length;
  }

  expect(listedStreamerCount).toBe(knownBirthDateStreamers.length);
  expect(unknownBirthDateStreamers).toHaveLength(4);
});

for (const { year, members } of generations) {
  test(`${year}年度ページに該当する配信者だけを表示する`, async ({ page }) => {
    const response = await page.goto(`/generations/${year}/`, {
      waitUntil: "networkidle"
    });
    expect(response?.status()).toBe(200);

    const range = getSchoolYearRange(year);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: `${year}年度生まれの配信者`
      })
    ).toBeVisible();
    await expect(page.getByText(`${range.label}生まれ`, { exact: true })).toBeVisible();
    await expect(page.locator("[data-generation-streamer]")).toHaveCount(members.length);

    for (const streamer of members) {
      const card = generationCardFor(page, streamer.name);
      await expect(card).toHaveCount(1);
      await expect(card).toContainText(formatBirthDate(streamer.birthDate));
      await expect(card.locator("[data-birth]")).toHaveText(
        `${calculateAge(streamer.birthDate)}歳`
      );
      await expect(card.locator("a")).toHaveAttribute(
        "href",
        `/streamers/${streamer.slug}/`
      );
    }

    for (const streamer of streamers.filter(
      (candidate) => getSchoolYear(candidate.birthDate) !== year
    )) {
      await expect(generationCardFor(page, streamer.name)).toHaveCount(0);
    }
  });
}

test("指定された主要4年度の同学年グループが正しい", async ({ page }) => {
  const expectedGroups = new Map<number, string[]>([
    [1990, ["関優太", "もこう", "たいじ"]],
    [1991, ["SHAKA", "k4sen"]],
    [1994, ["しょぼすけ", "あっさりしょこ", "あびつん"]],
    [1995, ["スタンミじゃぱん", "Laz", "Zerost"]]
  ]);

  for (const [year, expectedNames] of expectedGroups) {
    await page.goto(`/generations/${year}/`);
    const actualNames = await page
      .locator("[data-generation-streamer] h2")
      .allTextContents();
    expect(new Set(actualNames)).toEqual(new Set(expectedNames));
  }
});

test("登録者が存在しない年度ページは生成しない", async ({ request }) => {
  const response = await request.get("/generations/1992/");
  expect(response.status()).toBe(404);
});

test("年度ページにSEOメタ情報とnoindexを設定する", async ({ page }) => {
  for (const { year } of generations) {
    await page.goto(`/generations/${year}/`);
    const expectedUrl = `https://streamer-age-site.sheryl1414.workers.dev/generations/${year}/`;

    await expect(page).toHaveTitle(
      `${year}年度生まれの配信者一覧 | STREAMER AGE`
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      new RegExp(`${year}年4月2日`)
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      expectedUrl
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      expectedUrl
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, follow"
    );
  }
});
