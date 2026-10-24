import { mkdirSync } from "node:fs";
import { expect, test, type Locator, type Page } from "@playwright/test";

const viewports = [
  { width: 320, height: 900 },
  { width: 375, height: 900 },
  { width: 768, height: 1024 },
  { width: 1280, height: 900 }
];

async function expectNoHorizontalScroll(page: Page) {
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth
  }));

  expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport);
  expect(dimensions.body).toBeLessThanOrEqual(dimensions.viewport);
}

async function expectInsideViewport(locator: Locator, viewportWidth: number) {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(-0.5);
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewportWidth + 0.5);
}

for (const viewport of viewports) {
  test(`${viewport.width}pxでトップとプロフィールが横にはみ出さない`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");

    await expectNoHorizontalScroll(page);
    await expectInsideViewport(page.locator("[data-search-input]"), viewport.width);
    await expectInsideViewport(page.locator("[data-search-clear]"), viewport.width);
    await expectInsideViewport(page.locator("[data-school-year-filter]"), viewport.width);
    await expectInsideViewport(page.locator("[data-filter-reset]"), viewport.width);
    await expectInsideViewport(page.locator("[data-streamer-card]").first(), viewport.width);

    for (const selector of ["[data-search-clear]", "[data-filter-reset]"]) {
      const clipping = await page.locator(selector).evaluate((element) => {
        const htmlElement = element as HTMLElement;
        return {
          horizontal: htmlElement.scrollWidth > htmlElement.clientWidth,
          vertical: htmlElement.scrollHeight > htmlElement.clientHeight,
          whiteSpace: getComputedStyle(htmlElement).whiteSpace
        };
      });
      expect(clipping.horizontal).toBe(false);
      expect(clipping.vertical).toBe(false);
      expect(clipping.whiteSpace).toBe("nowrap");
    }

    await page.locator("[data-search-input]").fill("Lazvell");
    await page.locator("[data-search-clear]").click();
    await expect(page.locator("[data-search-input]")).toHaveValue("");

    await page.locator("[data-genre-filter]").selectOption("FPS");
    await page.locator("[data-school-year-filter]").selectOption("1995");
    await page.locator("[data-filter-reset]").click();
    await expect(page.locator("[data-genre-filter]")).toHaveValue("");
    await expect(page.locator("[data-school-year-filter]")).toHaveValue("");

    if (viewport.width === 375 || viewport.width === 1280) {
      mkdirSync("test-results/screenshots", { recursive: true });
      await page.screenshot({
        path: `test-results/screenshots/home-${viewport.width}.png`
      });
    }

    await page.goto("/streamers/shaka/");
    await expectNoHorizontalScroll(page);
    await expectInsideViewport(page.locator(".profile-hero__content"), viewport.width);
    await expectInsideViewport(page.locator(".key-facts"), viewport.width);
    await expectInsideViewport(page.locator(".section-card--wide"), viewport.width);
    await expect(page.locator(".back-link")).toBeEnabled();

    if (viewport.width === 375 || viewport.width === 1280) {
      await page.screenshot({
        path: `test-results/screenshots/profile-shaka-${viewport.width}.png`
      });

      await page.goto("/streamers/laz/");
      await expectNoHorizontalScroll(page);
      await expect(page.locator(".device-card")).toHaveCount(5);

      for (const card of await page.locator(".device-card").all()) {
        await expectInsideViewport(card, viewport.width);
      }

      await page.screenshot({
        path: `test-results/screenshots/profile-laz-${viewport.width}.png`,
        fullPage: true
      });
    }

    await page.goto("/generations/");
    await expectNoHorizontalScroll(page);
    await expectInsideViewport(
      page.locator("[data-generation-link]").first(),
      viewport.width
    );
    await expect(page.getByRole("link", { name: /1991年度生まれ/ })).toBeEnabled();

    if (viewport.width === 375 || viewport.width === 1280) {
      await page.screenshot({
        path: `test-results/screenshots/generations-${viewport.width}.png`
      });
    }

    await page.goto("/generations/1991/");
    await expectNoHorizontalScroll(page);
    await expectInsideViewport(
      page.locator("[data-generation-streamer]").first(),
      viewport.width
    );
    await expect(
      page.locator("[data-generation-streamer] a").first()
    ).toBeEnabled();

    if (viewport.width === 375 || viewport.width === 1280) {
      await page.screenshot({
        path: `test-results/screenshots/generation-1991-${viewport.width}.png`
      });
    }
  });
}
