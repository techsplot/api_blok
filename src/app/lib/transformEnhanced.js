// Enhanced Storyblok Data Transformation for Meta-Grade API Documentation
// This provides comprehensive data transformation with backward compatibility

// Helper function to convert Storyblok rich text to plain text
function richTextToPlainText(richText) {
  if (!richText) return "";
  if (typeof richText === "string") return richText;
  if (richText.type === "doc" && richText.content) {
    return richText.content.map(node => {
      if (node.type === "paragraph" && node.content) {
        return node.content.map(textNode => textNode.text || "").join("");
      }
      return "";
    }).join(" ");
  }
  return "";
}

// Helper function to normalize method strings (enhanced)
function normalizeMethod(method) {
  if (!method) return "GET";
  if (Array.isArray(method)) {
    const firstMethod = method[0] || "GET";
    return firstMethod.toString().toUpperCase();
  }
  const m = method.toString().toUpperCase();
  return ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(m) ? m : 'GET';
}

// Helper function to normalize tags
function normalizeTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags.map(tag => {
      if (typeof tag === 'string') return tag;
      if (tag && tag.name) return tag.name;
      if (tag && tag.slug) return tag.slug;
      return '';
    }).filter(Boolean);
  }
  return [];
}

// Helper function to transform parameters from Storyblok
function transformParameters(parameters) {
  if (!Array.isArray(parameters)) return [];
  return parameters.map(param => ({
    name: param.name || '',
    type: param.type || 'string',
    required: param.required || false,
    description: param.description || '',
    example: param.example_value || param.example || '',
    validation: param.validation || null
  }));
}

// Helper function to transform code examples
function transformCodeExamples(codeExamples) {
  if (!Array.isArray(codeExamples)) return {};
  const examples = {};
  codeExamples.forEach(example => {
    if (example.language && example.code) {
      examples[example.language] = {
        title: example.title || `${example.language} Example`,
        code: example.code,
        description: example.description || ''
      };
    }
  });
  return examples;
}

// Helper function to transform error responses
function transformErrorResponses(errorResponses) {
  if (!Array.isArray(errorResponses)) return [];
  return errorResponses.map(error => ({
    statusCode: error.status_code || 400,
    description: error.description || '',
    example: error.example || '',
    solution: error.solution || ''
  }));
}

// Helper function to transform use cases
function transformUseCases(useCases) {
  if (!Array.isArray(useCases)) return [];
  return useCases.map(useCase => ({
    title: useCase.title || '',
    description: useCase.description || '',
    codeExample: useCase.code_example || '',
    difficulty: useCase.difficulty || 'intermediate'
  }));
}

// Helper function to transform SDKs/libraries
function transformSDKs(sdks) {
  if (!Array.isArray(sdks)) return [];
  return sdks.map(sdk => ({
    name: sdk.name || '',
    language: sdk.language || '',
    url: sdk.url || '',
    installCommand: sdk.install_command || ''
  }));
}

// Enhanced transform function for comprehensive Storyblok data
export function transformStoryblokDataEnhanced(stories) {
  return stories.map(story => {
    const c = story.content || {};
    const tags = normalizeTags(c.tags);
    
    // Enhanced endpoints with parameters and responses
    const endpoints = (c.endpoints || []).map(ep => ({
      name: ep?.name || "",
      path: ep?.path || "",
      method: normalizeMethod(ep?.method),
      description: ep?.description || "",
      parameters: transformParameters(ep?.parameters || []),
      responseExample: ep?.response_example || "",
      errorResponses: transformErrorResponses(ep?.error_responses || []),
      rateLimit: ep?.rate_limit || null,
      isDeprecated: ep?.is_deprecated || false
    }));

    // Core transformation with enhanced fields
    const transformed = {
      // Core identifiers
      objectID: story.uuid, // required for Algolia
      id: story.uuid,
      name: c.name || story.name || "",
      slug: c.slug || story.slug || "",
      
      // Content
      description: richTextToPlainText(c.description),
      shortDescription: c.short_description || "",
      
      // Technical details
      base_url: c.base_url || "",
      documentation_url: c.documentation_url || c.base_url || "",
      endpoints,
      version: c.version || "1.0",
      
      // Authentication
      auth_method: c.auth_method || "none",
      authRequired: c.auth_method && c.auth_method.toLowerCase() !== 'none',
      authDescription: richTextToPlainText(c.auth_description),
      authExample: c.auth_example || "",
      
      // Developer experience
      difficulty: c.difficulty || "intermediate",
      pricing: c.pricing || "unknown",
      rateLimit: c.rate_limit || "",
      status: c.status || "stable",
      
      // Categorization
      category: Array.isArray(tags) && tags.length ? tags[0] : c.category || "general",
      tags,
      
      // Rich content
      codeExamples: transformCodeExamples(c.code_examples || []),
      useCases: transformUseCases(c.use_cases || []),
      sdks: transformSDKs(c.sdks || []),
      
      // Media
      image: c.logo?.filename || "",
      imageAlt: c.logo?.meta_data?.alt || c.logo?.alt || "",
      
      // Metadata
      popularityScore: c.popularity_score || 0,
      communityRating: c.community_rating || 0,
      updatedAt: c.updated_at || story.published_at || story.created_at,
      
      // Security
      securityNotes: richTextToPlainText(c.security_notes),
      
      // Backward compatibility fields
      endpoint: endpoints.length > 0 ? endpoints[0].path : "",
      method: endpoints.length > 0 ? endpoints[0].method : "GET",
      provider: (() => {
        try {
          return c.base_url ? new URL(c.base_url).hostname : undefined;
        } catch {
          return undefined;
        }
      })()
    };

    return transformed;
  });
}

// Original transform function (backward compatibility)
export function transformStoryblokData(stories) {
  return stories.map(story => {
    const c = story.content || {};
    const tags = normalizeTags(c.tags);
    const endpoints = (c.endpoints || []).map(ep => ({
      name: ep?.name || "",
      path: ep?.path || "",
      method: normalizeMethod(ep?.method)
    }));

    return {
      objectID: story.uuid, // required for Algolia
      name: c.name || story.name || "",
      slug: c.slug || story.slug || "",
      base_url: c.base_url || "",
      description: richTextToPlainText(c.description),
      tags,
      auth_method: c.auth_method || "",
      image: c.logo?.filename || "",
      image_alt: c.logo?.meta_data?.alt || c.logo?.alt || "",
      endpoints
    };
  });
}

// Export enhanced version as default for new implementations
export default transformStoryblokDataEnhanced;