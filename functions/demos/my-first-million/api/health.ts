import { handleHealth, type MfmSearchEnv } from "../../../../src/lib/mfm-jev-search/search-service";

export const onRequestGet: PagesFunction<MfmSearchEnv> = async (context) => {
  return handleHealth(context.env);
};
