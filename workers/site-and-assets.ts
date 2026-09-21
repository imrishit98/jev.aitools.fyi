import { dispatchMfmApi } from "../src/lib/mfm-jev-search/api-route";
import type { MfmSearchEnv } from "../src/lib/mfm-jev-search/search-service";

export interface Env extends MfmSearchEnv {
  SITE_ASSETS: Fetcher;
  PUBLIC_SITE_URL?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const mfm = await dispatchMfmApi(request, env);
    if (mfm) {
      return mfm;
    }
    return env.SITE_ASSETS.fetch(request);
  },
};
