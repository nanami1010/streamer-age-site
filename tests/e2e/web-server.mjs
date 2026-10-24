import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../../", import.meta.url));
const astroCli = path.join(projectRoot, "node_modules", "astro", "bin", "astro.mjs");
const markerDirectory = path.join(projectRoot, ".astro");
const markerFile = path.join(markerDirectory, "playwright-managed-server");
const runtimeConfigDirectory = path.join(markerDirectory, "playwright-runtime-config");
const serverEnvironment = {
  ...process.env,
  XDG_CONFIG_HOME: runtimeConfigDirectory
};

mkdirSync(runtimeConfigDirectory, { recursive: true });

const statusResult = spawnSync(process.execPath, [astroCli, "dev", "status"], {
  cwd: projectRoot,
  encoding: "utf8",
  env: serverEnvironment
});
const statusOutput = `${statusResult.stdout ?? ""}${statusResult.stderr ?? ""}`;

if (statusOutput.includes("Dev server running")) {
  process.stderr.write(
    "ポート4321の既存Astroサーバーが応答していません。`astro dev stop`で停止してから再実行してください。\n"
  );
  process.exit(1);
}

const startResult = spawnSync(
  process.execPath,
  [astroCli, "dev", "--background", "--port", "4321"],
  {
    cwd: projectRoot,
    stdio: "inherit",
    env: serverEnvironment
  }
);

if (startResult.status !== 0) {
  process.exit(startResult.status ?? 1);
}

mkdirSync(markerDirectory, { recursive: true });
writeFileSync(markerFile, String(process.pid), "utf8");

const markerWatcher = setInterval(() => {
  if (!existsSync(markerFile)) {
    clearInterval(markerWatcher);
    process.exit(0);
  }
}, 250);
