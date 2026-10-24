import assert from "node:assert/strict";
import {
  getSchoolYear,
  getSchoolYearRange,
  groupBySchoolYear
} from "../src/utils/generation.ts";

const boundaryCases = [
  ["1990-04-01", 1989],
  ["1990-04-02", 1990],
  ["1991-01-01", 1990],
  ["1991-03-31", 1990],
  ["1991-04-01", 1990],
  ["1991-04-02", 1991],
  ["1996-01-27", 1995]
];

for (const [birthDate, expectedYear] of boundaryCases) {
  assert.equal(getSchoolYear(birthDate), expectedYear, `${birthDate}の年度`);
}

assert.equal(getSchoolYear(null), null, "生年月日不明");
assert.equal(getSchoolYear("1991-02-29"), null, "存在しない日付");
assert.equal(getSchoolYear("1991/04/02"), null, "ISO形式以外");

assert.deepEqual(getSchoolYearRange(1990), {
  startDate: "1990-04-02",
  endDate: "1991-04-01",
  label: "1990年4月2日〜1991年4月1日"
});

const grouped = groupBySchoolYear([
  { name: "A", birthDate: "1991-03-24" },
  { name: "B", birthDate: "1990-05-06" },
  { name: "C", birthDate: "1991-12-27" },
  { name: "D", birthDate: null }
]);

assert.deepEqual(
  grouped.map(({ year, members }) => ({
    year,
    names: members.map(({ name }) => name)
  })),
  [
    { year: 1991, names: ["C"] },
    { year: 1990, names: ["A", "B"] }
  ],
  "年度不明を除外し、年度の降順でグループ化する"
);

console.log("generation tests: passed");
