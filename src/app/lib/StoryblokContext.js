"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getStoryblokApi } from "@/app/lib/storyblok"; // This is your existing RSC setup

const StoryblokContext = createContext(null);

export function StoryblokContextProvider({ children }) {
  const storyblokApi = getStoryblokApi(); // Uses your already-initialized API
  const [version, setVersion] = useState("draft");
  const [isPreview, setIsPreview] = useState(false);

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

  const value = {
    storyblokApi,
    version,
    isPreview,
    setVersion,
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
