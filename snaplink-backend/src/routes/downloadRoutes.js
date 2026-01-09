import { Router } from "express";
import * as linkService from "../services/linkService.js";
import * as mediaDownloadService from "../services/mediaDownloadService.js";
import { authenticate } from "../middleware/auth.js";
import { NotFoundError, ValidationError } from "../middleware/errorHandler.js";

const router = Router();

// Check if a link is downloadable (requires auth)
router.get("/check/:linkId", authenticate, async (req, res, next) => {
  try {
    const { linkId } = req.params;
    
    const link = await linkService.getLinkById(linkId);
    if (!link) {
      throw new NotFoundError("Link not found");
    }
    
    // Check if user owns the link
    if (link.user_id?.toString() !== req.user.id.toString()) {
      throw new NotFoundError("Link not found");
    }
    
    const mediaInfo = await mediaDownloadService.getMediaInfo(link.original_url);
    
    res.json({
      downloadable: mediaInfo.downloadable,
      platform: mediaInfo.platform,
      type: mediaInfo.type,
      requiresExternal: mediaInfo.requiresExternal || false,
      instructions: mediaInfo.requiresExternal 
        ? mediaDownloadService.getDownloadInstructions(mediaInfo.platform)
        : null
    });
  } catch (error) {
    next(error);
  }
});

// Download media from a link (requires auth)
router.get("/media/:linkId", authenticate, async (req, res, next) => {
  try {
    const { linkId } = req.params;
    
    const link = await linkService.getLinkById(linkId);
    if (!link) {
      throw new NotFoundError("Link not found");
    }
    
    // Check if user owns the link
    if (link.user_id?.toString() !== req.user.id.toString()) {
      throw new NotFoundError("Link not found");
    }
    
    const mediaInfo = await mediaDownloadService.getMediaInfo(link.original_url);
    
    if (!mediaInfo.downloadable) {
      throw new ValidationError("This link does not contain downloadable media");
    }
    
    // Only support direct media URLs for now
    if (mediaInfo.platform !== "direct") {
      return res.json({
        success: false,
        requiresExternal: true,
        platform: mediaInfo.platform,
        instructions: mediaDownloadService.getDownloadInstructions(mediaInfo.platform),
        originalUrl: link.original_url
      });
    }
    
    // Download direct media
    const download = await mediaDownloadService.downloadDirectMedia(link.original_url);
    
    res.setHeader("Content-Type", download.contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${download.filename}"`);
    if (download.contentLength) {
      res.setHeader("Content-Length", download.contentLength);
    }
    
    download.stream.pipe(res);
  } catch (error) {
    next(error);
  }
});

export default router;
