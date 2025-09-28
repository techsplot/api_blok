"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getStoryblokApi } from "@/app/lib/storyblok"; // This is your existing RSC setup

const StoryblokContext = createContext(null);

export function StoryblokContextProvider({ children }) {
  const storyblokApi = getStoryblokApi(); // Uses your already-initialized API
  const [version, setVersion] = useState("draft");
  const [isPreview, setIsPreview] = useState(false);
  const [cacheVersion, setCacheVersion] = useState(undefined);

  // Switch to "published" automatically in production unless preview mode is enabled
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      setVersion("published");
    }
  }, []);

  // Detect preview mode from Storyblok editor
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("_storyblok")) {
      setIsPreview(true);
      setVersion("draft");
    }
  }, []);

  // Fetch Storyblok Space cache version (cv) to ensure fresh content after publish
  useEffect(() => {
    if (!storyblokApi) return;

    let cancelled = false;
    const fetchCv = async () => {
      try {
        const { data } = await storyblokApi.get("cdn/spaces/me");
        if (!cancelled) setCacheVersion(data?.space?.version);
      } catch (e) {
        // non-fatal; keep old cv
        console.warn("Storyblok: failed to fetch space version (cv)", e?.message || e);
      }
    };

    // Initial fetch and interval to keep it updated
    fetchCv();
    const id = setInterval(fetchCv, 30000); // refresh every 30s
    return () => { cancelled = true; clearInterval(id); };
  }, [storyblokApi]);

  const value = {
    storyblokApi,
    version,
    isPreview,
    setVersion,
    cacheVersion,
  };

  return (
    <StoryblokContext.Provider value={value}>
      {children}
    </StoryblokContext.Provider>
  );
}

export function useStoryblok() {
  return useContext(StoryblokContext);
}
