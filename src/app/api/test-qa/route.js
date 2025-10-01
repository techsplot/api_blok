import { NextResponse } from 'next/server';
import { getApiQA, findBestMatchingQA } from '../../lib/qaService';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const apiSlug = searchParams.get('api') || 'paystack';
    const testQuestion = searchParams.get('question') || 'How do I authenticate?';
    
    console.log(`🧪 Testing Q&A for API: ${apiSlug}`);
    console.log(`❓ Test question: ${testQuestion}`);
    
    // Fetch Q&A data
    const qaData = await getApiQA(apiSlug);
    
    if (qaData.length === 0) {
      return NextResponse.json({
        success: false,
        message: `No Q&A data found for API: ${apiSlug}`,
        availableAPIs: ['paystack', 'flutterwave', 'stripe', 'twilio', 'hygraph']
      });
    }
    
    // Test matching
    const matchedQA = await findBestMatchingQA(testQuestion, qaData);
    
    return NextResponse.json({
      success: true,
      apiSlug,
      testQuestion,
      totalQA: qaData.length,
      qaItems: qaData.map(qa => ({
        question: qa.question,
        tags: qa.tags,
        category: qa.category,
        hasExamples: qa.examples && qa.examples.length > 0
      })),
      matchResult: matchedQA ? {
        found: true,
        confidence: matchedQA.confidence,
        reasoning: matchedQA.reasoning,
        matchedQuestion: matchedQA.question,
        answer: matchedQA.formattedAnswer?.substring(0, 200) + '...',
        tags: matchedQA.tags
      } : {
        found: false,
        message: 'No matching Q&A found'
      }
    });
    
  } catch (error) {
    console.error('❌ Error testing Q&A:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        details: 'Failed to test Q&A system'
      }, 
      { status: 500 }
    );
  }
}