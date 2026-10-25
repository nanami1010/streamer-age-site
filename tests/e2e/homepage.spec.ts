import { expect, test, type Page } from "@playwright/test";
import { getDisplayProfileImage } from "../../src/lib/profile-image";
import { calculateAge, getTodayJST } from "../../src/utils/age";
import { matchesAgeFilter } from "../../src/utils/filter";
import { getSchoolYear } from "../../src/utils/generation";
import { streamers, formatBirthDate, type StreamerRecord } from "./streamers";

const cards = (page: Page) => page.locator("[data-streamer-card]");
const visibleCards = (page: Page) => page.locator("[data-streamer-card]:visible");
const searchInput = (page: Page) => page.locator("[data-search-input]");
const schoolYearFilter = (page: Page) => page.locator("[data-school-year-filter]");
const resultCount = (page: Page) => page.locator("[data-search-count]");

function cardFor(page: Page, streamer: StreamerRecord) {
  return cards(page).filter({
    has: page.getByRole("heading", { name: streamer.name, exact: true })
  });
}

async function expectVisibleCount(page: Page, expected: number) {
  await expect(resultCount(page)).toHaveText(String(expected));
  await expect(visibleCards(page)).toHaveCount(expected);
}

test.beforeEach(async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
});

test("トップページにJSONと一致する60件のカードを表示する", async ({ page }) => {
  expect(streamers).toHaveLength(60);
  await expect(page.locator(".hero__lead")).toHaveText(
    "配信者の年齢・誕生日・同学年を検索。使用デバイスもチェック。"
  );
  await expect(cards(page)).toHaveCount(streamers.length);
  await expectVisibleCount(page, streamers.length);

  for (const streamer of streamers) {
    const card = cardFor(page, streamer);
    await expect(card).toHaveCount(1);
    await expect(card).toContainText(streamer.name);
    await expect(card).toContainText(
      formatBirthDate(streamer.birthDate, streamer.birthMonthDay)
    );

    const age = calculateAge(streamer.birthDate);
    await expect(card.locator("[data-birth]")).toHaveText(
      age === null ? "未確認" : `${age}歳`
    );
  }
});

test("生年月日未確認の配信者に年齢を表示しない", async ({ page }) => {
  const unknownBirthDate = streamers.filter((streamer) => !streamer.birthDate);
  expect(unknownBirthDate.length).toBeGreaterThan(0);

  for (const streamer of unknownBirthDate) {
    const age = cardFor(page, streamer).locator("[data-birth]");
    await expect(age).toHaveText("未確認");
    await expect(age).not.toContainText(/\d+歳/);
  }
});

test("生年不明で月日のみ確認済みの13人は誕生日だけを表示する", async ({ page }) => {
  const expectedBirthdays = new Map([
    ["daruma-is-god", "10月31日"],
    ["arisakaaa", "3月2日"],
    ["uruca", "1月23日"],
    ["ras", "9月28日"],
    ["kinako", "3月16日"],
    ["neth", "5月26日"],
    ["dogura", "6月12日"],
    ["shuto", "8月14日"],
    ["dozle", "11月21日"],
    ["bonjour", "5月30日"],
    ["qnly", "9月9日"],
    ["oraf-kun", "5月22日"],
    ["oohara-men", "7月28日"]
  ]);
  const monthDayOnly = streamers.filter((streamer) => streamer.birthMonthDay);

  expect(monthDayOnly).toHaveLength(expectedBirthdays.size);

  for (const streamer of monthDayOnly) {
    expect(streamer.birthDate).toBeNull();
    const card = cardFor(page, streamer);
    await expect(card).toContainText(expectedBirthdays.get(streamer.slug)!);
    await expect(card.locator("[data-birth]")).toHaveText("未確認");
  }
});

test("トップカードは許可範囲に応じて画像または頭文字を表示する", async ({ page }) => {
  for (const streamer of streamers) {
    const card = cardFor(page, streamer);
    const profileImage = getDisplayProfileImage(
      streamer.profileImage,
      "homeCard"
    );

    if (profileImage) {
      await expect(card.locator(".streamer-card__avatar img")).toHaveAttribute(
        "src",
        profileImage.src
      );
      await expect(card.locator(".streamer-card__avatar img")).toHaveAttribute(
        "alt",
        profileImage.alt
      );
      await expect(card.locator(".streamer-card__avatar > span")).toHaveCount(0);
    } else {
      await expect(card.locator(".streamer-card__avatar img")).toHaveCount(0);
      await expect(card.locator(".streamer-card__avatar > span")).toHaveCount(1);
    }
  }
});

test("名前・読み仮名・別名で全登録データを検索できる", async ({ page }) => {
  for (const streamer of streamers) {
    for (const query of [streamer.name, streamer.nameKana, ...streamer.aliases]) {
      await searchInput(page).fill(query);
      await expect(cardFor(page, streamer)).toBeVisible();
      await expect.poll(async () => Number(await resultCount(page).textContent())).toBeGreaterThan(0);
    }
  }
});

test("クリアボタンで名前検索を解除する", async ({ page }) => {
  await searchInput(page).fill("Lazvell");
  await expectVisibleCount(page, 1);
  await page.locator("[data-search-clear]").click();
  await expect(searchInput(page)).toHaveValue("");
  await expect(searchInput(page)).toBeFocused();
  await expectVisibleCount(page, streamers.length);
});

test("登録済みジャンルで絞り込める", async ({ page }) => {
  const genres = [...new Set(streamers.flatMap((streamer) => streamer.genres))];

  for (const genre of genres) {
    const expected = streamers.filter((streamer) => streamer.genres.includes(genre));
    await page.locator("[data-genre-filter]").selectOption(genre);
    await expectVisibleCount(page, expected.length);

    for (const streamer of expected) {
      await expect(cardFor(page, streamer)).toBeVisible();
    }
  }
});

test("すべての年齢帯と年齢不明で絞り込める", async ({ page }) => {
  const today = getTodayJST();
  const ageRanges = [
    "under-20",
    "20-24",
    "25-29",
    "30-34",
    "35-39",
    "40-and-over",
    "unknown"
  ];

  for (const ageRange of ageRanges) {
    const expected = streamers.filter((streamer) =>
      matchesAgeFilter(calculateAge(streamer.birthDate, today), ageRange)
    );
    await page.locator("[data-age-filter]").selectOption(ageRange);
    await expectVisibleCount(page, expected.length);
  }
});

test("年度選択肢を登録データから新しい順に生成する", async ({ page }) => {
  const expectedYears = Array.from(
    new Set(
      streamers
        .map((streamer) => getSchoolYear(streamer.birthDate))
        .filter((year): year is number => year !== null)
    )
  ).sort((a, b) => b - a);

  await expect(schoolYearFilter(page).locator("option")).toHaveCount(
    expectedYears.length + 1
  );
  await expect(schoolYearFilter(page).locator("option")).toHaveText([
    "すべての年度",
    ...expectedYears.map((year) => `${year}年度`)
  ]);
  await expect(schoolYearFilter(page)).toHaveValue("");
});

test("年度で絞り込むと同年度の配信者だけを表示する", async ({ page }) => {
  const cases = [
    { year: 1995, slugs: ["sutanmi-japan", "laz", "zerost"] },
    { year: 1994, slugs: ["shobosuke", "assari-shoko", "abitun"] },
    { year: 1991, slugs: ["shaka", "k4sen", "shomaru7"] },
    { year: 1990, slugs: ["seki-yuta", "mokou", "taiji"] }
  ];

  for (const { year, slugs } of cases) {
    await schoolYearFilter(page).selectOption(String(year));
    await expectVisibleCount(page, slugs.length);

    for (const slug of slugs) {
      const streamer = streamers.find((candidate) => candidate.slug === slug);
      expect(streamer).toBeDefined();
      await expect(cardFor(page, streamer!)).toBeVisible();
    }
  }
});

test("年度とジャンルをAND条件で検索する", async ({ page }) => {
  await schoolYearFilter(page).selectOption("1995");
  await page.locator("[data-genre-filter]").selectOption("FPS");

  await expectVisibleCount(page, 1);
  await expect(cardFor(page, streamers.find(({ slug }) => slug === "laz")!)).toBeVisible();
});

test("年度と年齢帯をAND条件で検索する", async ({ page }) => {
  await schoolYearFilter(page).selectOption("1995");
  await page.locator("[data-age-filter]").selectOption("30-34");
  await expectVisibleCount(page, 3);
});

test("年度と名前・別名をAND条件で検索する", async ({ page }) => {
  const shaka = streamers.find((streamer) => streamer.slug === "shaka");
  expect(shaka).toBeDefined();

  await schoolYearFilter(page).selectOption("1991");
  await searchInput(page).fill("釈迦");
  await expectVisibleCount(page, 1);
  await expect(cardFor(page, shaka!)).toBeVisible();
});

test("名前・ジャンル・年齢帯・年度をAND条件で検索する", async ({ page }) => {
  const laz = streamers.find((streamer) => streamer.slug === "laz");
  expect(laz).toBeDefined();

  await searchInput(page).fill("Lazvell");
  await page.locator("[data-genre-filter]").selectOption("FPS");
  await page.locator("[data-age-filter]").selectOption("30-34");
  await schoolYearFilter(page).selectOption("1995");

  await expectVisibleCount(page, 1);
  await expect(cardFor(page, laz!)).toBeVisible();
});

test("条件リセットで全件表示へ戻る", async ({ page }) => {
  await searchInput(page).fill("Lazvell");
  await page.locator("[data-genre-filter]").selectOption("FPS");
  await page.locator("[data-age-filter]").selectOption("30-34");
  await schoolYearFilter(page).selectOption("1995");
  await page.locator("[data-filter-reset]").click();

  await expect(searchInput(page)).toHaveValue("");
  await expect(page.locator("[data-genre-filter]")).toHaveValue("");
  await expect(page.locator("[data-age-filter]")).toHaveValue("");
  await expect(schoolYearFilter(page)).toHaveValue("");
  await expect(searchInput(page)).toBeFocused();
  await expectVisibleCount(page, streamers.length);
});

test("0件検索時に案内を表示する", async ({ page }) => {
  await schoolYearFilter(page).selectOption("1991");
  await searchInput(page).fill("Lazvell");
  await expectVisibleCount(page, 0);
  await expect(page.locator("[data-search-empty]")).toBeVisible();
  await expect(page.locator("[data-search-empty]")).toHaveText(
    "該当する配信者が見つかりません"
  );
});

test("年度指定を解除すると生年月日不明の配信者も検索対象へ戻る", async ({ page }) => {
  const unknownBirthDate = streamers.filter((streamer) => !streamer.birthDate);
  expect(unknownBirthDate.length).toBeGreaterThan(0);

  await schoolYearFilter(page).selectOption("1995");
  await expectVisibleCount(page, 3);
  await schoolYearFilter(page).selectOption("");
  await expectVisibleCount(page, streamers.length);

  for (const streamer of unknownBirthDate) {
    await expect(cardFor(page, streamer)).toBeVisible();
  }
});
