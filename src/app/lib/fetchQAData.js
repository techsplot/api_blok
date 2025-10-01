// Script to fetch and display Q&A data from Storyblok
import { getStoryblokApi } from './storyblok.js';

export async function fetchAndDisplayQAData() {
  try {
    const storyblokApi = getStoryblokApi();
    
    console.log('🔍 Fetching Q&A data from Storyblok...');
    
    // First, let's see what's in the api_ai folder
    const { data } = await storyblokApi.get('cdn/stories', {
      starts_with: 'api_ai',
      version: 'published',
      per_page: 100, // Get more results
    });

    console.log(`📊 Found ${data.stories.length} stories in api_ai folder`);
    
    if (data.stories.length === 0) {
      console.log('❌ No stories found. Make sure you have content in the api_ai folder');
      return [];
    }

    // Display the structure
    console.log('\n📁 Folder structure:');
    data.stories.forEach(story => {
      console.log(`  ${story.full_slug}`);
    });

    console.log('\n📄 Sample story content:');
    const sampleStory = data.stories[0];
    console.log('Story Object:', {
      id: sampleStory.id,
      name: sampleStory.name,
      slug: sampleStory.slug,
      full_slug: sampleStory.full_slug,
      content: sampleStory.content
    });

    console.log('\n🔧 Raw JSON structure:');
    console.log(JSON.stringify(sampleStory, null, 2));

    return data.stories;
  } catch (error) {
    console.error('❌ Error fetching Q&A data:', error);
    return [];
  }
}