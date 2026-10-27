import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_CONFIG, shouldIncludeInSitemap } from "../site.config.mjs";
import { getSchoolYear } from "../src/utils/generation.ts";
import {
  createRobotsTxt,
  getRobotsMetaContent,
  toAbsoluteUrl
} from "../src/utils/seo.ts";

assert.equal(SITE_CONFIG.name, "STREAMER AGE");
assert.equal(SITE_CONFIG.description, "配信者の年齢・世代・使用デバイス");
assert.equal(SITE_CONFIG.url, "https://streamerage.jp/");
assert.equal(SITE_CONFIG.indexingEnabled, false);

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
  shouldIncludeInSitemap(`${SITE_CONFIG.url}404/`),
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
const sitemapIndex = readFileSync(
  new URL("../dist/client/sitemap-index.xml", import.meta.url),
  "utf8"
);
const robotsTxt = readFileSync(
  new URL("../dist/client/robots.txt", import.meta.url),
  "utf8"
);
const legacyOrigin = "https://streamer-age-site.sheryl1414.workers.dev";

assert.match(
  sitemapIndex,
  /<loc>https:\/\/streamerage\.jp\/sitemap-0\.xml<\/loc>/
);
assert.ok(!sitemapIndex.includes(legacyOrigin));
assert.ok(!sitemap.includes(legacyOrigin));
assert.ok(!robotsTxt.includes(legacyOrigin));
assert.ok(robotsTxt.includes("Sitemap: https://streamerage.jp/sitemap-index.xml"));
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

function collectHtmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name);
    return entry.isDirectory()
      ? collectHtmlFiles(entryPath)
      : entry.name.endsWith(".html")
        ? [entryPath]
        : [];
  });
}

const clientDirectory = fileURLToPath(
  new URL("../dist/client/", import.meta.url)
);
const htmlFiles = collectHtmlFiles(clientDirectory);

assert.ok(htmlFiles.length > 0, "生成済みHTMLが存在する");

for (const htmlFile of htmlFiles) {
  const html = readFileSync(htmlFile, "utf8");
  const fileLabel = relative(clientDirectory, htmlFile);
  const isNotFoundPage = fileLabel === "404.html";
  const canonicalMatches = [
    ...html.matchAll(/<link rel="canonical" href="([^"]+)">/g)
  ];
  const ogUrlMatches = [
    ...html.matchAll(/<meta property="og:url" content="([^"]+)">/g)
  ];
  const robotsMatches = [
    ...html.matchAll(/<meta name="robots" content="([^"]+)">/g)
  ];

  assert.match(html, /<title>[^<]+<\/title>/, `${fileLabel}: title`);
  assert.match(
    html,
    /<meta name="description" content="[^"]+">/,
    `${fileLabel}: description`
  );
  for (const property of [
    "site_name",
    "locale",
    "type",
    "title",
    "description",
    "url"
  ]) {
    assert.match(
      html,
      new RegExp(`<meta property="og:${property}" content="[^"]+">`),
      `${fileLabel}: og:${property}`
    );
  }

  assert.equal(canonicalMatches.length, 1, `${fileLabel}: canonicalは1件`);
  assert.equal(ogUrlMatches.length, 1, `${fileLabel}: og:urlは1件`);
  assert.equal(robotsMatches.length, 1, `${fileLabel}: robots metaは1件`);

  const canonicalUrl = canonicalMatches[0][1];
  assert.ok(
    canonicalUrl.startsWith("https://streamerage.jp/"),
    `${fileLabel}: canonicalは正式ドメイン`
  );
  assert.equal(ogUrlMatches[0][1], canonicalUrl, `${fileLabel}: og:url`);
  assert.equal(robotsMatches[0][1], "noindex, follow", `${fileLabel}: noindex`);
  assert.ok(!html.includes(legacyOrigin), `${fileLabel}: 暫定ドメインを含まない`);
  assert.equal(
    sitemap.includes(`<loc>${canonicalUrl}</loc>`),
    !isNotFoundPage,
    `${fileLabel}: 404以外はサイトマップ掲載`
  );

  for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const url = new URL(href, SITE_CONFIG.url);
    if (url.origin !== "https://streamerage.jp") continue;

    const path = decodeURIComponent(url.pathname).replace(/^\//, "");
    const targetPath = url.pathname.endsWith("/")
      ? join(clientDirectory, path, "index.html")
      : join(clientDirectory, path);

    assert.ok(
      existsSync(targetPath),
      `${fileLabel}: 内部リンク ${href} の生成先が存在する`
    );
  }
}

console.log("seo tests: passed");
