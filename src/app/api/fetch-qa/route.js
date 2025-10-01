import { NextResponse } from 'next/server';
import { getStoryblokApi } from '../../lib/storyblok';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || 'api_ai';
    
    console.log(`🔍 Fetching data from folder: ${folder}`);
    
    const storyblokApi = getStoryblokApi();
    
    const { data } = await storyblokApi.get('cdn/stories', {
      starts_with: folder,
      version: 'published',
      per_page: 100,
    });

    const response = {
      success: true,
      totalStories: data.stories.length,
      folder: folder,
      stories: data.stories.map(story => ({
        id: story.id,
        name: story.name,
        slug: story.slug,
        full_slug: story.full_slug,
        content: story.content,
        created_at: story.created_at,
        published_at: story.published_at,
      }))
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ Error fetching Storyblok data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        details: 'Failed to fetch data from Storyblok'
      }, 
      { status: 500 }
    );
  }
}