import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    endpoints: {
      'smart-qa': '/api/smart-qa (POST)',
      'debug-qa': '/api/debug-qa (GET)',
      'fetch-qa': '/api/fetch-qa (GET)'
    }
  });
}