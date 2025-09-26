// lib/transform.js
export function richTextToPlainText(richTextObj) {
  if (!richTextObj?.content) return "";
  return richTextObj.content
    .map(item => item.content?.map(c => c.text || "").join(" "))
    .join("\n");
}

export function transformStoryblokData(stories) {
  return stories.map(story => ({
    objectID: story.uuid,  // required for Algolia
    name: story.content.name || "",
    slug: story.content.slug || "",
    base_url: story.content.base_url || "",
    description: richTextToPlainText(story.content.description),
    tags: story.content.tags || [],
    auth_method: story.content.auth_method || "",
    endpoints: (story.content.endpoints || []).map(ep => ({
      name: ep.name || "",
      path: ep.path || "",
      method: ep.method || ""
    }))
  }));
}
