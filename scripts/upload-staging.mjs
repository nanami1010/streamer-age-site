import { randomUUID } from "node:crypto";
import {
  readFile,
  writeFile,
  unlink
} from "node:fs/promises";
import { existsSync, unlinkSync } from "node:fs";
import { spawn } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const DESTINATION_ENV_NAME = "CONTACT_BINDING_DESTINATION";
export const GENERATED_CONFIG_PREFIX = ".wrangler.contact-binding.";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
export const projectRoot = resolve(scriptDirectory, "..");
const sourceConfigPath = join(projectRoot, "wrangler.jsonc");
let activeChild = null;

function stripJsonComments(source) {
  let output = "";
  let inString = false;
  let escaped = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    const nextCharacter = source[index + 1];

    if (inLineComment) {
      if (character === "\n" || character === "\r") {
        inLineComment = false;
        output += character;
      } else {
        output += " ";
      }
      continue;
    }

    if (inBlockComment) {
      if (character === "*" && nextCharacter === "/") {
        output += "  ";
        index += 1;
        inBlockComment = false;
      } else {
        output += character === "\n" || character === "\r" ? character : " ";
      }
      continue;
    }

    if (inString) {
      output += character;
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === '"') {
        inString = false;
      }
      continue;
    }

    if (character === '"') {
      inString = true;
      output += character;
    } else if (character === "/" && nextCharacter === "/") {
      output += "  ";
      index += 1;
      inLineComment = true;
    } else if (character === "/" && nextCharacter === "*") {
      output += "  ";
      index += 1;
      inBlockComment = true;
    } else {
      output += character;
    }
  }

  if (inBlockComment || inString) {
    throw new Error("wrangler.jsonc could not be parsed safely.");
  }

  return output;
}

function removeTrailingCommas(source) {
  let output = "";
  let inString = false;
  let escaped = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];

    if (inString) {
      output += character;
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === '"') {
        inString = false;
      }
      continue;
    }

    if (character === '"') {
      inString = true;
      output += character;
      continue;
    }

    if (character === ",") {
      let nextIndex = index + 1;
      while (/\s/.test(source[nextIndex] ?? "")) nextIndex += 1;
      if (source[nextIndex] === "}" || source[nextIndex] === "]") continue;
    }

    output += character;
  }

  return output;
}

export function parseJsonc(source) {
  try {
    return JSON.parse(removeTrailingCommas(stripJsonComments(source)));
  } catch (error) {
    if (error instanceof Error && error.message === "wrangler.jsonc could not be parsed safely.") {
      throw error;
    }
    throw new Error("wrangler.jsonc could not be parsed safely.");
  }
}

export function isValidDestination(value) {
  return (
    typeof value === "string" &&
    value === value.trim() &&
    value.length <= 254 &&
    /^[^\s@\r\n\0]+@[^\s@\r\n\0]+\.[^\s@\r\n\0]+$/.test(value)
  );
}

export function createRestrictedConfig(baseConfig, destination) {
  if (!isValidDestination(destination)) {
    throw new Error(`${DESTINATION_ENV_NAME} is not a valid email address.`);
  }
  if (!baseConfig || typeof baseConfig !== "object" || Array.isArray(baseConfig)) {
    throw new Error("wrangler.jsonc must contain an object.");
  }
  if (!Array.isArray(baseConfig.send_email)) {
    throw new Error("wrangler.jsonc does not define the CONTACT_EMAIL binding.");
  }

  const config = structuredClone(baseConfig);
  const matchingBindings = config.send_email.filter(
    (binding) => binding && typeof binding === "object" && binding.name === "CONTACT_EMAIL"
  );

  if (matchingBindings.length !== 1) {
    throw new Error("wrangler.jsonc must define exactly one CONTACT_EMAIL binding.");
  }

  const contactBinding = matchingBindings[0];
  if (
    Object.hasOwn(contactBinding, "allowed_destination_addresses") ||
    Object.hasOwn(contactBinding, "destination_address")
  ) {
    throw new Error(
      "CONTACT_EMAIL already has a destination restriction; review it before uploading."
    );
  }

  contactBinding.destination_address = destination;
  return config;
}

export function getWranglerArguments(configPath) {
  return [
    "wrangler",
    "versions",
    "upload",
    "--preview-alias",
    "staging",
    "--keep-vars",
    "--config",
    configPath
  ];
}

function redact(text, destination) {
  return text
    .split(destination)
    .join("[REDACTED]")
    .split(encodeURIComponent(destination))
    .join("[REDACTED]");
}

async function runWrangler(configPath, destination) {
  const command = process.platform === "win32" ? "npx.cmd" : "npx";
  const childEnvironment = { ...process.env };
  delete childEnvironment[DESTINATION_ENV_NAME];

  const child = spawn(command, getWranglerArguments(configPath), {
    cwd: projectRoot,
    env: childEnvironment,
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true
  });
  activeChild = child;

  let stdout = "";
  let stderr = "";
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  child.stdout.on("data", (chunk) => {
    stdout += chunk;
  });
  child.stderr.on("data", (chunk) => {
    stderr += chunk;
  });

  let exitCode;
  try {
    exitCode = await new Promise((resolvePromise, rejectPromise) => {
      child.once("error", rejectPromise);
      child.once("close", (code) => resolvePromise(code ?? 1));
    });
  } finally {
    activeChild = null;
  }

  if (stdout) process.stdout.write(redact(stdout, destination));
  if (stderr) process.stderr.write(redact(stderr, destination));
  if (exitCode !== 0) {
    throw new Error(`Wrangler exited with code ${exitCode}.`);
  }
}

export async function createTemporaryConfig(destination) {
  const source = await readFile(sourceConfigPath, "utf8");
  const config = createRestrictedConfig(parseJsonc(source), destination);
  const temporaryPath = join(
    projectRoot,
    `${GENERATED_CONFIG_PREFIX}${process.pid}-${randomUUID()}.json`
  );

  await writeFile(temporaryPath, `${JSON.stringify(config, null, 2)}\n`, {
    encoding: "utf8",
    flag: "wx",
    mode: 0o600
  });
  return temporaryPath;
}

export async function removeTemporaryConfig(temporaryPath) {
  if (!temporaryPath) return;
  await unlink(temporaryPath);
}

export async function main(args = process.argv.slice(2), environment = process.env) {
  const checkOnly = args.length === 1 && args[0] === "--check";
  if (!(args.length === 0 || checkOnly)) {
    throw new Error("Usage: node scripts/upload-staging.mjs [--check]");
  }

  const destination = environment[DESTINATION_ENV_NAME];
  if (!destination) {
    throw new Error(`${DESTINATION_ENV_NAME} is required; upload stopped.`);
  }
  if (!isValidDestination(destination)) {
    throw new Error(`${DESTINATION_ENV_NAME} is not a valid email address; upload stopped.`);
  }

  let temporaryPath;
  const cleanupOnSignal = (signal) => {
    try {
      if (activeChild && !activeChild.killed) activeChild.kill(signal);
      if (temporaryPath && existsSync(temporaryPath)) unlinkSync(temporaryPath);
    } catch {
      console.error("Temporary Wrangler configuration cleanup failed.");
    }
    process.exit(signal === "SIGINT" ? 130 : 143);
  };
  process.once("SIGINT", cleanupOnSignal);
  process.once("SIGTERM", cleanupOnSignal);

  try {
    temporaryPath = await createTemporaryConfig(destination);
    const generated = parseJsonc(await readFile(temporaryPath, "utf8"));
    const binding = generated.send_email.find(
      (candidate) => candidate?.name === "CONTACT_EMAIL"
    );
    if (binding?.destination_address !== destination) {
      throw new Error("The generated CONTACT_EMAIL restriction could not be verified.");
    }

    if (checkOnly) {
      console.log("Restricted staging configuration validated; no upload was performed.");
      return;
    }

    console.log("Uploading a staging-only Worker Version with a restricted email destination.");
    await runWrangler(temporaryPath, destination);
  } finally {
    process.removeListener("SIGINT", cleanupOnSignal);
    process.removeListener("SIGTERM", cleanupOnSignal);
    if (temporaryPath && existsSync(temporaryPath)) {
      await removeTemporaryConfig(temporaryPath);
    }
  }
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : "";
if (import.meta.url === invokedPath) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : "Staging upload failed.";
    console.error(message);
    process.exitCode = 1;
  });
}
