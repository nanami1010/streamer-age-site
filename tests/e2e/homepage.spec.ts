import { expect, test, type Page } from "@playwright/test";
import { calculateAge, getTodayJST } from "../../src/utils/age";
import { matchesAgeFilter } from "../../src/utils/filter";
import { streamers, formatBirthDate, type StreamerRecord } from "./streamers";

const cards = (page: Page) => page.locator("[data-streamer-card]");
const visibleCards = (page: Page) => page.locator("[data-streamer-card]:visible");
const searchInput = (page: Page) => page.locator("[data-search-input]");
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

test("トップページにJSONと一致する20件のカードを表示する", async ({ page }) => {
  expect(streamers).toHaveLength(20);
  await expect(cards(page)).toHaveCount(streamers.length);
  await expectVisibleCount(page, streamers.length);

  for (const streamer of streamers) {
    const card = cardFor(page, streamer);
    await expect(card).toHaveCount(1);
    await expect(card).toContainText(streamer.name);
    await expect(card).toContainText(formatBirthDate(streamer.birthDate));

    const age = calculateAge(streamer.birthDate);
    await expect(card.locator("[data-birth]")).toHaveText(
      age === null ? "非公開" : `${age}歳`
    );
  }
});

test("生年月日未確認の4人に年齢を表示しない", async ({ page }) => {
  const unknownBirthDate = streamers.filter((streamer) => !streamer.birthDate);
  expect(unknownBirthDate).toHaveLength(4);

  for (const streamer of unknownBirthDate) {
    const age = cardFor(page, streamer).locator("[data-birth]");
    await expect(age).toHaveText("非公開");
    await expect(age).not.toContainText(/\d+歳/);
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

test("名前・ジャンル・年齢帯をAND条件で検索する", async ({ page }) => {
  const laz = streamers.find((streamer) => streamer.slug === "laz");
  expect(laz).toBeDefined();

  await searchInput(page).fill("Lazvell");
  await page.locator("[data-genre-filter]").selectOption("FPS");
  await page.locator("[data-age-filter]").selectOption("30-34");

  await expectVisibleCount(page, 1);
  await expect(cardFor(page, laz!)).toBeVisible();
});

test("条件リセットで全件表示へ戻る", async ({ page }) => {
  await searchInput(page).fill("Lazvell");
  await page.locator("[data-genre-filter]").selectOption("FPS");
  await page.locator("[data-age-filter]").selectOption("30-34");
  await page.locator("[data-filter-reset]").click();

  await expect(searchInput(page)).toHaveValue("");
  await expect(page.locator("[data-genre-filter]")).toHaveValue("");
  await expect(page.locator("[data-age-filter]")).toHaveValue("");
  await expect(searchInput(page)).toBeFocused();
  await expectVisibleCount(page, streamers.length);
});

test("0件検索時に案内を表示する", async ({ page }) => {
  await searchInput(page).fill("__not_registered_streamer__");
  await expectVisibleCount(page, 0);
  await expect(page.locator("[data-search-empty]")).toBeVisible();
  await expect(page.locator("[data-search-empty]")).toHaveText(
    "該当する配信者が見つかりません"
  );
});
