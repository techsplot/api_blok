// lib/transform.js

// Recursively extract visible text from a Storyblok rich text field
export function richTextToPlainText(richTextObj) {
  if (!richTextObj) return "";

  function walk(node) {
    if (!node) return [];
    const results = [];
    if (Array.isArray(node)) {
      node.forEach(n => results.push(...walk(n)));
      return results;
    }
    // Text node
    if (typeof node.text === 'string') {
      results.push(node.text);
    }
    // Children
    if (Array.isArray(node.content)) {
      node.content.forEach(child => results.push(...walk(child)));
    }
    return results;
  }

  const pieces = walk(richTextObj?.content || []);
  return pieces.join(' ').replace(/\s+/g, ' ').trim();
}

function normalizeTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') {
    // split comma-separated, fallback to single token
    const parts = tags.split(',').map(s => s.trim()).filter(Boolean);
    return parts.length ? parts : [tags.trim()].filter(Boolean);
  }
  return [];
}

function normalizeMethod(method) {
  // Storyblok schema shows an array for method, e.g., ["post"]
  if (!method) return "";
  if (Array.isArray(method)) return (method[0] || "").toString().toUpperCase();
  return method.toString().toUpperCase();
}

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
