"use client"; // required if you're in Next.js App Router (app/page.js)

import React, { useState } from "react";
import { Search, Mic, User } from "lucide-react";
import Image from "next/image";

const Home = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/scrape?url=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full flex items-center justify-between px-6 bg-white shadow">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="APIblok"
            width={206}
            height={137}
            className="h-20 w-auto"
            priority
          />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-6">
          <a
            href="#"
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Logout
          </a>

          <button className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-7 w-7 text-gray-700" />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-col items-center flex-1 px-6 py-12 mt-40">
        {/* Sticky Search Section */}
        <div className="sticky top-20 z-40 w-full max-w-2xl bg-white pb-6">
          <h1 className="text-3xl font-medium text-gray-900 mb-6 text-center">
            Search APIs !
          </h1>

          <form
            onSubmit={handleSearch}
            className="flex items-center bg-[#1D2534] rounded-full px-6 py-3 shadow gap-3"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a website URL (e.g. https://stripe.com)"
              className="w-full flex-1 bg-transparent outline-none text-gray-100 placeholder-gray-400 text-base"
            />

            {/* Mic button (kept for later use) */}
            <button
              type="button"
              className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition"
            >
              <Mic className="h-5 w-5 text-white" />
            </button>

            {/* Search button */}
            <button
              type="submit"
              disabled={loading}
              className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition"
            >
              {loading ? (
                <span className="text-xs text-white">⏳</span>
              ) : (
                <Search className="h-5 w-5 text-white" />
              )}
            </button>
          </form>
        </div>

        {/* Search Results */}
        <div className="mt-10 w-full max-w-2xl">
          {error && (
            <p className="text-red-600 font-medium">Error: {error}</p>
          )}
          {result && (
            <div className="bg-gray-50 rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-4">
                {result.favicon && (
                  <img
                    src={result.favicon}
                    alt="favicon"
                    className="w-6 h-6"
                  />
                )}
                <h2 className="text-xl font-bold">
                  {result.title || "No title"}
                </h2>
              </div>
              <p className="text-gray-600 mb-4">
                {result.description || "No description found."}
              </p>
              <h3 className="font-semibold mb-2">Excerpt:</h3>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {result.excerpt}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-sm text-gray-600 border-t">
        APIblok built for Developers with love
      </footer>
    </div>
  );
};

export default Home;
