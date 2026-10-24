import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { calculateAge, getTodayJST } from "../src/utils/age.ts";
import { matchesAgeFilter, matchesGenre } from "../src/utils/filter.ts";
import { getSchoolYear } from "../src/utils/generation.ts";
import {
  createStreamerSearchIndex,
  matchesStreamer
} from "../src/utils/search.ts";

const fixedToday = { year: 2026, month: 5, day: 10 };
const fictionalStreamers = [
  {
    name: "ALPHA",
    nameKana: "あるふぁ",
    aliases: ["エー"],
    genres: ["FPS"],
    birthDate: "2001-05-10"
  },
  {
    name: "BETA",
    nameKana: "べーた",
    aliases: ["ビー"],
    genres: ["RPG"],
    birthDate: null
  }
].map((streamer) => ({
  ...streamer,
  searchIndex: createStreamerSearchIndex(streamer)
}));

function filterStreamers(query = "", genre = "", ageRange = "", schoolYear = "") {
  return fictionalStreamers.filter(
    (streamer) =>
      matchesStreamer(streamer.searchIndex, query) &&
      matchesGenre(streamer.genres, genre) &&
      matchesAgeFilter(
        calculateAge(streamer.birthDate, fixedToday),
        ageRange
      ) &&
      (schoolYear === "" || String(getSchoolYear(streamer.birthDate) ?? "") === schoolYear)
  );
}

assert.equal(filterStreamers("アル").length, 1, "名前検索");
assert.equal(filterStreamers("", "FPS").length, 1, "ジャンル絞り込み");
assert.equal(filterStreamers("", "", "25-29").length, 1, "年齢絞り込み");
assert.equal(filterStreamers("alpha", "FPS", "25-29").length, 1, "3条件AND");
assert.equal(filterStreamers("alpha", "FPS", "25-29", "2001").length, 1, "4条件AND");
assert.equal(filterStreamers("", "", "", "2001").length, 1, "年度絞り込み");
assert.equal(filterStreamers("alpha", "RPG", "25-29").length, 0, "0件");
assert.equal(filterStreamers().length, 2, "初期条件へのリセット");
assert.equal(filterStreamers("", "", "unknown")[0]?.name, "BETA", "年齢不明");

const ageRangeCases = [
  [19, "under-20"],
  [20, "20-24"],
  [24, "20-24"],
  [25, "25-29"],
  [29, "25-29"],
  [30, "30-34"],
  [34, "30-34"],
  [35, "35-39"],
  [39, "35-39"],
  [40, "40-and-over"],
  [null, "unknown"]
];

for (const [age, ageRange] of ageRangeCases) {
  assert.equal(matchesAgeFilter(age, ageRange), true, `${ageRange}の境界`);
}

assert.equal(matchesAgeFilter(20, "under-20"), false, "19歳以下の上限");
assert.equal(matchesAgeFilter(25, "20-24"), false, "20〜24歳の上限");
assert.equal(matchesAgeFilter(null, "40-and-over"), false, "年齢不明の分離");
assert.equal(
  calculateAge("2000-05-11", { year: 2026, month: 5, day: 10 }),
  25,
  "誕生日前日"
);
assert.equal(
  calculateAge("2000-05-11", { year: 2026, month: 5, day: 11 }),
  26,
  "誕生日当日"
);
assert.deepEqual(
  getTodayJST(new Date("2026-05-10T14:59:59Z")),
  { year: 2026, month: 5, day: 10 },
  "日本時間の日付変更直前"
);
assert.deepEqual(
  getTodayJST(new Date("2026-05-10T15:00:00Z")),
  { year: 2026, month: 5, day: 11 },
  "日本時間の日付変更時"
);

class ElementMock {
  constructor(value = "") {
    this.value = value;
    this.disabled = false;
    this.hidden = false;
    this.textContent = "";
    this.dataset = {};
    this.listeners = {};
    this.focused = false;
  }

  addEventListener(type, listener) {
    this.listeners[type] = listener;
  }

  emit(type) {
    this.listeners[type]?.();
  }

  focus() {
    this.focused = true;
  }
}

const input = new ElementMock();
const clearButton = new ElementMock();
const genreSelect = new ElementMock();
const ageSelect = new ElementMock();
const schoolYearSelect = new ElementMock();
const resetButton = new ElementMock();
const count = new ElementMock();
const emptyMessage = new ElementMock();
emptyMessage.hidden = true;

const currentJst = getTodayJST();
const thirtyYearOldBirthDate = `${currentJst.year - 30}-01-01`;
const shakaLikeCard = new ElementMock();
shakaLikeCard.dataset = {
  search: "shaka|しゃか|釈迦",
  genres: JSON.stringify(["ゲーム配信", "FPS"]),
  birthDate: thirtyYearOldBirthDate
};

const unknownAgeCard = new ElementMock();
unknownAgeCard.dataset = {
  search: "てすと|test",
  genres: JSON.stringify(["RPG"]),
  birthDate: ""
};

const elements = new Map([
  ["[data-search-input]", input],
  ["[data-search-clear]", clearButton],
  ["[data-genre-filter]", genreSelect],
  ["[data-age-filter]", ageSelect],
  ["[data-school-year-filter]", schoolYearSelect],
  ["[data-filter-reset]", resetButton],
  ["[data-search-count]", count],
  ["[data-search-empty]", emptyMessage]
]);

const root = {
  querySelector: (selector) => elements.get(selector) ?? null,
  querySelectorAll: (selector) =>
    selector === "[data-streamer-card]"
      ? [shakaLikeCard, unknownAgeCard]
      : []
};

globalThis.document = {
  querySelectorAll: (selector) =>
    selector === "[data-streamer-search-root]" ? [root] : []
};

const assetDirectory = new URL("../dist/client/_astro/", import.meta.url);
const clientBundleName = readdirSync(assetDirectory).find(
  (name) => name.startsWith("StreamerSearch.astro_") && name.endsWith(".js")
);

assert.ok(clientBundleName, "検索コンポーネントのクライアントJSが生成されている");
await import(new URL(clientBundleName, assetDirectory));

assert.equal(count.textContent, "2", "初期件数");
input.value = "シャカ";
input.emit("input");
assert.equal(count.textContent, "1", "クライアント側の名前検索");

clearButton.emit("click");
genreSelect.value = "FPS";
genreSelect.emit("change");
assert.equal(count.textContent, "1", "クライアント側のジャンル絞り込み");

genreSelect.value = "";
ageSelect.value = "30-34";
ageSelect.emit("change");
assert.equal(count.textContent, "1", "クライアント側の年齢絞り込み");

input.value = "shaka";
genreSelect.value = "FPS";
ageSelect.value = "30-34";
schoolYearSelect.value = String(getSchoolYear(thirtyYearOldBirthDate));
input.emit("input");
assert.equal(count.textContent, "1", "クライアント側の4条件AND");

genreSelect.value = "RPG";
genreSelect.emit("change");
assert.equal(count.textContent, "0", "クライアント側の0件");
assert.equal(emptyMessage.hidden, false, "0件メッセージの表示");

input.value = "";
genreSelect.value = "";
ageSelect.value = "unknown";
schoolYearSelect.value = "";
ageSelect.emit("change");
assert.equal(count.textContent, "1", "クライアント側の年齢不明");
assert.equal(unknownAgeCard.hidden, false, "年齢不明カードの表示");

resetButton.emit("click");
assert.equal(count.textContent, "2", "リセット後の件数");
assert.equal(input.value, "", "名前条件のリセット");
assert.equal(genreSelect.value, "", "ジャンル条件のリセット");
assert.equal(ageSelect.value, "", "年齢条件のリセット");
assert.equal(schoolYearSelect.value, "", "年度条件のリセット");
assert.equal(resetButton.disabled, true, "リセットボタンの無効化");
assert.equal(input.focused, true, "リセット後のフォーカス");

console.log("streamer filter tests: passed");
