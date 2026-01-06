import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import linkRoutes from "./routes/linkRoutes.js";
import redirectRoute from "./routes/redirectRoute.js";
import statsRoutes from "./routes/statsRoutes.js";
import { initDb } from "./db/database.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { generalLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(generalLimiter);

// Initialize database
initDb();

// Routes
app.use("/api/links", linkRoutes);
app.use("/api/stats", statsRoutes);
app.use("/", redirectRoute);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
