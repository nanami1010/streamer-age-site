import { spawnSync } from "node:child_process";
import { existsSync, unlinkSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export default function globalTeardown() {
  const projectRoot = fileURLToPath(new URL("../../", import.meta.url));
  const markerFile = path.join(projectRoot, ".astro", "playwright-managed-server");

  if (!existsSync(markerFile)) return;

  const astroCli = path.join(projectRoot, "node_modules", "astro", "bin", "astro.mjs");
  const serverEnvironment = {
    ...process.env,
    XDG_CONFIG_HOME: path.join(projectRoot, ".astro", "playwright-runtime-config")
  };
  const stopResult = spawnSync(process.execPath, [astroCli, "dev", "stop"], {
    cwd: projectRoot,
    stdio: "inherit",
    env: serverEnvironment
  });

  unlinkSync(markerFile);

  if (stopResult.status !== 0) {
    throw new Error("Playwrightが起動したAstro開発サーバーを停止できませんでした。");
  }
}
