import { handleSearch, type MfmSearchEnv } from "../../../../src/lib/mfm-jev-search/search-service";

export const onRequestGet: PagesFunction<MfmSearchEnv> = async (context) => {
  const url = new URL(context.request.url);
  const q = url.searchParams.get("q") || "";
  return handleSearch(q, context.env);
};
