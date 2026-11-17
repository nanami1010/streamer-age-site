import { expect, test, type Page } from "@playwright/test";
import { getDisplayProfileImage } from "../../src/lib/profile-image";
import { calculateAge, getTodayJST } from "../../src/utils/age";
import {
  getAffiliationOptions,
  getAffiliationOrganizations
} from "../../src/utils/affiliation";
import { matchesAgeFilter } from "../../src/utils/filter";
import { getSchoolYear } from "../../src/utils/generation";
import { streamers, formatBirthDate, type StreamerRecord } from "./streamers";

const cards = (page: Page) => page.locator("[data-streamer-card]");
const visibleCards = (page: Page) => page.locator("[data-streamer-card]:visible");
const searchInput = (page: Page) => page.locator("[data-search-input]");
const schoolYearFilter = (page: Page) => page.locator("[data-school-year-filter]");
const affiliationFilter = (page: Page) => page.locator("[data-affiliation-filter]");
const resultCount = (page: Page) => page.locator("[data-search-count]");

function cardFor(page: Page, streamer: StreamerRecord) {
  return cards(page).filter({
    has: page.getByRole("heading", { name: streamer.name, exact: true })
  });
}

function streamersForAffiliation(affiliation: string) {
  return streamers.filter((streamer) =>
    getAffiliationOrganizations(streamer.affiliation).includes(affiliation)
  );
}

async function expectVisibleCount(page: Page, expected: number) {
  await expect(resultCount(page)).toHaveText(String(expected));
  await expect(visibleCards(page)).toHaveCount(expected);
}

test.beforeEach(async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
});

test("トップページにJSONと一致する167件のカードを表示する", async ({ page }) => {
  expect(streamers).toHaveLength(167);
  await expect(page.locator(".hero__lead")).toHaveText(
    "配信者の年齢・誕生日・同学年を検索。使用デバイスもチェック。"
  );
  await expect(cards(page)).toHaveCount(streamers.length);
  await expectVisibleCount(page, streamers.length);

  const renderedCards = await cards(page).evaluateAll((elements) =>
    elements.map((card) => {
      const facts = card.querySelectorAll(".streamer-card__facts > div");
      const link = card.querySelector<HTMLAnchorElement>(".streamer-card__link");
      const age = card.querySelector<HTMLElement>("[data-birth]");

      return {
        name: card.querySelector("h2")?.textContent?.trim() ?? "",
        birthday: facts[1]?.querySelector("dd")?.textContent?.trim() ?? "",
        age: age?.textContent?.trim() ?? "",
        birthDate: age?.dataset.birth ?? "",
        detail: card.querySelector(".streamer-card__detail")?.textContent?.trim() ?? "",
        href: link?.getAttribute("href") ?? ""
      };
    })
  );

  const cardsByHref = new Map(renderedCards.map((card) => [card.href, card]));
  expect(cardsByHref.size, "カードのリンク先が重複していないこと").toBe(streamers.length);

  for (const streamer of streamers) {
    const href = `/streamers/${streamer.slug}/`;
    const card = cardsByHref.get(href);
    const context = `${streamer.name} (${streamer.slug})`;

    expect(card, `${context} のカードが存在すること`).toBeDefined();
    expect(card?.name, `${context} の活動名`).toBe(streamer.name);
    expect(card?.birthday, `${context} の誕生日`).toBe(
      formatBirthDate(streamer.birthDate, streamer.birthMonthDay)
    );

    const age = calculateAge(streamer.birthDate);
    expect(card?.age, `${context} の年齢`).toBe(age === null ? "未確認" : `${age}歳`);
    expect(card?.birthDate, `${context} の生年月日データ`).toBe(streamer.birthDate ?? "");
    expect(card?.detail, `${context} の詳細リンク文言`).toContain(
      "プロフィール・使用デバイスを見る"
    );
    expect(card?.href, `${context} の詳細リンク先`).toBe(href);
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

test("生年不明で月日のみ確認済みの配信者は誕生日だけを表示する", async ({ page }) => {
  const expectedBirthdays = new Map([
    ["akagami-no-tomo", "7月23日"],
    ["alice", "3月15日"],
    ["alpha-azur", "4月21日"],
    ["cornn", "11月4日"],
    ["gocchan-mikey", "11月2日"],
    ["iori-moe", "1月24日"],
    ["kettsun", "3月2日"],
    ["limone-sensei", "8月19日"],
    ["marutake", "3月18日"],
    ["misaco", "11月5日"],
    ["oraf-kun", "5月22日"],
    ["retort", "12月26日"],
    ["rigze", "9月25日"],
    ["rizart", "10月2日"],
    ["tiramisu", "9月22日"],
    ["totomix", "8月1日"],
    ["tttcheekyttt", "4月12日"],
    ["zeder", "1月5日"],
    ["yoru-yoichi", "3月7日"]
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
  test.setTimeout(90_000);

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

test("所属選択肢を登録データから生成し、所属単独で絞り込める", async ({ page }) => {
  const affiliations = getAffiliationOptions(
    streamers.map((streamer) => streamer.affiliation)
  );

  await expect(affiliationFilter(page).locator("option")).toHaveText([
    "すべての所属",
    ...affiliations
  ]);

  const selectedAffiliation = affiliations.find(
    (affiliation) =>
      streamersForAffiliation(affiliation).length > 1
  ) ?? affiliations[0];
  const expected = streamersForAffiliation(selectedAffiliation);

  await affiliationFilter(page).selectOption(selectedAffiliation);
  await expectVisibleCount(page, expected.length);
  await expect.poll(() => new URL(page.url()).searchParams.get("affiliation")).toBe(
    selectedAffiliation
  );

  for (const streamer of expected) {
    await expect(cardFor(page, streamer)).toBeVisible();
  }
});

test("所属未登録者は所属指定時だけ除外し、すべての所属で対象に戻る", async ({ page }) => {
  const withoutAffiliation = streamers.filter(
    (streamer) => streamer.affiliation === null
  );
  const selectedAffiliation = getAffiliationOptions(
    streamers.map((streamer) => streamer.affiliation)
  )[0];

  expect(withoutAffiliation.length).toBeGreaterThan(0);
  expect(selectedAffiliation).toBeTruthy();

  await affiliationFilter(page).selectOption(selectedAffiliation!);
  for (const streamer of withoutAffiliation) {
    await expect(cardFor(page, streamer)).toBeHidden();
  }

  await affiliationFilter(page).selectOption("");
  await expectVisibleCount(page, streamers.length);
  for (const streamer of withoutAffiliation) {
    await expect(cardFor(page, streamer)).toBeVisible();
  }
});

test("役職・契約形態が異なる同一組織を一つの候補へ統合する", async ({ page }) => {
  const cases = [
    {
      affiliation: "RIDDLE",
      slugs: ["ariken", "marutake", "shinji-san", "sqla", "vodka", "yukio"]
    },
    {
      affiliation: "FENNEL",
      slugs: [
        "curumi",
        "hotoke",
        "justive7",
        "kawase",
        "kentsumeshi",
        "komaru",
        "l1ng",
        "mittiii",
        "xnfri"
      ]
    }
  ];

  for (const { affiliation, slugs } of cases) {
    await affiliationFilter(page).selectOption(affiliation);
    await expectVisibleCount(page, slugs.length);

    for (const slug of slugs) {
      const streamer = streamers.find((candidate) => candidate.slug === slug);
      expect(streamer).toBeDefined();
      await expect(cardFor(page, streamer!)).toBeVisible();
    }
  }

  const optionValues = await affiliationFilter(page).locator("option").evaluateAll(
    (options) => options.map((option) => (option as HTMLOptionElement).value)
  );
  expect(new Set(optionValues).size).toBe(optionValues.length);
  expect(optionValues.filter((value) => value === "RIDDLE")).toHaveLength(1);
  expect(optionValues.filter((value) => value === "FENNEL")).toHaveLength(1);
  expect(optionValues).not.toContain("RIDDLE（オーナー）");
  expect(optionValues).not.toContain("FENNEL（エージェント契約）");
});

test("複数所属の配信者を各組織の結果へ一度だけ表示する", async ({ page }) => {
  const mokou = streamers.find((streamer) => streamer.slug === "mokou");
  const katoJunichi = streamers.find(
    (streamer) => streamer.slug === "kato-junichi"
  );
  const oniya = streamers.find((streamer) => streamer.slug === "oniya");
  const myako = streamers.find((streamer) => streamer.slug === "myako");
  const enako = streamers.find((streamer) => streamer.slug === "enako");
  const bakumatsuSakamoto = streamers.find(
    (streamer) => streamer.slug === "bakumatsu-sakamoto"
  );
  expect(mokou).toBeDefined();
  expect(katoJunichi).toBeDefined();
  expect(oniya).toBeDefined();
  expect(myako).toBeDefined();
  expect(enako).toBeDefined();
  expect(bakumatsuSakamoto).toBeDefined();

  for (const affiliation of ["DOROKUSA", "MURASH GAMING"]) {
    await affiliationFilter(page).selectOption(affiliation);
    await expect(cardFor(page, mokou!)).toBeVisible();
    await expect(cardFor(page, mokou!)).toHaveCount(1);
  }

  await affiliationFilter(page).selectOption("DOROKUSA");
  await expect(cardFor(page, katoJunichi!)).toBeVisible();
  await expect(cardFor(page, katoJunichi!)).toHaveCount(1);

  await affiliationFilter(page).selectOption("REJECT");
  await expect(cardFor(page, oniya!)).toBeVisible();
  await expect(cardFor(page, oniya!)).toHaveCount(1);

  for (const affiliation of ["PPエンタープライズ", "MURASH GAMING"]) {
    await affiliationFilter(page).selectOption(affiliation);
    await expect(cardFor(page, myako!)).toBeVisible();
    await expect(cardFor(page, myako!)).toHaveCount(1);
  }

  for (const affiliation of [
    "PPエンタープライズ",
    "プラチナムプロダクション"
  ]) {
    await affiliationFilter(page).selectOption(affiliation);
    await expect(cardFor(page, enako!)).toBeVisible();
    await expect(cardFor(page, enako!)).toHaveCount(1);
  }

  await affiliationFilter(page).selectOption("DOROKUSA");
  await expect(cardFor(page, bakumatsuSakamoto!)).toBeVisible();
  await expect(cardFor(page, bakumatsuSakamoto!)).toHaveCount(1);
});

test("統合前の単一所属URLを正規化する", async ({ page }) => {
  await page.goto(`/?${new URLSearchParams({
    affiliation: "RIDDLE（オーナー）"
  }).toString()}`);

  await expect(affiliationFilter(page)).toHaveValue("RIDDLE");
  await expectVisibleCount(page, streamersForAffiliation("RIDDLE").length);
  expect(new URL(page.url()).searchParams.get("affiliation")).toBe("RIDDLE");
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
    {
      year: 1995,
      slugs: [
        "sutanmi-japan",
        "laz",
        "zerost",
        "peinto",
        "torazo",
        "haseshin",
        "rion",
        "takaya-special",
        "tanuki-ninja",
        "vodka"
      ]
    },
    {
      year: 1994,
      slugs: [
        "shobosuke",
        "assari-shoko",
        "abitun",
        "kuronoa",
        "francisco",
        "mother3",
        "day1",
        "raijin",
        "shinji-san"
      ]
    },
    {
      year: 1991,
      slugs: ["shaka", "k4sen", "shomaru7", "syaruru", "amatsuki"]
    },
    {
      year: 1990,
      slugs: [
        "seki-yuta",
        "mokou",
        "taiji",
        "fuji",
        "kyoichiro",
        "tonakaito",
        "fanta"
      ]
    }
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
  const expected = streamers.filter(
    (streamer) =>
      getSchoolYear(streamer.birthDate) === 1995 &&
      streamer.genres.includes("FPS")
  );

  await schoolYearFilter(page).selectOption("1995");
  await page.locator("[data-genre-filter]").selectOption("FPS");

  await expectVisibleCount(page, expected.length);
  for (const streamer of expected) {
    await expect(cardFor(page, streamer)).toBeVisible();
  }
});

test("年度と年齢帯をAND条件で検索する", async ({ page }) => {
  const today = getTodayJST();
  const expected = streamers.filter(
    (streamer) =>
      getSchoolYear(streamer.birthDate) === 1995 &&
      matchesAgeFilter(calculateAge(streamer.birthDate, today), "30-34")
  );

  await schoolYearFilter(page).selectOption("1995");
  await page.locator("[data-age-filter]").selectOption("30-34");
  await expectVisibleCount(page, expected.length);
});

test("年度と名前・別名をAND条件で検索する", async ({ page }) => {
  const shaka = streamers.find((streamer) => streamer.slug === "shaka");
  expect(shaka).toBeDefined();

  await schoolYearFilter(page).selectOption("1991");
  await searchInput(page).fill("釈迦");
  await expectVisibleCount(page, 1);
  await expect(cardFor(page, shaka!)).toBeVisible();
});

test("名前・ジャンル・年齢帯・年度・所属をAND条件で検索する", async ({ page }) => {
  const laz = streamers.find((streamer) => streamer.slug === "laz");
  expect(laz).toBeDefined();
  expect(laz?.affiliation).toBeTruthy();

  await searchInput(page).fill("Lazvell");
  await page.locator("[data-genre-filter]").selectOption("FPS");
  await page.locator("[data-age-filter]").selectOption("30-34");
  await schoolYearFilter(page).selectOption("1995");
  await affiliationFilter(page).selectOption(laz!.affiliation!);

  await expectVisibleCount(page, 1);
  await expect(cardFor(page, laz!)).toBeVisible();
});

test("条件リセットで全件表示へ戻る", async ({ page }) => {
  await searchInput(page).fill("Lazvell");
  await page.locator("[data-genre-filter]").selectOption("FPS");
  await page.locator("[data-age-filter]").selectOption("30-34");
  await schoolYearFilter(page).selectOption("1995");
  const laz = streamers.find((streamer) => streamer.slug === "laz");
  expect(laz?.affiliation).toBeTruthy();
  await affiliationFilter(page).selectOption(laz!.affiliation!);
  await page.locator("[data-filter-reset]").click();

  await expect(searchInput(page)).toHaveValue("");
  await expect(page.locator("[data-genre-filter]")).toHaveValue("");
  await expect(page.locator("[data-age-filter]")).toHaveValue("");
  await expect(schoolYearFilter(page)).toHaveValue("");
  await expect(affiliationFilter(page)).toHaveValue("");
  await expect(page).toHaveURL("/");
  await expect(searchInput(page)).toBeFocused();
  await expectVisibleCount(page, streamers.length);
});

test("URLパラメータから複合条件を復元する", async ({ page }) => {
  const laz = streamers.find((streamer) => streamer.slug === "laz");
  expect(laz?.affiliation).toBeTruthy();

  const parameters = new URLSearchParams({
    q: "Lazvell",
    genre: "FPS",
    age: "30-34",
    year: "1995",
    affiliation: laz!.affiliation!
  });
  await page.goto(`/?${parameters.toString()}`);

  await expect(searchInput(page)).toHaveValue("Lazvell");
  await expect(page.locator("[data-genre-filter]")).toHaveValue("FPS");
  await expect(page.locator("[data-age-filter]")).toHaveValue("30-34");
  await expect(schoolYearFilter(page)).toHaveValue("1995");
  await expect(affiliationFilter(page)).toHaveValue(laz!.affiliation!);
  await expectVisibleCount(page, 1);
  await expect(cardFor(page, laz!)).toBeVisible();
});

test("所属変更の戻る・進むでURL、選択値、件数を復元する", async ({ page }) => {
  const affiliations = getAffiliationOptions(
    streamers.map((streamer) => streamer.affiliation)
  );
  expect(affiliations.length).toBeGreaterThanOrEqual(2);

  const [firstAffiliation, secondAffiliation] = affiliations;
  const firstCount = streamersForAffiliation(firstAffiliation).length;
  const secondCount = streamersForAffiliation(secondAffiliation).length;

  await affiliationFilter(page).selectOption(firstAffiliation);
  await expectVisibleCount(page, firstCount);
  await affiliationFilter(page).selectOption(secondAffiliation);
  await expectVisibleCount(page, secondCount);

  await page.goBack();
  await expect(affiliationFilter(page)).toHaveValue(firstAffiliation);
  await expectVisibleCount(page, firstCount);
  expect(new URL(page.url()).searchParams.get("affiliation")).toBe(firstAffiliation);

  await page.goForward();
  await expect(affiliationFilter(page)).toHaveValue(secondAffiliation);
  await expectVisibleCount(page, secondCount);
  expect(new URL(page.url()).searchParams.get("affiliation")).toBe(secondAffiliation);
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
  const expected1995 = streamers.filter(
    (streamer) => getSchoolYear(streamer.birthDate) === 1995
  );
  expect(unknownBirthDate.length).toBeGreaterThan(0);

  await schoolYearFilter(page).selectOption("1995");
  await expectVisibleCount(page, expected1995.length);
  await schoolYearFilter(page).selectOption("");
  await expectVisibleCount(page, streamers.length);

  for (const streamer of unknownBirthDate) {
    await expect(cardFor(page, streamer)).toBeVisible();
  }
});
