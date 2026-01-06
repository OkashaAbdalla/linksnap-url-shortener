import db from "../db/database.js";

export function getTotalClicks() {
  const stmt = db.prepare("SELECT SUM(clicks) as total FROM links");
  return stmt.get()?.total || 0;
}

export function getTotalLinks() {
  const stmt = db.prepare("SELECT COUNT(*) as total FROM links");
  return stmt.get()?.total || 0;
}

export function getClicksThisWeek() {
  const stmt = db.prepare(`
    SELECT COUNT(*) as count FROM clicks 
    WHERE clicked_at >= datetime('now', '-7 days')
  `);
  return stmt.get()?.count || 0;
}

export function getClicksLastWeek() {
  const stmt = db.prepare(`
    SELECT COUNT(*) as count FROM clicks 
    WHERE clicked_at >= datetime('now', '-14 days') 
    AND clicked_at < datetime('now', '-7 days')
  `);
  return stmt.get()?.count || 0;
}

export function getTopSource() {
  const stmt = db.prepare(`
    SELECT referrer, COUNT(*) as count FROM clicks 
    WHERE referrer IS NOT NULL 
    GROUP BY referrer 
    ORDER BY count DESC 
    LIMIT 1
  `);
  return stmt.get();
}
