import { Router } from "express";
import * as linkService from "../services/linkService.js";
import * as clickService from "../services/clickService.js";

const router = Router();

// Redirect short URL to original
router.get("/:slug", async (req, res, next) => {
  try {
    const { slug } = req.params;
    
    // Skip API routes
    if (slug === "api") {
      return res.status(404).json({ error: "Not found" });
    }
    
    const link = await linkService.getLinkBySlug(slug);
    
    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }
    
    // Check if link has expired
    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      return res.status(410).json({ error: "Link has expired" });
    }
    
    // Record click
    const referrer = req.get("Referer") || null;
    const userAgent = req.get("User-Agent") || null;
    await clickService.recordClick(link.id, referrer, userAgent);
    await linkService.incrementClicks(link.id);
    
    res.redirect(301, link.original_url);
  } catch (error) {
    next(error);
  }
});

export default router;
