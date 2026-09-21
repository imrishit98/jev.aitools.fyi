/// <reference types="@cloudflare/workers-types" />

interface Env {
  SITE_ASSETS?: Fetcher;
  AI_GATEWAY_API_KEY?: string;
  JEV_MOCK?: string;
  PUBLIC_SITE_URL?: string;
}
