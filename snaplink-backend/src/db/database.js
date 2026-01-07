import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Define schemas
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password_hash: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

const linkSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  original_url: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  clicks: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  expires_at: { type: Date, default: null }
});

const clickSchema = new mongoose.Schema({
  link_id: { type: mongoose.Schema.Types.ObjectId, ref: "Link", required: true },
  clicked_at: { type: Date, default: Date.now },
  referrer: { type: String, default: null },
  user_agent: { type: String, default: null }
});

// Create indexes (only non-unique ones, unique indexes are auto-created)
linkSchema.index({ user_id: 1 });
linkSchema.index({ expires_at: 1 });
clickSchema.index({ link_id: 1 });
clickSchema.index({ clicked_at: 1 });

// Create models
export const User = mongoose.model("User", userSchema);
export const Link = mongoose.model("Link", linkSchema);
export const Click = mongoose.model("Click", clickSchema);

export async function initDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

export default mongoose;
