import { nanoid } from "nanoid";
import { query } from "../db/database.js";

export async function createLink(originalUrl, customSlug = null, expiresAt = null, userId = null) {
  const slug = customSlug || nanoid(6);
  const result = await query(
    `INSERT INTO links (slug, original_url, expires_at, user_id) 
     VALUES ($1, $2, $3, $4) 
     RETURNING id, slug, original_url, clicks, created_at, expires_at, user_id`,
    [slug, originalUrl, expiresAt, userId]
  );
  return result.rows[0];
}

export async function getLinkBySlug(slug) {
  const result = await query("SELECT * FROM links WHERE slug = $1", [slug]);
  return result.rows[0];
}

export async function getAllLinks(limit = 50, offset = 0) {
  const result = await query(
    "SELECT * FROM links ORDER BY created_at DESC LIMIT $1 OFFSET $2",
    [limit, offset]
  );
  return result.rows;
}

export async function getLinksByUserId(userId, limit = 50, offset = 0) {
  const result = await query(
    "SELECT * FROM links WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
    [userId, limit, offset]
  );
  return result.rows;
}

export async function updateLink(id, updates, userId = null) {
  const fields = [];
  const values = [];
  let paramIndex = 1;

  if (updates.slug) {
    fields.push(`slug = $${paramIndex++}`);
    values.push(updates.slug);
  }
  if (updates.expiresAt !== undefined) {
    fields.push(`expires_at = $${paramIndex++}`);
    values.push(updates.expiresAt);
  }

  if (fields.length === 0) return getLinkById(id);

  values.push(id);
  let sql = `UPDATE links SET ${fields.join(", ")} WHERE id = $${paramIndex++}`;
  
  if (userId) {
    values.push(userId);
    sql += ` AND user_id = $${paramIndex}`;
  }
  
  sql += " RETURNING *";
  const result = await query(sql, values);
  return result.rows[0];
}

export async function getLinkById(id) {
  const result = await query("SELECT * FROM links WHERE id = $1", [id]);
  return result.rows[0];
}

export async function deleteLink(id, userId = null) {
  if (userId) {
    const link = await getLinkById(id);
    if (!link || link.user_id !== userId) return false;
  }
  await query("DELETE FROM clicks WHERE link_id = $1", [id]);
  await query("DELETE FROM links WHERE id = $1", [id]);
  return true;
}

export async function bulkDelete(ids, userId = null) {
  if (ids.length === 0) return;
  
  const placeholders = ids.map((_, i) => `$${i + 1}`).join(",");
  
  if (userId) {
    const userIdParam = ids.length + 1;
    await query(
      `DELETE FROM clicks WHERE link_id IN (SELECT id FROM links WHERE id IN (${placeholders}) AND user_id = $${userIdParam})`,
      [...ids, userId]
    );
    await query(
      `DELETE FROM links WHERE id IN (${placeholders}) AND user_id = $${userIdParam}`,
      [...ids, userId]
    );
  } else {
    await query(`DELETE FROM clicks WHERE link_id IN (${placeholders})`, ids);
    await query(`DELETE FROM links WHERE id IN (${placeholders})`, ids);
  }
}

export async function incrementClicks(id) {
  await query("UPDATE links SET clicks = clicks + 1 WHERE id = $1", [id]);
}

export async function slugExists(slug) {
  const result = await query("SELECT 1 FROM links WHERE slug = $1", [slug]);
  return result.rows.length > 0;
}

export async function isLinkOwner(linkId, userId) {
  const result = await query("SELECT 1 FROM links WHERE id = $1 AND user_id = $2", [linkId, userId]);
  return result.rows.length > 0;
}
