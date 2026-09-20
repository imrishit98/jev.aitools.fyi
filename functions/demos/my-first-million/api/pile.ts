import { handlePile } from "../../../../src/lib/mfm-jev-search/search-service";

export const onRequestGet: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  return handlePile(url.searchParams.get("n"));
};
