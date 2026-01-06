import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../db/database.js";

const JWT_SECRET = process.env.JWT_SECRET || "snaplink-secret-change-in-production";
const JWT_EXPIRES_IN = "7d";

export async function createUser(email, password, name = null) {
  const hashedPassword = bcrypt.hashSync(password, 10);
  const result = await query(
    "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at",
    [email.toLowerCase(), hashedPassword]
  );
  return result.rows[0];
}

export async function getUserByEmail(email) {
  const result = await query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
  return result.rows[0];
}

export async function getUserById(id) {
  const result = await query(
    "SELECT id, email, created_at FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0];
}

export function verifyPassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

export function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function emailExists(email) {
  const result = await query("SELECT 1 FROM users WHERE email = $1", [email.toLowerCase()]);
  return result.rows.length > 0;
}
