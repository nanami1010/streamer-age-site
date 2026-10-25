export const SITE_CONFIG = Object.freeze({
  name: "STREAMER AGE",
  description: "配信者の年齢・世代・使用デバイス",
  url: "https://streamerage.jp/",
  indexingEnabled: false,
  contactEmail: null,
  services: Object.freeze({
    analytics: null,
    displayAdvertising: null,
    affiliatePrograms: []
  }),
  sitemapExcludedPathPrefixes: [
    "/device-preview/",
    "/preview/",
    "/test/",
    "/tests/",
    "/__"
  ]
});

export function shouldIncludeInSitemap(pageUrl) {
  const { pathname } = new URL(pageUrl);
  const normalizedPath = pathname.endsWith("/") ? pathname : `${pathname}/`;

  return !SITE_CONFIG.sitemapExcludedPathPrefixes.some((prefix) =>
    normalizedPath.startsWith(prefix)
  );
}
