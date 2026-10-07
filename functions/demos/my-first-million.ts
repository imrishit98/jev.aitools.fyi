import { tryMfmDemoBarePathResponse } from "../../src/lib/mfm-demo-static";

/** Serves static demo HTML at /demos/my-first-million (before Assets directory redirect). */
export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const response = await tryMfmDemoBarePathResponse(
    context.request,
    url,
    (assetRequest) => context.env.ASSETS.fetch(assetRequest),
  );
  if (response) {
    return response;
  }
  return context.next();
};
