"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useStoryblok } from "@/app/lib/StoryblokContext";
import { autocomplete, getAlgoliaResults } from "@algolia/autocomplete-js";
import { searchClient } from "@/app/lib/algolia";
import "@algolia/autocomplete-theme-classic";

// Initialize Algolia

export default function Home() {
  const { storyblokApi, version, cacheVersion } = useStoryblok();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });
  const [apiData, setApiData] = useState(null);
  const router = useRouter();
  const autocompleteRef = useRef(null);

  // Fetch Storyblok data (list stories under 'apis/' of type 'api_doc')
  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await storyblokApi.get("cdn/stories", {
          version,
          content_type: "api_doc",
          starts_with: "apis/",
          per_page: 1,
          cv: cacheVersion,
        });
        const first = data?.stories?.[0]?.content;
        if (first) {
          console.log("Success: Fetched from Storyblok (home)");
          setApiData(first);
        } else {
          console.warn("Storyblok: No 'api_doc' stories found under 'apis/'");
          setApiData(null);
        }
      } catch (err) {
        console.error("Error fetching Storyblok data:", err);
      }
    }
    if (storyblokApi) fetchData();
  }, [storyblokApi, version, cacheVersion]);

  // Algolia Autocomplete
  useEffect(() => {
    if (!autocompleteRef.current) return;

    const ac = autocomplete({
      container: autocompleteRef.current,
      placeholder: "Search APIs by name, category, or keyword",
      openOnFocus: false, // only show suggestions when typing
      debug: true,
      getSources({ query }) {
        return [
          {
            sourceId: "apis",
            getItems() {
              return getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    indexName: "api_docs", // your Algolia index
                    params: {
                      query,
                      hitsPerPage: 5,
                      attributesToSnippet: ["name:10", "description:35"],
                      snippetEllipsisText: "…",
                    },
                  },
                ],
              });
            },
            // Provide a URL for each item so clicks naturally navigate
            getItemUrl({ item }) {
              return `/search?q=${encodeURIComponent(item.name)}`;
            },
            templates: {
              item({ item, components, html }) {
                // Render as an anchor so clicking always navigates
                const href = `/search?q=${encodeURIComponent(item.name)}`;
                return html`<a class="aa-ItemLink" href="${href}">
                  <div class="aa-ItemWrapper">
                    <div class="aa-ItemContent">
                      <div class="aa-ItemIcon aa-ItemIcon--alignTop">
                        <img src="${item.image || '/default-icon.png'}" alt="${item.name}" width="50" height="50" />
                      </div>
                      <div class="aa-ItemContentBody">
                        <div class="aa-ItemContentTitle">
                          ${components.Highlight({ hit: item, attribute: "name" })}
                        </div>
                        <div class="aa-ItemContentDescription">
                          ${components.Snippet({ hit: item, attribute: "tag" })}
                        </div>
                      </div>
                    </div>
                  </div>
                </a>`;
              },
            },
          },
        ];
      },
      onSelect({ item }) {
        console.log('Autocomplete item selected:', item);
        // Pass both query and selected item data
        const searchData = {
          query: item.name,
          selectedItem: item,
          fromAutocomplete: true
        };
        sessionStorage.setItem('searchData', JSON.stringify(searchData));
        // Navigate for keyboard selection or when onSelect fires
        window.location.assign(`/search?q=${encodeURIComponent(item.name)}`);
      },
    });

    return () => ac.destroy();
  }, [router]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setLoading(false);
  };

  const handleAuth = (data) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    setShowLogin(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full flex items-center justify-between px-6 bg-white shadow">
        <div className="flex items-center">
          <Image src="/logo.png" alt="APIblok" width={206} height={137} className="h-20 w-auto" priority />
        </div>
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <span className="text-base font-medium text-gray-700">{user.fullName || user.email}</span>
              <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 underline">
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => setShowLogin(true)} className="text-sm text-gray-600 hover:text-gray-800 underline">
              Login
            </button>
          )}
          <a href="/settings" className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition">
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </a>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-col items-center flex-1 px-6 py-12 mt-40 w-full">
        {/* Search Section */}
        <div className="sticky top-20 z-40 w-full max-w-2xl bg-white pb-6">
          <h1 className="text-3xl font-medium text-gray-900 mb-2 text-center">Search APIs!</h1>
          <p className="text-lg text-gray-600 text-center mb-6">
            Discover, explore, and integrate APIs faster.
          </p>
          {/* <form
            onSubmit={handleSearch}
            className="relative flex items-center overflow-visible"
          > */}
            <div ref={autocompleteRef} className="w-full " />
          {/* </form> */}
        </div>

        {/* Storyblok Data Preview */}
        {apiData && (
          <div className="mt-10 p-6 border rounded-lg shadow bg-white max-w-xl text-center">
            <h2 className="text-xl font-bold mb-2">API Details (from Storyblok)</h2>
            <pre className="text-sm text-left overflow-x-auto">{JSON.stringify(apiData, null, 2)}</pre>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-sm text-gray-600 border-t">
        APIblok built for Developers with love
      </footer>
    </div>
  );
}
