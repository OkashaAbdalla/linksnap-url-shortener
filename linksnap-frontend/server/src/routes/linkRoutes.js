import { Router } from "express";
import * as linkService from "../services/linkService.js";
import { validateUrl } from "../utils/validators.js";
import { sanitizeUrl, sanitizeSlug } from "../utils/sanitize.js";
import { createLinkLimiter } from "../middleware/rateLimiter.js";
import { ValidationError, ConflictError } from "../middleware/errorHandler.js";

const router = Router();

// Create short link
router.post("/", createLinkLimiter, (req, res, next) => {
  try {
    const { url, customSlug, expiresAt } = req.body;
    
    const sanitizedUrl = sanitizeUrl(url);
    if (!sanitizedUrl || !validateUrl(sanitizedUrl)) {
      throw new ValidationError("Invalid URL");
    }
    
    const slug = sanitizeSlug(customSlug);
    if (slug && linkService.slugExists(slug)) {
      throw new ConflictError("Slug already exists");
    }
    
    const link = linkService.createLink(sanitizedUrl, slug, expiresAt);
    res.status(201).json(link);
  } catch (error) {
    next(error);
  }
});

// Get all links
router.get("/", (req, res) => {
  const { limit = 50, offset = 0 } = req.query;
  const links = linkService.getAllLinks(Number(limit), Number(offset));
  res.json(links);
});

// Update link
router.patch("/:id", (req, res, next) => {
  try {
    const { id } = req.params;
    const { slug, expiresAt } = req.body;
    const link = linkService.updateLink(id, { slug: sanitizeSlug(slug), expiresAt });
    res.json(link);
  } catch (error) {
    next(error);
  }
});

// Delete link
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  linkService.deleteLink(id);
  res.json({ success: true });
});

// Bulk delete
router.post("/bulk-delete", (req, res) => {
  const { ids } = req.body;
  linkService.bulkDelete(ids);
  res.json({ success: true, deleted: ids.length });
});

// Export links as JSON
router.get("/export", (req, res) => {
  const links = linkService.getAllLinks(1000, 0);
  res.json(links);
});

export default router;
