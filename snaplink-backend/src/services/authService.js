import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../db/database.js";

const JWT_SECRET = process.env.JWT_SECRET || "snaplink-secret-change-in-production";
const JWT_EXPIRES_IN = "7d";

export async function createUser(email, password, name = null) {
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = await User.create({
    email: email.toLowerCase(),
    password_hash: hashedPassword
  });
  return { id: user._id, email: user.email, created_at: user.created_at };
}

export async function getUserByEmail(email) {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return null;
  return { id: user._id, email: user.email, password_hash: user.password_hash, created_at: user.created_at };
}

export async function getUserById(id) {
  const user = await User.findById(id).select("-password_hash");
  if (!user) return null;
  return { id: user._id, email: user.email, created_at: user.created_at };
}

export function verifyPassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

export function generateToken(userId) {
  return jwt.sign({ userId: userId.toString() }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function emailExists(email) {
  const user = await User.findOne({ email: email.toLowerCase() });
  return !!user;
}
