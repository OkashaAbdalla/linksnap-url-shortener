import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, "../../data/snaplink.db"));

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      original_url TEXT NOT NULL,
      clicks INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME
    );
    
    CREATE TABLE IF NOT EXISTS clicks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      link_id INTEGER NOT NULL,
      clicked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      referrer TEXT,
      user_agent TEXT,
      FOREIGN KEY (link_id) REFERENCES links(id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_slug ON links(slug);
    CREATE INDEX IF NOT EXISTS idx_link_clicks ON clicks(link_id);
    CREATE INDEX IF NOT EXISTS idx_expires ON links(expires_at);
  `);
  console.log("Database initialized");
}

export default db;
