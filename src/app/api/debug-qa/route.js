import { NextResponse } from 'next/server';
import { loadAllQAData, getQAForAPI } from '../../lib/qaCache';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const debug = searchParams.get('debug');
    const apiSlug = searchParams.get('api') || 'paystack';

    if (debug === 'cache') {
      // Debug: Show what's in the cache
      const cache = await loadAllQAData();
      const cacheEntries = Array.from(cache.entries()).map(([key, value]) => ({
        apiSlug: key,
        questionCount: value.length,
        firstQuestion: value[0]?.question || 'No questions',
      }));

      return NextResponse.json({
        success: true,
        cacheSize: cache.size,
        entries: cacheEntries,
        availableKeys: Array.from(cache.keys()),
      });
    }

    // Test specific API
    const qaItems = await getQAForAPI(apiSlug);
    
    return NextResponse.json({
      success: true,
      requestedApi: apiSlug,
      foundQuestions: qaItems.length,
      questions: qaItems.map(qa => ({
        id: qa.id,
        question: qa.question,
        tags: qa.tags,
        apiSlug: qa.apiSlug,
        apiName: qa.apiName,
      }))
    });

  } catch (error) {
    console.error('❌ Debug error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        stack: error.stack
      }, 
      { status: 500 }
    );
  }
}