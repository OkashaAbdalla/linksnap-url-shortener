import db from "../db/database.js";

export function recordClick(linkId, referrer, userAgent) {
  const stmt = db.prepare(
    "INSERT INTO clicks (link_id, referrer, user_agent) VALUES (?, ?, ?)"
  );
  return stmt.run(linkId, referrer, userAgent);
}

export function getClicksByLinkId(linkId, days = 30) {
  const stmt = db.prepare(`
    SELECT DATE(clicked_at) as date, COUNT(*) as count 
    FROM clicks 
    WHERE link_id = ? AND clicked_at >= datetime('now', '-' || ? || ' days')
    GROUP BY DATE(clicked_at)
    ORDER BY date
  `);
  return stmt.all(linkId, days);
}

export function getTopReferrers(linkId, limit = 5) {
  const stmt = db.prepare(`
    SELECT referrer, COUNT(*) as count 
    FROM clicks 
    WHERE link_id = ? AND referrer IS NOT NULL
    GROUP BY referrer
    ORDER BY count DESC
    LIMIT ?
  `);
  return stmt.all(linkId, limit);
}
