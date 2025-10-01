// Test utility for Q&A system
// Run this in your browser console or as a Node.js script to test Q&A functionality

/**
 * Test the Q&A API endpoint
 */
async function testQASystem() {
  const testCases = [
    {
      question: "How do I authenticate with Paystack?",
      apiSlug: "paystack",
      expectedSource: "qa_database" // if you have Q&A data
    },
    {
      question: "What is the meaning of life?", 
      apiSlug: "paystack",
      expectedSource: "ai_generated" // should fallback to AI
    },
    {
      question: "How do I process payments?",
      apiSlug: "flutterwave", 
      expectedSource: "qa_database" // if you have Q&A data
    }
  ];

  console.log("🧪 Testing Q&A System...\n");

  for (const testCase of testCases) {
    console.log(`📝 Question: "${testCase.question}"`);
    console.log(`🔖 API: ${testCase.apiSlug}`);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getHybridResponse',
          question: testCase.question,
          apiSlug: testCase.apiSlug,
          apiDoc: { name: testCase.apiSlug, slug: testCase.apiSlug }, // minimal doc
          userProfile: { 
            hasAnsweredOnboarding: true,
            projectType: "Web Application",
            techStack: ["JavaScript"],
            experience: "Beginner"
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      console.log(`✅ Source: ${result.source}`);
      console.log(`📊 Confidence: ${result.confidence}`);
      if (result.originalQuestion) {
        console.log(`🎯 Matched Q&A: "${result.originalQuestion}"`);
      }
      console.log(`💬 Response: ${result.response.substring(0, 100)}...`);
      
      // Check if result matches expectation
      if (result.source === testCase.expectedSource) {
        console.log("✅ Test PASSED");
      } else {
        console.log(`❌ Test FAILED - Expected: ${testCase.expectedSource}, Got: ${result.source}`);
      }
      
    } catch (error) {
      console.error(`❌ Error testing "${testCase.question}":`, error.message);
    }
    
    console.log("---\n");
  }
}

/**
 * Test individual Q&A retrieval
 */
async function testQARetrieval(apiSlug) {
  console.log(`📚 Testing Q&A retrieval for: ${apiSlug}`);
  
  try {
    // You would need to create a separate endpoint for this, or test the service directly
    console.log("ℹ️  This test requires direct access to the qaService.getApiQA function");
    console.log("ℹ️  Run this test on the server side or create a debug endpoint");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Export for use in Node.js or browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testQASystem, testQARetrieval };
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  console.log("🚀 Q&A Test Utility loaded. Run testQASystem() to start testing.");
}