export const SITE_CONFIG = Object.freeze({
  name: "配信者年齢サイト",
  url: "https://streamer-age-site.sheryl1414.workers.dev/",
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
