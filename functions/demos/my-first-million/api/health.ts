import { dispatchMfmApi } from "../../../../src/lib/mfm-jev-search/api-route";
import type { MfmSearchEnv } from "../../../../src/lib/mfm-jev-search/search-service";

export const onRequestGet: PagesFunction<MfmSearchEnv> = async (context) => {
  const res = await dispatchMfmApi(context.request, context.env);
  return res ?? new Response("Not found", { status: 404 });
};
