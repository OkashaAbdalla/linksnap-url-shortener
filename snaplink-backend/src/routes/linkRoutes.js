import { Router } from "express";
import * as linkService from "../services/linkService.js";
import { validateUrl } from "../utils/validators.js";
import { sanitizeUrl, sanitizeSlug } from "../utils/sanitize.js";
import { createLinkLimiter } from "../middleware/rateLimiter.js";
import { ValidationError, ConflictError, NotFoundError } from "../middleware/errorHandler.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create short link
router.post("/", createLinkLimiter, async (req, res, next) => {
  try {
    const { url, customSlug, expiresAt, password, qrStyle } = req.body;
    
    const sanitizedUrl = sanitizeUrl(url);
    if (!sanitizedUrl || !validateUrl(sanitizedUrl)) {
      throw new ValidationError("Invalid URL");
    }
    
    const slug = sanitizeSlug(customSlug);
    if (slug && await linkService.slugExists(slug)) {
      throw new ConflictError("Slug already exists");
    }
    
    const link = await linkService.createLink(sanitizedUrl, slug, expiresAt, req.user.id, password, qrStyle);
    res.status(201).json(link);
  } catch (error) {
    next(error);
  }
});

// Get user's links
router.get("/", async (req, res, next) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const links = await linkService.getLinksByUserId(req.user.id, Number(limit), Number(offset));
    res.json(links);
  } catch (error) {
    next(error);
  }
});

// Update link (only owner)
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { slug, expiresAt, originalUrl, password, qrStyle } = req.body;
    
    if (!await linkService.isLinkOwner(id, req.user.id)) {
      throw new NotFoundError("Link not found");
    }
    
    const updates = {};
    if (slug !== undefined) updates.slug = sanitizeSlug(slug);
    if (expiresAt !== undefined) updates.expiresAt = expiresAt;
    if (originalUrl !== undefined) updates.originalUrl = sanitizeUrl(originalUrl);
    if (password !== undefined) updates.password = password;
    if (qrStyle !== undefined) updates.qrStyle = qrStyle;
    
    const link = await linkService.updateLink(id, updates, req.user.id);
    res.json(link);
  } catch (error) {
    next(error);
  }
});

// Delete link (only owner)
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!await linkService.isLinkOwner(id, req.user.id)) {
      throw new NotFoundError("Link not found");
    }
    
    await linkService.deleteLink(id, req.user.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Bulk delete (only owner's links)
router.post("/bulk-delete", async (req, res, next) => {
  try {
    const { ids } = req.body;
    await linkService.bulkDelete(ids, req.user.id);
    res.json({ success: true, deleted: ids.length });
  } catch (error) {
    next(error);
  }
});

// Export user's links as JSON
router.get("/export", async (req, res, next) => {
  try {
    const links = await linkService.getLinksByUserId(req.user.id, 1000, 0);
    res.json(links);
  } catch (error) {
    next(error);
  }
});

export default router;
