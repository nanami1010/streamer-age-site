import type { APIRoute } from "astro";
import { SITE_CONFIG } from "../../site.config.mjs";
import { createRobotsTxt } from "../utils/seo";

export const prerender = true;

export const GET: APIRoute = () => new Response(
  createRobotsTxt(SITE_CONFIG.url, SITE_CONFIG.indexingEnabled),
  {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  }
);
