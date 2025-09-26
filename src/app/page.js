"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { Search, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useStoryblok } from "@/app/lib/StoryblokContext";
import { searchClient } from "@/app/lib/algolia";
import { autocomplete } from "@algolia/autocomplete-js";
import "@algolia/autocomplete-theme-classic/dist/theme.css";

// Login/Signup Form
function LoginSignupForm({ onSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      if (isSignup) {
        onSubmit({ email, password, fullName, signup: true });
      } else {
        onSubmit({ email, password, signup: false });
      }
    }, 1500);
  };

  return (
    <form
      className={`rounded-2xl shadow-2xl px-6 py-6 w-full max-w-md mx-auto flex flex-col border border-gray-100 ${isSignup ? "gap-4" : "gap-6"
        }`}
      style={{ background: "white" }}
      onSubmit={handleSubmit}
    >
      <h2 className="text-3xl font-bold mb-4 text-center tracking-tight">
        {isSignup ? "Sign Up" : "Login"}
      </h2>
      <div className={`flex flex-col ${isSignup ? "gap-3" : "gap-6"}`}>
        {isSignup && (
          <div className="flex flex-col gap-2">
            <label htmlFor="fullName" className="text-base text-gray-700 font-medium mb-1">
              Full Name
            </label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{
                width: "100%",
                borderColor: "#4FACFE",
                borderWidth: 2,
                borderRadius: 10,
                background: "#F8FAFC",
                paddingLeft: 18,
                height: 56,
                fontSize: 18,
              }}
            />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-base text-gray-700 font-medium mb-1">
            Email address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              borderColor: "#4FACFE",
              borderWidth: 2,
              borderRadius: 10,
              background: "#F8FAFC",
              paddingLeft: 18,
              height: 56,
              fontSize: 18,
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-base text-gray-700 font-medium mb-1">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            maxLength={18}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              borderColor: "#4FACFE",
              borderWidth: 2,
              borderRadius: 10,
              background: "#F8FAFC",
              paddingLeft: 18,
              height: 56,
              fontSize: 18,
            }}
          />
        </div>
        {isSignup && (
          <div className="flex flex-col gap-2">
            <label htmlFor="confirmPassword" className="text-base text-gray-700 font-medium mb-1">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              minLength={6}
              maxLength={18}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              valid={password === confirmPassword}
              style={{
                width: "100%",
                borderColor: "#4FACFE",
                borderWidth: 2,
                borderRadius: 10,
                background: "#F8FAFC",
                paddingLeft: 18,
                height: 56,
                fontSize: 18,
              }}
            />
          </div>
        )}
      </div>
      <Button
        type="submit"
        themeColor="primary"
        className="w-full mt-6 py-3 text-lg font-semibold rounded-lg bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] text-white shadow-md hover:opacity-90 transition"
      >
        {isSignup ? "Sign Up" : "Login"}
      </Button>
      <button
        type="button"
        onClick={() => setIsSignup(!isSignup)}
        className="w-full mt-2 py-1 text-sm text-blue-500 hover:underline"
      >
        {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
      </button>
      {success && (
        <div className="bg-green-100 text-green-700 rounded-lg px-4 py-2 mt-6 text-center text-base font-medium">
          Form submitted!
        </div>
      )}
    </form>
  );
}

// Landing Page
export default function Home() {
  const { storyblokApi, version } = useStoryblok();
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

  // Fetch Storyblok data
  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await storyblokApi.get("cdn/stories/apis/api_docs", { version });
        if (data?.story?.content) setApiData(data.story.content);
        else setApiData(null);
      } catch (err) {
        console.error("Error fetching Storyblok data:", err);
      }
    }
    if (storyblokApi) fetchData();
  }, [storyblokApi, version]);

  // Algolia Autocomplete
useEffect(() => {
  if (!autocompleteRef.current) return;

  const ac = autocomplete({
    container: autocompleteRef.current, // only render the suggestions panel
    placeholder: "", // input is already controlled by React
    openOnFocus: false, // only open when typing
    getSources() {
      return [
        {
          sourceId: "apis",
          getItems({ query }) {
            if (!query || query.trim().length === 0) return [];
            return searchClient
              .search([{ indexName: "api_docs", query, params: { hitsPerPage: 5 } }])
              .then(({ results }) => results[0].hits);
          },
          templates: {
            item({ item }) {
              return `
                <div class="px-4 py-2 cursor-pointer rounded hover:bg-gray-700">
                  <strong class="text-white">${item.name}</strong>
                  <div class="text-gray-300 text-sm">${item.category}</div>
                </div>
              `;
            },
          },
        },
      ];
    },
    onSelect({ item }) {
      router.push(`/search?q=${encodeURIComponent(item.name)}`);
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

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
          <div className="rounded-xl shadow-lg p-6 w-full max-w-md relative bg-white overflow-y-auto hide-scrollbar" style={{ maxHeight: "90vh" }}>
            <button onClick={() => setShowLogin(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold">
              &times;
            </button>
            <LoginSignupForm onSubmit={handleAuth} />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex flex-col items-center flex-1 px-6 py-12 mt-40 w-full">
        {/* Search Section */}
        <div className="sticky top-20 z-40 w-full max-w-2xl bg-white pb-6">
          <h1 className="text-3xl font-medium text-gray-900 mb-6 text-center">Search APIs!</h1>
          <form onSubmit={handleSearch} className="relative flex items-center bg-[#1D2534] rounded-full px-6 py-3 shadow gap-3 w-full max-w-2xl mx-auto">
  <input
    type="text"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    placeholder="Search APIs by name, category, or keyword"
    className="w-full flex-1 bg-transparent outline-none text-gray-100 placeholder-gray-400 text-base"
  />
  {/* Autocomplete suggestions panel */}
  <div ref={autocompleteRef} className="absolute top-full left-0 w-full z-50" />
  <button
    type="submit"
    disabled={loading}
    className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition"
  >
    {loading ? <span className="text-xs text-white">⏳</span> : <Search className="h-5 w-5 text-white cursor-pointer" />}
  </button>
</form>


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

      <style jsx global>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
