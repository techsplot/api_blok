import { getStoryblokApi } from './storyblok';
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Convert Storyblok rich text to plain text
 */
function richTextToPlainText(richTextObj) {
  if (!richTextObj || !richTextObj.content) return "";

  function extractText(node) {
    if (!node) return "";
    
    if (typeof node === 'string') return node;
    
    if (Array.isArray(node)) {
      return node.map(extractText).join("");
    }
    
    if (node.text) {
      return node.text;
    }
    
    if (node.content && Array.isArray(node.content)) {
      return node.content.map(extractText).join("");
    }
    
    return "";
  }

  return extractText(richTextObj.content).replace(/\s+/g, ' ').trim();
}

/**
 * Extract Q&A items from your Storyblok content structure
 */
function extractQAFromStory(story) {
  const qaItems = [];
  
  if (!story.content || !story.content.question || !Array.isArray(story.content.question)) {
    return qaItems;
  }

  story.content.question.forEach((qnaItem, index) => {
    if (qnaItem.component === 'qna_item' && qnaItem.question && qnaItem.answer) {
      qaItems.push({
        id: `${story.id}_${index}`,
        question: qnaItem.question,
        answer: richTextToPlainText(qnaItem.answer),
        tags: qnaItem.tags ? qnaItem.tags.split(',').map(tag => tag.trim()) : [],
        category: qnaItem.category || story.content.tags?.[0] || 'general',
        apiSlug: story.slug,
        storyId: story.id,
        examples: qnaItem.examples || [],
        originalAnswer: qnaItem.answer, // Keep original for code examples
      });
    }
  });

  return qaItems;
}

/**
 * Fetch Q&A data for a specific API from Storyblok
 * @param {string} apiSlug - The API slug/identifier (e.g., 'paystack', 'flutterwave')
 * @returns {Promise<Array>} Array of Q&A objects
 */
export async function getApiQA(apiSlug) {
  try {
    const storyblokApi = getStoryblokApi();
    
    // Look for stories that match the API slug in the api_ai folder
    const { data } = await storyblokApi.get('cdn/stories', {
      starts_with: 'api_ai',
      version: 'published',
      per_page: 100,
    });

    if (!data || !data.stories || data.stories.length === 0) {
      console.log('No Q&A stories found in api_ai folder');
      return [];
    }

    // Find the story that matches our API slug
    const matchingStory = data.stories.find(story => {
      // Check if the story slug contains the API slug
      return story.slug.toLowerCase().includes(apiSlug.toLowerCase()) ||
             story.name.toLowerCase().includes(apiSlug.toLowerCase());
    });

    if (!matchingStory) {
      console.log(`No Q&A data found for API: ${apiSlug}`);
      return [];
    }

    console.log(`Found Q&A story for ${apiSlug}:`, matchingStory.name);
    
    // Extract Q&A items from the story
    const qaItems = extractQAFromStory(matchingStory);
    
    console.log(`Extracted ${qaItems.length} Q&A items for ${apiSlug}`);
    
    return qaItems;
  } catch (error) {
    console.error('Error fetching Q&A data from Storyblok:', error);
    return [];
  }
}

/**
 * Format answer with code examples from Storyblok
 */
function formatAnswerWithExamples(qaItem) {
  let formattedAnswer = qaItem.answer;
  
  if (qaItem.examples && qaItem.examples.length > 0) {
    formattedAnswer += "\n\n**Examples:**\n\n";
    
    qaItem.examples.forEach((example, index) => {
      if (example.example_title) {
        formattedAnswer += `**${example.example_title}:**\n`;
      }
      
      if (example.example_code && example.example_code.content) {
        const codeText = richTextToPlainText(example.example_code);
        if (codeText.trim()) {
          // Extract language from the code block attributes if available
          const codeBlock = example.example_code.content.find(node => node.type === 'code_block');
          const language = codeBlock?.attrs?.class?.replace('language-', '') || 'javascript';
          
          formattedAnswer += `\`\`\`${language}\n${codeText}\n\`\`\`\n\n`;
        }
      }
    });
  }
  
  return formattedAnswer;
}

/**
 * Find the best matching Q&A using AI semantic similarity
 * @param {string} userQuestion - The user's question
 * @param {Array} qaData - Array of Q&A objects
 * @param {number} threshold - Similarity threshold (0-1)
 * @returns {Promise<Object|null>} Best matching Q&A or null
 */
export async function findBestMatchingQA(userQuestion, qaData, threshold = 0.75) {
  if (!qaData || qaData.length === 0) {
    return null;
  }

  try {
    // Create a simpler prompt for better matching
    const qaList = qaData.map((qa, index) => 
      `${index + 1}. "${qa.question}" (Tags: ${qa.tags.join(', ')})`
    ).join('\n');

    const prompt = `You are helping match user questions to a Q&A database. 
Find the most semantically similar question from the list below.

Consider these factors:
- Semantic meaning (not just exact words)
- Intent and context
- Topic similarity
- Tags relevance

Q&A Database:
${qaList}

User Question: "${userQuestion}"

Return the index number (1-${qaData.length}) of the best match, or 0 if no question is sufficiently similar.
Only return a match if you're confident it addresses the same topic/intent.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchIndex: {
              type: Type.INTEGER,
              description: 'Index of the best matching Q&A (1-based), or 0 if no good match',
            },
            confidence: {
              type: Type.NUMBER,
              description: 'Confidence score between 0 and 1',
            },
            reasoning: {
              type: Type.STRING,
              description: 'Brief explanation of the match',
            },
          },
          required: ['matchIndex', 'confidence'],
        },
        temperature: 0.1,
      }
    });

    const result = JSON.parse(response.text);
    
    console.log(`Q&A Matching: Index=${result.matchIndex}, Confidence=${result.confidence}, Reasoning=${result.reasoning}`);
    
    if (result.matchIndex > 0 && result.matchIndex <= qaData.length && result.confidence >= threshold) {
      const matchedQA = qaData[result.matchIndex - 1];
      return {
        ...matchedQA,
        confidence: result.confidence,
        reasoning: result.reasoning,
        formattedAnswer: formatAnswerWithExamples(matchedQA),
      };
    }

    return null;
  } catch (error) {
    console.error('Error finding matching Q&A:', error);
    return null;
  }
}

/**
 * Get response using hybrid approach: Q&A first, then AI fallback
 * @param {string} userQuestion - The user's question
 * @param {string} apiSlug - The API slug/identifier
 * @param {Object} apiDoc - The API documentation
 * @param {Object} userProfile - User profile for AI personalization
 * @returns {Promise<Object>} Response object with source information
 */
export async function getHybridResponse(userQuestion, apiSlug, apiDoc, userProfile) {
  try {
    // Step 1: Try to find a matching Q&A
    const qaData = await getApiQA(apiSlug);
    const matchedQA = await findBestMatchingQA(userQuestion, qaData);

    if (matchedQA) {
      // Return pre-stored answer with source info and formatted examples
      return {
        response: matchedQA.formattedAnswer || matchedQA.answer,
        source: 'qa_database',
        confidence: matchedQA.confidence,
        reasoning: matchedQA.reasoning,
        originalQuestion: matchedQA.question,
        qaId: matchedQA.id,
        category: matchedQA.category,
        tags: matchedQA.tags,
      };
    }

    // Step 2: Fallback to AI if no good match found
    console.log('No matching Q&A found, falling back to AI...');
    
    // Import getChatResponse to avoid circular dependency
    const { getChatResponse } = await import('./geminiService');
    
    const docString = JSON.stringify(apiDoc, null, 2);
    const prompt = `
You are an AI that answers questions about the following API documentation.
Provide helpful, accurate responses based on the documentation.

API DOCUMENTATION:
\`\`\`json
${docString}
\`\`\`

USER QUESTION:
${userQuestion}
    `;

    const aiResponse = await getChatResponse(prompt, userProfile);
    
    return {
      response: aiResponse,
      source: 'ai_generated',
      confidence: 0.8, // Default confidence for AI responses
    };

  } catch (error) {
    console.error('Error in hybrid response:', error);
    throw new Error('Failed to generate response');
  }
}