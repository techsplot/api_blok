"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useMemo } from "react";
import Link from "next/link";
import { SearchResults } from "../../components/SearchResults";
import { useStoryblok } from "@/app/lib/StoryblokContext";
import { ArrowLeft } from "lucide-react";

function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const { storyblokApi, version } = useStoryblok();
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch APIs from Storyblok
  useEffect(() => {
    async function fetchApis() {
      setLoading(true);
      try {
        // Update the path below to match your Storyblok structure
        const { data } = await storyblokApi.get("cdn/stories/apis", { version });
        // Assuming each API is a block inside the story content
        const apis = data.story?.content?.apis || [];
        setApiData(apis);
      } catch (err) {
        console.error("Error fetching Storyblok APIs:", err);
        setApiData([]);
      }
      setLoading(false);
    }
    if (storyblokApi) fetchApis();
  }, [storyblokApi, version]);

  const handleApiSelect = (api) => {
    sessionStorage.setItem("selectedApi", JSON.stringify(api));
    router.push(`/api/${api.id}`);
  };

  const handleNavigation = (screen) => {
    switch (screen) {
      case "home":
        router.push("/");
        break;
      case "chat":
        router.push("/chat");
        break;
      case "settings":
        router.push("/settings");
        break;
      default:
        router.push("/");
    }
  };

  return (
    <SearchResults
      query={query}
      data={apiData}
      onApiSelect={handleApiSelect}
      onNavigate={handleNavigation}
    />
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-medium mb-4">Loading...</h1>
            <p className="text-gray-600">Searching for APIs</p>
          </div>
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}
