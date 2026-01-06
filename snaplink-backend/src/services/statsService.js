import { query } from "../db/database.js";

export async function getTotalClicks(userId = null) {
  if (userId) {
    const result = await query(
      "SELECT COALESCE(SUM(clicks), 0)::int as total FROM links WHERE user_id = $1",
      [userId]
    );
    return result.rows[0].total;
  }
  const result = await query("SELECT COALESCE(SUM(clicks), 0)::int as total FROM links");
  return result.rows[0].total;
}

export async function getTotalLinks(userId = null) {
  if (userId) {
    const result = await query(
      "SELECT COUNT(*)::int as total FROM links WHERE user_id = $1",
      [userId]
    );
    return result.rows[0].total;
  }
  const result = await query("SELECT COUNT(*)::int as total FROM links");
  return result.rows[0].total;
}

export async function getClicksThisWeek(userId = null) {
  if (userId) {
    const result = await query(
      `SELECT COUNT(*)::int as count FROM clicks c
       JOIN links l ON c.link_id = l.id
       WHERE l.user_id = $1 AND c.clicked_at >= NOW() - INTERVAL '7 days'`,
      [userId]
    );
    return result.rows[0].count;
  }
  const result = await query(
    "SELECT COUNT(*)::int as count FROM clicks WHERE clicked_at >= NOW() - INTERVAL '7 days'"
  );
  return result.rows[0].count;
}

export async function getClicksLastWeek(userId = null) {
  if (userId) {
    const result = await query(
      `SELECT COUNT(*)::int as count FROM clicks c
       JOIN links l ON c.link_id = l.id
       WHERE l.user_id = $1 
       AND c.clicked_at >= NOW() - INTERVAL '14 days' 
       AND c.clicked_at < NOW() - INTERVAL '7 days'`,
      [userId]
    );
    return result.rows[0].count;
  }
  const result = await query(
    `SELECT COUNT(*)::int as count FROM clicks 
     WHERE clicked_at >= NOW() - INTERVAL '14 days' 
     AND clicked_at < NOW() - INTERVAL '7 days'`
  );
  return result.rows[0].count;
}

export async function getTopSource(userId = null) {
  if (userId) {
    const result = await query(
      `SELECT c.referrer, COUNT(*)::int as count FROM clicks c
       JOIN links l ON c.link_id = l.id
       WHERE l.user_id = $1 AND c.referrer IS NOT NULL 
       GROUP BY c.referrer 
       ORDER BY count DESC 
       LIMIT 1`,
      [userId]
    );
    return result.rows[0];
  }
  const result = await query(
    `SELECT referrer, COUNT(*)::int as count FROM clicks 
     WHERE referrer IS NOT NULL 
     GROUP BY referrer 
     ORDER BY count DESC 
     LIMIT 1`
  );
  return result.rows[0];
}
