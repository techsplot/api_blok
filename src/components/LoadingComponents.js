// Loading Components for Enhanced User Experience
import React from 'react';

// Spinner component for general loading states
export function LoadingSpinner({ size = 'md', color = 'blue' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    blue: 'border-blue-600',
    gray: 'border-gray-400',
    white: 'border-white'
  };

  return (
    <div 
      className={`inline-block animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClasses[color]}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// Skeleton loader for search results
export function SearchResultSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="flex items-center gap-4">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
        <div className="ml-4 flex flex-col gap-2">
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-6 bg-gray-200 rounded w-14"></div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-4 bg-gray-200 rounded w-4"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="h-6 bg-gray-200 rounded w-18"></div>
        </div>
      </div>
    </div>
  );
}

// Multiple skeleton loaders for search results
export function SearchResultsSkeletonList({ count = 5 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <SearchResultSkeleton key={index} />
      ))}
    </div>
  );
}

// Loading state for search header
export function SearchHeaderSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-32"></div>
    </div>
  );
}

// Enhanced loading screen with better UX
export function SearchLoadingScreen({ query }) {
  return (
    <div className="text-center py-16">
      <div className="mb-6">
        <LoadingSpinner size="xl" color="blue" />
      </div>
      <h3 className="text-xl font-medium text-gray-700 mb-2">
        {query ? `Searching for "${query}"...` : 'Loading APIs...'}
      </h3>
      <p className="text-gray-500 mb-8">
        We're finding the best APIs for your needs
      </p>
      
      {/* Search tips while loading */}
      <div className="max-w-md mx-auto text-left bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 Search Tips:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Try specific keywords like "payment", "email", or "weather"</li>
          <li>• Use filters to narrow down by category or method</li>
          <li>• Check for free APIs if you're just getting started</li>
        </ul>
      </div>
    </div>
  );
}

// Elegant loading for the entire search page
export function FullPageSearchLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header skeleton */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              <SearchHeaderSkeleton />
            </div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Filters sidebar skeleton */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-24 mb-6"></div>
              <div className="space-y-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i}>
                    <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results skeleton */}
          <div className="flex-1">
            <SearchResultsSkeletonList count={6} />
          </div>
        </div>
      </div>
    </div>
  );
}