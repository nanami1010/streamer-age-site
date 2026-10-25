import assert from "node:assert/strict";
import test from "node:test";
import {
  formatBirthday,
  isValidBirthMonthDay,
  parseBirthMonthDay
} from "../src/utils/birthday.ts";

test("誕生日の月日として実在する日付だけを受け入れる", () => {
  for (const value of ["01-01", "02-29", "04-30", "12-31"]) {
    assert.equal(isValidBirthMonthDay(value), true, `${value}は有効`);
  }

  for (const value of ["00-01", "02-30", "04-31", "13-01", "1-01", "01/01"]) {
    assert.equal(isValidBirthMonthDay(value), false, `${value}は無効`);
  }
});

test("生年月日を優先し、月日のみの場合は年を補わず表示する", () => {
  assert.equal(formatBirthday("1991-12-27", undefined), "1991年12月27日");
  assert.equal(formatBirthday(null, "10-31"), "10月31日");
  assert.equal(formatBirthday(null, undefined), "未確認");
  assert.deepEqual(parseBirthMonthDay("02-29"), { month: 2, day: 29 });
});
