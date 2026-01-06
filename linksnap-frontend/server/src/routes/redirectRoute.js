import { Router } from "express";
import * as linkService from "../services/linkService.js";
import * as clickService from "../services/clickService.js";

const router = Router();

// Redirect short URL to original
router.get("/:slug", (req, res) => {
  const { slug } = req.params;
  
  // Skip API routes
  if (slug === "api") {
    return res.status(404).json({ error: "Not found" });
  }
  
  const link = linkService.getLinkBySlug(slug);
  
  if (!link) {
    return res.status(404).json({ error: "Link not found" });
  }
  
  // Record click
  const referrer = req.get("Referer") || null;
  const userAgent = req.get("User-Agent") || null;
  clickService.recordClick(link.id, referrer, userAgent);
  linkService.incrementClicks(link.id);
  
  res.redirect(301, link.original_url);
});

export default router;
