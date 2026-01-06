import { nanoid } from "nanoid";
import db from "../db/database.js";

export function createLink(originalUrl, customSlug = null, expiresAt = null) {
  const slug = customSlug || nanoid(6);
  
  const stmt = db.prepare(
    "INSERT INTO links (slug, original_url, expires_at) VALUES (?, ?, ?)"
  );
  
  const result = stmt.run(slug, originalUrl, expiresAt);
  return { id: result.lastInsertRowid, slug, originalUrl, clicks: 0, expires_at: expiresAt };
}

export function getLinkBySlug(slug) {
  const stmt = db.prepare("SELECT * FROM links WHERE slug = ?");
  return stmt.get(slug);
}

export function getAllLinks(limit = 50, offset = 0) {
  const stmt = db.prepare(
    "SELECT * FROM links ORDER BY created_at DESC LIMIT ? OFFSET ?"
  );
  return stmt.all(limit, offset);
}

export function updateLink(id, updates) {
  const fields = [];
  const values = [];
  
  if (updates.slug) {
    fields.push("slug = ?");
    values.push(updates.slug);
  }
  if (updates.expiresAt !== undefined) {
    fields.push("expires_at = ?");
    values.push(updates.expiresAt);
  }
  
  if (fields.length === 0) return getLinkById(id);
  
  values.push(id);
  const stmt = db.prepare(`UPDATE links SET ${fields.join(", ")} WHERE id = ?`);
  stmt.run(...values);
  return getLinkById(id);
}

export function getLinkById(id) {
  const stmt = db.prepare("SELECT * FROM links WHERE id = ?");
  return stmt.get(id);
}

export function deleteLink(id) {
  db.prepare("DELETE FROM clicks WHERE link_id = ?").run(id);
  db.prepare("DELETE FROM links WHERE id = ?").run(id);
}

export function bulkDelete(ids) {
  const placeholders = ids.map(() => "?").join(",");
  db.prepare(`DELETE FROM clicks WHERE link_id IN (${placeholders})`).run(...ids);
  db.prepare(`DELETE FROM links WHERE id IN (${placeholders})`).run(...ids);
}

export function incrementClicks(id) {
  const stmt = db.prepare("UPDATE links SET clicks = clicks + 1 WHERE id = ?");
  return stmt.run(id);
}

export function slugExists(slug) {
  const stmt = db.prepare("SELECT 1 FROM links WHERE slug = ?");
  return !!stmt.get(slug);
}
