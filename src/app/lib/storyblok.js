import { apiPlugin, storyblokInit } from '@storyblok/react/rsc';

// Diagnostic function to check configuration
const checkStoryblokConfig = () => {
  const token = process.env.NEXT_PUBLIC_STORYBLOK_CONTENT_API_ACCESS_TOKEN;
  
  if (!token) {
    console.error('❌ NEXT_PUBLIC_STORYBLOK_CONTENT_API_ACCESS_TOKEN is not set');
    return false;
  }
  
  if (token.length < 10) {
    console.error('❌ NEXT_PUBLIC_STORYBLOK_CONTENT_API_ACCESS_TOKEN appears to be invalid (too short)');
    return false;
  }
  
  console.log('✅ Storyblok access token is configured');
  return true;
};

// Check configuration on import
if (typeof window === 'undefined') { // Only run on server-side
  checkStoryblokConfig();
}

export const getStoryblokApi = storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_CONTENT_API_ACCESS_TOKEN,
  use: [apiPlugin],
  apiOptions: {
    region: 'eu',
  },
});