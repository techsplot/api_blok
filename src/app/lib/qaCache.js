// Pre-load and cache Q&A data for faster access
import { getStoryblokApi } from './storyblok';

// Cache to store Q&A data
let qaCache = new Map();
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Convert Storyblok rich text to plain text
 */
function richTextToPlainText(richTextObj) {
  if (!richTextObj || !richTextObj.content) return "";

  function extractText(node) {
    if (!node) return "";
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(extractText).join("");
    if (node.text) return node.text;
    if (node.content && Array.isArray(node.content)) {
      return node.content.map(extractText).join("");
    }
    return "";
  }

  return extractText(richTextObj.content).replace(/\s+/g, ' ').trim();
}

/**
 * Extract and format code examples
 */
function formatCodeExamples(examples) {
  if (!examples || !Array.isArray(examples)) return "";

  return examples.map(example => {
    let formatted = "";
    if (example.example_title) {
      formatted += `**${example.example_title}:**\n`;
    }
    
    if (example.example_code && example.example_code.content) {
      const codeText = richTextToPlainText(example.example_code);
      if (codeText.trim()) {
        const codeBlock = example.example_code.content.find(node => node.type === 'code_block');
        const language = codeBlock?.attrs?.class?.replace('language-', '') || 'javascript';
        formatted += `\`\`\`${language}\n${codeText}\n\`\`\`\n\n`;
      }
    }
    return formatted;
  }).join("");
}

/**
 * Extract Q&A items from story content
 */
function extractQAFromStory(story) {
  const qaItems = [];
  
  console.log(`🔍 Extracting Q&A from story: ${story.slug}`, story.content);
  
  if (!story.content || !story.content.question || !Array.isArray(story.content.question)) {
    console.log(`⚠️ Story ${story.slug} missing question array`);
    return qaItems;
  }

  console.log(`📝 Found ${story.content.question.length} question items in ${story.slug}`);

  story.content.question.forEach((qnaItem, index) => {
    console.log(`📋 Processing Q&A item ${index}:`, qnaItem.component, qnaItem.question);
    
    if (qnaItem.component === 'qna_item' && qnaItem.question && qnaItem.answer) {
      const plainAnswer = richTextToPlainText(qnaItem.answer);
      const codeExamples = formatCodeExamples(qnaItem.examples);
      
      const qaItem = {
        id: `${story.id}_${index}`,
        question: qnaItem.question,
        answer: plainAnswer,
        fullAnswer: plainAnswer + (codeExamples ? "\n\n" + codeExamples : ""),
        tags: qnaItem.tags ? qnaItem.tags.split(',').map(tag => tag.trim()) : [],
        category: qnaItem.category || story.content.tags?.[0] || 'general',
        apiSlug: story.slug.replace(/_ai$/, '').replace(/_api_ai$/, ''), // Remove _ai or _api_ai suffix
        apiName: story.name.replace(/_ai$/i, '').replace(/_AI$/i, ''), // Remove _ai or _AI suffix
      };
      
      qaItems.push(qaItem);
      console.log(`✅ Added Q&A item: ${qaItem.question}`);
    } else {
      console.log(`❌ Skipping invalid Q&A item ${index}: component=${qnaItem.component}, hasQuestion=${!!qnaItem.question}, hasAnswer=${!!qnaItem.answer}`);
    }
  });

  console.log(`📊 Total Q&A items extracted from ${story.slug}: ${qaItems.length}`);
  return qaItems;
}

/**
 * Load all Q&A data and cache it
 */
export async function loadAllQAData() {
  // Check cache first
  if (qaCache.size > 0 && cacheTimestamp && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
    console.log('📚 Using cached Q&A data');
    return qaCache;
  }

  try {
    console.log('🔄 Loading fresh Q&A data from Storyblok...');
    const storyblokApi = getStoryblokApi();
    
    const { data } = await storyblokApi.get('cdn/stories', {
      starts_with: 'api_ai',
      version: 'published',
      per_page: 100,
    });

    qaCache.clear();

    if (data && data.stories) {
      data.stories.forEach(story => {
        const qaItems = extractQAFromStory(story);
        if (qaItems.length > 0) {
          const apiSlug = story.slug.replace(/_ai$/, '').replace(/_api_ai$/, '');
          console.log(`📚 Found ${qaItems.length} Q&A items for API: ${apiSlug} (from story: ${story.slug})`);
          qaCache.set(apiSlug, qaItems);
        } else {
          console.log(`⚠️ No Q&A items found in story: ${story.slug}`);
        }
      });
    }

    cacheTimestamp = Date.now();
    console.log(`✅ Loaded Q&A for ${qaCache.size} APIs:`, Array.from(qaCache.keys()));
    
    return qaCache;
  } catch (error) {
    console.error('❌ Error loading Q&A data:', error);
    return qaCache; // Return existing cache if available
  }
}

/**
 * Get Q&A data for specific API (from cache)
 */
export async function getQAForAPI(apiSlug) {
  const allQA = await loadAllQAData();
  return allQA.get(apiSlug) || [];
}

/**
 * Search for specific Q&A by ID
 */
export async function getQAById(qaId) {
  const allQA = await loadAllQAData();
  
  for (const [apiSlug, qaItems] of allQA) {
    const found = qaItems.find(qa => qa.id === qaId);
    if (found) return found;
  }
  
  return null;
}