'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ApiDetail } from '../../../components/apiDetails';
import { ApiDetailEnhanced } from '../../../components/apiDetailsEnhanced';
import { useStoryblok } from '../../lib/StoryblokContext';
import { transformStoryblokData } from '../../lib/transform';
import { transformStoryblokDataEnhanced } from '../../lib/transformEnhanced';

export default function ApiDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [selectedApi, setSelectedApi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [navigationState, setNavigationState] = useState(null);
  const { storyblokApi, version, cacheVersion } = useStoryblok();

  // Detect navigation intent and manage history state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const intent = sessionStorage.getItem('navigationIntent');
      const chatReturnHandled = sessionStorage.getItem('chatReturnHandled');
      
      // Store original referrer for proper back navigation
      if (!sessionStorage.getItem('originalReferrer') && !intent) {
        sessionStorage.setItem('originalReferrer', document.referrer || '/');
      }
      
      // If returning from chat, clean up navigation state
      if (intent === 'chat-to-api' && chatReturnHandled === 'true') {
        setNavigationState({ fromChat: true });
        sessionStorage.removeItem('navigationIntent');
        sessionStorage.removeItem('chatReturnHandled');
        sessionStorage.removeItem('chatApiContext');
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    
    // Development mode debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('🐛 API Detail Page Debug Info:', {
        slug: params?.slug,
        hasStoryblokApi: !!storyblokApi,
        version,
        cacheVersion,
        hasToken: !!process.env.NEXT_PUBLIC_STORYBLOK_CONTENT_API_ACCESS_TOKEN,
        navigationState,
      });
    }
    
    async function load() {
      try {
        const slug = params?.slug;
        
        // Early validation
        if (!slug) {
          console.error('Failed to load API by slug: No slug provided in URL params');
          if (!cancelled) router.push('/');
          return;
        }

        // 1) Try to get API data from sessionStorage for fast nav
        const storedApi = typeof window !== 'undefined' ? sessionStorage.getItem('selectedApi') : null;
        if (storedApi) {
          try {
            const parsed = JSON.parse(storedApi);
            if (parsed && parsed.slug === slug) {
              if (!cancelled) {
                setSelectedApi(parsed);
                setLoading(false);
              }
              // Continue to fetch fresh data but don't block
            }
          } catch (parseErr) {
            console.warn('Failed to parse stored API data:', parseErr);
            // Clear invalid stored data
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('selectedApi');
            }
          }
        }

        // 2) Check if Storyblok API is available
        if (!storyblokApi) {
          console.error('Failed to load API by slug: Storyblok API not initialized');
          console.error('Debug info:', {
            hasToken: !!process.env.NEXT_PUBLIC_STORYBLOK_CONTENT_API_ACCESS_TOKEN,
            tokenLength: process.env.NEXT_PUBLIC_STORYBLOK_CONTENT_API_ACCESS_TOKEN?.length || 0,
          });
          if (!storedApi && !cancelled) router.push('/');
          return;
        }

        // 3) Fetch from Storyblok by slug for shareable deep links and freshness
        const fullSlug = `apis/${slug}`; // content stored under 'apis/' folder
        
        console.log(`Attempting to fetch API data for slug: ${fullSlug}`);
        
        const { data } = await storyblokApi.get(`cdn/stories/${fullSlug}`, {
          version,
          cv: cacheVersion,
        });

        if (!data) {
          throw new Error('No data returned from Storyblok API');
        }

        if (!data.story) {
          throw new Error(`No story found for slug: ${fullSlug}`);
        }

        const story = [data.story];
        const [normalized] = transformStoryblokData(story);
        const [enhancedApi] = transformStoryblokDataEnhanced(story);
        
        if (!normalized) {
          throw new Error('Failed to transform Storyblok data');
        }

        // Use enhanced API data if available, fallback to legacy
        const apiData = enhancedApi || normalized;

        // Enrich with UI-derived fields for backward compatibility
        const endpoints = Array.isArray(apiData.endpoints) ? apiData.endpoints : [];
        const first = endpoints.find(ep => ep && ep.path) || endpoints[0] || {};
        let provider;
        try { 
          provider = apiData.base_url ? new URL(apiData.base_url).hostname : undefined; 
        } catch (urlErr) {
          console.warn('Invalid base_url format:', apiData.base_url);
        }
        
        const apiObj = {
          id: apiData.objectID,
          slug: apiData.slug || slug,
          name: apiData.name,
          description: apiData.description,
          method: (first.method || '').toString().toUpperCase(),
          endpoint: first.path || '',
          endpoints,
          category: Array.isArray(apiData.tags) && apiData.tags.length ? apiData.tags[0] : undefined,
          tags: apiData.tags || [],
          authRequired: !!apiData.auth_method && apiData.auth_method.toLowerCase() !== 'none',
          provider,
          image: apiData.image,
          documentation_url: apiData.base_url || undefined,
          // Enhanced fields from new schema
          ...apiData
        };
        
        console.log('Successfully loaded API data:', apiObj.name);
        if (!cancelled) {
          setSelectedApi(apiObj);
          setError(null);
          setLoading(false);
        }
        
      } catch (err) {
        // Enhanced error logging with more context
        const errorContext = {
          slug: params?.slug,
          hasStoryblokApi: !!storyblokApi,
          version,
          cacheVersion,
          errorMessage: err?.message,
          errorName: err?.name,
          errorStack: err?.stack,
          errorResponse: err?.response?.data,
          errorStatus: err?.response?.status,
          errorStatusText: err?.response?.statusText,
        };
        
        console.error('Failed to load API by slug:', errorContext);
        
        // Show user-friendly error message based on error type
        let userErrorMessage = 'Failed to load API information';
        if (err?.response?.status === 404) {
          console.warn(`API not found for slug: ${params?.slug}`);
          userErrorMessage = `API "${params?.slug}" not found`;
        } else if (err?.response?.status >= 500) {
          console.error('Server error while fetching API data');
          userErrorMessage = 'Server error - please try again later';
        } else if (err?.name === 'NetworkError' || err?.code === 'NETWORK_ERROR') {
          console.error('Network error while fetching API data');
          userErrorMessage = 'Network error - please check your connection';
        } else if (!storyblokApi) {
          userErrorMessage = 'Content management system not available';
        }
        
        if (!cancelled) {
          setError(userErrorMessage);
          setLoading(false);
        }
        
        // Only redirect to home if no stored API data and not cancelled
        if (!storedApi && !cancelled) {
          // Wait a bit before redirecting to show error
          setTimeout(() => {
            if (!cancelled) router.push('/');
          }, 3000);
        }
      }
    }
    
    load();
    return () => { 
      cancelled = true;
      // Cleanup navigation state on unmount if not going to chat
      if (typeof window !== 'undefined') {
        const intent = sessionStorage.getItem('navigationIntent');
        if (intent !== 'api-to-chat') {
          sessionStorage.removeItem('originalReferrer');
        }
      }
    };
  }, [router, params, storyblokApi, version, cacheVersion]);

  const handleNavigation = (screen) => {
    switch (screen) {
      case 'home':
        router.push('/');
        break;
      case 'search':
      case 'back':
        // Smart back navigation based on context
        if (navigationState?.fromChat) {
          // If we came from chat, go to search/home instead of back to chat
          const referrer = typeof window !== 'undefined' ? 
            sessionStorage.getItem('originalReferrer') || '/' : '/';
          // Clean up session storage
          sessionStorage.removeItem('originalReferrer');
          router.push(referrer);
        } else {
          // Normal back navigation
          router.back();
        }
        break;
      case 'chat':
        // Store API context with navigation intent for chat
        if (selectedApi && typeof window !== 'undefined') {
          // Create navigation state with proper intent tracking
          const navigationState = {
            api: selectedApi,
            returnUrl: `/api/${selectedApi.slug}`,
            timestamp: Date.now(),
            navigationIntent: 'api-to-chat',
            sourceHistory: window.history.length, // Track history depth
            previousUrl: window.location.pathname
          };
          
          sessionStorage.setItem('chatApiContext', JSON.stringify(navigationState));
          sessionStorage.setItem('navigationIntent', 'api-to-chat');
        }
        router.push('/chat');
        break;
      case 'settings':
        router.push('/settings');
        break;
      default:
        router.push('/');
    }
  };

  if (loading && !selectedApi) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h1 className="text-2xl font-medium mb-2">Loading API Details</h1>
          <p className="text-gray-600">Retrieving information for "{params?.slug}"</p>
        </div>
      </div>
    );
  }

  if (error && !selectedApi) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-medium mb-2 text-gray-900">Oops! Something went wrong</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedApi) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium mb-4">API Not Found</h1>
          <p className="text-gray-600 mb-6">The requested API could not be found.</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Render enhanced component if available enhanced data, otherwise use legacy
  const hasEnhancedData = selectedApi?.codeExamples || selectedApi?.useCases || selectedApi?.difficulty;
  
  return hasEnhancedData ? (
    <ApiDetailEnhanced
      api={selectedApi}
      onNavigate={handleNavigation}
    />
  ) : (
    <ApiDetail
      api={selectedApi}
      onNavigate={handleNavigation}
    />
  );
}