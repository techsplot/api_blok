// src/app/api/chat/page.js
import { NextResponse } from 'next/server';
import { getChatResponse, isQuestionRelevant } from '../../lib/geminiService';
import { getHybridResponse } from '../../lib/qaService';

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, question, apiDoc, prompt, userProfile, apiSlug } = body;

    if (action === 'checkRelevance') {
      if (!question) {
        return NextResponse.json({ error: 'Missing question for relevance check' }, { status: 400 });
      }
      const relevant = await isQuestionRelevant(question, apiDoc);
      return NextResponse.json({ relevant });

    } else if (action === 'getChatResponse') {
      if (!prompt || !userProfile) {
        return NextResponse.json({ error: 'Missing prompt or userProfile for chat response' }, { status: 400 });
      }
      const responseText = await getChatResponse(prompt, userProfile);
      return NextResponse.json({ response: responseText });

    } else if (action === 'getHybridResponse') {
      if (!question || !apiSlug || !apiDoc || !userProfile) {
        return NextResponse.json({ 
          error: 'Missing required fields: question, apiSlug, apiDoc, or userProfile' 
        }, { status: 400 });
      }
      
      const hybridResult = await getHybridResponse(question, apiSlug, apiDoc, userProfile);
      return NextResponse.json(hybridResult);

    } else {
      return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });
    }
  } catch (error) {
    console.error('/api/chat Error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
