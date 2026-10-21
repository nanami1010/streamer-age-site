// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import { SITE_CONFIG, shouldIncludeInSitemap } from './site.config.mjs';

// https://astro.build/config
export default defineConfig({
  site: SITE_CONFIG.url,
  adapter: cloudflare(),
  integrations: [
    sitemap({
      filter: shouldIncludeInSitemap
    })
  ]
});
