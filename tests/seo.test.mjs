import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { SITE_CONFIG, shouldIncludeInSitemap } from "../site.config.mjs";
import { getSchoolYear } from "../src/utils/generation.ts";
import {
  createRobotsTxt,
  getRobotsMetaContent,
  toAbsoluteUrl
} from "../src/utils/seo.ts";

assert.equal(
  toAbsoluteUrl(SITE_CONFIG.url, "/streamers/shaka/"),
  new URL("/streamers/shaka/", SITE_CONFIG.url).href
);

assert.equal(getRobotsMetaContent(false), "noindex, follow");
assert.equal(getRobotsMetaContent(true), "index, follow");
assert.equal(getRobotsMetaContent(true, true), "noindex, follow");

const prelaunchRobots = createRobotsTxt(SITE_CONFIG.url, false);
assert.match(prelaunchRobots, /Allow: \//);
assert.doesNotMatch(prelaunchRobots, /Disallow:/);
assert.ok(
  prelaunchRobots.includes(
    `Sitemap: ${new URL("/sitemap-index.xml", SITE_CONFIG.url).href}`
  )
);

const publicRobots = createRobotsTxt(SITE_CONFIG.url, true);
assert.match(publicRobots, /Allow: \//);
assert.doesNotMatch(publicRobots, /Disallow:/);
assert.equal(prelaunchRobots, publicRobots);

assert.equal(
  shouldIncludeInSitemap(`${SITE_CONFIG.url}streamers/shaka/`),
  true
);
assert.equal(
  shouldIncludeInSitemap(`${SITE_CONFIG.url}device-preview/`),
  false
);
assert.equal(
  getRobotsMetaContent(
    true,
    !shouldIncludeInSitemap(`${SITE_CONFIG.url}device-preview/`)
  ),
  "noindex, follow"
);
assert.equal(
  shouldIncludeInSitemap(`${SITE_CONFIG.url}test/device-list/`),
  false
);
assert.equal(
  shouldIncludeInSitemap(`${SITE_CONFIG.url}__internal/`),
  false
);

const sitemap = readFileSync(
  new URL("../dist/client/sitemap-0.xml", import.meta.url),
  "utf8"
);
const streamerDirectory = new URL("../src/data/streamers/", import.meta.url);
const generationYears = new Set(
  readdirSync(streamerDirectory)
    .filter((name) => name.endsWith(".json"))
    .map((name) => {
      const streamer = JSON.parse(
        readFileSync(new URL(name, streamerDirectory), "utf8")
      );
      return getSchoolYear(streamer.birthDate);
    })
    .filter((year) => year !== null)
);
const generationPaths = [
  "/generations/",
  ...Array.from(generationYears, (year) => `/generations/${year}/`)
];

for (const path of generationPaths) {
  assert.ok(
    sitemap.includes(new URL(path, SITE_CONFIG.url).href),
    `${path}がサイトマップに含まれる`
  );
}

console.log("seo tests: passed");
