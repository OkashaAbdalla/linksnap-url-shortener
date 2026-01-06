import { query } from "../db/database.js";

export async function recordClick(linkId, referrer, userAgent) {
  await query(
    "INSERT INTO clicks (link_id, referrer, user_agent) VALUES ($1, $2, $3)",
    [linkId, referrer, userAgent]
  );
}

export async function getClicksByLinkId(linkId, days = 30) {
  const result = await query(
    `SELECT DATE(clicked_at) as date, COUNT(*)::int as count 
     FROM clicks 
     WHERE link_id = $1 AND clicked_at >= NOW() - INTERVAL '1 day' * $2
     GROUP BY DATE(clicked_at)
     ORDER BY date`,
    [linkId, days]
  );
  return result.rows;
}

export async function getTopReferrers(linkId, limit = 5) {
  const result = await query(
    `SELECT referrer, COUNT(*)::int as count 
     FROM clicks 
     WHERE link_id = $1 AND referrer IS NOT NULL
     GROUP BY referrer
     ORDER BY count DESC
     LIMIT $2`,
    [linkId, limit]
  );
  return result.rows;
}
