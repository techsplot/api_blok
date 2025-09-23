import { useState, useEffect } from 'react';
import { Mic, Search as SearchIcon, TrendingUp } from 'lucide-react';
import imgImage1 from "figma:asset/c034dcdce9b4b3673747bef479ace380ce50717d.png";
import { imgGroup1, imgGroup2, imgGroup, imgEllipse2, imgLine1 } from "../imports/svg-40hrx";
import { imgEllipse2 as headerEllipse, imgGroup as profileIcon } from "../imports/svg-6lkbo";
import Vector from "../imports/Vector";
import { getAutocompleteSuggestions, getPopularSearches } from '../lib/algolia';

function Group1() {
  return (
    <div className="absolute inset-[49.7%_22.47%_47.45%_76.17%]">
      <img className="block max-w-none size-full" src={imgGroup1} />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute left-[1191px] size-[49px] top-[475px]">
      <img className="block max-w-none size-full" src={imgGroup2} />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[16.667%]" data-name="Group">
      <div className="absolute inset-[-4.688%]">
        <img className="block max-w-none size-full" src={imgGroup} />
      </div>
    </div>
  );
}

function IconamoonProfileLight() {
  return (
    <div className="absolute left-[1427px] overflow-clip size-6 top-[38px]" data-name="iconamoon:profile-light">
      <Group />
    </div>
  );
}

function Group3({ onNavigate }) {
  return (
    <div className="absolute contents left-[1411px] top-[22px]">
      <div className="absolute left-[1411px] size-14 top-[22px]">
        <img className="block max-w-none size-full" src={imgEllipse2} />
      </div>
      <IconamoonProfileLight />
    </div>
  );
}

export function HomeScreen({ onSearch, onNavigate }) {
  const [searchInput, setSearchInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [popularSearches, setPopularSearches] = useState([]);

  // Load popular searches on component mount
  useEffect(() => {
    const popular = getPopularSearches();
    setPopularSearches(popular);
  }, []);

  // Get autocomplete suggestions as user types
  useEffect(() => {
    const getSuggestions = async () => {
      if (searchInput.length > 2) {
        const suggestions = await getAutocompleteSuggestions(searchInput);
        setSuggestions(suggestions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(getSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchInput]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchInput(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleCategoryClick = (category) => {
    onSearch(category);
  };

  const handlePopularSearchClick = (searchTerm) => {
    setSearchInput(searchTerm);
    onSearch(searchTerm);
  };

  const handleVoiceSearch = () => {
    setIsListening(!isListening);
    // Voice search functionality would be implemented here
    // For now, we'll just toggle the visual state
  };

  return (
    <div className="bg-white min-h-screen flex flex-col" data-name="Home Screen">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6 relative z-10">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src={imgImage1} 
            alt="APIblok Logo" 
            className="h-24 w-auto"
          />
        </div>
        {/* Right side - Logout and Profile */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => {/* Handle logout */}}
            className="text-[rgba(0,0,0,0.6)] underline hover:text-black transition-colors"
          >
            Logout
          </button>
          <button
            onClick={() => onNavigate('settings')}
            className="relative hover:opacity-80 transition-opacity"
            title="Settings"
          >
            <div className="w-12 h-12">
              <img className="block max-w-none size-full" src={headerEllipse} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-5 h-5 overflow-hidden">
                <div className="absolute inset-[16.667%]">
                  <div className="absolute inset-[-4.688%]">
                    <img className="block max-w-none size-full" src={profileIcon} />
                  </div>
                </div>
              </div>
            </div>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        {/* Search Title */}
        <div className="mb-12">
          <h1 className="text-4xl text-black text-center">Search APIs !</h1>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="w-full max-w-4xl mb-16 relative">
          <div className="relative bg-slate-800 rounded-[40px] h-[84px] flex items-center px-8">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => setShowSuggestions(suggestions.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Ask me for any API"
              className="flex-1 bg-transparent text-[rgba(249,250,251,0.6)] placeholder:text-[rgba(249,250,251,0.6)] text-xl outline-none"
            />
            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="p-3 bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] text-white rounded-full hover:opacity-90 transition-all"
                title="Search"
              >
                <div className="w-5 h-5 relative">
                  <Vector />
                </div>
              </button>
              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`p-3 rounded-full transition-all ${
                  isListening 
                    ? 'bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Mic className="w-5 h-5" />
              </button>
              <Group1 />
              <Group2 />
            </div>
          </div>
          {/* Autocomplete Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                >
                  <SearchIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </form>

        {/* Popular Searches */}
        {popularSearches.length > 0 && (
          <div className="w-full max-w-4xl mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-gray-500" />
              <span className="text-slate-600">
                Popular searches:
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {popularSearches.slice(0, 6).map((searchTerm, index) => (
                <button
                  key={index}
                  onClick={() => handlePopularSearchClick(searchTerm)}
                  className="px-5 py-3 bg-gray-100 hover:bg-gradient-to-r hover:from-[#4FACFE] hover:to-[#00F2FE] hover:text-white text-gray-700 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  {searchTerm}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Categories */}
        <div className="w-full max-w-4xl">
          <div className="mb-8">
            <h2 className="text-slate-800">Quick categories:</h2>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Category Items */}
            {[
              { name: 'Payments', description: 'Payment processing, billing, and financial APIs' },
              { name: 'Auth', description: 'Authentication, authorization, and user management' },
              { name: 'Messaging', description: 'Email, SMS, push notifications, and chat APIs' }
            ].map((category, index) => (
              <div key={category.name}>
                <button
                  onClick={() => handleCategoryClick(category.name)}
                  className="w-full text-left py-6 px-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 group"
                >
                  <div className="text-[rgba(0,0,0,0.6)] group-hover:text-black transition-colors text-xl">
                    {category.name}
                  </div>
                  <div className="text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {category.description}
                  </div>
                </button>
                {index < 2 && (
                  <div className="h-px w-full px-6">
                    <div className="h-px bg-gray-100"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="py-8 text-center">
        <div className="text-black">
          <p>APIblok built for Developers with love</p>
        </div>
      </footer>
    </div>
  );
}
