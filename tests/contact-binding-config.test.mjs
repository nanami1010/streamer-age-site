import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

import {
  DESTINATION_ENV_NAME,
  GENERATED_CONFIG_PREFIX,
  createRestrictedConfig,
  createTemporaryConfig,
  getWranglerArguments,
  isValidDestination,
  parseJsonc,
  projectRoot,
  removeTemporaryConfig
} from "../scripts/upload-staging.mjs";

const TEST_DESTINATION = "contact-test@example.invalid";
const scriptPath = join(projectRoot, "scripts", "upload-staging.mjs");

test("CONTACT_EMAILだけに固定送信先を追加し、他のWrangler設定を維持する", async () => {
  const source = await readFile(join(projectRoot, "wrangler.jsonc"), "utf8");
  const baseConfig = parseJsonc(source);
  const restrictedConfig = createRestrictedConfig(baseConfig, TEST_DESTINATION);

  assert.equal(
    restrictedConfig.send_email.find(({ name }) => name === "CONTACT_EMAIL")
      .destination_address,
    TEST_DESTINATION
  );
  assert.equal(
    baseConfig.send_email.find(({ name }) => name === "CONTACT_EMAIL")
      .destination_address,
    undefined
  );

  const withoutRestriction = structuredClone(restrictedConfig);
  delete withoutRestriction.send_email.find(
    ({ name }) => name === "CONTACT_EMAIL"
  ).destination_address;
  assert.deepEqual(withoutRestriction, baseConfig);
});

test("JSONCのコメントと末尾カンマを安全に解析する", () => {
  const config = parseJsonc(`{
    // line comment
    "name": "value,}",
    "nested": {
      "enabled": true, /* block comment */
    },
  }`);

  assert.deepEqual(config, {
    name: "value,}",
    nested: { enabled: true }
  });
});

test("未設定・不正な送信先ではアップロード前に停止する", () => {
  const missingEnvironment = { ...process.env };
  delete missingEnvironment[DESTINATION_ENV_NAME];
  const missing = spawnSync(process.execPath, [scriptPath, "--check"], {
    cwd: projectRoot,
    env: missingEnvironment,
    encoding: "utf8"
  });
  assert.notEqual(missing.status, 0);
  assert.match(missing.stderr, /is required; upload stopped/);

  for (const invalidDestination of [
    "not-an-email",
    "with space@example.invalid",
    "linebreak@example.invalid\r\nBcc:other@example.invalid",
    " leading@example.invalid"
  ]) {
    assert.equal(isValidDestination(invalidDestination), false);
  }
});

test("確認モードは宛先を出力せず、一時設定を削除する", async () => {
  const before = new Set(
    (await readdir(projectRoot)).filter((name) =>
      name.startsWith(GENERATED_CONFIG_PREFIX)
    )
  );
  const result = spawnSync(process.execPath, [scriptPath, "--check"], {
    cwd: projectRoot,
    env: {
      ...process.env,
      [DESTINATION_ENV_NAME]: TEST_DESTINATION
    },
    encoding: "utf8"
  });
  const after = new Set(
    (await readdir(projectRoot)).filter((name) =>
      name.startsWith(GENERATED_CONFIG_PREFIX)
    )
  );

  assert.equal(result.status, 0, result.stderr);
  assert.doesNotMatch(`${result.stdout}${result.stderr}`, new RegExp(TEST_DESTINATION));
  assert.deepEqual(after, before);
});

test("一時設定はGit管理対象外で、distの外に生成される", async () => {
  const temporaryPath = await createTemporaryConfig(TEST_DESTINATION);
  try {
    assert.equal(temporaryPath.startsWith(projectRoot), true);
    assert.equal(temporaryPath.startsWith(join(projectRoot, "dist")), false);
    assert.equal(existsSync(temporaryPath), true);

    const ignoredPath = execFileSync(
      "git",
      ["check-ignore", "--no-index", temporaryPath],
      { cwd: projectRoot, encoding: "utf8" }
    ).trim();
    assert.equal(ignoredPath.length > 0, true);
  } finally {
    await removeTemporaryConfig(temporaryPath);
  }
  assert.equal(existsSync(temporaryPath), false);
});

test("Wrangler引数はstaging向けVersion uploadだけを使用する", () => {
  const configPath = join(projectRoot, ".wrangler.contact-binding.test.json");
  const args = getWranglerArguments(configPath);

  assert.deepEqual(args.slice(0, 3), ["wrangler", "versions", "upload"]);
  assert.deepEqual(args.slice(3), [
    "--preview-alias",
    "staging",
    "--keep-vars",
    "--config",
    configPath
  ]);
  assert.equal(args.includes("deploy"), false);
  assert.equal(args.includes("versions deploy"), false);
  assert.equal(args.includes(TEST_DESTINATION), false);
});
