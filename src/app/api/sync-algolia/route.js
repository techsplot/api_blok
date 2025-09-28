import { algoliasearch } from "algoliasearch";
import { NextResponse } from "next/server";
import { getStoryblokApi } from "@/app/lib/storyblok";
import { transformStoryblokData } from "@/app/lib/transform";

const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_KEY
);

export async function GET() {
  try {
    const storyblokApi = getStoryblokApi();

    // 1. Fetch Storyblok data
    const { data: space } = await storyblokApi.get("cdn/spaces/me");
    const cv = space?.space?.version;
    const { data } = await storyblokApi.get("cdn/stories", {
      version: "published",
      content_type: "api_doc",
      starts_with: "apis/",
      cv,
      per_page: 100,
    });

    // 2. Transform for Algolia
    const transformed = transformStoryblokData(data.stories);

    // 3. Push directly with index name
    await algoliaClient.saveObjects({
      indexName: "api_docs",    // ✅ index name here
      objects: transformed,     // ✅ your data
    });
 
    return NextResponse.json({ success: true, count: transformed.length });
  } catch (err) {
    console.error("Algolia Sync Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
