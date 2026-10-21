export function toAbsoluteUrl(siteUrl: string, pathOrUrl: string): string {
  return new URL(pathOrUrl, siteUrl).href;
}

export function getRobotsMetaContent(
  indexingEnabled: boolean,
  forceNoIndex = false
): string {
  return indexingEnabled && !forceNoIndex
    ? "index, follow"
    : "noindex, follow";
}

export function createRobotsTxt(
  siteUrl: string,
  _indexingEnabled: boolean
): string {
  const sitemapUrl = toAbsoluteUrl(siteUrl, "/sitemap-index.xml");

  return [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${sitemapUrl}`,
    ""
  ].join("\n");
}
