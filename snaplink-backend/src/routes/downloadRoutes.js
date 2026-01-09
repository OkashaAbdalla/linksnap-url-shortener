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
      title: mediaInfo.title,
      thumbnail: mediaInfo.thumbnail,
      requiresProcessing: mediaInfo.requiresProcessing || false,
      hasPassword: link.has_password
    });
  } catch (error) {
    next(error);
  }
});

// Download media from a link (requires auth)
router.get("/media/:linkId", authenticate, async (req, res, next) => {
  try {
    const { linkId } = req.params;
    const { password } = req.query;
    
    const link = await linkService.getLinkById(linkId);
    if (!link) {
      throw new NotFoundError("Link not found");
    }
    
    // Check if user owns the link
    const isOwner = link.user_id?.toString() === req.user.id.toString();
    
    if (!isOwner) {
      throw new NotFoundError("Link not found");
    }
    
    // If link has password, ALWAYS verify it (even for owner)
    if (link.has_password) {
      if (!password) {
        return res.status(401).json({ 
          error: "Password required",
          requiresPassword: true 
        });
      }
      
      const linkWithHash = await linkService.getLinkBySlug(link.slug);
      if (!linkService.verifyLinkPassword(password, linkWithHash.password_hash)) {
        return res.status(401).json({ 
          error: "Invalid password",
          requiresPassword: true 
        });
      }
    }
    
    // Get media info
    const mediaInfo = await mediaDownloadService.getMediaInfo(link.original_url);
    
    if (!mediaInfo.downloadable) {
      throw new ValidationError("This link does not contain downloadable media");
    }
    
    // Check if requires processing (YouTube, Facebook)
    if (mediaInfo.requiresProcessing) {
      return res.json({
        success: false,
        requiresProcessing: true,
        platform: mediaInfo.platform,
        message: `${mediaInfo.platform} downloads require additional processing. Please try again in a moment.`,
        originalUrl: link.original_url
      });
    }
    
    // Download the media
    const download = await mediaDownloadService.downloadMedia(mediaInfo);
    
    // Set headers for download
    res.setHeader("Content-Type", download.contentType || "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename="${download.filename}"`);
    if (download.contentLength) {
      res.setHeader("Content-Length", download.contentLength);
    }
    
    // Pipe the stream to response
    download.stream.pipe(res);
    
    // Handle stream errors
    download.stream.on('error', (error) => {
      console.error("Stream error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Download failed" });
      }
    });
    
  } catch (error) {
    next(error);
  }
});

export default router;
