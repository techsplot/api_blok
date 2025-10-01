import { NextResponse } from 'next/server';
import { getQAForAPI, getQAById } from '../../lib/qaCache';
import { getChatResponse } from '../../lib/geminiService';

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, apiSlug, qaId, question, userProfile } = body;

    if (action === 'getQuickQA') {
      // Get specific Q&A by ID (fast response)
      if (!qaId) {
        return NextResponse.json({ error: 'Missing qaId' }, { status: 400 });
      }

      const qaItem = await getQAById(qaId);
      if (!qaItem) {
        return NextResponse.json({ error: 'Q&A not found' }, { status: 404 });
      }

      return NextResponse.json({
        response: qaItem.fullAnswer,
        source: 'qa_database',
        confidence: 1.0,
        originalQuestion: qaItem.question,
        qaId: qaItem.id,
        category: qaItem.category,
        tags: qaItem.tags,
      });

    } else if (action === 'getAPIQuestions') {
      // Get all Q&A questions for an API (for buttons)
      if (!apiSlug) {
        return NextResponse.json({ error: 'Missing apiSlug' }, { status: 400 });
      }

      const qaItems = await getQAForAPI(apiSlug);
      
      return NextResponse.json({
        success: true,
        apiSlug,
        questions: qaItems.map(qa => ({
          id: qa.id,
          question: qa.question,
          tags: qa.tags,
          category: qa.category,
        }))
      });

    } else if (action === 'askAI') {
      // AI-powered response with context checking
      if (!question || !apiSlug || !userProfile) {
        return NextResponse.json({ 
          error: 'Missing required fields: question, apiSlug, or userProfile' 
        }, { status: 400 });
      }

      // Get API Q&A data for context checking
      const qaItems = await getQAForAPI(apiSlug);
      const apiName = qaItems.length > 0 ? qaItems[0].apiName : apiSlug;

      // Create context-aware prompt
      const contextPrompt = `You are an AI assistant that ONLY answers questions about the ${apiName} API.

STRICT RULES:
1. If the question is NOT related to ${apiName} API, respond with exactly: "__NOT_RELEVANT__"
2. Only answer questions about ${apiName} API features, integration, authentication, endpoints, etc.
3. If unsure, err on the side of being restrictive

Examples of RELEVANT questions for ${apiName}:
- "How do I authenticate with ${apiName}?"
- "What endpoints does ${apiName} provide?"
- "How do I handle errors in ${apiName}?"
- "Show me ${apiName} integration examples"

Examples of NOT RELEVANT questions:
- General programming questions
- Questions about other APIs or services
- Personal or unrelated topics

USER QUESTION: "${question}"

If relevant, provide a helpful answer about ${apiName}. If not relevant, respond with "__NOT_RELEVANT__".`;

      const aiResponse = await getChatResponse(contextPrompt, userProfile);

      // Check if AI determined the question is not relevant
      if (aiResponse.includes('__NOT_RELEVANT__')) {
        return NextResponse.json({
          response: `I'm sorry, but I can only answer questions related to the **${apiName}** API. Could you please ask a question about ${apiName} features, integration, authentication, or usage?`,
          source: 'context_boundary',
          confidence: 1.0,
          apiName,
        });
      }

      return NextResponse.json({
        response: aiResponse,
        source: 'ai_generated',
        confidence: 0.8,
        apiName,
      });

    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Error in smart Q&A:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message }, 
      { status: 500 }
    );
  }
}