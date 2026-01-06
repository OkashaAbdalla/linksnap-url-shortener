export function validateUrl(url) {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export function validateSlug(slug) {
  return /^[a-zA-Z0-9_-]{3,20}$/.test(slug);
}
