"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { SearchResults } from "../../components/SearchResults";
import { FullPageSearchLoading } from "../../components/LoadingComponents";
import { useStoryblok } from "../lib/StoryblokContext";
import { transformStoryblokData } from "../lib/transform";
import { ArrowLeft } from "lucide-react";

function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const { storyblokApi, version, cacheVersion } = useStoryblok();
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading true

  // Fetch APIs using both Algolia (when coming from autocomplete) and Storyblok
  useEffect(() => {
    async function fetchApis() {
      if (!query) {
        setLoading(false);
        setApiData([]);
        return;
      }
      
      setLoading(true);
      try {
        // Check if we have search data from autocomplete
        const storedSearchData = sessionStorage.getItem('searchData');
        
        if (storedSearchData) {
          const searchData = JSON.parse(storedSearchData);
          if (searchData.fromAutocomplete && searchData.selectedItem) {
            // Use Algolia search results if coming from autocomplete
            const { searchClient } = await import("../lib/algolia");
            const { getAlgoliaResults } = await import("@algolia/autocomplete-js");

            const results = await getAlgoliaResults({
              searchClient,
              queries: [
                {
                  indexName: "api_docs",
                  params: { query, hitsPerPage: 20 },
                },
              ],
            });

            const hits = results[0]?.hits || [];
            const normalizedHits = hits.map(item => {
              const eps = Array.isArray(item.endpoints) ? item.endpoints : [];
              const first = eps.find(ep => ep && ep.path) || eps[0] || {};
              const method = Array.isArray(first.method)
                ? (first.method[0] || '').toString().toUpperCase()
                : (first.method || '').toString().toUpperCase();
              let provider;
              try { provider = item.base_url ? new URL(item.base_url).hostname : undefined; } catch {}
              const tags = Array.isArray(item.tags)
                ? item.tags
                : (typeof item.tags === 'string' ? item.tags.split(',').map(s => s.trim()).filter(Boolean) : []);
              const endpoints = eps.map(ep => ({
                name: ep?.name || '',
                path: ep?.path || '',
                method: Array.isArray(ep?.method)
                  ? (ep.method[0] || '').toString().toUpperCase()
                  : (ep?.method || '').toString().toUpperCase(),
              }));
              return {
                id: item.objectID || item.id,
                slug: item.slug,
                name: item.name || item.slug,
                description: item.description || "",
                method,
                endpoint: first.path || "",
                category: tags[0],
                authRequired: !!item.auth_method && item.auth_method.toLowerCase() !== "none",
                provider,
                tags,
                image: item.image,
                documentation_url: item.base_url || undefined,
                endpoints,
              };
            });
            setApiData(normalizedHits);
            sessionStorage.removeItem('searchData');
            setLoading(false);
            return; // Don't fall through to Storyblok fetch
          }
        }

        // Fetch from Storyblok by content type (folder "apis" contains stories of type "api_doc")
        const { data } = await storyblokApi.get("cdn/stories", {
          version,
          content_type: "api_doc",
          starts_with: "apis/",
          per_page: 100,
          cv: cacheVersion,
        });
        const stories = data.stories || [];
        console.log("Success: Storyblok fetched", { count: stories.length });
        const transformed = transformStoryblokData(stories);
        const normalizedStories = transformed.map(item => {
          const eps = Array.isArray(item.endpoints) ? item.endpoints : [];
          const first = eps.find(ep => ep && ep.path) || eps[0] || {};
          const method = (first.method || '').toString().toUpperCase();
          let provider;
          try { provider = item.base_url ? new URL(item.base_url).hostname : undefined; } catch {}
          return {
            id: item.objectID || item.id,
            slug: item.slug,
            name: item.name || item.slug,
            description: item.description || "",
            method,
            endpoint: first.path || "",
            category: Array.isArray(item.tags) && item.tags.length ? item.tags[0] : undefined,
            authRequired: !!item.auth_method && item.auth_method.toLowerCase() !== "none",
            provider,
            tags: item.tags || [],
            image: item.image,
            documentation_url: item.base_url || undefined,
            endpoints: eps,
          };
        }).filter(api => {
          if (!query) return true;
          const q = query.toLowerCase();
          return (
            api.name?.toLowerCase().includes(q) ||
            api.description?.toLowerCase().includes(q) ||
            api.category?.toLowerCase().includes(q)
          );
        });
        setApiData(normalizedStories);
      } catch (err) {
        console.error("Error fetching API data:", err);
        setApiData([]);
      }
      setLoading(false);
    }
    
    if (!storyblokApi) {
      // Wait for storyblokApi to be initialized
      if (query) {
        setLoading(true);
      }
      return;
    }
    
    if (query) fetchApis();
    else {
      setLoading(false);
      setApiData([]);
    }
  }, [storyblokApi, version, query, cacheVersion]);

  const handleApiSelect = (api) => {
    sessionStorage.setItem("selectedApi", JSON.stringify(api));
    const slug = api.slug || (api.name ? api.name.toLowerCase().replace(/\s+/g, '_') : api.id);
    router.push(`/api/${slug}`);
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
      loading={loading}
      onApiSelect={handleApiSelect}
      onNavigate={handleNavigation}
    />
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<FullPageSearchLoading />}>
      <SearchResultsContent />
    </Suspense>
  );
}
