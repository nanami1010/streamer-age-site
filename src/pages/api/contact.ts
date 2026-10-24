import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import {
  processContactRequest,
  type ContactRuntime
} from "../../lib/contact";

export const prerender = false;

export const POST: APIRoute = ({ request }) =>
  processContactRequest(request, env as unknown as ContactRuntime);
