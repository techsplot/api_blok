"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useMemo } from "react";
import Link from "next/link";
import { SearchResults } from "../../components/SearchResults";
import { apis } from "@/app/lib/mockData";
import { ArrowLeft } from "lucide-react";

function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const handleApiSelect = (api) => {
    // Store the API data in sessionStorage to pass to detail page
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
      data={apis}
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
