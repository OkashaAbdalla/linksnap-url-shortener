import xss from "xss";

export function sanitizeUrl(url) {
  // Basic XSS prevention
  const cleaned = xss(url);
  
  // Prevent javascript: URLs
  if (cleaned.toLowerCase().startsWith("javascript:")) {
    return null;
  }
  
  // Prevent data: URLs
  if (cleaned.toLowerCase().startsWith("data:")) {
    return null;
  }
  
  return cleaned;
}

export function sanitizeSlug(slug) {
  if (!slug) return null;
  return slug.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 20);
}
